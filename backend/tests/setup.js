import { MongoMemoryServer } from "mongodb-memory-server";
import { connectDB, disconnectDB } from "../src/config/db.js";

let mongo;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();
  await connectDB(uri);
});

afterAll(async () => {
  await disconnectDB();
  await mongo.stop();
});
