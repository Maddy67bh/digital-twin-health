import React, { useEffect, useState } from "react";
import {
  getHealth,
  getTwin,
  getHistory,
  getAnomalies,
  getInsights,
  runWhatIf
} from "./services/api";

export default function App() {
  const [twin, setTwin] = useState<any>(null);
  const [history, setHistory] = useState<any>(null);
  const [anomalies, setAnomalies] = useState<any>(null);
  const [insights, setInsights] = useState<any>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [simulation, setSimulation] = useState<any>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      await getHealth();

      const [t, h, a, i] = await Promise.all([
        getTwin(),
        getHistory(),
        getAnomalies(),
        getInsights()
      ]);

      setTwin(t);
      setHistory(h);
      setAnomalies(a);
      setInsights(i);
    } catch (e: any) {
      setError(e.message || "Backend connection failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const whatIf = async () => {
    try {
      const result = await runWhatIf({
        sleep_hours: 8,
        steps: 9000,
        stress: 20,
        hydration: 2.5,
        exercise_days: 5
      });
      setSimulation(result);
    } catch (e: any) {
      setError(e.message || "Simulation failed");
    }
  };

  const metric = (name: string, fallback = "--") => {
    if (!twin) return fallback;
    const value =
      twin?.metrics?.[name] ??
      twin?.state?.[name] ??
      twin?.[name];
    return value ?? fallback;
  };

  return (
    <div className="app">
      <header className="header">
        <div>
          <div className="eyebrow">HEALTHCARE AI • PROOF OF CONCEPT</div>
          <h1>Digital Twin Health</h1>
          <p>
            A simulated digital representation of health state, trends,
            anomalies and What-If scenarios.
          </p>
        </div>
        <button onClick={loadData}>Refresh Twin</button>
      </header>

      {error && <div className="error">⚠ {error}</div>}

      {loading ? (
        <div className="loading">Loading Digital Twin...</div>
      ) : (
        <>
          <section className="status">
            <span className="dot"></span>
            Digital Twin Connected
            <span className="small">FastAPI • Synthetic Demo Data</span>
          </section>

          <section className="cards">
            <Card title="Heart Rate" value={metric("heart_rate")} unit="BPM" />
            <Card title="SpO₂" value={metric("spo2")} unit="%" />
            <Card title="Temperature" value={metric("temperature")} unit="°C" />
            <Card title="Sleep" value={metric("sleep")} unit="hours" />
            <Card title="Steps" value={metric("steps")} unit="steps" />
            <Card title="Stress" value={metric("stress")} unit="/100" />
            <Card title="Systolic BP" value={metric("systolic")} unit="mmHg" />
            <Card title="Diastolic BP" value={metric("diastolic")} unit="mmHg" />
          </section>

          <section className="grid">
            <Panel title="Health History">
              <pre>{JSON.stringify(history, null, 2).slice(0, 3500)}</pre>
            </Panel>

            <Panel title="Anomaly Detection">
              {Array.isArray(anomalies)
                ? anomalies.map((x, i) => (
                    <div className="item" key={i}>{JSON.stringify(x)}</div>
                  ))
                : <pre>{JSON.stringify(anomalies, null, 2)}</pre>}
            </Panel>

            <Panel title="Explainable Insights">
              {Array.isArray(insights)
                ? insights.map((x, i) => (
                    <div className="insight" key={i}>{JSON.stringify(x)}</div>
                  ))
                : <pre>{JSON.stringify(insights, null, 2)}</pre>}
            </Panel>

            <Panel title="What-If Simulation">
              <p>
                Simulate a healthier lifestyle scenario without changing
                real-world health data.
              </p>
              <button className="primary" onClick={whatIf}>
                Run What-If Scenario
              </button>
              {simulation && (
                <pre>{JSON.stringify(simulation, null, 2)}</pre>
              )}
            </Panel>
          </section>

          <footer>
            <strong>Responsible AI:</strong> This is a healthcare technology
            proof-of-concept using synthetic/demo data. It is not a medical
            diagnosis or treatment system.
          </footer>
        </>
      )}
    </div>
  );
}

function Card({ title, value, unit }: any) {
  return (
    <div className="card">
      <span>{title}</span>
      <strong>{String(value)}</strong>
      <small>{unit}</small>
    </div>
  );
}

function Panel({ title, children }: any) {
  return (
    <div className="panel">
      <h2>{title}</h2>
      {children}
    </div>
  );
}
