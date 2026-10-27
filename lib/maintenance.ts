import { connectDB } from './mongoose'
import { SiteSettings } from './models/SiteSettings'

/** Public pages that can be put into maintenance mode from Admin → Settings. */
export const MAINTENANCE_PAGES = [
  { key: 'home',      label: 'Home',        path: '/' },
  { key: 'offerings', label: 'Experiences', path: '/offerings' },
  { key: 'about',     label: 'About',       path: '/about' },
  { key: 'gallery',   label: 'Gallery',     path: '/gallery' },
  { key: 'journal',   label: 'Journal',     path: '/journal' },
  { key: 'contact',   label: 'Contact',     path: '/contact' },
  { key: 'book',      label: 'Book',        path: '/book' },
] as const

export type MaintenanceKey = (typeof MAINTENANCE_PAGES)[number]['key']
export type MaintenanceState = { enabled: boolean; message: string }
export type MaintenanceMap = Record<MaintenanceKey, MaintenanceState>

const blank = (): MaintenanceMap =>
  Object.fromEntries(MAINTENANCE_PAGES.map(p => [p.key, { enabled: false, message: '' }])) as MaintenanceMap

/** Server-only. Never throws — if the DB is unreachable every page is simply "live". */
export async function getMaintenanceMap(): Promise<MaintenanceMap> {
  const out = blank()
  try {
    await connectDB()
    const doc = await SiteSettings.findOne({ singleton: 'main' }).lean()
    const saved = (doc?.maintenance ?? {}) as Record<string, { enabled?: boolean; message?: string }>
    for (const p of MAINTENANCE_PAGES) {
      out[p.key] = { enabled: !!saved[p.key]?.enabled, message: saved[p.key]?.message ?? '' }
    }
  } catch { /* ignore */ }
  return out
}

export async function getPageMaintenance(key: MaintenanceKey): Promise<MaintenanceState> {
  return (await getMaintenanceMap())[key]
}
