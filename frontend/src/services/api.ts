const API_BASE = "http://127.0.0.1:8000";

async function api(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options
  });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  return response.json();
}

export const getHealth = () => api("/api/health");
export const getTwin = () => api("/api/twin");
export const getMetrics = () => api("/api/metrics");
export const getHistory = () => api("/api/history");
export const getAnomalies = () => api("/api/anomalies");
export const getInsights = () => api("/api/insights");

export const runSimulation = (data = {}) =>
  api("/api/simulation", {
    method: "POST",
    body: JSON.stringify(data)
  });

export const runWhatIf = (data = {}) =>
  api("/api/what-if", {
    method: "POST",
    body: JSON.stringify(data)
  });
