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
}

export async function uploadToCloudinary(file: File, folder = 'novanest'): Promise<UploadResult> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Please choose an image file.')
  }
  if (file.size > 10 * 1024 * 1024) {
    throw new Error('Image is larger than 10MB — please choose a smaller file.')
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
