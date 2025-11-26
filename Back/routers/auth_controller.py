from fastapi import APIRouter, HTTPException, status, Depends, Header
from fastapi.responses import JSONResponse
from models.user_model import User, UserLogin
from utils.auth_utils import hash_password, verify_password, create_access_token, decode_token
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
    is_admin = user.get("is_admin", False)
    return JSONResponse({
        "access_token": token, 
        "token_type": "bearer",
        "is_admin": is_admin
    })


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


@router.get("/me")
async def get_current_user(email: str = Depends(get_current_user_email)):
    user = await users.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Remove password from response
    user["_id"] = str(user["_id"])
    user.pop("password", None)
    return JSONResponse(user)
