// Thin typed fetch wrapper; throws readable errors so pages can show them.
export async function api<T = any>(path: string, opts?: { method?: string; body?: unknown }): Promise<T> {
  const r = await fetch(path, { method: opts?.method ?? "GET", headers: { "Content-Type": "application/json" }, body: opts?.body ? JSON.stringify(opts.body) : undefined });
  if (!r.ok) throw new Error(`${r.status}: ${(await r.text()).slice(0, 200)}`);
  return r.json();
}
