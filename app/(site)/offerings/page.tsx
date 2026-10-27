import type { Metadata } from 'next'
import OfferingsClient from './client'
import { getSiteImages } from '@/lib/getSiteImages'
import { getSiteContent } from '@/lib/getSiteContent'
import { connectDB } from '@/lib/mongoose'
import { Service } from '@/lib/models/Service'
import { getPageMaintenance } from '@/lib/maintenance'
import MaintenanceNotice from '@/components/ui/MaintenanceNotice'

export const metadata: Metadata = { title: 'Experiences' }
export const revalidate = 60 // admin edits also trigger an immediate refresh

// slug -> price (> 0 only). Prices are managed once, in Admin → Services.
async function getServicePrices(): Promise<Record<string, number>> {
  try {
    await connectDB()
    const services = await Service.find({ isActive: true }).select('slug price').lean()
    return Object.fromEntries(services.filter(s => s.price > 0).map(s => [s.slug, s.price]))
  } catch { return {} }
}

export default async function OfferingsPage() {
  const maint = await getPageMaintenance('offerings')
  if (maint.enabled) return <MaintenanceNotice title="Experiences" message={maint.message} />
  const [siteImages, content, prices] = await Promise.all([getSiteImages(), getSiteContent(), getServicePrices()])
  return <OfferingsClient siteImages={siteImages} content={content.offerings} servicePrices={prices} />
}
