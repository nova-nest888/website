import type { Metadata } from 'next'
import AboutClient from './client'
import { getSiteImages } from '@/lib/getSiteImages'
import { getSiteContent } from '@/lib/getSiteContent'
export const metadata: Metadata = { title: 'About' }
export const revalidate = 300 // ISR: pick up new portrait uploads within 5 min
export default async function AboutPage() {
  const [siteImages, content] = await Promise.all([getSiteImages(), getSiteContent()])
  return <AboutClient siteImages={siteImages} content={content.about} />
}
