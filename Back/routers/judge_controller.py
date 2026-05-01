from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from bson import ObjectId
import os
from motor.motor_asyncio import AsyncIOMotorClient
from services.local_executor import run_python_testcase

router = APIRouter(prefix="/judge", tags=["judge"])

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
client = AsyncIOMotorClient(MONGO_URI)
db = client["codeiq_db"]
questions = db["questions"]

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
    source_code = payload.get("source_code", "")
    language_id = payload.get("language_id", 71)

    if not source_code.strip():
        raise HTTPException(status_code=400, detail="source_code is required")

    # Phase 1 supports Python only to stay aligned with current frontend behavior.
    if language_id != 71:
        raise HTTPException(status_code=400, detail="Only Python (language_id=71) is supported")

    results = []

    for tc in testcases:
        execution_result = await run_python_testcase(
            source_code=source_code,
            stdin_data=tc.get("input", ""),
            expected_output=tc.get("expected_output", ""),
        )

        results.append({
            "input": tc.get("input", ""),
            "expected": tc.get("expected_output", ""),
            "stdout": execution_result.stdout,
            "stderr": execution_result.stderr,
            "status": execution_result.status,
        })

    # Compute final verdict
    all_passed = all(r["status"]["id"] == 3 for r in results)

    final_status = "Accepted" if all_passed else "Failed"

    return JSONResponse({
        "question_id": question_id,
        "verdict": final_status,
        "results": results
    })
