import type { Metadata } from 'next'
import OfferingsClient from './client'
import { getSiteImages } from '@/lib/getSiteImages'
export const metadata: Metadata = { title: 'Experiences' }
export const revalidate = 300 // ISR: pick up new offering photos within 5 min
export default async function OfferingsPage() {
  const siteImages = await getSiteImages()
  return <OfferingsClient siteImages={siteImages} />
}
