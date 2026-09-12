/**
 * Client-side upload helper. The actual Cloudinary call happens server-side
 * (see app/api/upload/route.ts) — the browser just sends the file to our own
 * admin-gated API route, which signs and forwards it using the Cloudinary API
 * secret. The secret never reaches the browser.
 */

export interface UploadResult {
  url: string
  width: number
  height: number
  resourceType: 'image' | 'video'
}

const MAX_IMAGE_BYTES = 10 * 1024 * 1024   // 10MB
const MAX_VIDEO_BYTES = 100 * 1024 * 1024  // 100MB

export async function uploadToCloudinary(file: File, folder = 'novanest'): Promise<UploadResult> {
  const isVideo = file.type.startsWith('video/')
  const isImage = file.type.startsWith('image/')
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
}

/** True if a URL looks like it points to a video file (by extension). */
export function isVideoUrl(url: string | null | undefined): boolean {
  if (!url) return false
  return /\.(mp4|webm|mov|m4v|ogv)(\?|#|$)/i.test(url) || url.includes('/video/upload/')
}
