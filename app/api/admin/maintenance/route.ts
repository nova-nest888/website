import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { revalidatePath } from 'next/cache'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/mongoose'
import { SiteSettings } from '@/lib/models/SiteSettings'
import { getMaintenanceMap, MAINTENANCE_PAGES } from '@/lib/maintenance'
import { apiError, apiSuccess } from '@/lib/utils'

// GET /api/admin/maintenance — admin only. { pageKey: { enabled, message } }
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return apiError('Unauthorized', 401)
  return apiSuccess({ maintenance: await getMaintenanceMap() })
}

// PUT /api/admin/maintenance — admin only. Body: { page, enabled, message? }
export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return apiError('Unauthorized', 401)

  const body = await req.json().catch(() => null)
  const page = MAINTENANCE_PAGES.find(p => p.key === body?.page)
  if (!page) return apiError('Unknown page')
  const enabled = !!body.enabled
  const message = typeof body.message === 'string' ? body.message.slice(0, 500) : ''

  await connectDB()
  await SiteSettings.findOneAndUpdate(
    { singleton: 'main' },
    { $set: { [`maintenance.${page.key}`]: { enabled, message } } },
    { upsert: true },
  )

  // Take effect on the live site immediately
  revalidatePath(page.path)
  if (page.key === 'journal') revalidatePath('/journal/[slug]', 'page')
  return apiSuccess({ saved: true })
}
