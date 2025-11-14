from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from bson import ObjectId
import httpx
import os
from motor.motor_asyncio import AsyncIOMotorClient

router = APIRouter(prefix="/judge", tags=["judge"])

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
client = AsyncIOMotorClient(MONGO_URI)
db = client["codeiq_db"]
questions = db["questions"]

JUDGE0_URL = "https://ce.judge0.com"


# -------------------------
# Get a question by ID
# -------------------------
@router.get("/question/{question_id}")
async def get_question(question_id: str):
    question = await questions.find_one({"_id": ObjectId(question_id)})
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")

    question["_id"] = str(question["_id"])
    return question


# -------------------------
# Judge code for a question
# -------------------------
@router.post("/submit/{question_id}")
async def submit_code(question_id: str, payload: dict):
    """
    payload = {
        "language_id": 71,
        "source_code": "... user code ..."
    }
    """

    # Fetch question
    question = await questions.find_one({"_id": ObjectId(question_id)})
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")

    testcases = question["testcases"]
    source_code = payload["source_code"]
    language_id = payload["language_id"]

    results = []

    async with httpx.AsyncClient() as client:
        for tc in testcases:

            req = {
                "source_code": source_code,
                "language_id": language_id,
                "stdin": tc["input"],
                "expected_output": tc["expected_output"]
            }

            # Send to Judge0
            response = await client.post(
                f"{JUDGE0_URL}/submissions?wait=true&base64_encoded=false",
                json=req,
                timeout=20
            )

            if response.status_code not in (200, 201):
                return JSONResponse({
                    "judge0_status": response.status_code,
                    "judge0_body": response.text
                }, status_code=500)

            judge_out = response.json()

            results.append({
                "input": tc["input"],
                "expected": tc["expected_output"],
                "stdout": judge_out.get("stdout"),
                "stderr": judge_out.get("stderr"),
                "status": judge_out.get("status"),
            })

    # Compute final verdict
    all_passed = all(r["status"]["id"] == 3 for r in results)

    final_status = "Accepted" if all_passed else "Failed"

    return JSONResponse({
        "question_id": question_id,
        "verdict": final_status,
        "results": results
    })
