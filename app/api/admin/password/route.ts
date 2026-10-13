import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import bcrypt from 'bcryptjs'
import { authOptions }  from '@/lib/auth'
import { connectDB }    from '@/lib/mongoose'
import { User }          from '@/lib/models/User'
import { changePasswordSchema } from '@/lib/validations'
import { apiError, apiSuccess } from '@/lib/utils'

// POST /api/admin/password — change the signed-in admin's own password
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return apiError('Unauthorized', 401)

  const body   = await req.json().catch(() => null)
  if (!body)   return apiError('Invalid JSON')
  const parsed = changePasswordSchema.safeParse(body)
  if (!parsed.success) return apiError(parsed.error.issues[0]?.message ?? 'Invalid input')

  await connectDB()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userId = (session.user as any).id
  const user = await User.findById(userId).select('+password')
  if (!user) return apiError('User not found', 404)

  const valid = await bcrypt.compare(parsed.data.currentPassword, user.password)
  if (!valid) return apiError('Current password is incorrect', 401)

  user.password = await bcrypt.hash(parsed.data.newPassword, 12)
  await user.save()

  return apiSuccess({ ok: true })
}
