from fastapi import APIRouter, HTTPException, status
from fastapi.responses import JSONResponse
from models.user_model import User, UserLogin
from utils.auth_utils import hash_password, verify_password, create_access_token
from motor.motor_asyncio import AsyncIOMotorClient
import os

router = APIRouter(prefix="/auth", tags=["auth"])

# MongoDB setup
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
client = AsyncIOMotorClient(MONGO_URI)
db = client["codeiq_db"]
users = db["users"]

@router.post("/signup")
async def signup(user: User):
    existing = await users.find_one({"email": user.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user.password = hash_password(user.password)
    new_user = user.dict()
    result = await users.insert_one(new_user)
    new_user["_id"] = str(result.inserted_id)
    return JSONResponse({"message": "User created successfully", "user": new_user})

@router.post("/login")
async def login(credentials: UserLogin):
    user = await users.find_one({"email": credentials.email})
    if not user or not verify_password(credentials.password, user["password"]):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    token = create_access_token({"sub": user["email"]})
    return JSONResponse({"access_token": token, "token_type": "bearer"})
