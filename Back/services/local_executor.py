import asyncio
import os
import sys
import tempfile
import subprocess
from dataclasses import dataclass


STATUS_ACCEPTED = {"id": 3, "description": "Accepted"}
STATUS_WRONG_ANSWER = {"id": 4, "description": "Wrong Answer"}
STATUS_TIME_LIMIT = {"id": 5, "description": "Time Limit Exceeded"}
STATUS_RUNTIME_ERROR = {"id": 11, "description": "Runtime Error"}
STATUS_INTERNAL_ERROR = {"id": 13, "description": "Internal Error"}


@dataclass
class ExecutionResult:
    stdout: str
    stderr: str
    status: dict


def _normalize_output(value: str) -> str:
    return (value or "").replace("\r\n", "\n").strip()


async def run_python_testcase(source_code: str, stdin_data: str, expected_output: str) -> ExecutionResult:
    """
    Runs a python snippet locally without external APIs.
    - Uses isolated mode (-I) for a cleaner runtime.
    - Enforces timeout to prevent infinite loops.
    """
    timeout_seconds = int(os.getenv("LOCAL_JUDGE_TIMEOUT_SECONDS", "2"))
    max_output_chars = int(os.getenv("LOCAL_JUDGE_MAX_OUTPUT_CHARS", "10000"))

    temp_path = None
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".py", mode="w", encoding="utf-8") as temp_file:
            temp_file.write(source_code)
            temp_path = temp_file.name

        env = {**os.environ, "PYTHONUNBUFFERED": "1", "PYTHONNOUSERSITE": "1"}

        def _run_process() -> subprocess.CompletedProcess:
            return subprocess.run(
                [sys.executable, "-I", temp_path],
                input=(stdin_data or ""),
                text=True,
                capture_output=True,
                timeout=timeout_seconds,
                env=env,
            )

        try:
            completed = await asyncio.to_thread(_run_process)
        except subprocess.TimeoutExpired:
            return ExecutionResult(stdout="", stderr="Execution timed out", status=STATUS_TIME_LIMIT)

        stdout_text = (completed.stdout or "")[:max_output_chars]
        stderr_text = (completed.stderr or "")[:max_output_chars]

        if completed.returncode != 0:
            return ExecutionResult(stdout=stdout_text, stderr=stderr_text, status=STATUS_RUNTIME_ERROR)

        got = _normalize_output(stdout_text)
        expected = _normalize_output(expected_output)
        status = STATUS_ACCEPTED if got == expected else STATUS_WRONG_ANSWER
        return ExecutionResult(stdout=stdout_text, stderr=stderr_text, status=status)

    except Exception as exc:
        error_text = f"{type(exc).__name__}: {exc}" if str(exc) else type(exc).__name__
        return ExecutionResult(stdout="", stderr=f"Internal executor error: {error_text}", status=STATUS_INTERNAL_ERROR)
    finally:
        if temp_path and os.path.exists(temp_path):
            try:
                os.remove(temp_path)
            except OSError:
                pass
