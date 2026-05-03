import mongoose from 'mongoose';

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  var mongooseCache: MongooseCache | undefined;
}

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_URI_FALLBACK = process.env.MONGODB_URI_FALLBACK;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

// Ensure `cached` is always a defined MongooseCache instance
let cached: MongooseCache = global.mongooseCache ?? { conn: null, promise: null };
// keep the global in sync
global.mongooseCache = cached;

const CONNECTION_OPTIONS = {
  bufferCommands: false,
  connectTimeoutMS: 10000,
  serverSelectionTimeoutMS: 10000,
};

function isSrvLookupError(error: unknown) {
  const err = error as { code?: string; syscall?: string; message?: string };
  return (
    (err?.code === 'ECONNREFUSED' && err?.syscall === 'querySrv') ||
    err?.message?.includes('querySrv')
  );
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function connectWithRetry(uri: string, maxAttempts = 3) {
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      return await mongoose.connect(uri, CONNECTION_OPTIONS);
    } catch (error) {
      lastError = error;

      if (!isSrvLookupError(error) || attempt === maxAttempts) {
        break;
      }

      // Retry transient DNS SRV lookup failures with a short backoff.
      await wait(300 * attempt);
    }
  }

  throw lastError;
}

async function connectToDatabase() {
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = (async () => {
      try {
        return await connectWithRetry(MONGODB_URI!);
      } catch (primaryError) {
        if (!MONGODB_URI_FALLBACK) {
          throw primaryError;
        }

        console.warn('Primary MongoDB URI failed. Trying fallback URI.');
        return connectWithRetry(MONGODB_URI_FALLBACK!, 1);
      }
    })();
  }
  
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectToDatabase;
