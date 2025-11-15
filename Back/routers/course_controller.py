from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
import os

from models.course_model import Course

router = APIRouter(prefix="/courses", tags=["courses"])

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
client = AsyncIOMotorClient(MONGO_URI)
db = client["codeiq_db"]
courses = db["courses"]


# Create a course
@router.post("/")
async def create_course(course: Course):
    new_course = course.dict()
    result = await courses.insert_one(new_course)
    new_course["_id"] = str(result.inserted_id)
    return JSONResponse(new_course)


# Get a course by ID
@router.get("/{course_id}")
async def get_course(course_id: str):
    course = await courses.find_one({"_id": ObjectId(course_id)})
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    course["_id"] = str(course["_id"])
    return JSONResponse(course)

# Get all courses
@router.get("/")
async def get_all_courses():
    cursor = courses.find({})
    all_courses = []
    async for course in cursor:
        course["_id"] = str(course["_id"])
        all_courses.append(course)

    return JSONResponse(all_courses)