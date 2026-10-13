import { connectDB } from './mongoose'
import { SiteSettings } from './models/SiteSettings'

/** Server-only. Fetches the persisted { key: imageUrl } map. Safe to call from any page.tsx. */
export async function getSiteImages(): Promise<Record<string, string>> {
  try {
    await connectDB()
    const doc = await SiteSettings.findOne({ singleton: 'main' }).lean()
    return (doc?.images as Record<string, string>) ?? {}
  } catch {
    return {}
  }
}
