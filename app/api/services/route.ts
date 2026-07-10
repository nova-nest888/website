import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions }  from '@/lib/auth'
import { connectDB }    from '@/lib/mongoose'
import { Service }      from '@/lib/models/Service'
import { serviceSchema } from '@/lib/validations'
import { apiError, apiSuccess, serialize } from '@/lib/utils'

// GET /api/services — public returns active; admin gets all
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  await connectDB()
  const filter  = session ? {} : { isActive: true }
  const services = await Service.find(filter).sort({ createdAt: 1 }).lean()
  return apiSuccess(serialize(services))
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return apiError('Unauthorized', 401)

  const body   = await req.json().catch(() => null)
  if (!body)   return apiError('Invalid JSON')
  const parsed = serviceSchema.safeParse(body)
  if (!parsed.success) return apiError(parsed.error.issues[0]?.message ?? 'Invalid input')

  await connectDB()
  try {
    const service = await Service.create(parsed.data)
    return apiSuccess(serialize(service), 201)
  } catch (e: any) {
    if (e.code === 11000) return apiError('A service with this slug already exists', 409)
    throw e
  }
}
