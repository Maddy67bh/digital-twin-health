import { useState } from "react"; import { api } from "../services/api"; import { Card, Err } from "../components/ui"; import Trend from "../charts/Trend";
const F = [["sleep", "Sleep (h)", 3, 12, 0.5], ["steps", "Daily steps", 0, 30000, 500], ["stress", "Stress (0-100)", 0, 100, 5], ["hydration", "Hydration (L)", 0.5, 5, 0.1], ["exercise_days", "Exercise days/week", 0, 7, 1], ["rest_minutes", "Rest (min/day)", 0, 240, 10]] as const;
export default function WhatIf() {
  const [v, setV] = useState<Record<string, number>>({ sleep: 7.5, steps: 8000, stress: 40, hydration: 2.5, exercise_days: 3, rest_minutes: 30 });
  const [res, setRes] = useState<any>(null); const [err, setErr] = useState<string | null>(null);
  const run = async () => { try { setRes(await api("/api/what-if", { method: "POST", body: v })); setErr(null); } catch (e: any) { setErr(e.message); } };
  return <div className="space-y-4"><Err e={err} /><Card title="Scenario inputs"><div className="grid gap-3 md:grid-cols-3">{F.map(([k, l, mn, mx, st]) => <label key={k} className="text-sm">{l}: <b>{v[k]}</b><input className="w-full" type="range" min={mn} max={mx} step={st} value={v[k]} onChange={(e) => setV({ ...v, [k]: +e.target.value })} /></label>)}</div>
    <button onClick={run} className="mt-3 rounded bg-slate-900 px-4 py-2 text-sm text-white">Run What-If Simulation</button></Card>
    {res && <Card title="Projected wellness trajectory (14 days)"><p className="mb-2 text-sm">Current {res.baseline_wellness} → projected {res.projected_wellness} / 100</p><Trend xKey="day" data={res.trajectory} keys={[{ k: "wellness", color: "#0f766e" }, { k: "stress", color: "#b45309" }]} /><p className="mt-2 text-xs font-medium text-amber-800">{res.label}. Illustrative model; not a guaranteed outcome.</p></Card>}</div>;
}
