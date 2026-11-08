#!/usr/bin/env python3
"""Browser-level regression tests for the preserved single-file tracker.

Requires: pip install playwright; a Chromium executable (or PLAYWRIGHT_CHROMIUM_PATH).
All records are synthetic and remain in an isolated browser context.
"""
from __future__ import annotations
import json
import os
import tempfile
import unittest
from pathlib import Path
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from threading import Thread
from functools import partial
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[2]
APP = ROOT / "app" / "index.html"
CHROMIUM = os.environ.get("PLAYWRIGHT_CHROMIUM_PATH", "/usr/bin/chromium")


@unittest.skipUnless(Path(CHROMIUM).exists(), f"Chromium not found at {CHROMIUM}")
class BrowserWorkflowTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.pw = sync_playwright().start()
        cls.browser = cls.pw.chromium.launch(headless=True, executable_path=CHROMIUM, args=["--no-sandbox"])
        handler = partial(SimpleHTTPRequestHandler, directory=str(ROOT))
        cls.server = ThreadingHTTPServer(("127.0.0.1", 0), handler)
        cls.server_thread = Thread(target=cls.server.serve_forever, daemon=True)
        cls.server_thread.start()
        cls.base_url = f"http://127.0.0.1:{cls.server.server_port}"

    @classmethod
    def tearDownClass(cls):
        cls.server.shutdown()
        cls.server.server_close()
        cls.browser.close()
        cls.pw.stop()

    def setUp(self):
        self.context = self.browser.new_context(accept_downloads=True)
        self.page = self.context.new_page()
        self.page_errors = []
        self.page.on("pageerror", lambda exc: self.page_errors.append(str(exc)))
        self.page.goto(self.base_url + "/app/index.html", wait_until="load")

    def tearDown(self):
        self.context.close()

    def test_initialization_and_seven_views(self):
        for view in ("dashboard", "daily", "questionnaire", "supplements", "healthdata", "trends", "settings"):
            self.assertEqual(self.page.locator(f"#{view}").count(), 1)
        self.assertEqual(self.page.locator("#dashboard").get_attribute("class").find("active") >= 0, True)
        self.assertFalse(self.page_errors, self.page_errors)

    def test_daily_log_persists_across_reload(self):
        self.page.evaluate("showView('daily')")
        self.page.locator("#logDate").evaluate("el => el.value = '2026-10-01'")
        self.page.locator("#tp0").fill("98.6")
        self.page.locator("#pu0").fill("70")
        self.page.locator("#dailyNotes").fill("synthetic regression record")
        self.page.get_by_role("button", name="Save daily log").click()
        self.assertIn("Saved locally", self.page.locator("#dailyStatus").inner_text())
        stored = self.page.evaluate("JSON.parse(localStorage.getItem('bioenergetic_profile_v1'))")
        self.assertEqual(stored["logs"]["2026-10-01"]["measurements"][0]["temp"], 98.6)
        self.assertEqual(stored["logs"]["2026-10-01"]["measurements"][0]["pulse"], 70)
        self.page.reload(wait_until="load")
        restored = self.page.evaluate("JSON.parse(localStorage.getItem('bioenergetic_profile_v1'))")
        self.assertEqual(restored["logs"]["2026-10-01"]["notes"], "synthetic regression record")
        self.assertFalse(self.page_errors, self.page_errors)

    def test_invalid_temperature_is_rejected(self):
        self.page.evaluate("showView('daily')")
        self.page.locator("#logDate").evaluate("el => el.value = '2026-10-02'")
        self.page.locator("#tp0").fill("200")
        self.page.locator("#pu0").fill("70")
        self.page.once("dialog", lambda dialog: dialog.accept())
        self.page.get_by_role("button", name="Save daily log").click()
        stored = self.page.evaluate("localStorage.getItem('bioenergetic_profile_v1')")
        self.assertTrue(stored is None or "2026-10-02" not in json.loads(stored).get("logs", {}))

    def test_json_backup_export_contains_saved_data(self):
        payload = {"logs": {"2026-10-03": {"date": "2026-10-03", "measurements": []}}, "assessment": {}, "supplements": {}, "customSupplements": []}
        self.page.evaluate("showView('settings')")
        self.page.evaluate("payload => { localStorage.setItem('bioenergetic_profile_v1', JSON.stringify(payload)); db=payload; }", payload)
        self.page.evaluate("exportJSON()")
        exported = self.page.evaluate("currentExport.content")
        self.assertEqual(json.loads(exported)["logs"].keys(), payload["logs"].keys())

    def test_valid_backup_import_and_invalid_backup_rejection(self):
        self.page.evaluate("showView('settings')")
        good = {"logs": {"2026-10-04": {"date": "2026-10-04", "measurements": []}}, "assessment": {"age": "25"}}
        bad = {"notLogs": {}, "assessment": {}}
        with tempfile.TemporaryDirectory() as tmp:
            good_path = Path(tmp) / "good.json"
            good_path.write_text(json.dumps(good))
            self.page.locator("#importFile").set_input_files(str(good_path))
            self.page.wait_for_function("document.querySelector('#backupStatus').textContent.includes('imported')")
            saved = self.page.evaluate("JSON.parse(localStorage.getItem('bioenergetic_profile_v1'))")
            self.assertIn("2026-10-04", saved["logs"])
            bad_path = Path(tmp) / "bad.json"
            bad_path.write_text(json.dumps(bad))
            self.page.locator("#importFile").set_input_files(str(bad_path))
            self.page.wait_for_function("document.querySelector('#backupStatus').textContent.includes('Could not import')")
            still_saved = self.page.evaluate("JSON.parse(localStorage.getItem('bioenergetic_profile_v1'))")
            self.assertIn("2026-10-04", still_saved["logs"])

    def test_delete_all_requires_confirmation_and_clears_storage(self):
        self.page.evaluate("localStorage.setItem('bioenergetic_profile_v1', JSON.stringify({logs:{x:{}},assessment:{},supplements:{},customSupplements:[]}))")
        self.page.evaluate("showView('settings')")
        self.page.once("dialog", lambda dialog: dialog.accept())
        self.page.get_by_role("button", name="Delete all local data").click()
        self.assertIsNone(self.page.evaluate("localStorage.getItem('bioenergetic_profile_v1')"))


if __name__ == "__main__":
    unittest.main(verbosity=2)
