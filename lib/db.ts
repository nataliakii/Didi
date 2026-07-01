import mongoose from "mongoose";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache ?? {
  conn: null,
  promise: null,
};

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

export function isDbConfigured(): boolean {
  return Boolean(process.env.MONGODB_URI);
}

export async function connectDB(): Promise<typeof mongoose> {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error(
      "MONGODB_URI is not defined. Add it to your .env file to connect to MongoDB.",
    );
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const dbName = process.env.MONGODB_DB || "di-di-jewellery";

    cached.promise = mongoose.connect(uri, {
      dbName,
      bufferCommands: false,
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}

export async function safeConnectDB(): Promise<typeof mongoose | null> {
  if (!isDbConfigured()) {
    return null;
  }

  try {
    return await connectDB();
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    return null;
  }
}
