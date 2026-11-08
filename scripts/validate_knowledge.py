#!/usr/bin/env python3
"""Validate knowledge manifest hashes and dataset envelope without third-party packages."""
import hashlib, json, pathlib, sys
ROOT = pathlib.Path(__file__).resolve().parents[1]
errors = []
def load(path):
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception as exc:
        errors.append(f"{path.relative_to(ROOT)}: invalid JSON: {exc}")
        return None
manifest = load(ROOT / "knowledge/manifest.json")
if manifest:
    if not isinstance(manifest.get("datasets"), list):
        errors.append("manifest.datasets must be an array")
    else:
        for item in manifest["datasets"]:
            path = ROOT / "knowledge" / item["path"]
            if not path.exists():
                errors.append(f"missing dataset: {item['path']}")
                continue
            raw = path.read_bytes()
            digest = hashlib.sha256(raw).hexdigest()
            if digest != item["sha256"]:
                errors.append(f"SHA-256 mismatch: {item['path']}")
            data = load(path)
            if data:
                if data.get("dataset_id") != item["id"]:
                    errors.append(f"dataset_id mismatch: {item['path']}")
                records = data.get("records")
                if not isinstance(records, list):
                    errors.append(f"records must be an array: {item['path']}")
                elif len(records) != item["record_count"]:
                    errors.append(f"record_count mismatch: {item['path']}")
if errors:
    print("\\n".join(errors))
    sys.exit(1)
print(f"Knowledge manifest valid: {len(manifest['datasets'])} datasets; all hashes match.")
