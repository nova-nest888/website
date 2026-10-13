import type { Metadata } from 'next'
import BookClient from './client'
import { connectDB } from '@/lib/mongoose'
import { Service }   from '@/lib/models/Service'
import { serialize } from '@/lib/utils'
import type { ServiceDoc } from '@/types'

export const metadata: Metadata = { title: 'Book an Experience' }
<<<<<<< HEAD
export const revalidate = 60
=======
export const revalidate = 3600
>>>>>>> 0535e7cc738eba828f46f7a78b8fc6434e5c1a86

async function getServices(): Promise<ServiceDoc[]> {
  try {
    await connectDB()
    return serialize(await Service.find({ isActive: true }).sort({ createdAt: 1 }).lean()) as unknown as ServiceDoc[]
  } catch { return [] }
}

export default async function BookPage() {
  const services = await getServices()
  return <BookClient services={services} />
}
