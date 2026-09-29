# Digital Twin Health — Proof of Concept

> **SIMULATED DATA — PROOF OF CONCEPT.** Uses synthetic data only, for demonstration and research. Not a medical device; no diagnosis, no medical advice.

## Problem Statement
Health data is fragmented and reactive. A digital twin can hold a person's state, spot deviations, and explore lifestyle scenarios.

## Solution
A FastAPI + React app: a simulated twin, live simulation, historical analytics, explainable anomaly/insight flags, an ML wellness-trend prediction, and a what-if engine.

## System Architecture
Data Sources (simulated) → Processing/Validation → Twin State Engine → Analytics/ML → Simulation → Visualization. See the Architecture tab and `docs/`.

## Technology Stack
React, TypeScript, Tailwind, Recharts · Python, FastAPI, pandas, NumPy, scikit-learn.

## Machine Learning Methodology
Ridge regression predicts next-day wellness score (an educational 0–100 composite of sleep, steps, stress, hydration) from today's values; standardized coefficients give importance, residual std gives a 95% band. Anomalies: configured baseline ranges plus a robust z-score (median/MAD, 7 days). Trained on synthetic data, so it is **not clinically validated**.

## Simulation Methodology
Twin: mean-reverting random walk around baseline plus circadian pattern. What-if: variables move ~25%/day toward scenario values; wellness recomputed; small documented heuristic for exercise/rest.

## Installation
```bash
pip install -r requirements.txt
npm install
```
## Running the Application
```bash
cd backend && uvicorn main:app --reload --port 8000
npm run dev        # http://localhost:5173
```
## API Documentation
`GET /api/health` · `GET /api/twin` · `PUT /api/twin` · `GET /api/metrics` · `GET /api/history?range=24h|7d|30d` · `POST /api/simulation {action,speed}` · `POST /api/what-if` · `GET /api/anomalies` · `GET /api/insights`. Interactive docs at `/docs`.

## Privacy & Security
Synthetic data only. Encryption, RBAC, auth, audit logging and consent management are design targets, not implemented.

## Limitations
No auth/persistence; no real device integrations; no clinical validation; screenshots, demo video and extended docs not yet produced.

## Future Scope
Wearable/IoT ingestion, personalized models, clinician-reviewed workflows, SQLite persistence.

## Demo Flow (3–5 min)
Dashboard → start simulation → trends (24h/7d/30d) → anomaly card → What-If (sleep 5.5→7.5, steps 3000→8000, stress lower) → Architecture → Privacy → future integrations.

## Team
_Add team members._

## Disclaimer
Educational prototype using simulated data. Not for diagnosis or treatment.
