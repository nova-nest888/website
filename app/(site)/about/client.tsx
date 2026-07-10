'use client'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import RevealWrapper from '@/components/ui/RevealWrapper'
import ImageUpload from '@/components/ui/ImageUpload'
import { saveSiteImage } from '@/lib/saveSiteImage'

export default function AboutClient({ siteImages }: { siteImages: Record<string, string> }) {
  const [portrait, setPortrait] = useState<string | null>(siteImages['about-portrait'] ?? null)
  const { data: session } = useSession()
  const isAdmin = !!session

  const handlePortraitChange = (url: string) => {
    setPortrait(url)
    saveSiteImage('about-portrait', url)
  }

  return (
    <>
      {/* Header — no wave SVG, just type against dark */}
      <section style={{ paddingTop:'10rem', paddingBottom:'5rem', background:'var(--forest-900)' }}>
        <div className="container">
          <div className="nn-rg" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'5rem', alignItems:'end' }}>
            <div>
              <div style={{ fontFamily:'Inter,sans-serif', fontSize:'0.6rem', fontWeight:600, letterSpacing:'0.22em', textTransform:'uppercase', color:'rgba(168,192,158,0.4)', marginBottom:'2rem' }}>
                How it started
              </div>
              <h1 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'clamp(2.6rem,6vw,5rem)', fontWeight:300, color:'var(--parchment)', lineHeight:1.05, letterSpacing:'-0.02em' }}>
                A backyard, eleven<br/>people, and a very<br/>ordinary Tuesday.
              </h1>
            </div>
            <div style={{ paddingBottom:'0.5rem' }}>
              <p style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'1.2rem', fontWeight:300, fontStyle:'italic', color:'rgba(200,217,195,0.65)', lineHeight:1.7 }}>
                "We didn't set out to build a company. We just wanted our Tuesdays back."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bio — portrait on right, text left. Classic, not trendy. */}
      <section style={{ background:'var(--parchment)', padding:'7rem 0' }}>
        <div className="container">
          <div className="nn-rg" style={{ display:'grid', gridTemplateColumns:'1fr 400px', gap:'6rem', alignItems:'start' }}>
            <div>
              <RevealWrapper>
                <div style={{ fontFamily:'Inter,sans-serif', fontSize:'0.6rem', fontWeight:600, letterSpacing:'0.2em', textTransform:'uppercase', color:'var(--text-ghost)', marginBottom:'0.5rem' }}>
                  Our story
                </div>
                <p style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'1.5rem', fontWeight:300, color:'var(--forest-700)', lineHeight:1.5, marginBottom:'2rem', fontStyle:'italic' }}>
                  "What if clarity lives somewhere between laughter, connection, and nature?"
                </p>
                <p style={{ fontSize:'0.97rem', lineHeight:1.9, marginBottom:'1.5rem' }}>
                  NovaNest started as nothing official — a handful of friends who were burnt out on the same things: back-to-back meetings, feeds that made everyone feel worse, and the quiet loneliness of being "fine" all the time. One of us suggested a Saturday hike instead of another brunch where nobody says anything real. Eleven people showed up. Something about being outside, moving, without an agenda, made people actually talk to each other.
                </p>
                <p style={{ fontSize:'0.97rem', lineHeight:1.9, marginBottom:'1.5rem', color:'var(--text-body)' }}>
                  We kept doing it. A hike became a Tuesday circle. A circle became a workshop. A workshop became a retreat somebody's company asked us to run for their whole team. Nobody planned this out on a whiteboard — we just kept saying yes to whatever made people feel more like themselves, and less like they were performing wellness for an audience.
                </p>
                <p style={{ fontSize:'0.97rem', lineHeight:1.9, marginBottom:'2.5rem', color:'var(--text-body)' }}>
                  Today NovaNest is a community-driven experience company, but the instinct hasn't changed: growth doesn't have to be serious to be real. No boring lectures, no pressure to become someone else — just experiences that help people slow down, laugh more, and feel more like themselves.
                </p>
                <div style={{ display:'flex', gap:'1rem', flexWrap:'wrap' }}>
                  <Link href="/book" className="btn btn-forest">Join an experience</Link>
                  <Link href="/contact" className="btn btn-outline">Say hi</Link>
                </div>
              </RevealWrapper>
            </div>

            {/* Portrait — right column */}
            <RevealWrapper delay={160}>
              <div>
                {isAdmin ? (
                  <ImageUpload
                    value={portrait}
                    onChange={handlePortraitChange}
                    aspectRatio="3/4"
                    label="Upload a photo from a gathering"
                  />
                ) : (
                  portrait
                    ? <img src={portrait} alt="Portrait" style={{ width:'100%', aspectRatio:'3/4', objectFit:'cover', display:'block' }}/>
                    : (
                      <div style={{ aspectRatio:'3/4', background:'linear-gradient(160deg,var(--parchment-deep),var(--forest-100))', display:'flex', alignItems:'center', justifyContent:'center' }}>
                        <div style={{ textAlign:'center', padding:'2rem' }}>
                          <div style={{ fontFamily:'Inter,sans-serif', fontSize:'0.6rem', fontWeight:600, letterSpacing:'0.14em', textTransform:'uppercase', color:'var(--forest-400)', marginBottom:'0.4rem' }}>Photo coming</div>
                        </div>
                      </div>
                    )
                )}
                {/* Caption sits under the photo, not in a box */}
                <div style={{ marginTop:'1rem', fontFamily:'Inter,sans-serif', fontSize:'0.72rem', color:'var(--text-ghost)', fontStyle:'italic' }}>
                  Growth doesn't have to be serious.
                </div>
              </div>
            </RevealWrapper>
          </div>
        </div>
      </section>

      {/* The three pillars — different treatment. Not cards, more like a page of a book. */}
      <section style={{ background:'var(--forest-900)', padding:'8rem 0' }}>
        <div className="container" style={{ maxWidth:'900px' }}>
          <RevealWrapper>
            <div style={{ marginBottom:'4rem' }}>
              <div style={{ fontFamily:'Inter,sans-serif', fontSize:'0.6rem', fontWeight:600, letterSpacing:'0.2em', textTransform:'uppercase', color:'rgba(168,192,158,0.35)', marginBottom:'1rem' }}>
                What NovaNest is built on
              </div>
              <h2 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'2.5rem', fontWeight:300, color:'var(--parchment)', lineHeight:1.15 }}>
                Three things, working together.
              </h2>
              <p style={{ fontFamily:'Inter,sans-serif', fontSize:'0.92rem', color:'rgba(168,192,158,0.55)', marginTop:'1rem', maxWidth:'560px', lineHeight:1.7 }}>
                A world where growth feels natural, connection feels genuine, and people don't have to disconnect from life to find themselves — that's the world we're trying to build one Tuesday at a time.
              </p>
            </div>
          </RevealWrapper>

          {[
            {
              n:'01',
              t:'Nature',
              body:"We're not big believers in escaping your life to go find yourself in the woods for ten days. We just think a trail, some fresh air, and a couple of hours away from a screen does something a conference room never will. Nature isn't the backdrop for NovaNest — it's usually where the actual conversation happens.",
            },
            {
              n:'02',
              t:'Play',
              body:"Somewhere along the way, personal growth got associated with discipline, discomfort, and sitting cross-legged for an hour. We think that's backwards. Dancing badly in a room full of strangers, laughing until your stomach hurts, getting genuinely competitive over a silly game — that's when people actually let their guard down.",
            },
            {
              n:'03',
              t:'Community',
              body:"You can't build real connection in a room full of people trying to network. NovaNest exists because strangers who show up to the same hike, the same circle, the same Friday gathering — again and again — eventually stop being strangers. That's not a happy accident. It's the entire model.",
            },
          ].map((p, i) => (
            <RevealWrapper key={i} delay={i*80}>
              <div className="nn-rg-timeline" style={{ display:'grid', gridTemplateColumns:'80px 1fr', gap:'3rem', padding:'3.5rem 0', borderBottom: i < 2 ? '1px solid rgba(61,82,50,0.22)' : 'none', alignItems:'start' }}>
                <div style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'4rem', fontWeight:200, color:'var(--forest-600)', lineHeight:1, opacity:0.4, paddingTop:'0.2rem' }}>
                  {p.n}
                </div>
                <div>
                  <h3 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'2rem', fontWeight:300, fontStyle:'italic', color:'var(--parchment)', marginBottom:'1rem' }}>{p.t}</h3>
                  <p style={{ color:'rgba(168,192,158,0.6)', fontSize:'0.93rem', lineHeight:1.85 }}>{p.body}</p>
                </div>
              </div>
            </RevealWrapper>
          ))}
        </div>
      </section>

      {/* Training timeline — no dots on a line, just text */}
      <section style={{ background:'var(--parchment-mid)', padding:'7rem 0' }}>
        <div className="container" style={{ maxWidth:'720px' }}>
          <RevealWrapper>
            <div style={{ marginBottom:'3.5rem' }}>
              <div style={{ fontFamily:'Inter,sans-serif', fontSize:'0.6rem', fontWeight:600, letterSpacing:'0.2em', textTransform:'uppercase', color:'var(--text-ghost)', marginBottom:'1rem' }}>How we grew</div>
              <h2 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'2.2rem', fontWeight:300, color:'var(--forest-800)' }}>The path here</h2>
            </div>
          </RevealWrapper>
          {[
            { year:'Year 1', label:'A WhatsApp group of eleven friends, meeting on Saturday mornings for a hike none of us admitted we needed.' },
            { year:'Year 2', label:'First real workshop — part nature, part neuroscience, part group circle. Word spread faster than we expected.' },
            { year:'Year 3', label:'First corporate retreat, for a team of forty that hadn\'t laughed together in longer than anyone wanted to say out loud.' },
            { year:'Today',  label:'Weekly gatherings, workshops, retreats, and a community that keeps showing up for each other — and for us.' },
          ].map((item, i) => (
            <RevealWrapper key={i} delay={i*70}>
              <div className="nn-rg-timeline" style={{ display:'grid', gridTemplateColumns:'80px 1fr', gap:'2rem', padding:'1.5rem 0', borderBottom: i < 3 ? '1px solid var(--border)' : 'none' }}>
                <div style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'1rem', fontStyle:'italic', color:'var(--gold)', paddingTop:'3px', textAlign:'right' }}>{item.year}</div>
                <div style={{ fontFamily:'Inter,sans-serif', fontSize:'0.9rem', color:'var(--text-body)', lineHeight:1.65 }}>{item.label}</div>
              </div>
            </RevealWrapper>
          ))}
        </div>
      </section>

      {/* Who this is for — plain two-column list, no icon grid */}
      <section style={{ background:'var(--forest-900)', padding:'8rem 0' }}>
        <div className="container">
          <RevealWrapper>
            <div style={{ marginBottom:'4rem', maxWidth:'620px' }}>
              <div style={{ fontFamily:'Inter,sans-serif', fontSize:'0.6rem', fontWeight:600, letterSpacing:'0.2em', textTransform:'uppercase', color:'rgba(168,192,158,0.35)', marginBottom:'1rem' }}>
                Who this is actually for
              </div>
              <h2 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'2.4rem', fontWeight:300, color:'var(--parchment)', lineHeight:1.2 }}>
                Probably you, if any of this sounds familiar.
              </h2>
            </div>
          </RevealWrapper>
          <div className="nn-rg" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'5rem' }}>
            <RevealWrapper delay={70}>
              <div style={{ fontFamily:'Inter,sans-serif', fontSize:'0.62rem', fontWeight:600, letterSpacing:'0.18em', textTransform:'uppercase', color:'var(--gold-light)', marginBottom:'1.5rem' }}>For people</div>
              {[
                'Feel stuck in routine and want something different, without quitting their job to go find it.',
                'Want real connection, minus the awkward networking event energy.',
                'Are curious about mindfulness but bounce off anything that feels like homework.',
                'Feel ambitious but quietly overwhelmed, most weeks.',
                'Learn better by doing something than by being told about it.',
                'Believe growth can actually be fun.',
              ].map((t, i) => (
                <div key={i} style={{ fontSize:'0.92rem', color:'rgba(200,217,195,0.68)', lineHeight:1.7, paddingBottom:'1rem', marginBottom:'1rem', borderBottom: i < 5 ? '1px solid rgba(92,122,82,0.2)' : 'none' }}>{t}</div>
              ))}
            </RevealWrapper>
            <RevealWrapper delay={140}>
              <div style={{ fontFamily:'Inter,sans-serif', fontSize:'0.62rem', fontWeight:600, letterSpacing:'0.18em', textTransform:'uppercase', color:'var(--gold-light)', marginBottom:'1.5rem' }}>For teams and organizations</div>
              {[
                'Want a stronger team, not another trust-fall exercise.',
                'Want connection that outlasts the offsite.',
                'Want an experience people are still talking about a year later.',
              ].map((t, i) => (
                <div key={i} style={{ fontSize:'0.92rem', color:'rgba(200,217,195,0.68)', lineHeight:1.7, paddingBottom:'1rem', marginBottom:'1rem', borderBottom: i < 2 ? '1px solid rgba(92,122,82,0.2)' : 'none' }}>{t}</div>
              ))}
              <Link href="/contact" className="btn btn-outline" style={{ marginTop:'1.5rem', borderColor:'rgba(92,122,82,0.4)', color:'var(--forest-200)' }}>
                Plan a team retreat
              </Link>
            </RevealWrapper>
          </div>
        </div>
      </section>
    </>
  )
}
