from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import judge_controller, auth_controller

app = FastAPI(title="CodeIQ Server")

app.include_router(judge_controller.router)
app.include_router(auth_controller.router)

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

