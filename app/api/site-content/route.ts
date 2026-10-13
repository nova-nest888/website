import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { revalidatePath } from 'next/cache'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/mongoose'
import { SiteContentModel } from '@/lib/models/SiteContent'
import { getSiteContent, getCustomizedSections } from '@/lib/getSiteContent'
import { apiError, apiSuccess } from '@/lib/utils'

const SECTIONS = ['home', 'about', 'offerings'] as const

// GET /api/site-content — admin only. Current copy (saved merged over defaults).
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return apiError('Unauthorized', 401)
  const [content, customized] = await Promise.all([getSiteContent(), getCustomizedSections()])
  return apiSuccess({ content, customized })
}

// PUT /api/site-content — admin only. { section, data } saves a section; data: null resets it to the default.
export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return apiError('Unauthorized', 401)

  const body = await req.json().catch(() => null)
  const section = body?.section as (typeof SECTIONS)[number] | undefined
  if (!section || !SECTIONS.includes(section)) return apiError('Unknown section')

  await connectDB()
  if (body.data === null) {
    await SiteContentModel.findOneAndUpdate({ singleton: 'main' }, { $unset: { [`data.${section}`]: '' } }, { upsert: true })
  } else {
    if (typeof body.data !== 'object' || Array.isArray(body.data)) return apiError('Invalid data')
    if (JSON.stringify(body.data).length > 300_000) return apiError('Content is too large')
    await SiteContentModel.findOneAndUpdate({ singleton: 'main' }, { $set: { [`data.${section}`]: body.data } }, { upsert: true })
  }

  // Make the change show up on the live site right away
  revalidatePath(section === 'home' ? '/' : `/${section}`)
  if (section === 'offerings') revalidatePath('/book')
  return apiSuccess({ saved: true })
}
