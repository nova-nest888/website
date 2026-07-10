import type { TestimonialDoc } from '@/types'
import type { Metadata } from 'next'
import HomeClient from './_home'
import { connectDB }   from '@/lib/mongoose'
import { Testimonial } from '@/lib/models/Testimonial'
import { serialize }   from '@/lib/utils'
import { getSiteImages } from '@/lib/getSiteImages'

export const metadata: Metadata = { title: 'NovaNest — A New Way of Living' }
export const revalidate = 300 // ISR: pick up new hero image / testimonials within 5 min

async function getTestimonials() {
  try {
    await connectDB()
    return serialize(await Testimonial.find({ isActive: true }).sort({ createdAt: -1 }).limit(3).lean()) as unknown as TestimonialDoc[]
  } catch { return [] }
}

export default async function HomePage() {
  const [testimonials, siteImages] = await Promise.all([getTestimonials(), getSiteImages()])
  return <HomeClient testimonials={testimonials} siteImages={siteImages} />
}
