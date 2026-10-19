import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { DatabaseSync } from "node:sqlite";
import { SCENARIO_VERSION, scenarios } from "./catalog.mjs";

export function createDatabase(filename) {
  if (filename !== ":memory:") mkdirSync(dirname(filename), { recursive: true });
  const database = new DatabaseSync(filename);
  database.exec("PRAGMA foreign_keys = ON; PRAGMA journal_mode = WAL;");
  database.exec(`
    CREATE TABLE IF NOT EXISTS scenarios (
      id TEXT NOT NULL,
      version TEXT NOT NULL,
      stage TEXT NOT NULL,
      skill TEXT NOT NULL,
      published_at TEXT NOT NULL,
      PRIMARY KEY (id, version)
    );
    CREATE TABLE IF NOT EXISTS learning_sessions (
      id TEXT PRIMARY KEY,
      access_token_hash TEXT NOT NULL,
      status TEXT NOT NULL CHECK(status IN ('active','completed')),
      goal TEXT,
      friction TEXT,
      scenario_version TEXT NOT NULL,
      current_stage TEXT NOT NULL,
      started_at TEXT NOT NULL,
      completed_at TEXT
    );
    CREATE TABLE IF NOT EXISTS decisions (
      id TEXT PRIMARY KEY,
      session_id TEXT NOT NULL REFERENCES learning_sessions(id),
      request_id TEXT NOT NULL,
      scenario_id TEXT NOT NULL,
      scenario_version TEXT NOT NULL,
      choice_id TEXT NOT NULL,
      stage TEXT NOT NULL,
      correct INTEGER NOT NULL,
      error_signal TEXT NOT NULL,
      skill TEXT NOT NULL,
      elapsed_ms INTEGER,
      decided_at TEXT NOT NULL,
      UNIQUE(session_id, request_id),
      UNIQUE(session_id, scenario_id)
    );
    CREATE TABLE IF NOT EXISTS interaction_events (
      id TEXT PRIMARY KEY,
      session_id TEXT NOT NULL REFERENCES learning_sessions(id),
      request_id TEXT NOT NULL,
      scenario_id TEXT,
      event_type TEXT NOT NULL,
      payload_json TEXT NOT NULL,
      occurred_at TEXT NOT NULL,
      UNIQUE(session_id, request_id)
    );
    CREATE TABLE IF NOT EXISTS skill_assessments (
      session_id TEXT NOT NULL REFERENCES learning_sessions(id),
      skill TEXT NOT NULL,
      attempts INTEGER NOT NULL,
      correct_attempts INTEGER NOT NULL,
      last_signal TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      PRIMARY KEY(session_id, skill)
    );
    CREATE TABLE IF NOT EXISTS session_outcomes (
      session_id TEXT PRIMARY KEY REFERENCES learning_sessions(id),
      total_correct INTEGER NOT NULL,
      diagnostic_correct INTEGER NOT NULL,
      transfer_correct INTEGER NOT NULL,
      demonstrated_transfer INTEGER NOT NULL,
      recommendation TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
  `);

  const sessionColumns = database.prepare("PRAGMA table_info(learning_sessions)").all();
  if (!sessionColumns.some((column) => column.name === "access_token_hash")) {
    database.exec("ALTER TABLE learning_sessions ADD COLUMN access_token_hash TEXT");
  }

  const insertScenario = database.prepare(`
    INSERT OR IGNORE INTO scenarios (id, version, stage, skill, published_at)
    VALUES (?, ?, ?, ?, ?)
  `);
  const publishedAt = new Date().toISOString();
  for (const scenario of Object.values(scenarios)) {
    insertScenario.run(scenario.id, SCENARIO_VERSION, scenario.stage, scenario.skill, publishedAt);
  }
  return database;
}
