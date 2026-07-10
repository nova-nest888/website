'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { PhotoDoc } from '@/types'

export default function AdminGallery() {
  const [items, setItems]     = useState<PhotoDoc[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/photos')
      .then(r => r.json())
      .then(d => { setItems(Array.isArray(d.data) ? d.data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const toggle = async (id: string, isActive: boolean) => {
    await fetch(`/api/photos/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !isActive }),
    })
    setItems(t => t.map(x => x.id === id ? { ...x, isActive: !isActive } : x))
  }

  const del = async (id: string) => {
    if (!confirm('Delete this photo?')) return
    await fetch(`/api/photos/${id}`, { method: 'DELETE' })
    setItems(t => t.filter(x => x.id !== id))
  }

  return (
    <div>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'2.5rem' }}>
        <div>
          <h1 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'2.2rem', fontWeight:300, color:'var(--forest-800)', marginBottom:'0.25rem' }}>Gallery</h1>
          <p style={{ fontFamily:'Inter,sans-serif', fontSize:'0.8rem', color:'var(--text-muted)' }}>
            {items.filter(i => i.isActive).length} showing on site · {items.filter(i => !i.isActive).length} hidden
          </p>
        </div>
        <Link href="/admin/gallery/new" className="btn btn-forest" style={{ fontSize:'0.65rem' }}>+ Add Photo</Link>
      </div>

      <div style={{ background:'#fdf8ec', border:'1px solid #ecd9a8', padding:'1rem 1.4rem', marginBottom:'2rem', fontFamily:'Inter,sans-serif', fontSize:'0.78rem', color:'var(--forest-700)', lineHeight:1.6 }}>
        Upload photos directly from your device — they're stored on Cloudinary, and the link is saved here. You can still paste an existing image URL instead if you'd rather.
      </div>

      {loading ? (
        <div style={{ padding:'3rem', fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'1.2rem', fontStyle:'italic', color:'var(--text-ghost)' }}>Loading…</div>
      ) : items.length === 0 ? (
        <div style={{ background:'white', padding:'4rem', textAlign:'center' }}>
          <p style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'1.4rem', fontStyle:'italic', color:'var(--text-ghost)', marginBottom:'1.5rem' }}>No photos yet.</p>
          <Link href="/admin/gallery/new" className="btn btn-forest">Add First Photo</Link>
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:'2px' }}>
          {items.map(p => (
            <div key={p.id} style={{ background:'white', borderLeft:`3px solid ${p.isActive ? 'var(--gold)' : 'var(--border-strong)'}`, opacity: p.isActive ? 1 : 0.5 }}>
              <div style={{ aspectRatio:'4/3', background:'var(--parchment-mid)', overflow:'hidden' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.url} alt={p.caption ?? ''} style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }}
                  onError={e => { (e.currentTarget as HTMLImageElement).style.opacity = '0.15' }}
                />
              </div>
              <div style={{ padding:'0.9rem 1rem' }}>
                <div style={{ fontFamily:'Inter,sans-serif', fontSize:'0.65rem', letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--gold-dark)', marginBottom:'0.3rem' }}>{p.category}</div>
                {p.caption && <div style={{ fontFamily:'Inter,sans-serif', fontSize:'0.78rem', color:'var(--text-body)', marginBottom:'0.7rem', lineHeight:1.5 }}>{p.caption}</div>}
                <div style={{ display:'flex', gap:'0.5rem' }}>
                  <button onClick={() => toggle(p.id, p.isActive)} style={{ flex:1, fontFamily:'Inter,sans-serif', fontSize:'0.6rem', fontWeight:500, letterSpacing:'0.08em', textTransform:'uppercase', cursor:'pointer', padding:'0.35rem 0.5rem', border:'1.5px solid', borderColor: p.isActive ? 'var(--border-strong)' : 'var(--forest-400)', background:'none', color: p.isActive ? 'var(--text-muted)' : 'var(--forest-600)' }}>
                    {p.isActive ? 'Hide' : 'Show'}
                  </button>
                  <button onClick={() => del(p.id)} style={{ flex:1, fontFamily:'Inter,sans-serif', fontSize:'0.6rem', fontWeight:500, letterSpacing:'0.06em', textTransform:'uppercase', cursor:'pointer', padding:'0.35rem 0.5rem', border:'1px solid #fecaca', background:'none', color:'#c0392b' }}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
