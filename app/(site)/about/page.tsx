import type { Metadata } from 'next'
import AboutClient from './client'
import { getSiteImages } from '@/lib/getSiteImages'
export const metadata: Metadata = { title: 'About' }
export const revalidate = 300 // ISR: pick up new portrait uploads within 5 min
export default async function AboutPage() {
  const siteImages = await getSiteImages()
  return <AboutClient siteImages={siteImages} />
}
