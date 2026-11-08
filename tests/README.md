# Test suite

All fixtures are synthetic. Do not place participant or personal health records in this repository.

## Static regression checks

Run from the repository root:

```sh
python -m unittest discover -s tests/regression -p 'check_*.py' -v
python scripts/check_source_baseline.py
python scripts/validate_knowledge.py
```

## Browser workflow checks

The browser suite exercises the real HTML app in an isolated Chromium context. It covers initialization, all seven views, daily-log validation and persistence, JSON export, valid/invalid backup import, and deletion confirmation.

Install Playwright and Chromium:

```sh
python -m pip install playwright
python -m playwright install chromium
```

Then run:

```sh
python -m unittest discover -s tests/regression -p 'test_*.py' -v
```

On Linux, if Chromium is installed outside Playwright's default browser cache, set `PLAYWRIGHT_CHROMIUM_PATH` to its executable path. The browser tests use a temporary local HTTP server and a fresh browser context per test. They do not connect to a remote service.
