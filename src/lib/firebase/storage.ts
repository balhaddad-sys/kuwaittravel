import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  type UploadMetadata,
} from "firebase/storage";
import { getFirebaseStorage } from "./config";

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "application/pdf",
]);

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

export async function uploadFile(
  path: string,
  file: File,
  metadata?: UploadMetadata
): Promise<string> {
  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    throw new Error(`File type "${file.type}" is not allowed.`);
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("File exceeds the 10 MB size limit.");
  }
  const storageRef = ref(getFirebaseStorage(), path);
  await uploadBytes(storageRef, file, metadata);
  return getDownloadURL(storageRef);
}

export async function getFileUrl(path: string): Promise<string> {
  const storageRef = ref(getFirebaseStorage(), path);
  return getDownloadURL(storageRef);
}

export async function deleteFile(path: string): Promise<void> {
  const storageRef = ref(getFirebaseStorage(), path);
  await deleteObject(storageRef);
}

export function generateStoragePath(
  type: "passports" | "visas" | "licenses" | "gallery" | "covers" | "avatars",
  userId: string,
  fileName: string
): string {
  const timestamp = Date.now();
  const ext = fileName.split(".").pop();
  return `${type}/${userId}/${timestamp}.${ext}`;
}
