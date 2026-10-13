/**
<<<<<<< HEAD
 * Client-side upload helper.
 *
 * Why it works this way:
 *  1. Phone/camera photos are often 6–15MB. We shrink images in the browser first
 *     (max 2400px, JPEG ~85%) — they end up ~300KB–1.5MB and still look sharp.
 *  2. The file then goes DIRECTLY to Cloudinary using a signature from our admin-only
 *     /api/upload/sign route. It never passes through our server, so Vercel's ~4.5MB
 *     request-body limit can't block it. The API secret never reaches the browser.
=======
 * Client-side upload helper. The actual Cloudinary call happens server-side
 * (see app/api/upload/route.ts) — the browser just sends the file to our own
 * admin-gated API route, which signs and forwards it using the Cloudinary API
 * secret. The secret never reaches the browser.
>>>>>>> 0535e7cc738eba828f46f7a78b8fc6434e5c1a86
 */

export interface UploadResult {
  url: string
  width: number
  height: number
  resourceType: 'image' | 'video'
}

<<<<<<< HEAD
const MAX_IMAGE_INPUT_BYTES = 60 * 1024 * 1024   // original file we'll accept (gets shrunk)
const MAX_VIDEO_BYTES       = 100 * 1024 * 1024  // 100MB (Cloudinary free-plan video limit)
const MAX_DIMENSION         = 2400
const TARGET_MAX_BYTES      = 9 * 1024 * 1024    // stay under Cloudinary's 10MB image limit

async function shrinkImage(file: File): Promise<File | Blob> {
  // Leave animated/vector formats alone, and small files that are already fine.
  if (file.type === 'image/gif' || file.type === 'image/svg+xml') return file
  try {
    const bitmap = await createImageBitmap(file)
    const scale  = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height))
    if (scale === 1 && file.size <= 1.5 * 1024 * 1024) { bitmap.close?.(); return file }

    const w = Math.round(bitmap.width * scale)
    const h = Math.round(bitmap.height * scale)
    const canvas = document.createElement('canvas')
    canvas.width = w; canvas.height = h
    const ctx = canvas.getContext('2d')
    if (!ctx) { bitmap.close?.(); return file }
    ctx.drawImage(bitmap, 0, 0, w, h)
    bitmap.close?.()

    for (const quality of [0.85, 0.75, 0.65]) {
      const blob: Blob | null = await new Promise(r => canvas.toBlob(r, 'image/jpeg', quality))
      if (blob && blob.size <= TARGET_MAX_BYTES) return blob
    }
    return file
  } catch {
    // Browser couldn't decode it (e.g. HEIC on Chrome) — send the original.
    return file
  }
}
=======
const MAX_IMAGE_BYTES = 10 * 1024 * 1024   // 10MB
const MAX_VIDEO_BYTES = 100 * 1024 * 1024  // 100MB
>>>>>>> 0535e7cc738eba828f46f7a78b8fc6434e5c1a86

export async function uploadToCloudinary(file: File, folder = 'novanest'): Promise<UploadResult> {
  const isVideo = file.type.startsWith('video/')
  const isImage = file.type.startsWith('image/')
<<<<<<< HEAD
  if (!isVideo && !isImage) throw new Error('Please choose an image or video file.')
  if (isImage && file.size > MAX_IMAGE_INPUT_BYTES) throw new Error('That image is over 60MB — please choose a smaller file.')
  if (isVideo && file.size > MAX_VIDEO_BYTES) throw new Error('Video is larger than 100MB — please choose a smaller file or trim it.')

  const payload = isImage ? await shrinkImage(file) : file
  if (isImage && payload.size > 10 * 1024 * 1024) {
    throw new Error('Image is still over 10MB after compressing — please export it as JPEG and try again.')
  }

  // 1. Get a signature from our server (admin-only)
  const signRes  = await fetch('/api/upload/sign', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ folder }),
  })
  const signJson = await signRes.json().catch(() => null)
  if (!signRes.ok) {
    throw new Error(signRes.status === 401 ? 'Your admin session expired — please log in again.' : (signJson?.error ?? 'Could not start upload.'))
  }
  const { signature, timestamp, apiKey, cloudName, folder: signedFolder } = signJson.data

  // 2. Upload straight to Cloudinary
  const form = new FormData()
  form.append('file', payload, file.name)
  form.append('api_key', apiKey)
  form.append('timestamp', String(timestamp))
  form.append('signature', signature)
  form.append('folder', signedFolder)

  const resourceType = isVideo ? 'video' : 'image'
  const res  = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`, { method: 'POST', body: form })
  const json = await res.json().catch(() => null)
  if (!res.ok || !json?.secure_url) {
    throw new Error(json?.error?.message ?? 'Upload failed — please try again.')
  }

  return { url: json.secure_url as string, width: json.width, height: json.height, resourceType }
=======
  if (!isVideo && !isImage) {
    throw new Error('Please choose an image or video file.')
  }
  if (isImage && file.size > MAX_IMAGE_BYTES) {
    throw new Error('Image is larger than 10MB — please choose a smaller file.')
  }
  if (isVideo && file.size > MAX_VIDEO_BYTES) {
    throw new Error('Video is larger than 100MB — please choose a smaller file.')
  }

  const form = new FormData()
  form.append('file', file)
  form.append('folder', folder)

  const res = await fetch('/api/upload', { method: 'POST', body: form })
  const json = await res.json().catch(() => null)

  if (!res.ok) {
    throw new Error(json?.error ?? 'Upload failed — please try again.')
  }

  return json.data as UploadResult
>>>>>>> 0535e7cc738eba828f46f7a78b8fc6434e5c1a86
}

/** True if a URL looks like it points to a video file (by extension). */
export function isVideoUrl(url: string | null | undefined): boolean {
  if (!url) return false
  return /\.(mp4|webm|mov|m4v|ogv)(\?|#|$)/i.test(url) || url.includes('/video/upload/')
}
