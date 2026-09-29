import { useState } from "react"; import { Banner } from "./components/ui"; import Dashboard from "./pages/Dashboard"; import WhatIf from "./pages/WhatIf"; import Profile from "./pages/Profile"; import { Architecture, Privacy } from "./pages/Info";
const tabs: [string, JSX.Element][] = [["Dashboard", <Dashboard />], ["Profile", <Profile />], ["What-If", <WhatIf />], ["Architecture", <Architecture />], ["Privacy & Security", <Privacy />]];
export default function App() {
  const [t, setT] = useState(0);
  return <div className="min-h-screen bg-slate-100 text-slate-800"><Banner /><header className="border-b bg-white px-4 py-3"><h1 className="text-lg font-semibold">Digital Twin Health — PoC</h1>
    <nav className="mt-2 flex flex-wrap gap-2">{tabs.map(([n], i) => <button key={n} onClick={() => setT(i)} className={`rounded px-3 py-1 text-sm ${i === t ? "bg-slate-900 text-white" : "border"}`}>{n}</button>)}</nav></header>
    <main className="mx-auto max-w-6xl p-4">{tabs[t][1]}</main><footer className="p-4 text-center text-xs text-slate-500">Educational demonstration with synthetic data. Not medical advice.</footer></div>;
}
