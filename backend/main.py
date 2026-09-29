from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Digital Twin Health API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {
        "project": "Digital Twin Health",
        "status": "running",
        "message": "Digital Twin API is active"
    }

@app.get("/api/health")
def health():
    return {"status": "healthy"}

@app.get("/api/twin")
def twin():
    return {
        "twin_id": "DT-DEMO-001",
        "status": "active",
        "data_type": "synthetic",
        "heart_rate": 72,
        "spo2": 98,
        "temperature": 36.7,
        "sleep_hours": 7.2,
        "steps": 6840,
        "stress": 35
    }
