from pydantic import BaseModel, EmailStr
from typing import Optional, List

class User(BaseModel):
    id: Optional[str] = None
    username: str
    email: EmailStr
    password: str
    purchased_courses: Optional[List[str]] = []
    is_admin: Optional[bool] = False
    logo_url: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str
