from fastapi import APIRouter, HTTPException, Depends, Header
from fastapi.responses import JSONResponse
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
import os

from models.course_model import Course
from utils.auth_utils import decode_token

router = APIRouter(prefix="/courses", tags=["courses"])

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
client = AsyncIOMotorClient(MONGO_URI)
db = client["codeiq_db"]
courses = db["courses"]
sessions = db["sessions"]
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


# Create a course
@router.post("/")
async def create_course(course: Course):
    new_course = course.dict()
    result = await courses.insert_one(new_course)
    new_course["_id"] = str(result.inserted_id)
    return JSONResponse(new_course)


# Get all courses
@router.get("/")
async def get_all_courses(email: str = Depends(get_current_user_email)):
    cursor = courses.find({})
    all_courses = []
    
    # Get user's purchased courses if authenticated
    purchased_course_ids = []
    if email:
        user = await users.find_one({"email": email})
        if user:
            purchased_course_ids = user.get("purchased_courses", [])
    
    async for course in cursor:
        course["_id"] = str(course["_id"])
        # Add purchased status to each course
        course["is_purchased"] = course["_id"] in purchased_course_ids
        all_courses.append(course)

    return JSONResponse(all_courses)


# Get all sessions for a course (must be before /{course_id} route)
@router.get("/{course_id}/sessions")
async def get_course_sessions(course_id: str, email: str = Depends(get_current_user_email)):
    course = await courses.find_one({"_id": ObjectId(course_id)})
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    # Check if user has purchased the course
    if email:
        user = await users.find_one({"email": email})
        if user:
            purchased_courses = user.get("purchased_courses", [])
            if course_id not in purchased_courses:
                raise HTTPException(
                    status_code=403, 
                    detail="You need to purchase this course to access its sessions"
                )
    else:
        raise HTTPException(
            status_code=401, 
            detail="Authentication required to access course sessions"
        )
    
    session_ids = course.get("session_ids", [])
    if not session_ids:
        return JSONResponse([])
    
    # Convert string IDs to ObjectIds
    object_ids = [ObjectId(sid) for sid in session_ids if ObjectId.is_valid(sid)]
    
    # Fetch all sessions with matching IDs
    cursor = sessions.find({"_id": {"$in": object_ids}})
    all_sessions = []
    async for session in cursor:
        session["_id"] = str(session["_id"])
        all_sessions.append(session)
    
    return JSONResponse(all_sessions)


# Get a course by ID
@router.get("/{course_id}")
async def get_course(course_id: str, email: str = Depends(get_current_user_email)):
    course = await courses.find_one({"_id": ObjectId(course_id)})
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    # Add purchased status
    is_purchased = False
    if email:
        user = await users.find_one({"email": email})
        if user:
            purchased_courses = user.get("purchased_courses", [])
            is_purchased = course_id in purchased_courses
    
    course["_id"] = str(course["_id"])
    course["is_purchased"] = is_purchased
    return JSONResponse(course)