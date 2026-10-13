'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import type { ServiceDoc, ServiceOptionChoice } from '@/types'

const FALLBACK_SERVICES: ServiceDoc[] = [
  { _id:'s1', id:'s1', title:'Nature Experience — Half Day',   slug:'nature-half-day',     category:'Nature',    duration:240, price:0, calSlug:'nature-half-day',     description:"Guided hike or nature walk built around slowing down and noticing what you usually miss.", isActive:true, createdAt:'', updatedAt:'' },
  { _id:'s2', id:'s2', title:'Movement & Expression Session',  slug:'movement-expression', category:'Movement',  duration:75,  price:0, calSlug:'movement-expression', description:"Somatic movement or free-form dance — no steps to learn, no mirrors to check yourself in.", isActive:true, createdAt:'', updatedAt:'' },
  { _id:'s3', id:'s3', title:'Sound Healing Session',          slug:'sound-healing',       category:'Presence',  duration:60,  price:0, calSlug:'sound-healing',       description:"Tibetan bowls and crystal frequencies guide your nervous system into deep rest.", isActive:true, createdAt:'', updatedAt:'' },
  { _id:'s4', id:'s4', title:'Breathwork Session',              slug:'breathwork',          category:'Presence',  duration:75,  price:0, calSlug:'breathwork',          description:"Conscious connected breathing to move what's stuck.", isActive:true, createdAt:'', updatedAt:'' },
  { _id:'s5', id:'s5', title:'Mind, Brain & Behaviour — 1:1 Session', slug:'leadership-intro',    category:'Growth',    duration:180, price:0, calSlug:'leadership-intro',    description:"A private, practical session using NLP tools, behavioural psychology, and neuroscience-informed approaches to explore patterns in thinking, emotion, attention, communication, and behaviour.", isActive:true, createdAt:'', updatedAt:'' },
  { _id:'s6', id:'s6', title:'Retreat Info Call',               slug:'retreat-info',        category:'Immersion', duration:30,  price:0, calSlug:'retreat-info',        description:"Free 30-min call to see if a NovaNest retreat is right for you or your team.", isActive:true, createdAt:'', updatedAt:'' },
]

// Cal.com's official embed bootstrap. Defines window.Cal as a small queueing
// stub that loads the real embed.js exactly once (guarded by cal.loaded),
// no matter how many times this function runs — safe under React Strict Mode's
// double-invoke, safe across remounts/navigation. This is what actually fixes
// "Cal is not defined" / "cal-modal-box has already been defined" — those
// happened because the previous version injected a brand new <script> tag on
// every mount, and embed.js can only run its custom-element registration once
// per page ever.
function loadCalScript() {
  const w = window as any
  if (typeof w.Cal === 'function') return // already loaded (or loading)
  const p = (a: any, ar: any) => a.q.push(ar)
  w.Cal = function (...args: any[]) {
    const cal = w.Cal
    if (!cal.loaded) {
      cal.ns = {}
      cal.q = cal.q || []
      document.head.appendChild(document.createElement('script')).src = 'https://app.cal.com/embed/embed.js'
      cal.loaded = true
    }
    if (args[0] === 'init') {
      const api: any = function (...apiArgs: any[]) { p(api, apiArgs) }
      const namespace = args[1]
      api.q = api.q || []
      if (typeof namespace === 'string') {
        cal.ns[namespace] = cal.ns[namespace] || api
        p(cal.ns[namespace], args)
        p(cal, ['initNamespace', namespace])
      } else {
        p(cal, args)
      }
      return
    }
    p(cal, args)
  }
}

