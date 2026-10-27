import type { Metadata } from 'next'
import BookClient from './client'
import { connectDB } from '@/lib/mongoose'
import { Service }   from '@/lib/models/Service'
import { serialize } from '@/lib/utils'
import type { ServiceDoc } from '@/types'
import { getPageMaintenance } from '@/lib/maintenance'
import MaintenanceNotice from '@/components/ui/MaintenanceNotice'

export const metadata: Metadata = { title: 'Book an Experience' }
export const revalidate = 60

async function getServices(): Promise<ServiceDoc[]> {
  try {
    await connectDB()
    return serialize(await Service.find({ isActive: true }).sort({ createdAt: 1 }).lean()) as unknown as ServiceDoc[]
  } catch { return [] }
}

export default async function BookPage() {
  const maint = await getPageMaintenance('book')
  if (maint.enabled) return <MaintenanceNotice title="Book" message={maint.message} />
  const services = await getServices()
  return <BookClient services={services} />
}
