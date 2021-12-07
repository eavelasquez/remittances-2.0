"use strict";

import mongoose from "mongoose";

// Get the MongoDB uri from environment variables
const { MONGODB_URI } = process.env;

if (!MONGODB_URI) {
  throw new Error(
    "Please set the MONGODB_URI environment variable inside .env.local"
  );
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { connection: null, promise: null };
}

async function connect() {
  if (cached.connection) return cached.connection;

  if (!cached.promise) {
    const options = {
      bufferCommands: false,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    cached.promise = mongoose
      .connect(MONGODB_URI, options)
      .then((mongoose) => mongoose);
  }

  cached.connection = await cached.promise;
  return cached.connection;
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default connect;
