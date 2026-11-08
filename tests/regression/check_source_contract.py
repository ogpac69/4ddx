#!/usr/bin/env python3
"""Static characterization checks for the preserved v22.6 tracker source."""
from pathlib import Path
import hashlib
import re
import unittest

ROOT = Path(__file__).resolve().parents[2]
APP = ROOT / "app" / "index.html"
BASELINE = ROOT / "docs" / "source-baselines" / "v22.6-original.html"
CHECKSUMS = ROOT / "docs" / "source-baselines" / "SHA256SUMS.txt"

class SourceContractTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.source = APP.read_text(encoding="utf-8")

    def test_original_baseline_is_preserved_byte_for_byte(self):
        self.assertTrue(BASELINE.is_file())
        self.assertEqual(APP.read_bytes(), BASELINE.read_bytes())
        expected = CHECKSUMS.read_text().split()[0]
        self.assertEqual(hashlib.sha256(BASELINE.read_bytes()).hexdigest(), expected)

    def test_storage_key_is_unchanged(self):
        self.assertIn("bioenergetic_profile_v1", self.source)

    def test_expected_top_level_data_collections_exist(self):
        for key in ("logs", "assessment", "supplements", "customSupplements"):
            self.assertIn(key, self.source)

    def test_all_seven_views_exist(self):
        for view in ("dashboard", "daily", "questionnaire", "supplements", "healthdata", "trends", "settings"):
            self.assertRegex(self.source, rf'id=["\']{view}["\']')

    def test_core_workflows_remain_present(self):
        for function in ("saveDaily", "loadDaily", "saveAssessment", "saveSupplements", "renderSupplementTracker", "exportJSON", "importJSON", "exportCSV", "deleteAll"):
            self.assertRegex(self.source, rf"function\s+{function}\s*\(")

    def test_temperature_is_stored_in_fahrenheit(self):
        self.assertIn("function temperatureToF", self.source)
        self.assertIn("Number(value)*9/5+32", self.source)

    def test_manual_json_backup_and_print_report_exist(self):
        self.assertIn("function exportJSON", self.source)
        self.assertIn("function buildReportHTML", self.source)
        self.assertIn("window.print()", self.source)

if __name__ == "__main__":
    unittest.main(verbosity=2)
