import { Permission } from "node-appwrite";
import { storage } from "./config";
import { attachmentBucket } from "../name";

let setupPromise: Promise<void> | null = null;

async function ensureBucket(bucketId: string) {
  const permissions = [
    Permission.create("users"),
    Permission.read("any"),
    Permission.update("users"),
    Permission.delete("users"),
  ];

  try {
    const bucket = await storage.getBucket(bucketId);
    await storage.updateBucket(bucketId, bucket.name, permissions);
    return;
  } catch (error: unknown) {
    if (
      typeof error !== "object" ||
      error === null ||
      !("code" in error) ||
      error.code !== 404
    ) {
      throw error;
    }
  }

  try {
    await storage.createBucket(
      bucketId,
      bucketId,
      permissions,
      false,
      undefined,
      undefined,
      ["jpg", "png", "jpeg", "webp", "gif", "heic"],
    );
    console.log(`Storage bucket created: ${bucketId}`);
  } catch (error: unknown) {
    if (
      typeof error !== "object" ||
      error === null ||
      !("code" in error) ||
      error.code !== 409
    ) {
      throw error;
    }
  }
}

async function setupStorageBuckets() {
  await ensureBucket(attachmentBucket);
}

export default function getOrCreateStorageBuckets() {
  setupPromise ??= setupStorageBuckets();
  return setupPromise;
}
