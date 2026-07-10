// ─── Shared application types ─────────────────────────────────────────────────

export type ServiceCategory = 'Nature' | 'Movement' | 'Presence' | 'Growth' | 'Immersion' | 'Community'
export type BookingStatus   = 'confirmed' | 'cancelled' | 'pending'
export type PostCategory    = 'nature' | 'movement' | 'presence' | 'growth' | 'community' | 'immersion'
export type PhotoCategory   = 'general' | 'nature' | 'movement' | 'presence' | 'growth' | 'community' | 'immersion'
export type UserRole        = 'admin' | 'editor'

// Lean (plain object) versions returned from API routes
export interface PhotoDoc {
  _id: string
  id:  string
  url: string
  caption?: string
  category: PhotoCategory
  order: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface ServiceDoc {
  _id: string
  id:  string
  title: string
  slug: string
  description: string
  duration: number
  price: number
  category: ServiceCategory
  calSlug: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface BookingDoc {
  _id: string
  id:  string
  serviceId: string
  serviceName: string
  name: string
  email: string
  phone?: string
  date: string
  time: string
  status: BookingStatus
  notes?: string
  calEventId?: string
  createdAt: string
}

export interface PostDoc {
  _id: string
  id:  string
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage?: string
  published: boolean
  publishedAt?: string
  category: PostCategory
  createdAt: string
  updatedAt: string
}

export interface TestimonialDoc {
  _id: string
  id:  string
  name: string
  role?: string
  content: string
  rating: number
  isActive: boolean
  createdAt: string
}

export interface AvailabilityDoc {
  _id: string
  id:  string
  dayOfWeek: number
  startTime: string
  endTime: string
  isActive: boolean
}

export interface ApiResponse<T = unknown> {
  data?: T
  error?: string
  message?: string
}
