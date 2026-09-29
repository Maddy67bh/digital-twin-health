# Methodology
Synthetic data: hourly circadian sine + Gaussian noise; daily sleep/steps/hydration; one injected HR spike for demo.
Wellness score (0-100): 30% sleep (target 8h), 25% steps (10k), 25% low stress, 20% hydration (2.5L). Educational composite, not clinical.
Prediction: Ridge regression on today's variables to next-day wellness; importance = normalized |standardized coefficient|; uncertainty = 1.96 x residual std (in-sample, so optimistic).
Anomalies: outside configured range or |robust z| > 4 (median/MAD over 7 days).
What-if: exponential approach (25%/day) to scenario values plus small heuristic bonus for exercise days and rest minutes. Not validated.
