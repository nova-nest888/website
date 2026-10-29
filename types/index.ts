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
  mediaType: 'image' | 'video'
  caption?: string
  category: PhotoCategory
  order: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface ServiceOptionChoice {
  label: string
  description?: string
  /** Optional "from" price ($) shown when this choice is picked — overrides the service price */
  price?: number
  /** Optional Cal.com event slug to use when this choice is picked (e.g. a separate event for outdoor) */
  calSlug?: string
}

export interface ServiceOptionGroup {
  /** Question shown to the booker, e.g. "How are you joining?" */
  label: string
  choices: ServiceOptionChoice[]
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
  optionGroups?: ServiceOptionGroup[]
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
  image?: string
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
