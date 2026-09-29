import { ReactNode } from "react";
export const Card = ({ title, children }: { title?: string; children: ReactNode }) => (
  <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">{title && <h2 className="mb-3 text-sm font-semibold text-slate-700">{title}</h2>}{children}</section>);
export const Stat = ({ label, value, unit }: { label: string; value: string | number; unit?: string }) => (
  <div className="rounded-lg bg-slate-50 p-3"><div className="text-xs text-slate-500">{label}</div><div className="text-xl font-semibold text-slate-900">{value}<span className="ml-1 text-xs font-normal text-slate-500">{unit}</span></div></div>);
export const Banner = () => <div role="note" className="bg-amber-100 px-4 py-2 text-center text-xs font-medium text-amber-900">SIMULATED DATA — PROOF OF CONCEPT · Not a medical device · No diagnosis or medical advice</div>;
export const Err = ({ e }: { e: string | null }) => e ? <div role="alert" className="rounded bg-red-50 p-2 text-sm text-red-700">Backend error: {e}. Is the API running on port 8000?</div> : null;
