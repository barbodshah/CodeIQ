from fastapi.responses import JSONResponse
from fastapi import APIRouter

router = APIRouter(prefix="/login", tags=["login"])