import { z } from 'zod'

// ─── Contact form ──────────────────────────────────────────────────────────────
export const contactSchema = z.object({
  name:     z.string().min(1).max(100),
  email:    z.string().email(),
  phone:    z.string().max(30).optional(),
  interest: z.string().max(100).optional(),
  how:      z.string().max(100).optional(),
  message:  z.string().min(10).max(2000),
})

// ─── Booking ───────────────────────────────────────────────────────────────────
export const bookingSchema = z.object({
  serviceId:   z.string().min(1),
  serviceName: z.string().min(1),
  name:        z.string().min(1).max(100),
  email:       z.string().email(),
  phone:       z.string().max(30).optional(),
  date:        z.string().min(1),
  time:        z.string().min(1),
  notes:       z.string().max(500).optional(),
  calEventId:  z.string().optional(),
})

// ─── Post ──────────────────────────────────────────────────────────────────────
export const postSchema = z.object({
  title:       z.string().min(1).max(200),
  slug:        z.string().min(1).max(200).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers, hyphens'),
  excerpt:     z.string().min(1).max(500),
  content:     z.string().min(1),
  category:    z.enum(['nature','movement','presence','growth','community','immersion']),
  published:   z.boolean().default(false),
  coverImage:  z.string().url().optional().or(z.literal('')),
})

// ─── Service ───────────────────────────────────────────────────────────────────
export const serviceSchema = z.object({
  title:       z.string().min(1).max(200),
  slug:        z.string().min(1).max(200).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers, hyphens'),
  description: z.string().max(1000).default(''),
  duration:    z.number().min(15).max(480),
  price:       z.number().min(0),
  category:    z.enum(['Nature','Movement','Presence','Growth','Immersion','Community']),
  calSlug:     z.string().max(200).default(''),
  isActive:    z.boolean().default(true),
})

// ─── Testimonial ───────────────────────────────────────────────────────────────
export const testimonialSchema = z.object({
  name:     z.string().min(1).max(100),
  role:     z.string().max(100).optional(),
  content:  z.string().min(10).max(1000),
  rating:   z.number().min(1).max(5).default(5),
  isActive: z.boolean().default(true),
})

// ─── Photo (gallery) ─────────────────────────────────────────────────────────────
export const photoSchema = z.object({
  url:      z.string().url('Must be a valid image URL'),
  caption:  z.string().max(200).optional(),
  category: z.enum(['general','nature','movement','presence','growth','community','immersion']).default('general'),
  order:    z.number().default(0),
  isActive: z.boolean().default(true),
})

// ─── Site images (hero, portrait, per-offering photos) ─────────────────────────
export const siteImageSchema = z.object({
  key: z.string().min(1).max(120),
  url: z.string().url(),
})

// ─── Admin: change password ─────────────────────────────────────────────────────
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword:     z.string().min(8, 'New password must be at least 8 characters'),
}).refine(d => d.currentPassword !== d.newPassword, {
  message: 'New password must be different from the current password',
  path: ['newPassword'],
})

export type ContactInput         = z.infer<typeof contactSchema>
export type BookingInput         = z.infer<typeof bookingSchema>
export type PostInput            = z.infer<typeof postSchema>
export type ServiceInput         = z.infer<typeof serviceSchema>
export type TestimonialInput     = z.infer<typeof testimonialSchema>
export type PhotoInput           = z.infer<typeof photoSchema>
export type ChangePasswordInput  = z.infer<typeof changePasswordSchema>
