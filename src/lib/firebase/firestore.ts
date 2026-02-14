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
  callback: (data: T | null) => void
): Unsubscribe {
  const ref = doc(getFirebaseDb(), collectionName, docId);
  return onSnapshot(ref, (snap) => {
    if (!snap.exists()) {
      callback(null);
      return;
    }
    callback({ id: snap.id, ...snap.data() } as T);
  });
}

export function onCollectionChange<T>(
  collectionName: string,
  constraints: QueryConstraint[],
  callback: (data: T[]) => void
): Unsubscribe {
  const ref = collection(getFirebaseDb(), collectionName);
  const q = constraints.length > 0 ? query(ref, ...constraints) : query(ref);
  return onSnapshot(q, (snap) => {
    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as T);
    callback(items);
  });
}
