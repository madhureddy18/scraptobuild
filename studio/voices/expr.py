"""Exaggerate intonation (same voice): Praat 'Change gender' with formant shift 1.0, pitch range factor F. usage: expr.py in.wav out.wav F"""
import sys, parselmouth
from parselmouth.praat import call
s = parselmouth.Sound(sys.argv[1]); F = float(sys.argv[3])
o = call(s, "Change gender", 70, 300, 1.0, 0, F, 1.0)
o.save(sys.argv[2], "WAV")
