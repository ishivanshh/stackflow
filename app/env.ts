const env = {
    appwrite : {
        endpoint : String(process.env.NEXT_PUBLIC_APPRWITE_HOST_URL),
        projectId : String(process.env.NEXT_PUBLIC_APPRWITE_PROECT_ID),
        apikey : String(process.env.APPWRITE_API_KEY)
    }
}

export default env;
