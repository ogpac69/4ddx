#!/bin/sh
node d4.1-d4.2-ui-integration.test.js
node d4.3-diagnostic-reasoning.test.js

node "$(dirname "$0")/d4.5-evidence-library.test.js"
