'use client'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import RevealWrapper from '@/components/ui/RevealWrapper'
import type { TestimonialDoc } from '@/types'
import { uploadToCloudinary } from '@/lib/cloudinary'
import { saveSiteImage } from '@/lib/saveSiteImage'

const FALLBACK_TESTIMONIALS = [
  { id:'1', name:'Sarah M.',  role:'Sunrise Hike',    content:"I went because a coworker dragged me. I stayed because I made three friends before we even reached the top." },
  { id:'2', name:'Ravi K.',   role:'Friday Circle', content:"First time in years I laughed that hard with people I'd met an hour earlier. Didn't see that coming." },
  { id:'3', name:'Emma L.',   role:'Weekend Retreat',  content:"Our team hadn't actually talked — not about anything real — in over a year. This retreat cracked that open in a day." },
]

// Shown until an admin uploads a real photo from a NovaNest gathering.
// Verified working, free-to-use, no attribution required (Unsplash License).
// Green forest tones so it blends with the dark overlay rather than fighting it.
const DEFAULT_HERO_IMAGE = 'https://images.unsplash.com/photo-1520274908385-1f57e1bd43b5?fm=jpg&q=80&w=2400&auto=format&fit=crop'

export default function HomeClient({ testimonials, siteImages }: { testimonials: TestimonialDoc[]; siteImages: Record<string, string> }) {
  const [heroImg, setHeroImg]   = useState<string | null>(siteImages['hero'] ?? DEFAULT_HERO_IMAGE)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const { data: session } = useSession()
  const isAdmin = !!session
  const showTestimonials = testimonials.length > 0 ? testimonials : FALLBACK_TESTIMONIALS

  const handleHeroFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''
    const localPreview = URL.createObjectURL(file)
    setHeroImg(localPreview)
    setUploadError('')
    setUploading(true)
    try {
      const { url } = await uploadToCloudinary(file)
      setHeroImg(url)
      await saveSiteImage('hero', url)
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed.')
      setHeroImg(siteImages['hero'] ?? DEFAULT_HERO_IMAGE)
    } finally {
      setUploading(false)
    }
  }

  return (
    <>
      {/* ── HERO ── */}
      <section style={{ minHeight:'100vh', background:'var(--forest-900)', position:'relative', display:'flex', alignItems:'center', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0 }}>
          {heroImg
            ? <img src={heroImg} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', mixBlendMode:'luminosity', opacity:0.55 }} onError={() => setHeroImg(null)}/>
            : (
              <svg style={{ width:'100%', height:'100%', position:'absolute' }} viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
                <defs>
                  <linearGradient id="skyG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1C2B1A"/>
                    <stop offset="100%" stopColor="#3D5232"/>
                  </linearGradient>
                </defs>
                <rect width="1440" height="900" fill="url(#skyG)"/>
                <path d="M0 600 Q360 350 720 450 Q1080 280 1440 380 L1440 900 L0 900Z" fill="#253322" opacity="0.8"/>
                <path d="M0 680 Q240 480 480 560 Q720 400 960 500 Q1200 340 1440 420 L1440 900 L0 900Z" fill="#1C2B1A" opacity="0.9"/>
                {[30,80,140,220,310,1120,1200,1270,1340,1400].map((x,i) => (
                  <path key={i} d={`M${x} 900 L${x+15} ${580+i*12} Q${x+22} ${520+i*10} ${x+30} ${580+i*12} L${x+45} 900Z`} fill={i%2===0?'#1C2B1A':'#253322'}/>
                ))}
                <ellipse cx="720" cy="820" rx="1000" ry="160" fill="#3D5232" opacity="0.12"/>
              </svg>
            )
          }
          <div style={{ position:'absolute', inset:0, background: heroImg ? 'linear-gradient(to bottom,rgba(28,43,26,0.72) 0%,rgba(28,43,26,0.5) 40%,rgba(28,43,26,0.82) 100%)' : 'linear-gradient(to bottom,rgba(28,43,26,0.5) 0%,rgba(28,43,26,0.2) 50%,rgba(28,43,26,0.7) 100%)' }}/>
        </div>

        {isAdmin && (
          <div style={{ position:'absolute', top:'5.5rem', right:'2rem', zIndex:10, display:'flex', flexDirection:'column', alignItems:'flex-end', gap:'0.4rem' }}>
            <label style={{ background:'rgba(28,43,26,0.55)', backdropFilter:'blur(8px)', border:'1px solid rgba(200,217,195,0.2)', color:'rgba(200,217,195,0.65)', fontFamily:'Inter,sans-serif', fontSize:'0.58rem', fontWeight:600, letterSpacing:'0.14em', textTransform:'uppercase', padding:'0.45rem 0.85rem', cursor: uploading ? 'default' : 'pointer', display:'flex', alignItems:'center', gap:'0.4rem', opacity: uploading ? 0.6 : 1 }}>
              <input type="file" accept="image/*" style={{ display:'none' }} onChange={handleHeroFile} disabled={uploading}/>
              {uploading ? 'Uploading…' : '↑ Change Hero Image'}
            </label>
            {uploadError && (
              <div style={{ maxWidth:'220px', background:'rgba(192,57,43,0.85)', color:'white', fontFamily:'Inter,sans-serif', fontSize:'0.62rem', padding:'0.5rem 0.7rem', lineHeight:1.5 }}>
                {uploadError}
              </div>
            )}
          </div>
        )}

        <div className="container" style={{ position:'relative', zIndex:5, paddingTop:'7rem', paddingBottom:'6rem' }}>
          <div style={{ maxWidth:'800px' }}>
            <div className="overline" style={{ color:'var(--gold-light)', marginBottom:'1.8rem', animation:'fadeUp 0.8s ease both' }}>A New Way of Living</div>
            <h1 className="display" style={{ color:'var(--parchment)', marginBottom:'1.5rem', animation:'fadeUp 0.8s 0.1s ease both' }}>
              What if clarity lives<br/>somewhere between<br/><em style={{ color:'var(--forest-200)' }}>laughter and nature?</em>
            </h1>
            <p style={{ color:'rgba(200,217,195,0.72)', fontSize:'1.08rem', lineHeight:1.8, maxWidth:'500px', marginBottom:'2.8rem', fontFamily:'Inter,sans-serif', animation:'fadeUp 0.8s 0.2s ease both' }}>
              NovaNest is a community-driven experience company — weekly gatherings, outdoor adventures, creative workshops, and retreats for people who think growth shouldn't feel like homework.
            </p>
            <div style={{ display:'flex', gap:'1rem', flexWrap:'wrap', animation:'fadeUp 0.8s 0.3s ease both' }}>
              <Link href="/book" className="btn btn-parchment">Join an Experience</Link>
              <Link href="/offerings" className="btn btn-light">See What We Do</Link>
            </div>
          </div>
        </div>

        <div style={{ position:'absolute', bottom:'2.5rem', left:'50%', transform:'translateX(-50%)', textAlign:'center', zIndex:5 }}>
          <div style={{ fontFamily:'Inter,sans-serif', fontSize:'0.52rem', letterSpacing:'0.22em', textTransform:'uppercase', color:'rgba(200,217,195,0.35)', marginBottom:'0.6rem' }}>Scroll</div>
          <div style={{ width:'1px', height:'2.5rem', background:'linear-gradient(to bottom,rgba(200,217,195,0.4),transparent)', margin:'0 auto', animation:'breathe 2s ease-in-out infinite' }}/>
        </div>
      </section>

      {/* ── WHAT HAPPENS HERE — different layout, no wave SVG ── */}
      <section style={{ background:'var(--parchment)', padding:'8rem 0' }}>
        <div className="container">
          {/* Deliberately asymmetric — text takes more space than usual */}
          <div className="nn-rg" style={{ display:'grid', gridTemplateColumns:'1.4fr 1fr', gap:'7rem', alignItems:'start' }}>
            <RevealWrapper>
              <p style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'clamp(1.5rem,3vw,2.2rem)', fontWeight:300, color:'var(--forest-700)', lineHeight:1.5, marginBottom:'2rem', fontStyle:'italic' }}>
                "Growth doesn't have to be serious."
              </p>
              <p style={{ marginBottom:'1.2rem', fontSize:'1rem' }}>
                That's the whole idea behind NovaNest. We're not a wellness brand and we're definitely not a retreat centre with a strict schedule and a bell you have to sit still for. We're a community that gathers — in forests, on hikes, in living rooms turned dance floors — because we think people find themselves faster in motion than in silence.
              </p>
              <p style={{ marginBottom:'2.5rem', color:'var(--text-muted)', fontSize:'0.95rem', lineHeight:1.85 }}>
                Most people who show up to a NovaNest gathering aren't in crisis. They're just tired — of routine, of small talk that goes nowhere, of being told that becoming a better version of yourself has to hurt a little first. So we built something that doesn't ask you to hurt first.
              </p>
              <Link href="/about" className="btn btn-outline">Read our story</Link>
            </RevealWrapper>

            {/* Right column — deliberate uneven list, not 4 perfect items */}
            <RevealWrapper delay={140}>
              <div style={{ paddingTop:'1rem' }}>
                <div style={{ fontFamily:'Inter,sans-serif', fontSize:'0.62rem', fontWeight:600, letterSpacing:'0.2em', textTransform:'uppercase', color:'var(--text-ghost)', marginBottom:'2rem' }}>
                  What actually happens here
                </div>
                {[
                  { heading:'You show up a stranger, you leave with someone\'s number.', body:'Most people arrive knowing exactly one person, or nobody. By the end of a hike or a Friday circle, that\'s rarely still true.' },
                  { heading:'You get outside without it being a whole production.', body:'No 10-day silent retreat required. Just a trail, a fire, a Sunday morning — done with other people instead of alone.' },
                  { heading:'You learn something real about yourself, minus the whiteboard.', body:'Our workshops borrow from actual psychology and neuroscience, but they\'re built around doing things, not sitting through slides about them.' },
                  { heading:'You laugh more than you planned to.', body:'That\'s not a side effect — it\'s kind of the point. Some of the clearest thinking happens mid-laugh, not mid-lecture.' },
                ].map((item, i) => (
                  <div key={i} style={{ marginBottom:'2rem', paddingBottom:'2rem', borderBottom: i < 3 ? '1px solid var(--border)' : 'none' }}>
                    <div style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'1.15rem', fontWeight:400, color:'var(--forest-700)', marginBottom:'0.4rem', lineHeight:1.3 }}>
                      {item.heading}
                    </div>
                    <p style={{ fontSize:'0.87rem', color:'var(--text-muted)', margin:0, lineHeight:1.75 }}>{item.body}</p>
                  </div>
                ))}
              </div>
            </RevealWrapper>
          </div>
        </div>
      </section>

      {/* ── EXPECT STRIP — horizontal scroll feeling, not a grid ── */}
      <section style={{ background:'var(--forest-800)', padding:'5rem 0', overflow:'hidden' }}>
        <div className="container">
          {/* Label sits above — no overline treatment */}
          <div style={{ fontFamily:'Inter,sans-serif', fontSize:'0.6rem', fontWeight:600, letterSpacing:'0.25em', textTransform:'uppercase', color:'rgba(168,192,158,0.4)', marginBottom:'3.5rem' }}>
            Expect
          </div>
          {/* Intentionally 3 + 1 layout — not a perfect 4 grid */}
          <div className="nn-rg3" style={{ display:'grid', gridTemplateColumns:'1.5fr 1fr 1fr', gap:'0' }}>
            {[
              { icon: (
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22c0-5 0-9 2-12 2-3 5-4 8-4 0 3-1 6-4 8-3 2-6 2-6 2"/>
                    <path d="M12 22c0-4 0-7-1.5-9.5C9 10 6.5 9 4 9c0 2.5.5 5 3 6.5S12 17 12 17"/>
                  </svg>
                ), t:'Nature', d:'meets growth.' },
              { icon: (
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="15.5" cy="4.5" r="1.7"/>
                    <path d="M13 8l2 2 3-1.5M15 10l-1 4-3 2 1 5M15 10l3 1 2 4M11 14L7 15l-1 5"/>
                  </svg>
                ), t:'Movement', d:'meets mindfulness.' },
              { icon: (
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 3a3.5 3.5 0 0 0-3.5 3.5c0 .5.1 1 .3 1.4A3 3 0 0 0 4 10.5a3 3 0 0 0 1.7 2.7A3.5 3.5 0 0 0 9 18a3.5 3.5 0 0 0 3.5-3.5v-8A3.5 3.5 0 0 0 9 3Z"/>
                    <path d="M15 3a3.5 3.5 0 0 1 3.5 3.5c0 .5-.1 1-.3 1.4A3 3 0 0 1 20 10.5a3 3 0 0 1-1.7 2.7A3.5 3.5 0 0 1 15 18a3.5 3.5 0 0 1-3.5-3.5v-8A3.5 3.5 0 0 1 15 3Z"/>
                  </svg>
                ), t:'Science', d:'meets self-discovery.' },
            ].map((item, i) => (
              <RevealWrapper key={i} delay={i*80}>
                <div className="nn-rg3-item" style={{ borderLeft: i > 0 ? '1px solid rgba(92,122,82,0.2)' : 'none', padding: i===0 ? '2rem 3rem 2rem 0' : '2rem 2.5rem' }}>
                  <div style={{ color:'var(--gold-light)', marginBottom:'1rem' }}>{item.icon}</div>
                  <div style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'1.3rem', fontWeight:400, color:'var(--parchment)', marginBottom:'0.4rem' }}>{item.t}</div>
                  <p style={{ color:'rgba(168,192,158,0.55)', fontSize:'0.82rem', margin:0, lineHeight:1.7 }}>{item.d}</p>
                </div>
              </RevealWrapper>
            ))}
          </div>
          {/* Fourth item sits below, different weight */}
          <RevealWrapper delay={300}>
            <div style={{ borderTop:'1px solid rgba(92,122,82,0.2)', marginTop:'2rem', paddingTop:'2rem', display:'flex', alignItems:'center', gap:'1.5rem' }}>
              <span style={{ fontSize:'1.2rem' }}>✦</span>
              <div>
                <span style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'1.2rem', fontWeight:400, fontStyle:'italic', color:'var(--forest-200)' }}>Strangers become community </span>
                <span style={{ fontFamily:'Inter,sans-serif', fontSize:'0.9rem', color:'rgba(168,192,158,0.55)' }}>— and fun meets reflection.</span>
              </div>
            </div>
          </RevealWrapper>
        </div>
      </section>

      {/* ── OFFERINGS — no grid symmetry, card sizes vary ── */}
      <section style={{ background:'var(--parchment-mid)', padding:'8rem 0' }}>
        <div className="container">
          <RevealWrapper>
            <div style={{ marginBottom:'4rem', display:'flex', justifyContent:'space-between', alignItems:'flex-end', flexWrap:'wrap', gap:'1rem' }}>
              <div>
                <h2 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'clamp(2rem,4vw,3rem)', fontWeight:300, color:'var(--forest-800)', lineHeight:1.1 }}>
                  Ways to join in
                </h2>
              </div>
              <Link href="/offerings" style={{ fontFamily:'Inter,sans-serif', fontSize:'0.68rem', fontWeight:500, letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--forest-500)', textDecoration:'none' }}>
                See all experiences →
              </Link>
            </div>
          </RevealWrapper>

          {/* Intentionally asymmetric layout — one large + two small */}
          <div className="nn-rg" style={{ display:'grid', gridTemplateColumns:'1.4fr 1fr', gap:'2px', marginBottom:'2px' }}>
            <RevealWrapper>
              <div style={{ background:'var(--forest-700)', padding:'3.5rem', height:'100%' }}>
                <div style={{ fontFamily:'Inter,sans-serif', fontSize:'0.6rem', fontWeight:600, letterSpacing:'0.18em', textTransform:'uppercase', color:'rgba(200,217,195,0.4)', marginBottom:'1.2rem' }}>Nature</div>
                <h3 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'2rem', fontWeight:300, color:'var(--parchment)', marginBottom:'1.2rem', lineHeight:1.15 }}>Nature Experiences</h3>
                <p style={{ color:'rgba(200,217,195,0.65)', fontSize:'0.92rem', lineHeight:1.8, marginBottom:'2rem' }}>
                  Guided hikes, nature walks, and outdoor reflection sessions built around noticing the things you don't notice indoors. We also run regular community gatherings outdoors — the best conversations tend to happen when nobody's trying to have one.
                </p>
                <Link href="/book" className="btn btn-light" style={{ fontSize:'0.62rem' }}>Book this</Link>
              </div>
            </RevealWrapper>

            <div style={{ display:'flex', flexDirection:'column', gap:'2px' }}>
              <RevealWrapper delay={80}>
                <div style={{ background:'var(--parchment)', padding:'2.5rem', flex:1 }}>
                  <div style={{ fontFamily:'Inter,sans-serif', fontSize:'0.6rem', fontWeight:600, letterSpacing:'0.18em', textTransform:'uppercase', color:'var(--text-ghost)', marginBottom:'0.8rem' }}>Presence</div>
                  <h3 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'1.5rem', fontWeight:300, color:'var(--forest-800)', marginBottom:'0.6rem' }}>Sound &amp; Breathwork</h3>
                  <p style={{ fontSize:'0.87rem', color:'var(--text-body)', lineHeight:1.75 }}>Sound healing and breathwork sessions for minds that don't slow down just because someone told them to relax.</p>
                </div>
              </RevealWrapper>
              <RevealWrapper delay={140}>
                <div style={{ background:'var(--forest-50)', padding:'2.5rem', flex:1 }}>
                  <div style={{ fontFamily:'Inter,sans-serif', fontSize:'0.6rem', fontWeight:600, letterSpacing:'0.18em', textTransform:'uppercase', color:'var(--text-ghost)', marginBottom:'0.8rem' }}>Movement</div>
                  <h3 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'1.5rem', fontWeight:300, color:'var(--forest-800)', marginBottom:'0.6rem' }}>Movement &amp; Expression</h3>
                  <p style={{ fontSize:'0.87rem', color:'var(--text-body)', lineHeight:1.75 }}>Somatic sessions, free-form dance, and playful group activities. No steps to learn, no mirrors to check yourself in.</p>
                </div>
              </RevealWrapper>
            </div>
          </div>

          {/* Second row — 3 equal */}
          <div className="nn-rg3" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'2px' }}>
            {[
              { cat:'Growth', t:'Leadership Workshops', d:'Interactive sessions grounded in real psychology and neuroscience — for individuals and teams who learn by doing, not by sitting through slides.' },
              { cat:'Immersion',  t:'Retreats',        d:'Weekend retreats, nature retreats, and fully customized team retreats. The thing people keep coming back to, years later.' },
              { cat:'Community', t:'Weekly Gatherings',   d:'Regular hikes, circles, and community events. The easiest way to meet people who feel like your people.' },
            ].map((o, i) => (
              <RevealWrapper key={i} delay={i*70}>
                <div style={{ background:'var(--parchment)', padding:'2.5rem', height:'100%', borderLeft:'3px solid transparent', transition:'border-color 0.25s ease' }}
                  onMouseEnter={e => (e.currentTarget.style.borderLeftColor='var(--gold)')}
                  onMouseLeave={e => (e.currentTarget.style.borderLeftColor='transparent')}
                >
                  <div style={{ fontFamily:'Inter,sans-serif', fontSize:'0.6rem', fontWeight:600, letterSpacing:'0.18em', textTransform:'uppercase', color:'var(--text-ghost)', marginBottom:'0.8rem' }}>{o.cat}</div>
                  <h3 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'1.45rem', fontWeight:300, color:'var(--forest-800)', marginBottom:'0.8rem' }}>{o.t}</h3>
                  <p style={{ fontSize:'0.87rem', color:'var(--text-body)', lineHeight:1.75 }}>{o.d}</p>
                </div>
              </RevealWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS — different frame, not cards in a grid ── */}
      <section style={{ background:'var(--parchment)', padding:'8rem 0' }}>
        <div className="container">
          <RevealWrapper>
            <div style={{ marginBottom:'5rem' }}>
              <div style={{ fontFamily:'Inter,sans-serif', fontSize:'0.62rem', fontWeight:600, letterSpacing:'0.2em', textTransform:'uppercase', color:'var(--text-ghost)', marginBottom:'1.5rem' }}>
                What people say
              </div>
              <h2 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'clamp(1.6rem,3.5vw,2.8rem)', fontWeight:300, color:'var(--forest-700)', maxWidth:'540px', lineHeight:1.25 }}>
                The thing about NovaNest is what people <em>take home.</em>
              </h2>
              <p style={{ fontFamily:'Inter,sans-serif', fontSize:'0.9rem', color:'var(--text-muted)', maxWidth:'480px', marginTop:'1rem', lineHeight:1.7 }}>
                Not a certificate. Usually a phone number, a memory, or a sentence they keep repeating to themselves weeks later.
              </p>
            </div>
          </RevealWrapper>

          {/* Stacked, not grid — more like quotes in a magazine */}
          {showTestimonials.map((t: any, i: number) => (
            <RevealWrapper key={t.id ?? i} delay={i*80}>
              <div className="nn-rg" style={{
                display:'grid',
                gridTemplateColumns: i % 2 === 0 ? '2fr 1fr' : '1fr 2fr',
                gap:'4rem',
                alignItems:'center',
                padding:'4rem 0',
                borderBottom: i < showTestimonials.length - 1 ? '1px solid var(--border)' : 'none',
              }}>
                <div style={{ order: i % 2 === 0 ? 0 : 1 }}>
                  <p style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'clamp(1.3rem,2.5vw,1.8rem)', fontWeight:300, fontStyle:'italic', color:'var(--forest-800)', lineHeight:1.5, marginBottom:'1.5rem' }}>
                    "{t.content}"
                  </p>
                  <div style={{ fontFamily:'Inter,sans-serif', fontSize:'0.78rem', fontWeight:600, color:'var(--text-primary)' }}>{t.name}</div>
                  {t.role && <div style={{ fontFamily:'Inter,sans-serif', fontSize:'0.7rem', color:'var(--text-muted)', marginTop:'0.2rem' }}>{t.role}</div>}
                </div>
                {/* Empty column creates visual breathing room — intentional */}
                <div style={{ order: i % 2 === 0 ? 1 : 0 }} />
              </div>
            </RevealWrapper>
          ))}
        </div>
      </section>

      {/* ── CTA — plain, no decorative circles or SVGs ── */}
      <section style={{ background:'var(--forest-800)', padding:'9rem 0' }}>
        <div className="container">
          <RevealWrapper>
            <div style={{ maxWidth:'640px' }}>
              <h2 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'clamp(2rem,4.5vw,3.5rem)', fontWeight:300, color:'var(--parchment)', lineHeight:1.1, marginBottom:'1.5rem' }}>
                Ready to try<br/>
                <em style={{ color:'var(--forest-200)' }}>a new way of living?</em>
              </h2>
              <p style={{ color:'rgba(200,217,195,0.6)', fontSize:'1rem', lineHeight:1.8, maxWidth:'440px', marginBottom:'2.5rem' }}>
                No experience needed, no gear list, no personality type required. Just show up — the rest tends to sort itself out.
              </p>
              <div style={{ display:'flex', gap:'1rem', flexWrap:'wrap' }}>
                <Link href="/book" className="btn btn-parchment">Reserve Your Spot</Link>
                <Link href="/contact" className="btn btn-light">Ask a Question First</Link>
              </div>
            </div>
          </RevealWrapper>
        </div>
      </section>
    </>
  )
}
