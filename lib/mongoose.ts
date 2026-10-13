import mongoose from 'mongoose'

// Next.js auto-loads .env.local, but standalone scripts run via `tsx` (like `npm run seed`)
// never go through Next — so process.env.MONGODB_URI is empty unless we load it ourselves.
// This is a safe no-op inside Next.js: dotenv never overwrites vars that already exist.
if (!process.env.MONGODB_URI) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('dotenv').config({ path: '.env.local' })
  } catch {
    // dotenv not installed — fine inside Next.js, where env vars are already loaded
  }
}

function getMongoUri(): string {
  const uri = process.env.MONGODB_URI
  if (!uri) {
    throw new Error(
      'MONGODB_URI is not defined. Add it to .env.local (see .env.example), and make sure it sits next to package.json.'
    )
  }
  return uri
}

interface MongooseCache {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

// Preserve connection across hot reloads in development
declare global {
  // eslint-disable-next-line no-var
  var __mongoose: MongooseCache | undefined
}

const cached: MongooseCache = global.__mongoose ?? { conn: null, promise: null }
global.__mongoose = cached

export async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) return cached.conn

  if (!cached.promise) {
    cached.promise = mongoose.connect(getMongoUri(), {
      bufferCommands: false,
      maxPoolSize: 10,
    }).then(m => {
      console.log('✓ MongoDB connected')
      return m
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (err) {
    cached.promise = null
    throw err
  }

  return cached.conn
}
