"""Run from the project root after generating this episode's sound."""
from pathlib import Path
import wave
import numpy as np

with wave.open(str(Path(__file__).resolve().parents[2] / "public/cards/06-lovers/sfx.wav"), "rb") as w:
    assert w.getframerate() == 48000 and w.getnchannels() == 2
    assert abs(w.getnframes() / 48000 - 81.2) < 0.05
    samples = np.frombuffer(w.readframes(w.getnframes()), dtype="<i2").reshape(-1, 2) / 32768
assert 0.05 < np.max(np.abs(samples)) < 0.9, "Silent or excessive audio peak"
mono = samples.mean(axis=1)
power = np.abs(np.fft.rfft(mono)) ** 2
freq = np.fft.rfftfreq(len(mono), 1 / 48000)
assert power[freq > 4000].sum() / power.sum() < 0.002, "Excessive high-frequency energy"
print("Audio duration, peak and high-frequency checks passed.")
