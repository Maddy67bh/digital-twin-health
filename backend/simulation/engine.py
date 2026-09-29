"""Synthetic data + twin state engine. ALL DATA IS SIMULATED."""
import numpy as np, pandas as pd
BASE = dict(hr=72, sys=118, dia=76, spo2=98, temp=36.7, sleep=7.0, steps=7500, stress=35, hydration=2.0)
PROFILE = dict(age=34, height_cm=172, weight_kg=70, activity_level="moderate", sleep_pattern="23:00-06:30")
BASELINE_RANGES = dict(hr=(60, 85), spo2=(95, 100), sys=(100, 130), temp=(36.1, 37.3))

def make_history(days=30, seed=7, p=None):
    """Hourly synthetic series: circadian rhythm + noise; daily sleep/steps/hydration."""
    b = {**BASE, **(p or {})}; r = np.random.default_rng(seed)
    idx = pd.date_range(end=pd.Timestamp.now().floor("h"), periods=days * 24, freq="h")
    h = idx.hour.values; circ = np.sin((h - 9) / 24 * 2 * np.pi); n = len(idx)
    df = pd.DataFrame(index=idx)
    df["hr"] = b["hr"] + 6 * circ + r.normal(0, 2.5, n)
    df["spo2"] = np.clip(b["spo2"] + r.normal(0, .6, n), 92, 100)
    df["sys"] = b["sys"] + 5 * circ + r.normal(0, 3, n); df["dia"] = b["dia"] + 3 * circ + r.normal(0, 2, n)
    df["temp"] = b["temp"] + .2 * circ + r.normal(0, .08, n)
    df["stress"] = np.clip(b["stress"] + 10 * circ + r.normal(0, 6, n), 0, 100)
    nd = days + 1; days_idx = pd.date_range(end=idx[-1].normalize(), periods=nd, freq="D")
    d = pd.DataFrame(dict(sleep=np.clip(r.normal(b["sleep"], .8, nd), 4, 10), steps=np.clip(r.normal(b["steps"], 1800, nd), 800, 20000),
                          hydration=np.clip(r.normal(b["hydration"], .4, nd), .8, 4)), index=days_idx)
    for c in d: df[c] = d[c].reindex(idx.normalize()).values
    df["calories"] = 1500 + df["steps"] * .04
    df.iloc[-6, df.columns.get_loc("hr")] = 108  # injected simulated anomaly for the demo
    return df.round(2)

def wellness(sleep, steps, stress, hydration):
    """0-100 educational score: weighted closeness to generic targets (not clinical)."""
    return round(float(min(sleep / 8, 1) * 30 + min(steps / 10000, 1) * 25 + (1 - stress / 100) * 25 + min(hydration / 2.5, 1) * 20), 1)

class Twin:
    def __init__(self): self.reset()
    def reset(self):
        self.profile = dict(PROFILE); self.params = dict(BASE); self.running = False; self.speed = 1.0
        self.hist = make_history(); self.tick = 0; self.rng = np.random.default_rng(1)
    def update_profile(self, prof, params):
        self.profile.update(prof); self.params.update(params); self.hist = make_history(p=self.params)
    def current(self):
        row = self.hist.iloc[-1].to_dict()
        row["wellness"] = wellness(row["sleep"], row["steps"], row["stress"], row["hydration"]); return row
    def step(self):
        """Mean-reverting random walk (Ornstein-Uhlenbeck style) around configured baseline."""
        last = self.hist.iloc[-1].copy(); r = self.rng
        for k, sd in dict(hr=2, spo2=.4, sys=2, dia=1.5, temp=.05, stress=3).items():
            last[k] = last[k] + .2 * (self.params[k] - last[k]) + r.normal(0, sd)
        last["spo2"] = min(last["spo2"], 100); last["steps"] += r.integers(20, 120) * self.speed
        last["calories"] = 1500 + last["steps"] * .04
        self.tick += 1; self.hist.loc[self.hist.index[-1] + pd.Timedelta(minutes=5)] = last.round(2)
        return self.current()
TWIN = Twin()
