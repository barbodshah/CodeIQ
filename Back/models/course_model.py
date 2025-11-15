from pydantic import BaseModel
from typing import List

class Course(BaseModel):
    title: str
    description: str
    author_id: str
    session_ids: List[str]
