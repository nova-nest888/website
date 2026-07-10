import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/mongoose'
import { Post }      from '@/lib/models/Post'
import { postSchema } from '@/lib/validations'
import { apiError, apiSuccess, serialize } from '@/lib/utils'

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await connectDB()
  const post = await Post.findById(id).lean()
  if (!post) return apiError('Not found', 404)
  return apiSuccess(serialize(post))
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session) return apiError('Unauthorized', 401)

  const { id } = await params
  const body   = await req.json().catch(() => null)
  if (!body)   return apiError('Invalid JSON')
  const parsed = postSchema.partial().safeParse(body)
  if (!parsed.success) return apiError(parsed.error.issues[0]?.message ?? 'Invalid input')

  await connectDB()
  const update: Record<string, unknown> = { ...parsed.data }
  if ('published' in parsed.data) {
    update.publishedAt = parsed.data.published ? new Date() : null
  }

  const post = await Post.findByIdAndUpdate(id, update, { new: true }).lean()
  if (!post) return apiError('Not found', 404)
  return apiSuccess(serialize(post))
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session) return apiError('Unauthorized', 401)

  const { id } = await params
  await connectDB()
  await Post.findByIdAndDelete(id)
  return apiSuccess({ deleted: true })
}
