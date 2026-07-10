import { MetadataRoute } from 'next'
import { connectDB } from '@/lib/mongoose'
import { Post }      from '@/lib/models/Post'

const BASE_URL = process.env.NEXTAUTH_URL ?? 'https://novanest.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL,                   lastModified: new Date(), changeFrequency:'monthly',  priority: 1 },
    { url: `${BASE_URL}/offerings`,    lastModified: new Date(), changeFrequency:'monthly',  priority: 0.9 },
    { url: `${BASE_URL}/about`,        lastModified: new Date(), changeFrequency:'monthly',  priority: 0.8 },
    { url: `${BASE_URL}/journal`,      lastModified: new Date(), changeFrequency:'weekly',   priority: 0.8 },
    { url: `${BASE_URL}/book`,         lastModified: new Date(), changeFrequency:'monthly',  priority: 0.9 },
    { url: `${BASE_URL}/contact`,      lastModified: new Date(), changeFrequency:'yearly',   priority: 0.6 },
  ]

  let postRoutes: MetadataRoute.Sitemap = []
  try {
    await connectDB()
    const posts = await Post.find({ published: true }).select('slug updatedAt').lean()
    postRoutes = posts.map(p => ({
      url:            `${BASE_URL}/journal/${p.slug}`,
      lastModified:   p.updatedAt,
      changeFrequency:'monthly' as const,
      priority:        0.7,
    }))
  } catch { /* silently skip if DB unavailable during build */ }

  return [...staticRoutes, ...postRoutes]
}
