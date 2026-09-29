import { useEffect, useState } from "react"; import { api } from "../services/api"; import { Card, Stat, Err } from "../components/ui"; import Trend from "../charts/Trend";
export default function Dashboard() {
  const [twin, setTwin] = useState<any>(null); const [hist, setHist] = useState<any[]>([]); const [range, setRange] = useState("7d");
  const [an, setAn] = useState<any[]>([]); const [ins, setIns] = useState<any>(null); const [speed, setSpeed] = useState(2); const [err, setErr] = useState<string | null>(null);
  const load = async () => { try { setTwin(await api("/api/twin")); setHist((await api(`/api/history?range=${range}`)).data); setAn((await api("/api/anomalies")).items); setIns(await api("/api/insights")); setErr(null); } catch (e: any) { setErr(e.message); } };
  useEffect(() => { load(); }, [range]);
  useEffect(() => { if (!twin?.running) return; const id = setInterval(async () => { try { await api("/api/simulation", { method: "POST", body: { action: "step", speed } }); load(); } catch (e: any) { setErr(e.message); } }, 1000 / speed); return () => clearInterval(id); }, [twin?.running, speed, range]);
  const act = async (action: string) => { try { const r = await api("/api/simulation", { method: "POST", body: { action, speed } }); if (action === "reset") await load(); else setTwin((t: any) => ({ ...t, running: r.running, state: r.state })); } catch (e: any) { setErr(e.message); } };
  const s = twin?.state;
  return <div className="space-y-4"><Err e={err} />
    <Card title="Digital Twin status"><div className="flex flex-wrap items-center gap-3"><span className={`rounded-full px-3 py-1 text-xs ${twin?.running ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-700"}`}>{twin?.running ? "Simulation running" : "Paused"}</span>
      <button className="rounded bg-slate-900 px-3 py-1.5 text-sm text-white" onClick={() => act("start")}>Start Simulation</button>
      <button className="rounded border px-3 py-1.5 text-sm" onClick={() => act("pause")}>Pause Simulation</button>
      <button className="rounded border px-3 py-1.5 text-sm" onClick={() => act("reset")}>Reset Twin</button>
      <label className="text-sm">Speed {speed}x <input type="range" min={1} max={10} value={speed} onChange={(e) => setSpeed(+e.target.value)} /></label></div></Card>
    {s && <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-5">
      <Stat label="Heart rate" value={Math.round(s.hr)} unit="bpm" /><Stat label="Blood pressure" value={`${Math.round(s.sys)}/${Math.round(s.dia)}`} unit="mmHg" /><Stat label="SpO2" value={Math.round(s.spo2)} unit="%" />
      <Stat label="Temperature" value={s.temp.toFixed(1)} unit="°C" /><Stat label="Sleep" value={s.sleep.toFixed(1)} unit="h" /><Stat label="Steps" value={Math.round(s.steps)} /><Stat label="Calories" value={Math.round(s.calories)} unit="kcal" />
      <Stat label="Stress (0-100)" value={Math.round(s.stress)} /><Stat label="Hydration" value={s.hydration.toFixed(1)} unit="L" /><Stat label="Wellness score" value={s.wellness} unit="/100" /></div>}
    <div className="flex gap-2">{["24h", "7d", "30d"].map((r) => <button key={r} onClick={() => setRange(r)} className={`rounded px-3 py-1 text-sm ${r === range ? "bg-slate-900 text-white" : "border"}`}>{r}</button>)}</div>
    <div className="grid gap-4 lg:grid-cols-2">
      <Card title="Heart rate (bpm)"><Trend data={hist} keys={[{ k: "hr", color: "#0f766e" }]} /></Card><Card title="SpO2 (%)"><Trend data={hist} keys={[{ k: "spo2", color: "#2563eb" }]} /></Card>
      <Card title="Blood pressure (mmHg)"><Trend data={hist} keys={[{ k: "sys", color: "#7c3aed" }, { k: "dia", color: "#a78bfa" }]} /></Card><Card title="Stress (0-100)"><Trend data={hist} keys={[{ k: "stress", color: "#b45309" }]} /></Card>
      <Card title="Sleep (h/night)"><Trend data={hist} keys={[{ k: "sleep", color: "#4338ca" }]} /></Card><Card title="Activity (daily steps)"><Trend data={hist} keys={[{ k: "steps", color: "#15803d" }]} /></Card></div>
    <Card title="Anomaly detection (simulated, vs configured baseline)">{an.length === 0 ? <p className="text-sm text-slate-500">No unusual simulated readings in the last 48 h.</p> : an.slice(-5).map((a, i) => <div key={i} className="mb-2 rounded border-l-4 border-amber-500 bg-amber-50 p-2 text-sm"><b>{a.message}</b>: {a.metric} = {a.value} (baseline {a.baseline}, robust z={a.z}) at {a.time.slice(0, 16)}<div className="text-xs text-slate-600">{a.detail}</div></div>)}</Card>
    {ins && <div className="grid gap-4 lg:grid-cols-2"><Card title="Explainable insights (last 7 d vs previous 7 d)">{ins.insights.map((i: any) => <div key={i.metric} className="mb-2 text-sm"><b>{i.metric}</b>: {i.baseline} → {i.current} ({i.change_pct}%)<div className="text-xs text-slate-600">Why flagged: {i.reason}</div></div>)}</Card>
      <Card title="Next-day wellness projection (Ridge regression)"><p className="text-2xl font-semibold">{ins.prediction.prediction} <span className="text-sm font-normal text-slate-500">95% band {ins.prediction.lower}–{ins.prediction.upper}</span></p>
        <p className="mt-2 text-xs text-slate-600">Contributing variables: {Object.entries(ins.prediction.importance).map(([k, v]) => `${k} ${Math.round((v as number) * 100)}%`).join(", ")}</p><p className="mt-2 text-xs font-medium text-amber-800">{ins.prediction.label}</p></Card></div>}
  </div>;
}
