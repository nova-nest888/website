'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { TestimonialDoc } from '@/types'

export default function AdminTestimonials() {
  const [items, setItems]     = useState<TestimonialDoc[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/testimonials')
      .then(r => r.json())
      .then(d => { setItems(Array.isArray(d.data) ? d.data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const toggle = async (id: string, isActive: boolean) => {
    await fetch(`/api/testimonials/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !isActive }),
    })
    setItems(t => t.map(x => x.id === id ? { ...x, isActive: !isActive } : x))
  }

  const del = async (id: string) => {
    if (!confirm('Delete this testimonial?')) return
    await fetch(`/api/testimonials/${id}`, { method: 'DELETE' })
    setItems(t => t.filter(x => x.id !== id))
  }

  return (
    <div>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'2.5rem' }}>
        <div>
          <h1 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'2.2rem', fontWeight:300, color:'var(--forest-800)', marginBottom:'0.25rem' }}>Testimonials</h1>
          <p style={{ fontFamily:'Inter,sans-serif', fontSize:'0.8rem', color:'var(--text-muted)' }}>
            {items.filter(i => i.isActive).length} showing on site · {items.filter(i => !i.isActive).length} hidden
          </p>
        </div>
        <Link href="/admin/testimonials/new" className="btn btn-forest" style={{ fontSize:'0.65rem' }}>+ Add Testimonial</Link>
      </div>

      {loading ? (
        <div style={{ padding:'3rem', fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'1.2rem', fontStyle:'italic', color:'var(--text-ghost)' }}>Loading…</div>
      ) : items.length === 0 ? (
        <div style={{ background:'white', padding:'4rem', textAlign:'center' }}>
          <p style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'1.4rem', fontStyle:'italic', color:'var(--text-ghost)', marginBottom:'1.5rem' }}>No testimonials yet.</p>
          <Link href="/admin/testimonials/new" className="btn btn-forest">Add First Testimonial</Link>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:'2px' }}>
          {items.map(t => (
            <div key={t.id} style={{
              background:'white', padding:'1.8rem 2rem',
              display:'grid', gridTemplateColumns:'1fr auto',
              gap:'2rem', alignItems:'start',
              borderLeft:`3px solid ${t.isActive ? 'var(--gold)' : 'var(--border-strong)'}`,
              opacity: t.isActive ? 1 : 0.5,
            }}>
              <div>
                {/* Stars */}
                <div style={{ display:'flex', gap:'2px', marginBottom:'0.6rem' }}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} style={{ fontSize:'0.78rem', color: i < t.rating ? 'var(--gold)' : 'var(--border-strong)' }}>◆</span>
                  ))}
                </div>
                <p style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'1.1rem', fontStyle:'italic', color:'var(--forest-800)', lineHeight:1.65, marginBottom:'0.8rem' }}>
                  "{t.content}"
                </p>
                <div style={{ fontFamily:'Inter,sans-serif', fontSize:'0.78rem', fontWeight:600, color:'var(--text-primary)' }}>{t.name}</div>
                {t.role && <div style={{ fontFamily:'Inter,sans-serif', fontSize:'0.7rem', color:'var(--gold)', marginTop:'0.15rem' }}>{t.role}</div>}
                <div style={{ fontFamily:'Inter,sans-serif', fontSize:'0.65rem', color:'var(--text-ghost)', marginTop:'0.4rem' }}>
                  Added {new Date(t.createdAt).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' })}
                </div>
              </div>

              <div style={{ display:'flex', flexDirection:'column', gap:'0.5rem', flexShrink:0, paddingTop:'0.2rem' }}>
                <button onClick={() => toggle(t.id, t.isActive)} style={{ fontFamily:'Inter,sans-serif', fontSize:'0.62rem', fontWeight:500, letterSpacing:'0.1em', textTransform:'uppercase', cursor:'pointer', padding:'0.35rem 0.7rem', border:'1.5px solid', borderColor: t.isActive ? 'var(--border-strong)' : 'var(--forest-400)', background:'none', color: t.isActive ? 'var(--text-muted)' : 'var(--forest-600)', transition:'all 0.15s ease' }}>
                  {t.isActive ? 'Hide' : 'Show'}
                </button>
                <button onClick={() => del(t.id)} style={{ fontFamily:'Inter,sans-serif', fontSize:'0.62rem', fontWeight:500, letterSpacing:'0.08em', textTransform:'uppercase', cursor:'pointer', padding:'0.35rem 0.7rem', border:'1px solid #fecaca', background:'none', color:'#c0392b' }}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
