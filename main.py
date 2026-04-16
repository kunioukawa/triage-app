from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime
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

class Patient(BaseModel):
    name: str
    age: int
    chief_complaint: str        # 主訴
    pain_score: int             # 疼痛スコア 0-10
    vital_temp: Optional[float] = None   # 体温
    vital_spo2: Optional[int] = None     # SpO2
    vital_bp: Optional[str] = None       # 血圧
    notes: Optional[str] = None

def calc_triage_level(patient: Patient) -> int:
    """簡易重症度判定（1=最重症, 5=軽症）"""
    score = 5
    if patient.pain_score >= 8:
        score = min(score, 2)
    elif patient.pain_score >= 5:
        score = min(score, 3)
    if patient.vital_spo2 and patient.vital_spo2 < 90:
        score = min(score, 1)
    elif patient.vital_spo2 and patient.vital_spo2 < 95:
        score = min(score, 2)
    if patient.vital_temp and patient.vital_temp >= 39.0:
        score = min(score, 3)
    return score

@app.get("/patients")
def get_patients():
    return load_patients()

@app.post("/patients")
def add_patient(patient: Patient):
    patients = load_patients()
    record = patient.dict()
    record["id"] = len(patients) + 1
    record["arrived_at"] = datetime.now().isoformat()
    record["triage_level"] = calc_triage_level(patient)
    patients.append(record)
    save_patients(patients)
    return record

@app.delete("/patients/{patient_id}")
def delete_patient(patient_id: int):
    patients = load_patients()
    patients = [p for p in patients if p["id"] != patient_id]
    save_patients(patients)
    return {"ok": True}

from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

app.mount("/assets", StaticFiles(directory="frontend/dist/assets"), name="assets")

@app.get("/{full_path:path}")
def serve_frontend(full_path: str):
    return FileResponse("frontend/dist/index.html")