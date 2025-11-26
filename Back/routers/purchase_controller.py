from fastapi import APIRouter, HTTPException, Depends, Header
from fastapi.responses import JSONResponse
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
import os

from utils.auth_utils import decode_token

router = APIRouter(prefix="/purchase", tags=["purchase"])

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
client = AsyncIOMotorClient(MONGO_URI)
db = client["codeiq_db"]
users = db["users"]
courses = db["courses"]


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


# Purchase a course
@router.post("/{course_id}")
async def purchase_course(course_id: str, email: str = Depends(get_current_user_email)):
    # Check if course exists
    course = await courses.find_one({"_id": ObjectId(course_id)})
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    # Get user
    user = await users.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Check if user already purchased the course
    purchased_courses = user.get("purchased_courses", [])
    if course_id in purchased_courses:
        raise HTTPException(status_code=400, detail="Course already purchased")
    
    # Add course to user's purchased courses
    purchased_courses.append(course_id)
    await users.update_one(
        {"email": email},
        {"$set": {"purchased_courses": purchased_courses}}
    )
    
    return JSONResponse({"message": "Course purchased successfully", "course_id": course_id})


# Get user's purchased courses
@router.get("/my-courses")
async def get_my_courses(email: str = Depends(get_current_user_email)):
    user = await users.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    purchased_course_ids = user.get("purchased_courses", [])
    
    if not purchased_course_ids:
        return JSONResponse([])
    
    # Convert string IDs to ObjectIds
    object_ids = [ObjectId(cid) for cid in purchased_course_ids if ObjectId.is_valid(cid)]
    
    # Fetch all purchased courses
    cursor = courses.find({"_id": {"$in": object_ids}})
    purchased_courses = []
    async for course in cursor:
        course["_id"] = str(course["_id"])
        purchased_courses.append(course)
    
    return JSONResponse(purchased_courses)


# Check if user has access to a course
@router.get("/check-access/{course_id}")
async def check_course_access(course_id: str, email: str = Depends(get_current_user_email)):
    user = await users.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    purchased_courses = user.get("purchased_courses", [])
    has_access = course_id in purchased_courses
    
    return JSONResponse({"has_access": has_access, "course_id": course_id})

