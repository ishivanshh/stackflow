import env from "@/app/env";

import {
    Client,
    Account,
    Avatars,
    TablesDB,
    Storage,
    Users
} from "node-appwrite";

const client = new Client();

client
    .setEndpoint(env.appwrite.endpoint)
    .setProject(env.appwrite.projectId)
    .setKey(env.appwrite.apikey);

const tablesDB = new TablesDB(client);

const avatars = new Avatars(client);
const storage = new Storage(client);
const users = new Users(client);

export {
    client,
    tablesDB,
    users,
    avatars,
    storage
};