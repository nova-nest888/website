'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { ServiceDoc } from '@/types'

export default function AdminServices() {
  const [services, setServices] = useState<ServiceDoc[]>([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    fetch('/api/services')
      .then(r => r.json())
      .then(d => { setServices(Array.isArray(d.data) ? d.data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const toggle = async (id: string, isActive: boolean) => {
    await fetch(`/api/services/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !isActive }),
    })
    setServices(s => s.map(x => x.id === id ? { ...x, isActive: !isActive } : x))
  }

  const del = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return
    await fetch(`/api/services/${id}`, { method: 'DELETE' })
    setServices(s => s.filter(x => x.id !== id))
  }

  return (
    <div>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'2.5rem' }}>
        <div>
          <h1 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'2.2rem', fontWeight:300, color:'var(--forest-800)', marginBottom:'0.25rem' }}>Services</h1>
          <p style={{ fontFamily:'Inter,sans-serif', fontSize:'0.8rem', color:'var(--text-muted)' }}>
            {services.filter(s => s.isActive).length} active · {services.filter(s => !s.isActive).length} hidden
          </p>
        </div>
        <Link href="/admin/services/new" className="btn btn-forest" style={{ fontSize:'0.65rem' }}>+ New Service</Link>
      </div>

      {loading ? (
        <div style={{ padding:'3rem', fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'1.2rem', fontStyle:'italic', color:'var(--text-ghost)' }}>Loading…</div>
      ) : services.length === 0 ? (
        <div style={{ background:'white', padding:'4rem', textAlign:'center' }}>
          <p style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'1.4rem', fontStyle:'italic', color:'var(--text-ghost)', marginBottom:'1.5rem' }}>No services yet.</p>
          <Link href="/admin/services/new" className="btn btn-forest">Create First Service</Link>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:'2px' }}>
          {services.map(s => (
            <div key={s.id} style={{
              background:'white', padding:'1.5rem 2rem',
              display:'grid', gridTemplateColumns:'1fr auto',
              gap:'1.5rem', alignItems:'center',
              borderLeft:`3px solid ${s.isActive ? 'var(--forest-400)' : 'var(--border-strong)'}`,
              opacity: s.isActive ? 1 : 0.55,
            }}>
              <div>
                <div style={{ display:'flex', alignItems:'center', gap:'0.8rem', marginBottom:'0.3rem' }}>
                  <span className="overline">{s.category}</span>
                  <span style={{
                    fontFamily:'Inter,sans-serif', fontSize:'0.6rem', fontWeight:600,
                    letterSpacing:'0.1em', textTransform:'uppercase',
                    color: s.isActive ? 'var(--forest-600)' : 'var(--text-ghost)',
                    padding:'0.15rem 0.45rem',
                    border:`1px solid ${s.isActive ? 'var(--forest-300)' : 'var(--border-strong)'}`,
                  }}>{s.isActive ? 'Active' : 'Hidden'}</span>
                </div>
                <div style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'1.2rem', fontWeight:300, color:'var(--forest-800)', marginBottom:'0.2rem' }}>{s.title}</div>
                <div style={{ fontFamily:'Inter,sans-serif', fontSize:'0.72rem', color:'var(--text-muted)' }}>
                  {s.duration} min
                  {s.price > 0 ? ` · $${s.price}` : ' · Free'}
                  {s.calSlug && <span style={{ color:'var(--forest-300)', marginLeft:'0.5rem' }}>cal: {s.calSlug}</span>}
                </div>
              </div>

              <div style={{ display:'flex', gap:'0.5rem', alignItems:'center', flexShrink:0 }}>
                <Link href={`/admin/services/${s.id}`} style={{ fontFamily:'Inter,sans-serif', fontSize:'0.62rem', fontWeight:500, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--forest-700)', textDecoration:'none', padding:'0.32rem 0.65rem', border:'1.5px solid var(--border-strong)', display:'inline-block' }}>Edit</Link>
                <button onClick={() => toggle(s.id, s.isActive)} style={{ fontFamily:'Inter,sans-serif', fontSize:'0.62rem', fontWeight:500, letterSpacing:'0.1em', textTransform:'uppercase', cursor:'pointer', padding:'0.32rem 0.65rem', border:'1.5px solid', borderColor: s.isActive ? 'var(--border-strong)' : 'var(--forest-400)', background: 'none', color: s.isActive ? 'var(--text-muted)' : 'var(--forest-600)', transition:'all 0.15s ease' }}>
                  {s.isActive ? 'Hide' : 'Show'}
                </button>
                <button onClick={() => del(s.id, s.title)} style={{ fontFamily:'Inter,sans-serif', fontSize:'0.62rem', fontWeight:500, letterSpacing:'0.08em', textTransform:'uppercase', cursor:'pointer', padding:'0.32rem 0.6rem', border:'1px solid #fecaca', background:'none', color:'#c0392b' }}>✕</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
