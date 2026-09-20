import { Account, Client } from "appwrite";

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_HOST_URL ?? "https://cloud.appwrite.io/v1")
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID ?? "demo-project");

export const account = new Account(client);

export { client };
export default client;
