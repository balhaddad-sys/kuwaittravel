/**
 * Module-level store for the Firebase ConfirmationResult object.
 *
 * ConfirmationResult contains functions and cannot be serialised to
 * sessionStorage or localStorage.  Storing it on `window` pollutes the global
 * namespace and creates an XSS attack surface.  A plain module variable is
 * scoped to the JS module graph and is never accessible from outside the app.
 */
import type { ConfirmationResult } from "firebase/auth";

let _pending: ConfirmationResult | null = null;

export function setPendingOTP(result: ConfirmationResult): void {
  _pending = result;
}

export function getPendingOTP(): ConfirmationResult | null {
  return _pending;
}

export function clearPendingOTP(): void {
  _pending = null;
}
