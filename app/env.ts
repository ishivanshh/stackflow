const requiredEnv = (name: string) => {
    const value = process.env[name];

    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }

    return value;
};

const env = {
    appwrite: {
        endpoint: requiredEnv("NEXT_PUBLIC_APPWRITE_HOST_URL"),
        projectId: requiredEnv("NEXT_PUBLIC_APPWRITE_PROJECT_ID"),
        apikey: requiredEnv("APPWRITE_API_KEY")
    }
};

export default env;
