import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB }   from '@/lib/mongoose'
import { Booking }     from '@/lib/models/Booking'
import { Post }        from '@/lib/models/Post'
import { Service }     from '@/lib/models/Service'
import { Testimonial } from '@/lib/models/Testimonial'
import { apiError, apiSuccess } from '@/lib/utils'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return apiError('Unauthorized', 401)

  await connectDB()
  const now = new Date()

  const [bookings, posts, services, testimonials, upcoming, revenue] = await Promise.all([
    Booking.countDocuments(),
    Post.countDocuments({ published: true }),
    Service.countDocuments({ isActive: true }),
    Testimonial.countDocuments({ isActive: true }),
    Booking.countDocuments({ date: { $gte: now }, status: 'confirmed' }),
    Booking.countDocuments({ status: 'confirmed' }),
  ])

  return apiSuccess({ bookings, posts, services, testimonials, upcoming, revenue })
}
