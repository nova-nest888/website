import type { Metadata } from 'next'
import ContactClient from './client'
import { getSiteContent } from '@/lib/getSiteContent'
import { getPageMaintenance } from '@/lib/maintenance'
import MaintenanceNotice from '@/components/ui/MaintenanceNotice'
export const metadata: Metadata = { title: 'Contact' }
export const revalidate = 300 // ISR: pick up edits / new QR codes within 5 min
export default async function ContactPage() {
  const maint = await getPageMaintenance('contact')
  if (maint.enabled) return <MaintenanceNotice title="Contact" message={maint.message} />
  const content = await getSiteContent()
  return <ContactClient content={content.contact} />
}