function CalEmbed({ calSlug, notes, onBooked }: { calSlug: string; notes?: string; onBooked: () => void }) {
  const ref    = useRef<HTMLDivElement>(null)
  const calUser = process.env.NEXT_PUBLIC_CAL_USERNAME ?? '***YOUR-CAL-USERNAME***'

  useEffect(() => {
    if (!ref.current) return
    const id = `cal-${calSlug}`

    loadCalScript()
    const Cal = (window as any).Cal

    Cal('init', id, { origin: 'https://cal.com' })
    Cal.ns[id]('inline', {
      elementOrSelector: `#${id}`,
      calLink: `${calUser}/${calSlug}`,
      config: {
        layout: 'month_view',
        ...(notes ? { notes } : {}),
        cssVarsPerTheme: {
          light: {
            'cal-brand':          '#3D5232',
            'cal-brand-emphasis': '#2D3D2A',
            'cal-brand-text':     '#F0EDE6',
            'cal-bg':             '#FFFFFF',
            'cal-text':           '#1C2B1A',
            'cal-border':         'rgba(61,82,50,0.15)',
            'cal-bg-subtle':      '#F0EDE6',
            'cal-text-muted':     '#6B7D68',
          },
        },
      },
    })
    Cal.ns[id]('on', { action: 'bookingSuccessful', callback: onBooked })

    return () => {
      // Only clear this instance's DOM — the shared embed.js script and the
      // window.Cal stub stay loaded for the lifetime of the page, as intended.
      if (ref.current) ref.current.innerHTML = ''
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calSlug, notes])

  return <div ref={ref} id={`cal-${calSlug}`} style={{ minHeight: 650, width: '100%' }} />
}

// Prices come from Admin → Services (the same price the Experiences page shows).
function priceLabel(svc: ServiceDoc, picked: ServiceOptionChoice[] = []): string {
  // A picked option with its own price (e.g. "Outdoor") overrides the service price
  const override = [...picked].reverse().find(c => typeof c.price === 'number')
  if (override) return `From $${override.price}`
  if (svc.price > 0) return `From $${svc.price}`
  // Only a service with no price at all is treated as free (e.g. the info call); set a price in Admin → Services otherwise.
  return svc.slug === 'retreat-info' ? 'Free' : 'Price on request'
}

type Step = 'select' | 'options' | 'calendar' | 'confirmed'

export default function BookClient({ services }: { services: ServiceDoc[] }) {
  const display               = services.length > 0 ? services : FALLBACK_SERVICES
  const [step, setStep]       = useState<Step>('select')
  const [selected, setSelected] = useState<ServiceDoc | null>(null)

  // picks[i] = index of the choice selected for optionGroups[i]
  const [picks, setPicks] = useState<Record<number, number>>({})

  const groupsOf = (svc: ServiceDoc | null) => (svc?.optionGroups ?? []).filter(g => g.choices.length > 0)

  const choose = (svc: ServiceDoc) => {
    setSelected(svc)
    setPicks({})
    // Services with admin-defined options ask those questions first (still step 1)
    setStep(groupsOf(svc).length > 0 ? 'options' : 'calendar')
  }

  const pickedChoices: ServiceOptionChoice[] = groupsOf(selected)
    .map((g, gi) => (picks[gi] !== undefined ? g.choices[picks[gi]] : undefined))
    .filter((c): c is ServiceOptionChoice => !!c)
  const allAnswered = groupsOf(selected).every((_, gi) => picks[gi] !== undefined)
  const effectiveCalSlug = [...pickedChoices].reverse().find(c => c.calSlug)?.calSlug || selected?.calSlug || selected?.slug || ''
  const bookingNotes = groupsOf(selected).length
    ? 'Booking preferences — ' + groupsOf(selected).map((g, gi) => picks[gi] !== undefined ? `${g.label} ${g.choices[picks[gi]].label}` : '').filter(Boolean).join('; ')
    : undefined
  const crumbStep = step === 'options' ? 'select' : step

  return (
    <>
      {/* Header */}
      <section style={{ paddingTop:'9rem', paddingBottom:'4rem', background:'var(--forest-900)', position:'relative', overflow:'hidden' }}>
        <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', opacity:0.07 }} viewBox="0 0 1440 350" preserveAspectRatio="xMidYMid slice">
          <path d="M0 350 Q360 150 720 230 Q1080 80 1440 160 L1440 350Z" fill="var(--forest-400)"/>
        </svg>
        <div className="container" style={{ position:'relative', zIndex:2 }}>
          <div className="overline" style={{ color:'var(--gold-light)' }}>Reserve Your Spot</div>
          <div className="rule" style={{ background:'var(--gold)' }}/>
          <h1 className="headline" style={{ color:'var(--parchment)', marginBottom:'1rem' }}>Book an Experience</h1>
          <p style={{ color:'rgba(168,192,158,0.62)', maxWidth:'500px', fontSize:'1rem' }}>
            Pick whatever calls to you. If you're unsure, a nature experience or a sound healing session are easy places to start. The retreat info call is always free.
          </p>
        </div>
      </section>

      {/* Step breadcrumb */}
      <div style={{ background:'var(--parchment-mid)', borderBottom:'1px solid var(--border)', padding:'1rem 0' }}>
        <div className="container">
          <div style={{ display:'flex', alignItems:'center', gap:'1.5rem' }}>
            {[['select','1','Choose Experience'],['calendar','2','Pick a Time'],['confirmed','3','Confirmed']].map(([s,n,label], i) => {
              const done    = ['select','calendar','confirmed'].indexOf(crumbStep) > i
              const current = crumbStep === s
              return (
                <div key={s} style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>
                  <div style={{ width:22, height:22, borderRadius:'50%', background: current||done ? 'var(--forest-600)' : 'var(--border-strong)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Inter,sans-serif', fontSize:'0.62rem', fontWeight:700, color:'white', flexShrink:0 }}>
                    {done ? '✓' : n}
                  </div>
                  <span style={{ fontFamily:'Inter,sans-serif', fontSize:'0.68rem', fontWeight:500, letterSpacing:'0.1em', textTransform:'uppercase', color: current ? 'var(--forest-700)' : 'var(--text-ghost)' }}>{label}</span>
                  {i < 2 && <div style={{ width:'2rem', height:'1px', background:'var(--border-strong)', marginLeft:'0.5rem' }}/>}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <section style={{ background:'var(--parchment)', padding:'4rem 0', minHeight:'70vh' }}>
        <div className="container">

          {/* ── STEP 1: Select ── */}
          {step === 'select' && (
            <div>
              <h2 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'1.8rem', fontWeight:300, color:'var(--forest-800)', marginBottom:'2rem' }}>
                What would you like to explore?
              </h2>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:'2px' }}>
                {display.map(svc => (
                  <button key={svc.id} onClick={() => choose(svc)} style={{ background:'white', border:'none', cursor:'pointer', padding:'2rem 2.5rem', textAlign:'left', borderLeft:'3px solid transparent', transition:'all 0.2s ease' }}
                    onMouseEnter={e => { e.currentTarget.style.borderLeftColor='var(--gold)'; e.currentTarget.style.background='var(--parchment-mid)' }}
                    onMouseLeave={e => { e.currentTarget.style.borderLeftColor='transparent'; e.currentTarget.style.background='white' }}
                  >
                    <div className="overline" style={{ marginBottom:'0.5rem' }}>{svc.category}</div>
                    <div style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'1.35rem', fontWeight:300, color:'var(--forest-800)', marginBottom:'0.5rem' }}>{svc.title}</div>
                    <p style={{ fontSize:'0.84rem', color:'var(--text-muted)', lineHeight:1.65, marginBottom:'1rem' }}>{svc.description}</p>
                    <div style={{ display:'flex', gap:'1.5rem' }}>
                      <span style={{ fontFamily:'Inter,sans-serif', fontSize:'0.72rem', color:'var(--forest-500)' }}>{svc.duration} min</span>
                      <span style={{ fontFamily:'Inter,sans-serif', fontSize:'0.72rem', fontWeight:600, color:'var(--gold-dark)' }}>
                        {priceLabel(svc)}
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              <div style={{ marginTop:'2rem', padding:'2rem 2.5rem', background:'var(--forest-50)', borderLeft:'3px solid var(--forest-300)', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'1rem' }}>
                <div>
                  <div style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'1.25rem', fontWeight:300, color:'var(--forest-800)', marginBottom:'0.3rem' }}>Not sure where to begin?</div>
                  <p style={{ fontSize:'0.84rem', color:'var(--text-muted)', margin:0 }}>Send a message and we'll find the right fit together.</p>
                </div>
                <div style={{ display:'flex', gap:'0.8rem' }}>
                  <button onClick={() => choose(display[display.length - 1])} className="btn btn-forest" style={{ fontSize:'0.62rem', padding:'0.65rem 1.2rem' }}>Free Info Call</button>
                  <Link href="/contact" className="btn btn-outline" style={{ fontSize:'0.62rem', padding:'0.65rem 1.2rem' }}>Message First</Link>
                </div>
              </div>

              <p style={{ fontFamily:'Inter,sans-serif', fontSize:'0.72rem', color:'var(--text-ghost)', marginTop:'1.5rem', lineHeight:1.6 }}>
                Bookings are powered by Cal.com with live availability. Set <code style={{ background:'var(--parchment-deep)', padding:'0 4px', fontSize:'0.7rem' }}>NEXT_PUBLIC_CAL_USERNAME</code> in your .env to activate the live calendar.
              </p>
            </div>
          )}

          {/* ── STEP 1b: Booking options (set by admin per service) ── */}
          {step === 'options' && selected && (
            <div style={{ maxWidth:'720px' }}>
              <button onClick={() => { setStep('select'); setSelected(null); setPicks({}) }} style={{ background:'none', border:'none', cursor:'pointer', fontFamily:'Inter,sans-serif', fontSize:'0.67rem', fontWeight:500, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--forest-500)', marginBottom:'2rem', padding:0 }}>
                ← Change experience
              </button>
              <div className="overline" style={{ marginBottom:'0.5rem' }}>{selected.category}</div>
              <h2 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'2rem', fontWeight:300, color:'var(--forest-800)', marginBottom:'0.6rem' }}>{selected.title}</h2>
              <p style={{ fontSize:'0.9rem', color:'var(--text-muted)', lineHeight:1.7, marginBottom:'2.2rem' }}>A couple of quick choices so we can set this up the right way.</p>

              {groupsOf(selected).map((g, gi) => (
                <div key={gi} style={{ marginBottom:'2rem' }}>
                  <div style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'1.3rem', fontWeight:400, color:'var(--forest-800)', marginBottom:'0.9rem' }}>{g.label}</div>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:'2px' }}>
                    {g.choices.map((c, ci) => {
                      const on = picks[gi] === ci
                      return (
                        <button key={ci} onClick={() => setPicks(p => ({ ...p, [gi]: ci }))}
                          style={{ textAlign:'left', cursor:'pointer', border:'none', padding:'1.2rem 1.4rem', background: on ? 'var(--forest-800)' : 'white', color: on ? 'var(--parchment)' : 'var(--forest-800)', borderLeft:`3px solid ${on ? 'var(--gold)' : 'transparent'}`, transition:'all 0.2s ease' }}>
                          <div style={{ fontFamily:'Inter,sans-serif', fontSize:'0.9rem', fontWeight:600 }}>{c.label}</div>
                          {c.description && <div style={{ fontFamily:'Inter,sans-serif', fontSize:'0.76rem', marginTop:'0.3rem', lineHeight:1.55, opacity:0.75 }}>{c.description}</div>}
                          {typeof c.price === 'number' && <div style={{ fontFamily:'Inter,sans-serif', fontSize:'0.72rem', marginTop:'0.4rem', fontWeight:600, color: on ? 'var(--gold-light)' : 'var(--gold-dark)' }}>From ${c.price}</div>}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}

              <div style={{ display:'flex', alignItems:'center', gap:'1.2rem', flexWrap:'wrap', marginTop:'0.5rem' }}>
                <button onClick={() => setStep('calendar')} disabled={!allAnswered} className="btn btn-forest" style={{ opacity: allAnswered ? 1 : 0.4, cursor: allAnswered ? 'pointer' : 'not-allowed' }}>
                  Continue to pick a time →
                </button>
                <span style={{ fontFamily:'Inter,sans-serif', fontSize:'0.78rem', color:'var(--gold-dark)', fontWeight:600 }}>{priceLabel(selected, pickedChoices)}</span>
              </div>
            </div>
          )}

          {/* ── STEP 2: Calendar ── */}
          {step === 'calendar' && selected && (
            <div>
              <button onClick={() => { if (groupsOf(selected).length) { setStep('options') } else { setStep('select'); setSelected(null) } }} style={{ background:'none', border:'none', cursor:'pointer', fontFamily:'Inter,sans-serif', fontSize:'0.67rem', fontWeight:500, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--forest-500)', padding:0, marginBottom:'2rem', display:'flex', alignItems:'center', gap:'0.4rem' }}>
                ← Change experience
              </button>

              <div className="nn-rg" style={{ display:'grid', gridTemplateColumns:'260px 1fr', gap:'3rem', alignItems:'start' }}>
                {/* Sidebar summary */}
                <div style={{ background:'var(--forest-800)', padding:'2rem', position:'sticky', top:'7rem' }}>
                  <div className="overline" style={{ color:'var(--gold-light)', marginBottom:'0.6rem' }}>{selected.category}</div>
                  <h3 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'1.4rem', fontWeight:200, color:'var(--parchment)', marginBottom:'0.8rem', lineHeight:1.25 }}>{selected.title}</h3>
                  <p style={{ color:'rgba(168,192,158,0.55)', fontSize:'0.82rem', lineHeight:1.7, marginBottom:'1.5rem' }}>{selected.description}</p>
                  <div style={{ borderTop:'1px solid rgba(92,122,82,0.2)', paddingTop:'1.2rem', display:'flex', flexDirection:'column', gap:'0.5rem', marginBottom:'1.2rem' }}>
                    {[['Duration',`${selected.duration} min`],...pickedChoices.map((c, i) => [groupsOf(selected)[i]?.label ?? 'Choice', c.label]),['Investment', priceLabel(selected, pickedChoices)]].map(([k,v]) => (
                      <div key={k} style={{ display:'flex', justifyContent:'space-between' }}>
                        <span style={{ fontFamily:'Inter,sans-serif', fontSize:'0.62rem', textTransform:'uppercase', letterSpacing:'0.1em', color:'var(--forest-300)' }}>{k}</span>
                        <span style={{ fontFamily:'Inter,sans-serif', fontSize:'0.82rem', color:'var(--parchment)', fontWeight: k==='Investment' ? 600 : 400 }}>{v}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ padding:'0.9rem', background:'rgba(61,82,50,0.3)', borderLeft:'2px solid var(--forest-400)' }}>
                    <p style={{ fontFamily:'Inter,sans-serif', fontSize:'0.72rem', color:'rgba(168,192,158,0.6)', margin:0, lineHeight:1.65 }}>
                      ✓ Auto-confirmed instantly<br/>✓ Calendar invite by email<br/>✓ Prep notes included
                    </p>
                  </div>
                </div>

                {/* Cal.com embed */}
                <div style={{ background:'white' }}>
                  <div style={{ padding:'1.5rem 2rem', borderBottom:'1px solid var(--border)' }}>
                    <h3 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'1.4rem', fontWeight:300, color:'var(--forest-800)' }}>Choose a date and time</h3>
                  </div>
                  <div style={{ padding:'1rem' }}>
                    <CalEmbed calSlug={effectiveCalSlug} notes={bookingNotes} onBooked={() => setStep('confirmed')} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 3: Confirmed ── */}
          {step === 'confirmed' && (
            <div style={{ textAlign:'center', padding:'5rem 2rem', maxWidth:'520px', margin:'0 auto' }}>
              <div style={{ fontFamily:'serif', fontSize:'3rem', color:'var(--gold)', marginBottom:'1.5rem' }}>◇</div>
              <h2 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'2.5rem', fontWeight:300, color:'var(--forest-800)', marginBottom:'1rem', lineHeight:1.15 }}>You're confirmed.</h2>
              <p style={{ fontSize:'1rem', color:'var(--text-body)', lineHeight:1.8, marginBottom:'0.8rem' }}>A calendar invite and session details have been sent to your email.</p>
              <p style={{ fontSize:'0.9rem', color:'var(--text-muted)', lineHeight:1.8, marginBottom:'2.5rem' }}>If you have any questions before your session, feel free to reach out.</p>
              <div style={{ display:'flex', gap:'1rem', justifyContent:'center', flexWrap:'wrap' }}>
                <Link href="/contact" className="btn btn-outline">Contact Us</Link>
                <Link href="/" className="btn btn-forest">Back to Home</Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
