import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { v2 as cloudinary } from 'cloudinary'
import { authOptions } from '@/lib/auth'
import { apiError, apiSuccess } from '@/lib/utils'

// Configured lazily inside the handler (not at module load) so a missing env var
// produces a clean error response instead of crashing the whole route module.
function configureCloudinary() {
  const cloud_name = process.env.CLOUDINARY_CLOUD_NAME
  const api_key    = process.env.CLOUDINARY_API_KEY
  const api_secret = process.env.CLOUDINARY_API_SECRET
  if (!cloud_name || !api_key || !api_secret) {
    throw new Error(
      'Image uploads aren\'t set up yet. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to .env.local.'
    )
  }
  cloudinary.config({ cloud_name, api_key, api_secret })
}

const MAX_BYTES = 10 * 1024 * 1024 // 10MB

// POST /api/upload — admin only. Receives a file, uploads it to Cloudinary
// server-side (using the API secret, which never reaches the browser), returns
// the resulting hosted URL. This is the only place the secret is used.
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return apiError('Unauthorized', 401)

  let cloudName: string
  try {
    configureCloudinary()
    cloudName = process.env.CLOUDINARY_CLOUD_NAME!
  } catch (err) {
    return apiError(err instanceof Error ? err.message : 'Upload not configured', 500)
  }
  void cloudName

  const form = await req.formData().catch(() => null)
  const file = form?.get('file')
  if (!file || !(file instanceof File)) return apiError('No file provided')

  if (!file.type.startsWith('image/')) return apiError('Please choose an image file.')
  if (file.size > MAX_BYTES) return apiError('Image is larger than 10MB — please choose a smaller file.')

  const folder = (form?.get('folder') as string) || 'novanest'
  const bytes  = Buffer.from(await file.arrayBuffer())

  try {
    const result = await new Promise<any>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream({ folder }, (err, res) => {
        if (err || !res) reject(err ?? new Error('Upload failed'))
        else resolve(res)
      })
      stream.end(bytes)
    })
    return apiSuccess({ url: result.secure_url as string, width: result.width, height: result.height })
  } catch (err) {
    return apiError(err instanceof Error ? err.message : 'Upload failed — please try again.', 500)
  }
}
