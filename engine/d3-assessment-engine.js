(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.D3AssessmentEngine = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const VERSION = "0.1.0";
  const CORE_CHECKPOINTS = 3;
  const LIMITS = {
    temperatureF: { min: 85, max: 110 },
    pulseBpm: { min: 25, max: 240 },
    weightKg: { min: 0.1, max: 500 },
    sleepHours: { min: 0, max: 24 }
  };

  function isObject(v) { return !!v && typeof v === "object" && !Array.isArray(v); }
  function isFiniteNumber(v) {
    if (v === "" || v === null || v === undefined) return false;
    const n = typeof v === "number" ? v : Number(v);
    return Number.isFinite(n);
  }
  function validDate(s) {
    if (typeof s !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
    const d = new Date(s + "T12:00:00Z");
    return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s;
  }
  function median(values) {
    if (!values.length) return null;
    const a = values.slice().sort((x, y) => x - y);
    const m = Math.floor(a.length / 2);
    return a.length % 2 ? a[m] : (a[m - 1] + a[m]) / 2;
  }
  function quantile(values, q) {
    if (!values.length) return null;
    const a = values.slice().sort((x, y) => x - y);
    const pos = (a.length - 1) * q, lo = Math.floor(pos), hi = Math.ceil(pos);
    return a[lo] + (a[hi] - a[lo]) * (pos - lo);
  }
  function stats(values) {
    const clean = values.filter(Number.isFinite);
    if (!clean.length) return { count: 0, median: null, min: null, max: null, q1: null, q3: null };
    return {
      count: clean.length, median: median(clean),
      min: Math.min(...clean), max: Math.max(...clean),
      q1: quantile(clean, 0.25), q3: quantile(clean, 0.75)
    };
  }
  function clonePlain(value) {
    if (Array.isArray(value)) return value.map(clonePlain);
    if (isObject(value)) {
      const out = {};
      Object.keys(value).forEach(k => { out[k] = clonePlain(value[k]); });
      return out;
    }
    return value;
  }

  function analyze(input, options) {
    const opts = options || {};
    const now = opts.generatedAt || new Date().toISOString();
    const startDate = opts.startDate || null;
    const endDate = opts.endDate || null;
    const errors = [], missingness = [], comparability = [], excluded = [];
    if (!isObject(input)) {
      return { ok: false, errors: ["Input must be a database object."], report: null };
    }

    const db = input; // Read-only by convention; no mutation occurs below.
    const logsObject = isObject(db.logs) ? db.logs : {};
    const healthObject = isObject(db.healthData) && isObject(db.healthData.daily) ? db.healthData.daily : {};
    const dates = new Set();
    const logRows = [];
    const checkpointValues = {};
    let validTemp = 0, validPulse = 0, completeCore = 0, coreSlots = 0;
    let missingMethods = 0, missingTimes = 0;

    Object.keys(logsObject).sort().forEach(key => {
      const log = logsObject[key];
      if (!isObject(log)) {
        errors.push("Log at key " + key + " is not an object.");
        return;
      }
      const date = validDate(log.date) ? log.date : (validDate(key) ? key : null);
      if (!date) {
        errors.push("Invalid log date at key " + key + ".");
        return;
      }
      if ((startDate && date < startDate) || (endDate && date > endDate)) return;
      if (dates.has(date)) errors.push("Duplicate log date encountered: " + date + ".");
      dates.add(date);
      if (!log.method) missingMethods++;
      const measurements = Array.isArray(log.measurements) ? log.measurements : [];
      for (let i = 0; i < Math.max(measurements.length, CORE_CHECKPOINTS); i++) {
        const m = isObject(measurements[i]) ? measurements[i] : {};
        const label = String(m.label || ("Checkpoint " + (i + 1)));
        const tempPresent = isFiniteNumber(m.temp);
        const pulsePresent = isFiniteNumber(m.pulse);
        const timePresent = typeof m.time === "string" && m.time.trim() !== "";
        if (i < CORE_CHECKPOINTS) {
          coreSlots++;
          if (tempPresent && pulsePresent && timePresent) completeCore++;
        }
        if (!timePresent && (tempPresent || pulsePresent)) missingTimes++;
        let temp = null, pulse = null;
        if (tempPresent) {
          const n = Number(m.temp);
          if (n >= LIMITS.temperatureF.min && n <= LIMITS.temperatureF.max) { temp = n; validTemp++; }
          else excluded.push({ date, field: label + ".temperature", reason: "Outside app input bounds (85–110 °F)." });
        }
        if (pulsePresent) {
          const n = Number(m.pulse);
          if (n >= LIMITS.pulseBpm.min && n <= LIMITS.pulseBpm.max) { pulse = n; validPulse++; }
          else excluded.push({ date, field: label + ".pulse", reason: "Outside app input bounds (25–240 BPM)." });
        }
        const groupKey = i + "|" + label + "|" + String(log.method || "unknown");
        if (!checkpointValues[groupKey]) checkpointValues[groupKey] = { checkpoint_index: i, label, method: String(log.method || "unknown"), temperatureF: [], pulseBpm: [], observations: [] };
        if (temp !== null) checkpointValues[groupKey].temperatureF.push(temp);
        if (pulse !== null) checkpointValues[groupKey].pulseBpm.push(pulse);
        if (temp !== null || pulse !== null) checkpointValues[groupKey].observations.push({ date, time: timePresent ? m.time : null, temperatureF: temp, pulseBpm: pulse });
      }
      logRows.push({ date, log });
    });

    if (missingMethods) missingness.push(missingMethods + " daily log(s) have no measurement method recorded.");
    if (missingTimes) missingness.push(missingTimes + " checkpoint(s) with a value have no measurement time.");
    const corePct = coreSlots ? Math.round(completeCore / coreSlots * 100) : 0;
    if (coreSlots && completeCore < coreSlots) missingness.push((coreSlots - completeCore) + " of " + coreSlots + " core checkpoint slots are incomplete (time, temperature and pulse all required for completeness).");

    const methodSet = new Set(logRows.map(x => String(x.log.method || "unknown")));
    if (methodSet.size > 1) comparability.push("More than one temperature measurement method is present. Do not pool these measurements without method-specific review.");
    if (Object.keys(checkpointValues).some(k => checkpointValues[k].observations.length > 1)) {
      comparability.push("Summaries are separated by checkpoint index, label and measurement method.");
    }

    const checkpointSummaries = Object.keys(checkpointValues).sort().map(k => {
      const g = checkpointValues[k];
      return {
        checkpoint_index: g.checkpoint_index, label: g.label, method: g.method,
        temperatureF: stats(g.temperatureF), pulseBpm: stats(g.pulseBpm),
        observations: g.observations
      };
    });

    const healthRows = [];
    Object.keys(healthObject).sort().forEach(key => {
      const r = healthObject[key];
      if (!isObject(r)) { errors.push("Health record at key " + key + " is not an object."); return; }
      const date = validDate(r.date) ? r.date : (validDate(key) ? key : null);
      if (!date) { errors.push("Invalid health-data date at key " + key + "."); return; }
      if ((startDate && date < startDate) || (endDate && date > endDate)) return;
      const row = { date, weightKg: null, sleepHours: null, sleepQuality: r.sleepQuality || null };
      [["weightKg", LIMITS.weightKg, "weight"], ["sleepHours", LIMITS.sleepHours, "sleep"]].forEach(([field, lim, label]) => {
        if (isFiniteNumber(r[field])) {
          const n = Number(r[field]);
          if (n >= lim.min && n <= lim.max) row[field] = n;
          else excluded.push({ date, field: label, reason: "Outside accepted data bounds." });
        }
      });
      healthRows.push(row);
    });

    const weightStats = stats(healthRows.map(x => x.weightKg).filter(x => x !== null));
    const sleepStats = stats(healthRows.map(x => x.sleepHours).filter(x => x !== null));
    const allDates = Array.from(new Set(logRows.map(x => x.date).concat(healthRows.map(x => x.date)))).sort();
    const periodStart = allDates.length ? allDates[0] : null;
    const periodEnd = allDates.length ? allDates[allDates.length - 1] : null;

    const observationSummary = [];
    observationSummary.push(logRows.length + " daily temperature/pulse log(s) in the selected period.");
    observationSummary.push(validTemp + " valid temperature value(s) and " + validPulse + " valid pulse value(s) passed basic app-range checks.");
    if (healthRows.length) observationSummary.push(healthRows.length + " daily health record(s); weight median " + (weightStats.median === null ? "not available" : weightStats.median + " kg") + "; sleep median " + (sleepStats.median === null ? "not available" : sleepStats.median + " hours") + ".");
    else observationSummary.push("No daily health records in the selected period.");

    const report = {
      report_version: VERSION,
      generated_at: now,
      period: { start_date: periodStart, end_date: periodEnd, days_with_records: allDates.length },
      observation_summary: observationSummary,
      data_quality: {
        valid_temperature_count: validTemp,
        valid_pulse_count: validPulse,
        missingness_notes: missingness,
        comparability_notes: comparability,
        excluded_values: excluded
      },
      bioenergetic_interpretation: [],
      physiology: [],
      mainstream_comparison: [],
      critical_appraisal: [{
        issue: "D3.1 is descriptive only.",
        explanation: "This build does not retrieve knowledge records or generate physiological/clinical interpretations. D3.2 is required before source-linked interpretation can be produced.",
        related_record_ids: []
      }],
      safety: {
        status: "incomplete_knowledge",
        items: [],
        limitations: ["No validated safety-rule dataset is connected in D3.1. This output must not be interpreted as a safety clearance."]
      },
      next_steps: []
    };

    return {
      ok: errors.length === 0,
      errors,
      report,
      quality: {
        core_checkpoint_slots: coreSlots,
        complete_core_checkpoint_slots: completeCore,
        core_checkpoint_completion_percent: corePct,
        measurement_methods: Array.from(methodSet),
        checkpoint_summaries: checkpointSummaries,
        health_data: { record_count: healthRows.length, weight: weightStats, sleep: sleepStats, rows: healthRows },
        trend_display_gate: validTemp + validPulse === 0 ? "no_observations" :
          (Math.max(...checkpointSummaries.map(x => Math.max(x.temperatureF.count, x.pulseBpm.count)), 0) < 2 ? "observation_only" :
          (Math.max(...checkpointSummaries.map(x => Math.max(x.temperatureF.count, x.pulseBpm.count)), 0) < 4 ? "small_sample" :
          (Math.max(...checkpointSummaries.map(x => Math.max(x.temperatureF.count, x.pulseBpm.count)), 0) < 7 ? "provisional_descriptive" : "descriptive_trend"))),
        assessment_field_count: isObject(db.assessment) ? Object.keys(db.assessment).length : 0
      }
    };
  }

  return Object.freeze({ VERSION, analyze, stats, validDate });
});
