const requiredEnv = (name: string, value: string | undefined) => {

    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }

    return value;
};

const env = {
    appwrite: {
        endpoint: requiredEnv("NEXT_PUBLIC_APPWRITE_HOST_URL", process.env.NEXT_PUBLIC_APPWRITE_HOST_URL),
        projectId: requiredEnv("NEXT_PUBLIC_APPWRITE_PROJECT_ID", process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID),
        apikey:
            typeof window === "undefined"
                ? requiredEnv("APPWRITE_API_KEY", process.env.APPWRITE_API_KEY)
                : "",
    }
};

export default env;
