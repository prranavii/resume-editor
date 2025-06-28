# backend/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json

app = FastAPI()

# Allow frontend to access backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # frontend origin
    allow_methods=["*"],
    allow_headers=["*"],
)

class AIRequest(BaseModel):
    section: str
    content: str

@app.post("/ai-enhance")
def ai_enhance(req: AIRequest):
    if req.section == "skills":
        if "frontend" in req.content.lower():
            return {"enhanced_content": "React, JavaScript, HTML, CSS, Redux"}
        elif "data" in req.content.lower():
            return {"enhanced_content": "Python, SQL, Pandas, NumPy, Power BI"}
    return {
        "enhanced_content": f"✨ Enhanced {req.section}: {req.content} + AI suggestion"
    }

@app.post("/save-resume")
def save_resume(resume: dict):
    with open("resume.json", "w") as f:
        json.dump(resume, f, indent=4)
    return {"message": "Resume saved"}

@app.get("/generate-resume")
def generate_resume(job_title: str = "Software Engineer"):
    return {
        "name": "Jane Doe",
        "summary": f"Passionate {job_title} with 3+ years of experience...",
        "experience": [f"{job_title} at ABC Corp (2020–2023)"],
        "education": ["B.Tech in Computer Science - XYZ University"],
        "skills": ["Python", "Git", "REST APIs"],
        "projects": ["Resume AI Generator App"],
        "certifications": ["AWS Certified Developer"],
        "hobbies": ["Reading Tech Blogs", "Chess"]
    }
