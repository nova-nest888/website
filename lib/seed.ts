/**
 * Seed script — run once after setting up MongoDB
 * Usage: npm run seed
 */
import { connectDB } from './mongoose'
import { User }      from './models/User'
import { Service }   from './models/Service'

// eslint-disable-next-line @typescript-eslint/no-require-imports
const bcrypt = require('bcryptjs')

async function seed() {
  await connectDB()
  console.log('Connected to MongoDB')

  // ─── Admin user ──────────────────────────────────────────────────────────────
  const existing = await User.findOne({ email: 'admin@novanest.com' })
  if (!existing) {
    const hashed = await bcrypt.hash('novanest2024!', 12)
    await User.create({ email: 'admin@novanest.com', password: hashed, name: 'Admin', role: 'admin' })
    console.log('✓ Admin created: admin@novanest.com / novanest2024!')
    console.log('⚠  CHANGE THIS PASSWORD before going live.')
  } else {
    console.log('  Admin user already exists — skipping')
  }

  // ─── Default services ─────────────────────────────────────────────────────────
  const services: Array<{ title:string; slug:string; category:string; duration:number; price:number; calSlug:string; description:string }> = [
    { title: 'Nature Experience — Half Day',   slug: 'nature-half-day',     category: 'Nature',   duration: 240, price: 0, calSlug: 'nature-half-day',     description: 'Guided hike or nature walk built around slowing down and noticing what you usually miss.' },
    { title: 'Movement & Expression Session',  slug: 'movement-expression', category: 'Movement', duration: 75,  price: 0, calSlug: 'movement-expression', description: 'Somatic movement or free-form dance — no steps to learn, no mirrors to check yourself in.' },
    { title: 'Sound Healing Session',          slug: 'sound-healing',      category: 'Presence', duration: 60,  price: 0, calSlug: 'sound-healing',       description: 'Tibetan bowls and crystal frequencies to guide your nervous system into deep rest.' },
    { title: 'Breathwork Session',              slug: 'breathwork',         category: 'Presence', duration: 75,  price: 0, calSlug: 'breathwork',          description: 'Conscious connected breathing to move what\'s stuck and access what\'s below the surface.' },
    { title: 'Leadership Workshop — Intro',     slug: 'leadership-intro',   category: 'Growth',   duration: 180, price: 0, calSlug: 'leadership-intro',    description: 'Interactive workshop grounded in psychology and neuroscience, built around doing, not slides.' },
    { title: 'Retreat Info Call',               slug: 'retreat-info',       category: 'Immersion',duration: 30,  price: 0, calSlug: 'retreat-info',        description: 'Free 30-min call to find out if a NovaNest retreat is right for you or your team.' },
  ]

  let created = 0
  for (const svc of services) {
    const exists = await Service.findOne({ slug: svc.slug })
    if (!exists) { await Service.create(svc as any); created++ }
  }
  console.log(`✓ Services: ${created} created, ${services.length - created} already existed`)

  console.log('\n✓ Seed complete. You can now log in at /admin/login')
  process.exit(0)
}

seed().catch(err => { console.error('Seed failed:', err); process.exit(1) })
