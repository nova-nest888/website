import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions }    from '@/lib/auth'
import { connectDB }      from '@/lib/mongoose'
import { SiteSettings }   from '@/lib/models/SiteSettings'
import { siteImageSchema } from '@/lib/validations'
import { apiError, apiSuccess } from '@/lib/utils'

// GET /api/site-images — public, returns the full { key: url } map
export async function GET() {
  await connectDB()
  const doc = await SiteSettings.findOne({ singleton: 'main' }).lean()
  return apiSuccess((doc?.images as Record<string, string>) ?? {})
}

// PUT /api/site-images — admin only, upserts a single key -> url
export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return apiError('Unauthorized', 401)

  const body   = await req.json().catch(() => null)
  if (!body)   return apiError('Invalid JSON')
  const parsed = siteImageSchema.safeParse(body)
  if (!parsed.success) return apiError(parsed.error.issues[0]?.message ?? 'Invalid input')

  await connectDB()
  const doc = await SiteSettings.findOneAndUpdate(
    { singleton: 'main' },
    { $set: { [`images.${parsed.data.key}`]: parsed.data.url } },
    { upsert: true, new: true }
  ).lean()

  return apiSuccess((doc?.images as Record<string, string>) ?? {})
}
