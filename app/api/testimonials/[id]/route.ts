import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions }       from '@/lib/auth'
import { connectDB }         from '@/lib/mongoose'
import { Testimonial }       from '@/lib/models/Testimonial'
import { testimonialSchema } from '@/lib/validations'
import { apiError, apiSuccess, serialize } from '@/lib/utils'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session) return apiError('Unauthorized', 401)

  const { id } = await params
  const body   = await req.json().catch(() => null)
  if (!body)   return apiError('Invalid JSON')
  const parsed = testimonialSchema.partial().safeParse(body)
  if (!parsed.success) return apiError(parsed.error.issues[0]?.message ?? 'Invalid input')

  await connectDB()
  const item = await Testimonial.findByIdAndUpdate(id, parsed.data, { new: true }).lean()
  if (!item) return apiError('Not found', 404)
  return apiSuccess(serialize(item))
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session) return apiError('Unauthorized', 401)

  const { id } = await params
  await connectDB()
  await Testimonial.findByIdAndDelete(id)
  return apiSuccess({ deleted: true })
}
