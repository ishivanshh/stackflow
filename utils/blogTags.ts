export function serializeBlogTags(tags: string[] | undefined): string | undefined {
    if (!tags) return undefined;

    return JSON.stringify(
        tags
            .map(tag => tag.trim())
            .filter(Boolean)
    );
}

export function deserializeBlogTags(tags: string | undefined): string[] {
    if (!tags) return [];

    try {
        const parsed = JSON.parse(tags);
        return Array.isArray(parsed) && parsed.every(tag => typeof tag === "string")
            ? parsed
            : [];
    } catch {
        return [];
    }
}