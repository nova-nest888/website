import type { Metadata } from 'next'
import ContactClient from './client'
import { getPageMaintenance } from '@/lib/maintenance'
import MaintenanceNotice from '@/components/ui/MaintenanceNotice'
export const metadata: Metadata = { title: 'Contact' }
export default async function ContactPage() {
  const maint = await getPageMaintenance('contact')
  if (maint.enabled) return <MaintenanceNotice title="Contact" message={maint.message} />
  return <ContactClient />
}
