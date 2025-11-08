from fastapi import FastAPI, Request, BackgroundTasks
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import os, json, uuid, traceback
#from Routers import csp_routes
from starlette.middleware.sessions import SessionMiddleware

app = FastAPI(title="Konquest AI Server")
#app.include_router(csp_routes.router)
#app.include_router(report_routes.router)
#app.include_router(analyze_routes.router)

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
