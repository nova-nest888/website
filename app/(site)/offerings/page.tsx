import type { Metadata } from 'next'
import OfferingsClient from './client'
import { getSiteImages } from '@/lib/getSiteImages'
<<<<<<< HEAD
import { getSiteContent } from '@/lib/getSiteContent'
import { connectDB } from '@/lib/mongoose'
import { Service } from '@/lib/models/Service'

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
  const [siteImages, content, prices] = await Promise.all([getSiteImages(), getSiteContent(), getServicePrices()])
  return <OfferingsClient siteImages={siteImages} content={content.offerings} servicePrices={prices} />
=======
export const metadata: Metadata = { title: 'Experiences' }
export const revalidate = 300 // ISR: pick up new offering photos within 5 min
export default async function OfferingsPage() {
  const siteImages = await getSiteImages()
  return <OfferingsClient siteImages={siteImages} />
>>>>>>> 0535e7cc738eba828f46f7a78b8fc6434e5c1a86
}
