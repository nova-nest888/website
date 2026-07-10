'use client'
import { useEffect, useState } from 'react'
import type { BookingDoc } from '@/types'

type Filter = 'all' | 'confirmed' | 'cancelled'

export default function AdminBookings() {
  const [bookings, setBookings] = useState<BookingDoc[]>([])
  const [loading, setLoading]   = useState(true)
  const [filter, setFilter]     = useState<Filter>('all')

  useEffect(() => {
    fetch('/api/bookings').then(r=>r.json()).then(d=>{ setBookings(Array.isArray(d.data)?d.data:[]); setLoading(false) }).catch(()=>setLoading(false))
  }, [])

  const patch = async (id: string, status: string) => {
    await fetch(`/api/bookings/${id}`, { method:'PATCH', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ status }) })
    setBookings(b=>b.map(x=>x.id===id?{...x,status:status as any}:x))
  }
  const del = async (id: string) => {
    if (!confirm('Delete this booking? This cannot be undone.')) return
    await fetch(`/api/bookings/${id}`, { method:'DELETE' })
    setBookings(b=>b.filter(x=>x.id!==id))
  }

  const display   = filter==='all' ? bookings : bookings.filter(b=>b.status===filter)
  const upcoming  = bookings.filter(b=>new Date(b.date)>=new Date()&&b.status==='confirmed').length
  const STATUS_COLOR: Record<string,string> = { confirmed:'var(--forest-600)', cancelled:'#c0392b', pending:'var(--gold)' }

  return (
    <div>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'2.5rem', flexWrap:'wrap', gap:'1rem' }}>
        <div>
          <h1 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'2.2rem', fontWeight:300, color:'var(--forest-800)', marginBottom:'0.25rem' }}>Bookings</h1>
          <p style={{ fontFamily:'Inter,sans-serif', fontSize:'0.8rem', color:'var(--text-muted)' }}>{bookings.length} total · {upcoming} upcoming confirmed</p>
        </div>
        <div style={{ display:'flex', gap:'0.4rem' }}>
          {(['all','confirmed','cancelled'] as Filter[]).map(f=>(
            <button key={f} onClick={()=>setFilter(f)} style={{ padding:'0.4rem 1rem', cursor:'pointer', fontFamily:'Inter,sans-serif', fontSize:'0.65rem', fontWeight:500, letterSpacing:'0.1em', textTransform:'uppercase', background:filter===f?'var(--forest-700)':'transparent', color:filter===f?'var(--forest-100)':'var(--forest-600)', border:`1.5px solid ${filter===f?'var(--forest-700)':'var(--border-strong)'}`, transition:'all 0.15s ease' }}>{f}</button>
          ))}
        </div>
      </div>

      <div style={{ background:'var(--forest-50)', borderLeft:'3px solid var(--forest-300)', padding:'1rem 1.5rem', marginBottom:'1.5rem' }}>
        <p style={{ fontFamily:'Inter,sans-serif', fontSize:'0.76rem', color:'var(--text-body)', margin:0, lineHeight:1.6 }}>
          <strong>Cal.com bookings</strong> appear here automatically via webhook. Set up the webhook in Cal.com → Integrations → Webhooks → <code style={{ background:'var(--parchment-deep)', padding:'0 4px' }}>POST https://yourdomain.com/api/bookings</code>
        </p>
      </div>

      {loading ? (
        <div style={{ padding:'3rem', fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'1.2rem', fontStyle:'italic', color:'var(--text-ghost)' }}>Loading…</div>
      ) : display.length === 0 ? (
        <div style={{ background:'white', padding:'4rem', textAlign:'center' }}>
          <p style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'1.4rem', fontStyle:'italic', color:'var(--text-ghost)' }}>
            {filter==='all' ? "No bookings yet. They'll appear here when clients book through your site or Cal.com." : `No ${filter} bookings.`}
          </p>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:'2px' }}>
          {display.map(b => {
            const past = new Date(b.date) < new Date()
            return (
              <div key={b.id} style={{ background:'white', padding:'1.5rem 2rem', display:'grid', gridTemplateColumns:'1fr 1.6fr 0.8fr auto', gap:'1.5rem', alignItems:'center', opacity:past?0.6:1, borderLeft:`3px solid ${STATUS_COLOR[b.status]??'var(--border-strong)'}` }}>
                <div>
                  <div style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'1.15rem', fontWeight:300, color:'var(--forest-800)', marginBottom:'0.15rem' }}>{b.name}</div>
                  <div style={{ fontFamily:'Inter,sans-serif', fontSize:'0.72rem', color:'var(--text-muted)' }}>{b.email}</div>
                  {b.phone && <div style={{ fontFamily:'Inter,sans-serif', fontSize:'0.68rem', color:'var(--text-ghost)' }}>{b.phone}</div>}
                  {b.calEventId && <div style={{ fontFamily:'Inter,sans-serif', fontSize:'0.6rem', color:'var(--forest-300)', marginTop:'0.2rem' }}>Cal: {b.calEventId.slice(0,12)}…</div>}
                </div>
                <div>
                  <div style={{ fontFamily:'Inter,sans-serif', fontSize:'0.86rem', color:'var(--text-primary)', marginBottom:'0.2rem' }}>{b.serviceName}</div>
                  <div style={{ fontFamily:'Inter,sans-serif', fontSize:'0.72rem', color:'var(--text-muted)' }}>
                    {new Date(b.date).toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric',year:'numeric'})} · {b.time}
                  </div>
                  {b.notes && <div style={{ fontFamily:'Inter,sans-serif', fontSize:'0.7rem', color:'var(--text-ghost)', marginTop:'0.3rem', fontStyle:'italic' }}>"{b.notes}"</div>}
                </div>
                <div>
                  <span style={{ fontFamily:'Inter,sans-serif', fontSize:'0.62rem', fontWeight:600, letterSpacing:'0.12em', textTransform:'uppercase', color:STATUS_COLOR[b.status]??'var(--text-muted)', padding:'0.25rem 0.55rem', border:`1px solid ${STATUS_COLOR[b.status]??'var(--border-strong)'}`, display:'inline-block' }}>{b.status}</span>
                  {past && <div style={{ fontFamily:'Inter,sans-serif', fontSize:'0.58rem', color:'var(--text-ghost)', marginTop:'0.3rem' }}>Past</div>}
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:'0.4rem' }}>
                  {b.status==='confirmed'
                    ? <button onClick={()=>patch(b.id,'cancelled')} style={{ fontFamily:'Inter,sans-serif', fontSize:'0.6rem', fontWeight:500, letterSpacing:'0.08em', textTransform:'uppercase', cursor:'pointer', padding:'0.3rem 0.6rem', border:'1px solid #fecaca', background:'none', color:'#c0392b' }}>Cancel</button>
                    : <button onClick={()=>patch(b.id,'confirmed')} style={{ fontFamily:'Inter,sans-serif', fontSize:'0.6rem', fontWeight:500, letterSpacing:'0.08em', textTransform:'uppercase', cursor:'pointer', padding:'0.3rem 0.6rem', border:'1.5px solid var(--forest-400)', background:'none', color:'var(--forest-600)' }}>Restore</button>
                  }
                  <button onClick={()=>del(b.id)} style={{ fontFamily:'Inter,sans-serif', fontSize:'0.6rem', fontWeight:500, letterSpacing:'0.08em', textTransform:'uppercase', cursor:'pointer', padding:'0.3rem 0.6rem', border:'1px solid #e5e7eb', background:'none', color:'#9ca3af' }}>Delete</button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
