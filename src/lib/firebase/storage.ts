import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  type UploadMetadata,
} from "firebase/storage";
import { storage } from "./config";

export async function uploadFile(
  path: string,
  file: File,
  metadata?: UploadMetadata
): Promise<string> {
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file, metadata);
  return getDownloadURL(storageRef);
}

export async function getFileUrl(path: string): Promise<string> {
  const storageRef = ref(storage, path);
  return getDownloadURL(storageRef);
}

export async function deleteFile(path: string): Promise<void> {
  const storageRef = ref(storage, path);
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
