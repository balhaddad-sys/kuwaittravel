#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const required = [
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  "NEXT_PUBLIC_FIREBASE_APP_ID",
];

const adminCredentialSets = [
  ["FB_ADMIN_PROJECT_ID", "FB_ADMIN_CLIENT_EMAIL", "FB_ADMIN_PRIVATE_KEY"],
  ["FIREBASE_PROJECT_ID", "FIREBASE_CLIENT_EMAIL", "FIREBASE_PRIVATE_KEY"],
];

function parseEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const out = {};
  const content = fs.readFileSync(filePath, "utf8");
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const idx = line.indexOf("=");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim();
    out[key] = value;
  }
  return out;
}

function getConfig() {
  const root = process.cwd();
  const fromDotEnv = parseEnvFile(path.join(root, ".env"));
  const fromLocal = parseEnvFile(path.join(root, ".env.local"));
  return { ...fromDotEnv, ...fromLocal, ...process.env };
}

function hasAll(env, keys) {
  return keys.every((key) => String(env[key] || "").trim());
}

function main() {
  const env = getConfig();
  const missing = required.filter((key) => !String(env[key] || "").trim());
  const hasAdminCredentials = adminCredentialSets.some((keys) => hasAll(env, keys));

  if (missing.length > 0 || !hasAdminCredentials) {
    console.error("Missing required environment variables:");
    for (const key of missing) console.error(`- ${key}`);
    if (!hasAdminCredentials) {
      console.error(
        "- One complete admin credential set is required:"
      );
      console.error(
        "  * FB_ADMIN_PROJECT_ID + FB_ADMIN_CLIENT_EMAIL + FB_ADMIN_PRIVATE_KEY"
      );
      console.error(
        "  * or FIREBASE_PROJECT_ID + FIREBASE_CLIENT_EMAIL + FIREBASE_PRIVATE_KEY"
      );
    }
    process.exit(1);
  }

  if (String(env.ADMIN_SETUP_ENABLED || "").toLowerCase() === "true") {
    console.warn("Warning: ADMIN_SETUP_ENABLED=true. Keep this false for production.");
  }

  console.log("Environment validation passed.");
}

main();
