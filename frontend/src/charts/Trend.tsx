import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
export default function Trend({ data, keys, xKey = "t" }: { data: any[]; keys: { k: string; color: string }[]; xKey?: string }) {
  return <div className="h-52 w-full"><ResponsiveContainer><LineChart data={data}><CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
    <XAxis dataKey={xKey} tick={{ fontSize: 10 }} tickFormatter={(v) => String(v).slice(5, 13)} minTickGap={40} /><YAxis tick={{ fontSize: 10 }} domain={["auto", "auto"]} /><Tooltip />
    {keys.map((s) => <Line key={s.k} dataKey={s.k} stroke={s.color} dot={false} strokeWidth={2} isAnimationActive={false} />)}</LineChart></ResponsiveContainer></div>;
}
