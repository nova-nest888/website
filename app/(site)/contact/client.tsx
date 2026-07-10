'use client'
import { useState } from 'react'
import Link from 'next/link'

type Status = 'idle' | 'sending' | 'sent' | 'error'

export default function ContactClient() {
  const [form, setForm]   = useState({ name:'', email:'', phone:'', interest:'', how:'', message:'' })
  const [status, setStatus] = useState<Status>('idle')
  const [errMsg, setErrMsg] = useState('')

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const submit = async () => {
    setStatus('sending'); setErrMsg('')
    try {
      const res = await fetch('/api/contact', {
        method:'POST', headers:{ 'Content-Type':'application/json' },
        body: JSON.stringify(form),
      })
      const json = await res.json()
      if (!res.ok) { setErrMsg(json.error ?? 'Something went wrong'); setStatus('error'); return }
      setStatus('sent')
    } catch {
      setErrMsg('Network error — please try again or email directly.')
      setStatus('error')
    }
  }

  const canSubmit = form.name.length > 0 && form.email.length > 0 && form.message.length >= 10

  return (
    <>
      <section style={{ paddingTop:'9rem', paddingBottom:'5rem', background:'var(--forest-900)', position:'relative', overflow:'hidden' }}>
        <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', opacity:0.07 }} viewBox="0 0 1440 400" preserveAspectRatio="xMidYMid slice">
          <path d="M0 400 Q360 180 720 260 Q1080 80 1440 180 L1440 400Z" fill="var(--forest-500)"/>
        </svg>
        <div className="container" style={{ position:'relative', zIndex:2 }}>
          <div className="overline" style={{ color:'var(--gold-light)' }}>Get in Touch</div>
          <div className="rule" style={{ background:'var(--gold)' }}/>
          <h1 className="headline" style={{ color:'var(--parchment)', marginBottom:'1rem' }}>Contact</h1>
          <p style={{ color:'rgba(168,192,158,0.62)', maxWidth:'460px', fontSize:'1.05rem' }}>No wrong questions here. Curious about a hike, planning a retreat for your team, or just want to know if this is your kind of thing — say hello.</p>
        </div>
      </section>

      <section style={{ background:'var(--parchment)', padding:'6rem 0' }}>
        <div className="container">
          <div className="nn-rg" style={{ display:'grid', gridTemplateColumns:'1fr 1.5fr', gap:'5rem', alignItems:'start' }}>

            {/* Info */}
            <div>
              <h2 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'1.8rem', fontWeight:300, color:'var(--forest-800)', marginBottom:'2rem', lineHeight:1.3 }}>
                There's no wrong place to start.
              </h2>
              {[
                { label:'Instagram',          value:'@novanest_777',          href:'https://instagram.com/novanest_777' },
                { label:'Email',              value:'***YOUR EMAIL***',        href:null },
                { label:'Phone / WhatsApp',   value:'***YOUR PHONE***',        href:null },
                { label:'Location',           value:'***YOUR CITY, COUNTRY***',href:null },
                { label:'Gatherings',         value:'***In-person · Virtual · Both?***', href:null },
              ].map(item => (
                <div key={item.label} style={{ marginBottom:'1.5rem', paddingBottom:'1.5rem', borderBottom:'1px solid var(--border)' }}>
                  <div className="overline" style={{ marginBottom:'0.3rem' }}>{item.label}</div>
                  {item.href
                    ? <a href={item.href} target="_blank" rel="noopener" style={{ fontFamily:'Inter,sans-serif', fontSize:'0.92rem', color:'var(--forest-600)', textDecoration:'none', fontWeight:500 }}>{item.value}</a>
                    : <div style={{ fontFamily:'Inter,sans-serif', fontSize:'0.92rem', color:'var(--text-body)' }}>{item.value}</div>
                  }
                </div>
              ))}

              <div style={{ background:'var(--parchment-mid)', padding:'1.5rem', borderLeft:'3px solid var(--gold)', marginTop:'0.5rem' }}>
                <div style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'1.1rem', fontStyle:'italic', color:'var(--forest-700)', marginBottom:'0.8rem' }}>Ready to book directly?</div>
                <Link href="/book" className="btn btn-forest" style={{ fontSize:'0.62rem', padding:'0.65rem 1.2rem' }}>Go to Booking</Link>
              </div>
            </div>

            {/* Form */}
            <div style={{ background:'white', padding:'3rem' }}>
              {status === 'sent' ? (
                <div style={{ textAlign:'center', padding:'3rem 0' }}>
                  <div style={{ fontFamily:'serif', fontSize:'2.5rem', color:'var(--gold)', marginBottom:'1rem' }}>◇</div>
                  <h3 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'1.8rem', fontWeight:300, color:'var(--forest-800)', marginBottom:'0.8rem' }}>Message received.</h3>
                  <p style={{ fontSize:'0.9rem', color:'var(--text-body)', lineHeight:1.75, maxWidth:'300px', margin:'0 auto 2rem' }}>
                    We'll get back to you within 1–2 business days. You'll also receive a confirmation email.
                  </p>
                  <Link href="/offerings" className="btn btn-outline">Explore Experiences</Link>
                </div>
              ) : (
                <div style={{ display:'flex', flexDirection:'column', gap:'1.4rem' }}>
                  <h3 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'1.5rem', fontWeight:300, color:'var(--forest-800)', marginBottom:'0.2rem' }}>Send a message</h3>

                  <div className="nn-rg-sm" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
                    <div>
                      <label className="field-label">Your Name *</label>
                      <input type="text" value={form.name} onChange={e=>set('name',e.target.value)} className="field-input" placeholder="How should I address you?"/>
                    </div>
                    <div>
                      <label className="field-label">Email *</label>
                      <input type="email" value={form.email} onChange={e=>set('email',e.target.value)} className="field-input" placeholder="Where should I write back?"/>
                    </div>
                  </div>

                  <div className="nn-rg-sm" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
                    <div>
                      <label className="field-label">Phone (optional)</label>
                      <input type="tel" value={form.phone} onChange={e=>set('phone',e.target.value)} className="field-input" placeholder="WhatsApp / phone"/>
                    </div>
                    <div>
                      <label className="field-label">Interested in</label>
                      <select value={form.interest} onChange={e=>set('interest',e.target.value)} className="field-input" style={{ cursor:'pointer' }}>
                        <option value="">Select...</option>
                        {['Nature Experiences','Movement & Expression','Deep Relaxation & Presence','Growth & Leadership Workshops','Retreats & Immersive Experiences','Corporate / Team Retreat','Just exploring'].map(o=><option key={o}>{o}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="field-label">How did you find us?</label>
                    <select value={form.how} onChange={e=>set('how',e.target.value)} className="field-input" style={{ cursor:'pointer' }}>
                      <option value="">Select...</option>
                      {['Instagram (@novanest_777)','A friend','Google search','Event or retreat','Other'].map(o=><option key={o}>{o}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="field-label">Your message *</label>
                    <textarea value={form.message} onChange={e=>set('message',e.target.value)} rows={5} className="field-input" style={{ resize:'vertical' }} placeholder="What's on your mind? What are you hoping for?"/>
                    <div style={{ fontFamily:'Inter,sans-serif', fontSize:'0.62rem', color:'var(--text-ghost)', marginTop:'0.3rem' }}>{form.message.length} / 2000</div>
                  </div>

                  {status === 'error' && (
                    <div style={{ padding:'0.8rem 1rem', background:'#fef2f2', border:'1px solid #fecaca', fontFamily:'Inter,sans-serif', fontSize:'0.8rem', color:'#c0392b' }}>
                      {errMsg || 'Something went wrong. Please try again.'}
                    </div>
                  )}

                  <button onClick={submit} disabled={!canSubmit || status === 'sending'} className="btn btn-forest" style={{ justifyContent:'center', opacity: canSubmit ? 1 : 0.4, cursor: canSubmit ? 'pointer' : 'not-allowed' }}>
                    {status === 'sending' ? 'Sending…' : 'Send Message'}
                  </button>

                  <p style={{ fontFamily:'Inter,sans-serif', fontSize:'0.7rem', color:'var(--text-ghost)', textAlign:'center', lineHeight:1.6 }}>
                    You'll receive a confirmation email automatically. We typically respond within 1–2 business days.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
