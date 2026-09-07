import env from "@/app/env";

import { Client , Account , Avatars , Databases , Storage, Users  } from "node-appwrite";
let client = new Client();

client
.setEndpoint(env.appwrite.endpoint)
.setProject(env.appwrite.projectId)
.setDevKey(env.appwrite.apikey);


const databases = new Databases(client);

const avatars = new Avatars(client);

const storage = new Storage(client);

const users = new Users(client);

export {client , databases , users , avatars , storage };
