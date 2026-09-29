import { useEffect, useState } from "react"; import { api } from "../services/api"; import { Card, Err } from "../components/ui";
export default function Profile() {
  const [p, setP] = useState<any>(null); const [err, setErr] = useState<string | null>(null); const [ok, setOk] = useState(false);
  useEffect(() => { api("/api/twin").then((t) => setP({ ...t.profile, sleep: t.params.sleep, steps: t.params.steps })).catch((e) => setErr(e.message)); }, []);
  const save = async () => { try { await api("/api/twin", { method: "PUT", body: { age: p.age, height_cm: p.height_cm, weight_kg: p.weight_kg, activity_level: p.activity_level, sleep: p.sleep, steps: p.steps } }); setOk(true); setErr(null); } catch (e: any) { setErr(e.message); } };
  if (!p) return <Err e={err} />;
  const n = (k: string, l: string) => <label className="text-sm">{l}<input type="number" className="mt-1 w-full rounded border p-2" value={p[k]} onChange={(e) => setP({ ...p, [k]: +e.target.value })} /></label>;
  return <Card title="Virtual person profile (synthetic)"><Err e={err} /><div className="grid gap-3 md:grid-cols-3">{n("age", "Age")}{n("height_cm", "Height (cm)")}{n("weight_kg", "Weight (kg)")}{n("sleep", "Baseline sleep (h)")}{n("steps", "Baseline daily steps")}
    <label className="text-sm">Activity level<select className="mt-1 w-full rounded border p-2" value={p.activity_level} onChange={(e) => setP({ ...p, activity_level: e.target.value })}><option>low</option><option>moderate</option><option>high</option></select></label></div>
    <p className="mt-3 text-xs text-slate-600">Sleep pattern: {p.sleep_pattern}. Baseline ranges: HR 60–85 bpm, SpO2 95–100%. Routine: work 9–18h, evening walk.</p>
    <button onClick={save} className="mt-3 rounded bg-slate-900 px-4 py-2 text-sm text-white">Update Digital Twin</button>{ok && <span className="ml-3 text-sm text-emerald-700">Twin regenerated.</span>}</Card>;
}
