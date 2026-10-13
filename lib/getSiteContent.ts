import { connectDB } from './mongoose'
import { SiteContentModel } from './models/SiteContent'
import { DEFAULT_CONTENT, deepMerge, type SiteContent } from './siteContent.defaults'

/** Server-only. Saved admin copy merged over the built-in defaults. Never throws. */
export async function getSiteContent(): Promise<SiteContent> {
  try {
    await connectDB()
    const doc = await SiteContentModel.findOne({ singleton: 'main' }).lean()
    return deepMerge(DEFAULT_CONTENT, doc?.data ?? {})
  } catch {
    return DEFAULT_CONTENT
  }
}

/** Server-only. Which sections have been customised by an admin. */
export async function getCustomizedSections(): Promise<string[]> {
  try {
    await connectDB()
    const doc = await SiteContentModel.findOne({ singleton: 'main' }).lean()
    return Object.keys(doc?.data ?? {})
  } catch {
    return []
  }
}
