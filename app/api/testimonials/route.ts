import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions }       from '@/lib/auth'
import { connectDB }         from '@/lib/mongoose'
import { Testimonial }       from '@/lib/models/Testimonial'
import { testimonialSchema } from '@/lib/validations'
import { apiError, apiSuccess, serialize } from '@/lib/utils'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  await connectDB()
  const filter = session ? {} : { isActive: true }
  const items  = await Testimonial.find(filter).sort({ createdAt: -1 }).lean()
  return apiSuccess(serialize(items))
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return apiError('Unauthorized', 401)

  const body   = await req.json().catch(() => null)
  if (!body)   return apiError('Invalid JSON')
  const parsed = testimonialSchema.safeParse(body)
  if (!parsed.success) return apiError(parsed.error.issues[0]?.message ?? 'Invalid input')

  await connectDB()
  const item = await Testimonial.create(parsed.data)
  return apiSuccess(serialize(item), 201)
}
