export function normalizeTags(value: unknown): string[] {
    if (Array.isArray(value)) return value.filter((tag): tag is string => typeof tag === "string");
    if (typeof value !== "string" || value.length === 0) return [];

    try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) {
            return parsed.filter((tag): tag is string => typeof tag === "string");
        }
    } catch {
        // Existing rows use comma-separated tags.
    }

    return value.split(",").map(tag => tag.trim()).filter(Boolean);
}
