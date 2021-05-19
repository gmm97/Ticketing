import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { app } from "../app";
import jwt from "jsonwebtoken";

declare global {
  namespace NodeJS {
    interface Global {
      signin(id?: string): string[];
    }
  }
}

jest.mock("../nats-wrapper");

let mongo: any;

process.env.STRIPE_KEY =
  "sk_test_51Is3FDBjqzVqloB5CW64LcndDVSgeWoBMsJ5f5s4vyDzTpou5U9O5X6dzk2OSRFeEjhNoMwDXrfBvrba7W8pTW3j00E5M8su8h";

beforeAll(async () => {
  process.env.JWT_KEY = "dhncxdcbn";
  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.signin = (id?: string) => {
  // Build a JWT payload of the form {id, email}
  const payload = {
    id: id || new mongoose.Types.ObjectId().toHexString(),
    email: "test@test.com",
  };
  // Create the JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!);
  // Build session object { jwt: MY_JWT }
  const session = { jwt: token };
  // Turn that session into JSON
  const sessionJSON = JSON.stringify(session);
  // Encode that JSON into base64
  const base64 = Buffer.from(sessionJSON).toString("base64");
  // Return string with the encoded data
  return [`express:sess=${base64}`];
};
