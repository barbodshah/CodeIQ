from pydantic import BaseModel
from typing import List

class Testcase(BaseModel):
    input: str
    expected_output: str

class Question(BaseModel):
    title: str
    description: str
    difficulty: str
    testcases: List[Testcase]
    constraints: str | None = None
    tags: List[str] | None = None
