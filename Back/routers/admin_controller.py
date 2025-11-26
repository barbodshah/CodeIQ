from fastapi import APIRouter, HTTPException, Depends, Header, UploadFile, File
from fastapi.responses import JSONResponse
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from pydantic import BaseModel
import os
import shutil
import uuid
from pathlib import Path

from utils.auth_utils import decode_token


class UpdateLogoRequest(BaseModel):
    logo_url: str

# Create uploads directory if it doesn't exist
UPLOADS_DIR = Path("uploads/logos")
UPLOADS_DIR.mkdir(parents=True, exist_ok=True)

router = APIRouter(prefix="/admin", tags=["admin"])

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
client = AsyncIOMotorClient(MONGO_URI)
db = client["codeiq_db"]
users = db["users"]
courses = db["courses"]
sessions = db["sessions"]


async def get_current_user_email(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing")
    
    try:
        token = authorization.split(" ")[1]  # Remove "Bearer " prefix
        email = decode_token(token)
        if not email:
            raise HTTPException(status_code=401, detail="Invalid token")
        return email
    except IndexError:
        raise HTTPException(status_code=401, detail="Invalid authorization header format")


async def verify_admin(email: str = Depends(get_current_user_email)):
    user = await users.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if not user.get("is_admin", False):
        raise HTTPException(status_code=403, detail="Admin access required")
    
    return email


# Get all users (admin only)
@router.get("/users")
async def get_all_users(email: str = Depends(verify_admin)):
    cursor = users.find({})
    all_users = []
    async for user in cursor:
        # Remove password from response
        user["_id"] = str(user["_id"])
        user.pop("password", None)
        all_users.append(user)
    
    return JSONResponse(all_users)


# Get all courses (admin only)
@router.get("/courses")
async def get_all_courses_admin(email: str = Depends(verify_admin)):
    cursor = courses.find({})
    all_courses = []
    async for course in cursor:
        course["_id"] = str(course["_id"])
        
        # Get session details for each course
        session_ids = course.get("session_ids", [])
        if session_ids:
            object_ids = [ObjectId(sid) for sid in session_ids if ObjectId.is_valid(sid)]
            session_cursor = sessions.find({"_id": {"$in": object_ids}})
            course_sessions = []
            async for session in session_cursor:
                session["_id"] = str(session["_id"])
                course_sessions.append(session)
            course["sessions"] = course_sessions
        
        all_courses.append(course)
    
    return JSONResponse(all_courses)


# Update user logo with file upload (admin only)
@router.post("/users/{user_id}/logo/upload")
async def upload_user_logo(
    user_id: str, 
    file: UploadFile = File(...),
    email: str = Depends(verify_admin)
):
    # Verify user exists
    user = await users.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Validate file type
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    # Generate unique filename
    file_extension = Path(file.filename).suffix if file.filename else ".png"
    unique_filename = f"{user_id}_{uuid.uuid4().hex}{file_extension}"
    file_path = UPLOADS_DIR / unique_filename
    
    # Save file
    try:
        # Read file content
        contents = await file.read()
        # Write to disk
        with open(file_path, "wb") as buffer:
            buffer.write(contents)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save file: {str(e)}")
    
    # Delete old logo if exists
    old_logo_url = user.get("logo_url")
    if old_logo_url and old_logo_url.startswith("/uploads/logos/"):
        old_filename = old_logo_url.split("/")[-1]
        old_file_path = UPLOADS_DIR / old_filename
        if old_file_path.exists():
            try:
                old_file_path.unlink()
            except Exception:
                pass  # Ignore errors when deleting old file
    
    # Update logo URL in database
    logo_url = f"/uploads/logos/{unique_filename}"
    await users.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {"logo_url": logo_url}}
    )
    
    return JSONResponse({
        "message": "User logo uploaded successfully",
        "user_id": user_id,
        "logo_url": logo_url
    })


# Update user logo with URL (admin only) - kept for backward compatibility
@router.put("/users/{user_id}/logo")
async def update_user_logo(user_id: str, logo_request: UpdateLogoRequest, email: str = Depends(verify_admin)):
    # Verify user exists
    user = await users.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Delete old logo file if it was uploaded
    old_logo_url = user.get("logo_url")
    if old_logo_url and old_logo_url.startswith("/uploads/logos/"):
        old_filename = old_logo_url.split("/")[-1]
        old_file_path = UPLOADS_DIR / old_filename
        if old_file_path.exists():
            try:
                old_file_path.unlink()
            except Exception:
                pass  # Ignore errors when deleting old file
    
    # Update logo
    await users.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {"logo_url": logo_request.logo_url}}
    )
    
    return JSONResponse({
        "message": "User logo updated successfully",
        "user_id": user_id,
        "logo_url": logo_request.logo_url
    })

