import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/mongoose'
import { Post }      from '@/lib/models/Post'
import { postSchema } from '@/lib/validations'
import { apiError, apiSuccess, serialize } from '@/lib/utils'

// GET /api/posts — public returns published; admin gets all
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  await connectDB()

  const filter = session ? {} : { published: true }
  const posts  = await Post.find(filter).sort({ createdAt: -1 }).lean()
  return apiSuccess(serialize(posts))
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return apiError('Unauthorized', 401)

  const body   = await req.json().catch(() => null)
  if (!body)   return apiError('Invalid JSON')
  const parsed = postSchema.safeParse(body)
  if (!parsed.success) return apiError(parsed.error.issues[0]?.message ?? 'Invalid input')

  await connectDB()
  try {
    const postData = {
      title:       parsed.data.title,
      slug:        parsed.data.slug,
      excerpt:     parsed.data.excerpt,
      content:     parsed.data.content,
      category:    parsed.data.category,
      published:   parsed.data.published,
      coverImage:  parsed.data.coverImage ?? undefined,
      publishedAt: parsed.data.published ? new Date() : undefined,
    }
    const post = await Post.create(postData)
    return apiSuccess(serialize(post), 201)
  } catch (e: any) {
    if (e.code === 11000) return apiError('A post with this slug already exists', 409)
    throw e
  }
}
