import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions }  from '@/lib/auth'
import { connectDB }    from '@/lib/mongoose'
import { Service }      from '@/lib/models/Service'
import { serviceSchema } from '@/lib/validations'
import { apiError, apiSuccess, serialize } from '@/lib/utils'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session) return apiError('Unauthorized', 401)

  const { id } = await params
  const body   = await req.json().catch(() => null)
  if (!body)   return apiError('Invalid JSON')
  const parsed = serviceSchema.partial().safeParse(body)
  if (!parsed.success) return apiError(parsed.error.issues[0]?.message ?? 'Invalid input')

  await connectDB()
  const service = await Service.findByIdAndUpdate(id, parsed.data, { new: true }).lean()
  if (!service) return apiError('Not found', 404)
  return apiSuccess(serialize(service))
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session) return apiError('Unauthorized', 401)

  const { id } = await params
  await connectDB()
  await Service.findByIdAndDelete(id)
  return apiSuccess({ deleted: true })
}
