// Rate limiting — works with Upstash Redis
// Falls back to no-op in development if env vars are missing

import { NextRequest, NextResponse } from 'next/server'

interface RateLimitResult {
  success: boolean
  remaining: number
}

async function rateLimit(
  req: NextRequest,
  prefix: string,
  limit: number,
  windowSeconds: number
): Promise<RateLimitResult> {
  // If no Upstash configured, skip rate limiting
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return { success: true, remaining: limit }
  }

  try {
    const { Ratelimit } = await import('@upstash/ratelimit')
    const { Redis }     = await import('@upstash/redis')

    const redis = new Redis({
      url:   process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })

    const ratelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(limit, `${windowSeconds}s`),
      prefix,
    })

    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      ?? req.headers.get('x-real-ip')
      ?? '127.0.0.1'

    const result = await ratelimit.limit(ip)
    return { success: result.success, remaining: result.remaining }
  } catch {
    // Never block a request because rate limiting failed
    return { success: true, remaining: limit }
  }
}

// Pre-configured limiters for each endpoint
export const contactRateLimit  = (req: NextRequest) => rateLimit(req, 'contact',  5,  3600)  // 5/hr
export const bookingRateLimit  = (req: NextRequest) => rateLimit(req, 'booking',  10, 3600)  // 10/hr
export const authRateLimit     = (req: NextRequest) => rateLimit(req, 'auth',     10, 900)   // 10/15min

export function rateLimitResponse() {
  return NextResponse.json(
    { error: 'Too many requests. Please try again later.' },
    { status: 429, headers: { 'Retry-After': '3600' } }
  )
}
