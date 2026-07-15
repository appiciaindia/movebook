import dns from "node:dns";
import mongoose from "mongoose";
import { URL, URLSearchParams } from "url";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

const resolver = new dns.promises.Resolver();
resolver.setServers(["8.8.8.8", "1.1.1.1"]);

const resolveSrvRecords = async (host) => {
  try {
    return await resolver.resolveSrv(`_mongodb._tcp.${host}`);
  } catch (error) {
    console.warn("⚠️ SRV lookup failed:", error.message || error);
    throw error;
  }
};

const resolveHostNames = async (host) => {
  try {
    await dns.promises.resolve4(host);
    return `${host}:27017`;
  } catch (error) {
    console.warn("⚠️ A record lookup failed:", error.message || error);
    return `${host}:27017`;
  }
};

const buildMongoUriFromSrv = async (uri) => {
  const parsed = new URL(uri);
  const host = parsed.hostname;
  const auth = parsed.username
    ? `${encodeURIComponent(parsed.username)}:${encodeURIComponent(parsed.password)}@`
    : "";
  const dbName = parsed.pathname ? parsed.pathname.slice(1) : "";
  const params = new URLSearchParams(parsed.search);

  params.set("tls", "true");
  if (!params.has("authSource")) {
    params.set("authSource", "admin");
  }

  let hosts;
  try {
    const srvRecords = await resolveSrvRecords(host);
    hosts = srvRecords.map(({ name, port }) => `${name}:${port || 27017}`).join(",");
  } catch {
    hosts = await resolveHostNames(host);
  }

  const query = params.toString();
  const path = dbName ? `/${dbName}` : "";
  return `mongodb://${auth}${hosts}${path}${query ? `?${query}` : ""}`;
};

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  let uri = MONGODB_URI;
  if (uri.startsWith("mongodb+srv://")) {
    uri = await buildMongoUriFromSrv(uri);
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: true,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      minPoolSize: 2,
      maxIdleTimeMS: 60000,
    };

    cached.promise = mongoose.connect(uri, opts).then((mongoose) => {
      console.log("✓ MongoDB connected successfully");
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error("✗ MongoDB connection failed:", e.message);
    throw e;
  }

  return cached.conn;
}

export default connectDB;
