from pydantic import BaseModel
from typing import List

class Section(BaseModel):
    title: str
    video_url: str
    question_id: str

class Session(BaseModel):
    title: str
    description: str
    sections: List[Section]
