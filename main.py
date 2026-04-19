from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import json, os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

DATA_FILE = "patients.json"


def load_patients():
    if not os.path.exists(DATA_FILE):
        return []
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def save_patients(patients):
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(patients, f, ensure_ascii=False, indent=2)


class StatusUpdate(BaseModel):
    status: str


class QuestionnaireUpdate(BaseModel):
    questionnaire: dict


@app.get("/patients")
def get_patients():
    return load_patients()


@app.patch("/patients/{patient_id}/status")
def update_status(patient_id: int, body: StatusUpdate):
    patients = load_patients()
    for p in patients:
        if p["id"] == patient_id:
            p["status"] = body.status
            save_patients(patients)
            return p
    raise HTTPException(status_code=404, detail="Patient not found")


@app.patch("/patients/{patient_id}/questionnaire")
def save_questionnaire(patient_id: int, body: QuestionnaireUpdate):
    patients = load_patients()
    for p in patients:
        if p["id"] == patient_id:
            p["questionnaire"] = body.questionnaire
            p["status"] = "完了"
            save_patients(patients)
            return p
    raise HTTPException(status_code=404, detail="Patient not found")


from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

if os.path.exists("frontend/dist/assets"):
    app.mount("/assets", StaticFiles(directory="frontend/dist/assets"), name="assets")


@app.get("/{full_path:path}")
def serve_frontend(full_path: str):
    return FileResponse("frontend/dist/index.html")
