import { NextRequest }   from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions }   from '@/lib/auth'
import { connectDB }     from '@/lib/mongoose'
import { Booking }       from '@/lib/models/Booking'
import { bookingSchema } from '@/lib/validations'
import { verifyCalWebhook, apiError, apiSuccess, serialize } from '@/lib/utils'
import { bookingRateLimit, rateLimitResponse } from '@/lib/ratelimit'

// GET /api/bookings — admin only, returns all bookings
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return apiError('Unauthorized', 401)

  await connectDB()
  const bookings = await Booking.find().sort({ date: -1 }).lean()
  return apiSuccess(serialize(bookings))
}

// POST /api/bookings — public, created by Cal.com webhook OR direct booking
export async function POST(req: NextRequest) {
  // Check if this is a Cal.com webhook
  const calSig = req.headers.get('x-cal-signature-256')

  if (calSig) {
    // Cal.com webhook path — verify signature
    const rawBody = await req.text()
    const valid = await verifyCalWebhook(rawBody, calSig)
    if (!valid) return apiError('Invalid webhook signature', 401)

    const payload = JSON.parse(rawBody)
    // Cal.com webhook event
    if (payload.triggerEvent === 'BOOKING_CREATED') {
      await connectDB()
      const meta    = payload.payload
      const startAt = new Date(meta.startTime)
      const time    = startAt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })

      await Booking.create({
        serviceId:   '000000000000000000000000', // placeholder ObjectId
        serviceName: meta.title ?? 'Session',
        name:        meta.attendees?.[0]?.name  ?? 'Guest',
        email:       meta.attendees?.[0]?.email ?? '',
        date:        startAt,
        time,
        calEventId:  meta.uid,
        status:      'confirmed',
      })
    } else if (payload.triggerEvent === 'BOOKING_CANCELLED') {
      await connectDB()
      await Booking.findOneAndUpdate(
        { calEventId: payload.payload?.uid },
        { status: 'cancelled' }
      )
    }
    return apiSuccess({ received: true })
  }

  // Direct booking path — rate limit
  const rl = await bookingRateLimit(req)
  if (!rl.success) return rateLimitResponse()

  const body   = await req.json().catch(() => null)
  if (!body)   return apiError('Invalid JSON')
  const parsed = bookingSchema.safeParse(body)
  if (!parsed.success) return apiError(parsed.error.issues[0]?.message ?? 'Invalid input')

  await connectDB()
  const booking = await Booking.create({
    ...parsed.data,
    date: new Date(parsed.data.date),
  })
  return apiSuccess(serialize(booking), 201)
}
