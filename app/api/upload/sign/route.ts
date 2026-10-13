import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { v2 as cloudinary } from 'cloudinary'
import { authOptions } from '@/lib/auth'
import { apiError, apiSuccess } from '@/lib/utils'

// POST /api/upload/sign — admin only.
// Returns a short-lived signature so the browser can upload straight to
// Cloudinary. This avoids sending the file through our own server, which is
// what was failing: Vercel rejects request bodies over ~4.5MB, so large
// camera photos never even reached /api/upload. The API secret stays here.
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return apiError('Unauthorized', 401)

  const cloud_name = process.env.CLOUDINARY_CLOUD_NAME
  const api_key    = process.env.CLOUDINARY_API_KEY
  const api_secret = process.env.CLOUDINARY_API_SECRET
  if (!cloud_name || !api_key || !api_secret) {
    return apiError("Image uploads aren't set up yet. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to your environment variables.", 500)
  }

  const body   = await req.json().catch(() => ({}))
  const folder = typeof body?.folder === 'string' && /^[\w\-/]{1,60}$/.test(body.folder) ? body.folder : 'novanest'
  const timestamp = Math.round(Date.now() / 1000)
  const signature = cloudinary.utils.api_sign_request({ folder, timestamp }, api_secret)

  return apiSuccess({ signature, timestamp, folder, apiKey: api_key, cloudName: cloud_name })
}
