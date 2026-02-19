import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  onSnapshot,
  type QueryConstraint,
  type DocumentData,
  type Unsubscribe,
  serverTimestamp,
} from "firebase/firestore";
import { getFirebaseDb } from "./config";

const PERMISSION_DENIED_CODE = "permission-denied";

function normalizeFirestoreError(err: unknown): Error {
  if (err instanceof Error) return err;
  return new Error(typeof err === "string" ? err : "Unknown Firestore error");
}

function getFirestoreErrorCode(err: unknown): string | undefined {
  if (typeof err !== "object" || err === null || !("code" in err)) return undefined;
  const code = (err as { code?: unknown }).code;
  return typeof code === "string" ? code : undefined;
}

function reportListenerError(
  context: string,
  err: unknown,
  onError?: (error: Error) => void
): void {
  const normalizedError = normalizeFirestoreError(err);
  const code = getFirestoreErrorCode(err);

  if (code === PERMISSION_DENIED_CODE) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`[Firestore] ${context} permission denied.`);
    }
    onError?.(normalizedError);
    return;
  }

  console.error(`[Firestore] ${context} listener error:`, err);
  onError?.(normalizedError);
}

export async function getDocument<T>(
  collectionName: string,
  docId: string
): Promise<T | null> {
  const ref = doc(getFirebaseDb(), collectionName, docId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as T;
}

export async function getDocuments<T>(
  collectionName: string,
  constraints: QueryConstraint[] = []
): Promise<T[]> {
  const ref = collection(getFirebaseDb(), collectionName);
  const q = constraints.length > 0 ? query(ref, ...constraints) : query(ref);
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as T);
}

export async function createDocument<T extends DocumentData>(
  collectionName: string,
  data: T,
  id?: string
): Promise<string> {
  const timestamped = { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() };
  if (id) {
    const ref = doc(getFirebaseDb(), collectionName, id);
    await setDoc(ref, timestamped);
    return id;
  }
  const ref = collection(getFirebaseDb(), collectionName);
  const docRef = await addDoc(ref, timestamped);
  return docRef.id;
}

export async function updateDocument(
  collectionName: string,
  docId: string,
  data: Partial<DocumentData>
): Promise<void> {
  const ref = doc(getFirebaseDb(), collectionName, docId);
  await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
}

export async function deleteDocument(
  collectionName: string,
  docId: string
): Promise<void> {
  const ref = doc(getFirebaseDb(), collectionName, docId);
  await deleteDoc(ref);
}

export function onDocumentChange<T>(
  collectionName: string,
  docId: string,
  callback: (data: T | null) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const ref = doc(getFirebaseDb(), collectionName, docId);
  return onSnapshot(
    ref,
    (snap) => {
      if (!snap.exists()) {
        callback(null);
        return;
      }
      callback({ id: snap.id, ...snap.data() } as T);
    },
    (err) => {
      reportListenerError(`${collectionName}/${docId}`, err, onError);
    }
  );
}

export function onCollectionChange<T>(
  collectionName: string,
  constraints: QueryConstraint[],
  callback: (data: T[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const ref = collection(getFirebaseDb(), collectionName);
  const q = constraints.length > 0 ? query(ref, ...constraints) : query(ref);
  return onSnapshot(
    q,
    (snap) => {
      const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as T);
      callback(items);
    },
    (err) => {
      reportListenerError(collectionName, err, onError);
    }
  );
}
