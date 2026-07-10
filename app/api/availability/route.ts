import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions }  from '@/lib/auth'
import { connectDB }    from '@/lib/mongoose'
import { Availability } from '@/lib/models/Availability'
import { apiError, apiSuccess, serialize } from '@/lib/utils'

export async function GET() {
  await connectDB()
  const slots = await Availability.find().sort({ dayOfWeek: 1 }).lean()
  return apiSuccess(serialize(slots))
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return apiError('Unauthorized', 401)

  const body = await req.json().catch(() => null)
  if (!Array.isArray(body)) return apiError('Expected array of slots')

  await connectDB()
  // Upsert each day — one document per dayOfWeek
  const ops = body.map((slot: { dayOfWeek: number; startTime: string; endTime: string; isActive: boolean }) =>
    Availability.findOneAndUpdate(
      { dayOfWeek: slot.dayOfWeek },
      { startTime: slot.startTime, endTime: slot.endTime, isActive: slot.isActive },
      { upsert: true, new: true }
    )
  )
  const results = await Promise.all(ops)
  return apiSuccess(serialize(results))
}
