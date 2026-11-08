#!/usr/bin/env python3
from pathlib import Path
import hashlib, sys
root=Path(__file__).resolve().parents[1]
p=root/"app/index.html"
expected="77451c9d271a80f3e4320a4690070160996382398d24954e7b7df6326ac86c11"
actual=hashlib.sha256(p.read_bytes()).hexdigest()
if actual != expected:
    print("Baseline mismatch:", actual)
    sys.exit(1)
print("Application source matches the captured v22.6 baseline:", actual)
