#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { FieldValue, getFirestore } from "firebase-admin/firestore";

function usage() {
  console.log(`
Usage:
  npm run grant-admin -- --service-account <path> --uid <firebaseUid> [--role admin|super_admin]
  npm run grant-admin -- --service-account <path> --email <email> [--role admin|super_admin]
  npm run grant-admin -- --service-account <path> --phone <+965...> [--role admin|super_admin]

Examples:
  npm run grant-admin -- --service-account "C:/keys/service-account.json" --uid abc123
  npm run grant-admin -- --service-account "C:/keys/service-account.json" --phone +96550000000 --role super_admin
`);
}

function parseArgs(argv) {
  const parsed = {};
  for (let i = 0; i < argv.length; i += 1) {
    const key = argv[i];
    if (!key.startsWith("--")) continue;
    const normalized = key.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith("--")) {
      parsed[normalized] = true;
      continue;
    }
    parsed[normalized] = next;
    i += 1;
  }
  return parsed;
}

async function resolveUserRecord(auth, args) {
  if (typeof args.uid === "string") return auth.getUser(args.uid);
  if (typeof args.email === "string") return auth.getUserByEmail(args.email);
  if (typeof args.phone === "string") return auth.getUserByPhoneNumber(args.phone);
  throw new Error("Missing target user. Provide --uid, --email, or --phone.");
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help || args.h) {
    usage();
    return;
  }

  const serviceAccountPath = args["service-account"];
  const role = args.role === "super_admin" ? "super_admin" : "admin";

  if (typeof serviceAccountPath !== "string") {
    throw new Error("Missing required --service-account argument.");
  }

  if (!args.uid && !args.email && !args.phone) {
    throw new Error("Missing target user. Provide --uid, --email, or --phone.");
  }

  const resolvedPath = path.resolve(process.cwd(), serviceAccountPath);
  if (!fs.existsSync(resolvedPath)) {
    throw new Error(`Service account file not found: ${resolvedPath}`);
  }

  const raw = fs.readFileSync(resolvedPath, "utf8");
  const serviceAccount = JSON.parse(raw);

  if (getApps().length === 0) {
    initializeApp({
      credential: cert(serviceAccount),
    });
  }

  const auth = getAuth();
  const db = getFirestore();
  const userRecord = await resolveUserRecord(auth, args);

  const userRef = db.collection("users").doc(userRecord.uid);
  const userSnap = await userRef.get();
  const existing = userSnap.exists ? userSnap.data() : {};

  const profile = {
    uid: userRecord.uid,
    email: userRecord.email || existing.email || "",
    phone: userRecord.phoneNumber || existing.phone || "",
    displayName: userRecord.displayName || existing.displayName || existing.displayNameAr || "Admin User",
    displayNameAr: existing.displayNameAr || userRecord.displayName || "مشرف",
    role,
    preferredLanguage: existing.preferredLanguage || "ar",
    notificationTokens: Array.isArray(existing.notificationTokens) ? existing.notificationTokens : [],
    isVerified: true,
    isActive: true,
    updatedAt: FieldValue.serverTimestamp(),
  };

  if (!userSnap.exists) {
    profile.createdAt = FieldValue.serverTimestamp();
  }

  await userRef.set(profile, { merge: true });

  const claims = userRecord.customClaims || {};
  await auth.setCustomUserClaims(userRecord.uid, {
    ...claims,
    platformRole: role,
    admin: true,
  });

  console.log(`Granted ${role} access to user ${userRecord.uid}`);
  console.log("User can now sign in from /admin-login");
}

main().catch((error) => {
  console.error("Failed to grant admin access:");
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
