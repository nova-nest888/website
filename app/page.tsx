import type { TestimonialDoc } from '@/types'
import type { Metadata } from 'next'
import HomeClient from './_home'
import { connectDB }   from '@/lib/mongoose'
import { Testimonial } from '@/lib/models/Testimonial'
import { serialize }   from '@/lib/utils'
import { getSiteImages } from '@/lib/getSiteImages'
<<<<<<< HEAD
import { getSiteContent } from '@/lib/getSiteContent'
=======
>>>>>>> 0535e7cc738eba828f46f7a78b8fc6434e5c1a86

export const metadata: Metadata = { title: 'NovaNest — A New Way of Living' }
export const revalidate = 300 // ISR: pick up new hero image / testimonials within 5 min

async function getTestimonials() {
  try {
    await connectDB()
    return serialize(await Testimonial.find({ isActive: true }).sort({ createdAt: -1 }).limit(3).lean()) as unknown as TestimonialDoc[]
  } catch { return [] }
}

export default async function HomePage() {
<<<<<<< HEAD
  const [testimonials, siteImages, content] = await Promise.all([getTestimonials(), getSiteImages(), getSiteContent()])
  return <HomeClient testimonials={testimonials} siteImages={siteImages} content={content.home} />
=======
  const [testimonials, siteImages] = await Promise.all([getTestimonials(), getSiteImages()])
  return <HomeClient testimonials={testimonials} siteImages={siteImages} />
>>>>>>> 0535e7cc738eba828f46f7a78b8fc6434e5c1a86
}
