import { NextRequest }  from 'next/server'
import { contactSchema } from '@/lib/validations'
import { sendContactNotification, sendContactAutoReply } from '@/lib/email'
import { contactRateLimit, rateLimitResponse } from '@/lib/ratelimit'
import { apiError, apiSuccess } from '@/lib/utils'

export async function POST(req: NextRequest) {
  // Rate limit
  const rl = await contactRateLimit(req)
  if (!rl.success) return rateLimitResponse()

  // Parse + validate
  const body = await req.json().catch(() => null)
  if (!body) return apiError('Invalid JSON')

  const parsed = contactSchema.safeParse(body)
  if (!parsed.success) return apiError(parsed.error.issues[0]?.message ?? 'Invalid input')

  const data = parsed.data
  try {
    await Promise.all([
      sendContactNotification(data),
      sendContactAutoReply({ name: data.name, email: data.email }),
    ])
    return apiSuccess({ message: 'Message sent' })
  } catch (err) {
    console.error('Email error:', err)
    // Still return success to user — don't expose email config errors
    return apiSuccess({ message: 'Message received' })
  }
}
