from fastapi import APIRouter, HTTPException, Depends, Header
from fastapi.responses import JSONResponse
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
import os

from models.session_model import Session
from utils.auth_utils import decode_token

router = APIRouter(prefix="/sessions", tags=["sessions"])

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
client = AsyncIOMotorClient(MONGO_URI)
db = client["codeiq_db"]
sessions = db["sessions"]
courses = db["courses"]
users = db["users"]


async def get_current_user_email(authorization: str = Header(None)):
    if not authorization:
        return None
    
    try:
        token = authorization.split(" ")[1]  # Remove "Bearer " prefix
        email = decode_token(token)
        return email
    except (IndexError, Exception):
        return None


# Create a session
@router.post("/")
async def create_session(session: Session):
    new_sess = session.dict()
    result = await sessions.insert_one(new_sess)
    new_sess["_id"] = str(result.inserted_id)
    return JSONResponse(new_sess)


# Get a session by ID
@router.get("/{session_id}")
async def get_session(session_id: str, email: str = Depends(get_current_user_email)):
    session = await sessions.find_one({"_id": ObjectId(session_id)})

    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    # Check if user has access to this session
    # Find the course that contains this session
    course = await courses.find_one({"session_ids": session_id})
    
    if course:
        # If session belongs to a course, check if user purchased it
        if email:
            user = await users.find_one({"email": email})
            if user:
                purchased_courses = user.get("purchased_courses", [])
                course_id = str(course["_id"])
                if course_id not in purchased_courses:
                    raise HTTPException(
                        status_code=403, 
                        detail="You need to purchase this course to access its sessions"
                    )
        else:
            raise HTTPException(
                status_code=401, 
                detail="Authentication required to access this session"
            )

    session["_id"] = str(session["_id"])
    return JSONResponse(session)
