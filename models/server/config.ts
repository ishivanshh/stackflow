import env from "@/app/env";

import {
    Client,
    Avatars,
    Databases,
    TablesDB,
    Storage,
    Users
} from "node-appwrite";

const client = new Client();

client
    .setEndpoint(env.appwrite.endpoint)
    .setProject(env.appwrite.projectId)
    .setKey(env.appwrite.apikey);

const databases = new Databases(client);
const tablesDB = new TablesDB(client);

const avatars = new Avatars(client);
const storage = new Storage(client);
const users = new Users(client);

export {
    client,
    databases,
    tablesDB,
    users,
    avatars,
    storage
};