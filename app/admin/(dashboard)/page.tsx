'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Stats { bookings:number; posts:number; services:number; testimonials:number; upcoming:number }

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats|null>(null)

  useEffect(() => {
    fetch('/api/admin/stats').then(r=>r.json()).then(d=>setStats(d.data)).catch(()=>{})
  }, [])

  const STAT_CARDS = [
    { label:'Total Bookings', value:stats?.bookings??'—', href:'/admin/bookings', bg:'var(--forest-50)' },
    { label:'Upcoming',       value:stats?.upcoming??'—', href:'/admin/bookings', bg:'var(--parchment-mid)' },
    { label:'Posts Live',     value:stats?.posts??'—',    href:'/admin/posts',    bg:'var(--forest-50)' },
    { label:'Active Services',value:stats?.services??'—', href:'/admin/services', bg:'var(--parchment-mid)' },
  ]

  const QUICK = [
    { label:'+ New journal post',   href:'/admin/posts/new' },
    { label:'+ Add testimonial',    href:'/admin/testimonials/new' },
    { label:'+ Create service',     href:'/admin/services/new' },
    { label:'✦ Manage availability',href:'/admin/availability' },
    { label:'↗ View live site',    href:'/', target:'_blank' },
  ]

  const CHECKLIST = [
    'Set MONGODB_URI in .env.local',
    'Set NEXTAUTH_SECRET in .env.local',
    'Set RESEND_API_KEY and EMAIL_TO in .env.local',
    'Set NEXT_PUBLIC_CAL_USERNAME in .env.local',
    'Create Cal.com event types matching service slugs',
    'Set up Cal.com webhook → /api/bookings',
    'Replace all *** placeholders in page files',
    'Run npm run seed to create admin user',
    'Upload portrait on the About page',
    'Add your first journal post',
  ]

  return (
    <div>
      <div style={{ marginBottom:'2.5rem' }}>
        <h1 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'2.4rem', fontWeight:300, color:'var(--forest-800)', marginBottom:'0.3rem' }}>Good to see you.</h1>
        <p style={{ fontFamily:'Inter,sans-serif', fontSize:'0.84rem', color:'var(--text-muted)' }}>Here's what's happening at NovaNest.</p>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))', gap:'2px', marginBottom:'3rem' }}>
        {STAT_CARDS.map(c => (
          <Link key={c.href+c.label} href={c.href} style={{ textDecoration:'none', display:'block', background:c.bg, padding:'2rem', transition:'transform 0.15s ease' }}
            onMouseEnter={e=>e.currentTarget.style.transform='translateY(-2px)'}
            onMouseLeave={e=>e.currentTarget.style.transform='none'}
          >
            <div style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'3.5rem', fontWeight:200, color:'var(--forest-700)', lineHeight:1, marginBottom:'0.4rem' }}>{c.value}</div>
            <div className="overline">{c.label}</div>
          </Link>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'2rem' }}>
        {/* Quick actions */}
        <div style={{ background:'white', padding:'2rem' }}>
          <div className="overline" style={{ marginBottom:'1.2rem' }}>Quick Actions</div>
          {QUICK.map(l => (
            <Link key={l.label} href={l.href} target={(l as any).target} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', fontFamily:'Inter,sans-serif', fontSize:'0.84rem', color:'var(--forest-700)', textDecoration:'none', padding:'0.7rem 0', borderBottom:'1px solid var(--border)', transition:'color 0.15s ease' }}
              onMouseEnter={e=>e.currentTarget.style.color='var(--gold)'}
              onMouseLeave={e=>e.currentTarget.style.color='var(--forest-700)'}
            >
              {l.label}<span style={{ opacity:0.3 }}>→</span>
            </Link>
          ))}
        </div>

        {/* Checklist */}
        <div style={{ background:'var(--forest-800)', padding:'2rem' }}>
          <div className="overline" style={{ color:'var(--gold-light)', marginBottom:'1.2rem' }}>Setup Checklist</div>
          {CHECKLIST.map((item, i) => (
            <div key={i} style={{ display:'flex', gap:'0.8rem', alignItems:'flex-start', marginBottom:'0.6rem' }}>
              <span style={{ color:'var(--gold)', marginTop:'2px', flexShrink:0, fontSize:'0.72rem' }}>◇</span>
              <span style={{ fontFamily:'Inter,sans-serif', fontSize:'0.78rem', color:'rgba(168,192,158,0.65)', lineHeight:1.55 }}>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
