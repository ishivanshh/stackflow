import { Permission } from "node-appwrite";
import { storage } from "./config";
import { questionAttachmentBucket } from "../name";

export default async function getOrCreateStorageBucket() {
  try {
    // Check if bucket already exists
    await storage.getBucket(questionAttachmentBucket);

    console.log("Storage bucket already exists");
    console.log("Storage connected");
  } catch (error) {
    try {
      // Create bucket if it doesn't exist
      await storage.createBucket(
        questionAttachmentBucket,
        questionAttachmentBucket,
        [
          Permission.create("users"),
          Permission.read("any"),
          Permission.update("users"),
          Permission.delete("users"),
        ],
        false,
        undefined,
        undefined,
        ["jpg", "png", "jpeg", "webp", "gif", "heic"],
      );

      console.log("Storage bucket created");
      console.log("Storage connected");
    } catch (error) {
      console.log("Error creating storage bucket:", error);
    }
  }
}
