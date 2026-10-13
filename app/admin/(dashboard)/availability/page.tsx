'use client'
import { useEffect, useState } from 'react'
import type { BookingDoc } from '@/types'

const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']

interface Slot { dayOfWeek: number; startTime: string; endTime: string; isActive: boolean }

const DEFAULT_SLOTS: Slot[] = DAYS.map((_, i) => ({
  dayOfWeek: i, startTime: '09:00', endTime: '17:00', isActive: i >= 1 && i <= 5,
}))

export default function AdminAvailability() {
  const [slots,    setSlots]    = useState<Slot[]>(DEFAULT_SLOTS)
  const [bookings, setBookings] = useState<BookingDoc[]>([])
  const [saving,   setSaving]   = useState(false)
  const [saved,    setSaved]    = useState(false)

  const calUser = process.env.NEXT_PUBLIC_CAL_USERNAME

  useEffect(() => {
    // Load saved availability
    fetch('/api/availability')
      .then(r => r.json())
      .then(d => { if (Array.isArray(d.data) && d.data.length > 0) setSlots(d.data) })
      .catch(() => {})

    // Load upcoming bookings
    fetch('/api/bookings')
      .then(r => r.json())
      .then(d => {
        const upcoming = (Array.isArray(d.data) ? d.data : [])
          .filter((b: BookingDoc) => new Date(b.date) >= new Date())
          .sort((a: BookingDoc, b: BookingDoc) => new Date(a.date).getTime() - new Date(b.date).getTime())
          .slice(0, 10)
        setBookings(upcoming)
      })
      .catch(() => {})
  }, [])

  const update = (day: number, key: keyof Slot, val: string | boolean) =>
    setSlots(s => s.map(x => x.dayOfWeek === day ? { ...x, [key]: val } : x))

  const save = async () => {
    setSaving(true)
    try {
      await fetch('/api/availability', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(slots),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div style={{ marginBottom:'2.5rem' }}>
        <h1 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'2.2rem', fontWeight:300, color:'var(--forest-800)', marginBottom:'0.25rem' }}>Availability</h1>
        <p style={{ fontFamily:'Inter,sans-serif', fontSize:'0.8rem', color:'var(--text-muted)' }}>
          Set your general schedule for reference. Live booking is handled by Cal.com.
        </p>
      </div>

      {/* Cal.com banner */}
      <div style={{ background:'var(--forest-50)', borderLeft:'3px solid var(--forest-400)', padding:'1.2rem 1.5rem', marginBottom:'2rem', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'1rem' }}>
        <div>
          <div className="overline" style={{ marginBottom:'0.3rem' }}>Cal.com — Live Booking Calendar</div>
          <p style={{ fontFamily:'Inter,sans-serif', fontSize:'0.8rem', color:'var(--text-body)', margin:0, lineHeight:1.65 }}>
            Your live availability is managed directly in Cal.com. Set working hours, buffer times, and blocked dates there.
            The booking widget on your site pulls real-time slots from Cal.com automatically.
          </p>
        </div>
        {calUser ? (
          <a href={`https://cal.com/${calUser}`} target="_blank" rel="noopener" className="btn btn-forest" style={{ fontSize:'0.62rem', padding:'0.65rem 1.2rem', whiteSpace:'nowrap', textDecoration:'none' }}>
            Open Cal.com ↗
          </a>
        ) : (
          <div style={{ fontFamily:'Inter,sans-serif', fontSize:'0.75rem', color:'var(--text-ghost)', fontStyle:'italic' }}>
            Set NEXT_PUBLIC_CAL_USERNAME in .env.local
          </div>
        )}
      </div>

      {/* Weekly schedule */}
      <div style={{ background:'white', padding:'2rem', marginBottom:'2rem' }}>
        <div className="overline" style={{ marginBottom:'1.5rem' }}>Your General Schedule</div>
        <div style={{ display:'flex', flexDirection:'column', gap:'2px' }}>
          {slots.map(slot => (
            <div key={slot.dayOfWeek} style={{
              display:'grid', gridTemplateColumns:'130px 140px 140px 80px',
              gap:'1.5rem', alignItems:'center', padding:'0.85rem 1rem',
              background: slot.isActive ? 'var(--forest-50)' : 'var(--parchment-deep)',
              opacity: slot.isActive ? 1 : 0.5,
              transition:'opacity 0.2s ease',
            }}>
              <div style={{ fontFamily:'Inter,sans-serif', fontSize:'0.85rem', fontWeight:500, color:'var(--forest-700)' }}>
                {DAYS[slot.dayOfWeek]}
              </div>
              <div>
                <label className="field-label" style={{ marginBottom:'0.3rem' }}>Start</label>
                <input type="time" value={slot.startTime} onChange={e => update(slot.dayOfWeek,'startTime',e.target.value)} disabled={!slot.isActive} className="field-input" style={{ padding:'0.4rem 0.6rem', fontSize:'0.85rem' }}/>
              </div>
              <div>
                <label className="field-label" style={{ marginBottom:'0.3rem' }}>End</label>
                <input type="time" value={slot.endTime} onChange={e => update(slot.dayOfWeek,'endTime',e.target.value)} disabled={!slot.isActive} className="field-input" style={{ padding:'0.4rem 0.6rem', fontSize:'0.85rem' }}/>
              </div>
              <label style={{ display:'flex', alignItems:'center', gap:'0.4rem', cursor:'pointer', paddingTop:'1.4rem' }}>
                <input type="checkbox" checked={slot.isActive} onChange={e => update(slot.dayOfWeek,'isActive',e.target.checked)} style={{ accentColor:'var(--forest-600)', width:15, height:15 }}/>
                <span style={{ fontFamily:'Inter,sans-serif', fontSize:'0.72rem', fontWeight:500, color: slot.isActive ? 'var(--forest-600)' : 'var(--text-ghost)' }}>
                  {slot.isActive ? 'Open' : 'Off'}
                </span>
              </label>
            </div>
          ))}
        </div>
        <div style={{ marginTop:'1.5rem', display:'flex', alignItems:'center', gap:'1rem' }}>
          <button onClick={save} disabled={saving} className="btn btn-forest" style={{ fontSize:'0.65rem' }}>
            {saving ? 'Saving…' : 'Save Schedule'}
          </button>
          {saved && <span style={{ fontFamily:'Inter,sans-serif', fontSize:'0.76rem', color:'var(--forest-500)' }}>✓ Saved</span>}
        </div>
      </div>

      {/* Upcoming bookings */}
      <div style={{ background:'white', padding:'2rem' }}>
        <div className="overline" style={{ marginBottom:'1.5rem' }}>Upcoming Confirmed Bookings</div>
        {bookings.length === 0 ? (
          <p style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'1.1rem', fontStyle:'italic', color:'var(--text-ghost)' }}>
            No upcoming bookings. They'll appear here once clients book through your site or Cal.com.
          </p>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:'2px' }}>
            {bookings.map(b => (
              <div key={b.id} style={{ display:'grid', gridTemplateColumns:'1fr 1.4fr auto', gap:'2rem', alignItems:'center', padding:'0.9rem 1rem', background:'var(--parchment)' }}>
                <div>
                  <div style={{ fontFamily:'Inter,sans-serif', fontSize:'0.85rem', fontWeight:500, color:'var(--forest-800)' }}>{b.name}</div>
                  <div style={{ fontFamily:'Inter,sans-serif', fontSize:'0.7rem', color:'var(--text-ghost)' }}>{b.email}</div>
                </div>
                <div>
                  <div style={{ fontFamily:'Inter,sans-serif', fontSize:'0.82rem', color:'var(--text-body)' }}>{b.serviceName}</div>
                  <div style={{ fontFamily:'Inter,sans-serif', fontSize:'0.7rem', color:'var(--text-muted)' }}>
                    {new Date(b.date).toLocaleDateString('en-US',{ weekday:'short', month:'short', day:'numeric' })} · {b.time}
                  </div>
                </div>
                <span style={{ fontFamily:'Inter,sans-serif', fontSize:'0.62rem', fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--forest-600)', padding:'0.22rem 0.5rem', border:'1px solid var(--forest-300)', whiteSpace:'nowrap' }}>
                  {b.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
