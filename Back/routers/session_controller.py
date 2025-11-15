from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
import os

from models.session_model import Session

router = APIRouter(prefix="/sessions", tags=["sessions"])

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
client = AsyncIOMotorClient(MONGO_URI)
db = client["codeiq_db"]
sessions = db["sessions"]


# Create a session
@router.post("/")
async def create_session(session: Session):
    new_sess = session.dict()
    result = await sessions.insert_one(new_sess)
    new_sess["_id"] = str(result.inserted_id)
    return JSONResponse(new_sess)


# Get a session by ID
@router.get("/{session_id}")
async def get_session(session_id: str):
    session = await sessions.find_one({"_id": ObjectId(session_id)})

    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    session["_id"] = str(session["_id"])
    return JSONResponse(session)
