from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from routers import judge_controller, auth_controller, session_controller, course_controller, contact_controller, purchase_controller, admin_controller
from pathlib import Path

app = FastAPI(title="CodeIQ Server")

# Mount static files for uploads
uploads_dir = Path("uploads")
uploads_dir.mkdir(exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.include_router(judge_controller.router)
app.include_router(auth_controller.router)
app.include_router(session_controller.router)
app.include_router(course_controller.router)
app.include_router(contact_controller.router)
app.include_router(purchase_controller.router)
app.include_router(admin_controller.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "CodeIQ Server is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=True)

