"""Explainable ML (scikit-learn). Non-diagnostic wellness trend only."""
import numpy as np
from sklearn.linear_model import Ridge
from simulation.engine import wellness, BASELINE_RANGES
LABEL = "Simulation / Educational Projection — Not Medical Advice"
F = ["sleep", "steps", "stress", "hydration"]
def daily(df): return df.resample("D").mean().dropna()

def predict_next_wellness(df):
    """Ridge regression: today's [sleep, steps, stress, hydration] -> next-day wellness score.
    Standardised |coef| share = importance; residual std = 95% uncertainty band."""
    d = daily(df); d["w"] = [wellness(r.sleep, r.steps, r.stress, r.hydration) for r in d.itertuples()]
    X = d[F].values[:-1]; y = d["w"].values[1:]; mu, sd = X.mean(0), X.std(0) + 1e-9
    m = Ridge(alpha=1.0).fit((X - mu) / sd, y)
    pred = float(m.predict(((d[F].values[-1] - mu) / sd)[None])[0]); res = float(np.std(y - m.predict((X - mu) / sd)))
    c = np.abs(m.coef_); imp = c / (c.sum() + 1e-9)
    return dict(prediction=round(pred, 1), lower=round(pred - 1.96 * res, 1), upper=round(pred + 1.96 * res, 1),
                importance={k: round(float(v), 3) for k, v in zip(F, imp)}, history=[round(float(v), 1) for v in d["w"].tail(14)], label=LABEL)

def anomalies(df):
    """Flag if outside configured baseline range OR robust z-score (median/MAD, last 7 days) > 4."""
    out = []; ref = df.tail(168)
    for k, (lo, hi) in BASELINE_RANGES.items():
        med = ref[k].median(); mad = (ref[k] - med).abs().median() * 1.4826 + 1e-9
        for ts, v in df[k].tail(48).items():
            z = (v - med) / mad
            if v < lo or v > hi or abs(z) > 4:
                out.append(dict(time=str(ts), metric=k, value=float(v), baseline=f"{lo}-{hi}", z=round(float(z), 1),
                    message="Unusual simulated reading detected",
                    detail="This simulated value differs from the configured baseline. In a real deployment, measurements should be reviewed using appropriate clinical workflows."))
    return out

def insights(df):
    """Last 7 days vs previous 7 days; each insight lists metric, baseline, current, change, reason."""
    d = daily(df); cur, prev = d.tail(7).mean(), d.iloc[-14:-7].mean(); res = []
    for k in ("sleep", "steps", "stress", "hydration", "hr"):
        ch = (cur[k] - prev[k]) / prev[k] * 100
        if abs(ch) >= 5:
            res.append(dict(metric=k, baseline=round(float(prev[k]), 2), current=round(float(cur[k]), 2), change_pct=round(float(ch), 1),
                reason=f"{k} {'decreased' if ch < 0 else 'increased'} by approximately {abs(ch):.0f}% compared with the previous 7-day simulated baseline."))
    return res

def what_if(current, sc, days=14):
    """Each variable moves ~25%/day toward its scenario value; wellness recomputed daily.
    Exercise days / rest minutes add a small documented heuristic bonus. Illustrative only."""
    cur = {k: float(current[k]) for k in F}; tgt = {k: float(sc[k]) for k in F}
    bonus = min(sc.get("exercise_days", 0), 7) * .6 + min(sc.get("rest_minutes", 0), 120) / 60; rows = []
    for d in range(days + 1):
        a = 1 - .75 ** d; s = {k: cur[k] + (tgt[k] - cur[k]) * a for k in F}
        rows.append(dict(day=d, **{k: round(v, 2) for k, v in s.items()}, wellness=round(min(100, wellness(**s) + bonus * a), 1)))
    return dict(baseline_wellness=rows[0]["wellness"], projected_wellness=rows[-1]["wellness"], trajectory=rows, label=LABEL)
