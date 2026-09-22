import { attachmentBucket } from "@/models/name";

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_HOST_URL ?? "https://cloud.appwrite.io/v1";
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID ?? "";

export function getAttachmentPreviewUrl(fileId: string) {
    const url = new URL(
        `${endpoint.replace(/\/$/, "")}/storage/buckets/${attachmentBucket}/files/${encodeURIComponent(fileId)}/view`
    );
    url.searchParams.set("project", projectId);
    return url.toString();
}