import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/mongoose'
import { Booking }   from '@/lib/models/Booking'
import { apiError, apiSuccess, serialize } from '@/lib/utils'
import { z } from 'zod'

const patchSchema = z.object({
  status: z.enum(['confirmed', 'cancelled', 'pending']).optional(),
  notes:  z.string().max(500).optional(),
})

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session) return apiError('Unauthorized', 401)

  const { id }  = await params
  const body    = await req.json().catch(() => null)
  if (!body)    return apiError('Invalid JSON')
  const parsed  = patchSchema.safeParse(body)
  if (!parsed.success) return apiError(parsed.error.issues[0]?.message ?? 'Invalid')

  await connectDB()
  const booking = await Booking.findByIdAndUpdate(id, parsed.data, { new: true }).lean()
  if (!booking) return apiError('Booking not found', 404)
  return apiSuccess(serialize(booking))
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session) return apiError('Unauthorized', 401)

  const { id } = await params
  await connectDB()
  await Booking.findByIdAndDelete(id)
  return apiSuccess({ deleted: true })
}
