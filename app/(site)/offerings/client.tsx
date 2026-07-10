'use client'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import RevealWrapper from '@/components/ui/RevealWrapper'
import ImageUpload from '@/components/ui/ImageUpload'
import { saveSiteImage } from '@/lib/saveSiteImage'

const OFFERINGS = [
  {
    slug:'nature-experiences', category:'Nature', title:'Nature Experiences',
    duration:'Half-day or full-day', format:'Groups of 8–20', price:'***PRICE***',
    description:"Guided hikes, nature walks, and outdoor reflection activities built around noticing the things you don't notice indoors — your breath, your thoughts, the actual sound of wind instead of a notification. We also run regular community gatherings outdoors, since the best conversations tend to happen when nobody's trying to have one.",
    callouts: [
      "No fitness level required — pace adjusts to whoever shows up",
      "Includes guided hikes, nature walks, outdoor reflection activities, and community gatherings",
      "Most popular on weekend mornings, when everyone still has a bit of Tuesday in their legs",
    ],
  },
  {
    slug:'movement-expression', category:'Movement', title:'Movement & Expression',
    duration:'60–90 min', format:'Drop-in or series', price:'***PRICE***',
    description:"For people who think better when they move. Somatic movement sessions, ecstatic and free-form dance, and playful group activities that don't require you to know a single step — just a body willing to move it.",
    callouts: [
      "No dance background needed, and no mirrors either",
      "Includes somatic sessions, ecstatic dance, and movement-based mindfulness",
      "The good kind of sweaty — the kind you don't regret",
    ],
  },
  {
    slug:'relaxation-presence', category:'Presence', title:'Deep Relaxation & Presence',
    duration:'60–75 min', format:'Individual or group', price:'***PRICE***',
    description:"Sound healing, breathwork, and guided relaxation for people whose minds don't slow down just because somebody told them to relax. These sessions quiet the noise without forcing stillness — the sessions do the work for you.",
    callouts: [
      "Works even if you've never meditated in your life",
      "Includes sound healing, breathwork, and guided relaxation experiences",
      "Bring a mat, leave the to-do list at the door",
    ],
  },
  {
    slug:'growth-leadership', category:'Growth', title:'Growth & Leadership Workshops',
    duration:'Half-day', format:'Groups of 6–30', price:'***PRICE***',
    description:"Interactive workshops grounded in real psychology, neuroscience, and leadership research — minus the whiteboard fatigue. Built for people and teams who learn by doing, not by being lectured at for two hours.",
    callouts: [
      "Includes neuroscience-based workshops, leadership development, and team-building sessions",
      "Popular with teams who've sat through one too many generic offsites",
      "Personal growth sessions also available one-on-one, not just for groups",
    ],
  },
  {
    slug:'retreats-immersive', category:'Immersion', title:'Retreats & Immersive Experiences',
    duration:'2–4 days', format:'Individuals, teams, or communities', price:'***From PRICE***',
    description:"Weekend retreats, nature retreats, and fully customized team retreats for people who want more than a few hours. This is where everything else NovaNest does gets room to breathe — nature, movement, workshops, and conversations around a fire that run later than planned.",
    callouts: [
      "Corporate retreats available with an agenda built around your team, not a template",
      "Customized retreat experiences for communities and organizations of any size",
      "The one people are still talking about a year later",
    ],
  },
]

export default function OfferingsClient({ siteImages }: { siteImages: Record<string, string> }) {
  const [images, setImages] = useState<Record<string, string>>(
    Object.fromEntries(
      Object.entries(siteImages)
        .filter(([k]) => k.startsWith('offering:'))
        .map(([k, v]) => [k.replace('offering:', ''), v])
    )
  )
  const { data: session } = useSession()
  const isAdmin = !!session

  const handleImageChange = (slug: string, url: string) => {
    setImages(prev => ({ ...prev, [slug]: url }))
    saveSiteImage(`offering:${slug}`, url)
  }

  return (
    <>
      {/* Header — deliberately plain, no wave SVG */}
      <section style={{ paddingTop:'9rem', paddingBottom:'4rem', background:'var(--forest-900)' }}>
        <div className="container">
          <div style={{ maxWidth:'680px' }}>
            <div style={{ fontFamily:'Inter,sans-serif', fontSize:'0.6rem', fontWeight:600, letterSpacing:'0.22em', textTransform:'uppercase', color:'rgba(168,192,158,0.4)', marginBottom:'1.5rem' }}>
              What we do
            </div>
            <h1 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'clamp(2.5rem,6vw,5rem)', fontWeight:300, color:'var(--parchment)', lineHeight:1.05, marginBottom:'1.5rem' }}>
              Ways to<br/><em>reconnect</em>
            </h1>
            <p style={{ color:'rgba(168,192,158,0.6)', fontSize:'1.05rem', lineHeight:1.8, fontFamily:'Inter,sans-serif' }}>
              Experiences designed to help you reconnect, recharge, and grow — without pressure, and without pretending you have to sit still to get there.
            </p>
          </div>
        </div>
      </section>

      {/* Offerings — alternating layout, not a grid of identical cards */}
      <section style={{ background:'var(--parchment)' }}>
        {OFFERINGS.map((o, i) => (
          <RevealWrapper key={o.slug}>
            <div className="nn-rg" style={{
              display:'grid',
              gridTemplateColumns: i % 2 === 0 ? '340px 1fr' : '1fr 340px',
              gap:0,
              borderBottom:'1px solid var(--border)',
            }}>
              {/* Image zone */}
              <div style={{ order: i % 2 === 0 ? 0 : 1, background:'var(--parchment-deep)', minHeight:'340px' }}>
                {isAdmin ? (
                  <ImageUpload
                    value={images[o.slug] ?? null}
                    onChange={url => handleImageChange(o.slug, url)}
                    aspectRatio="unset"
                    label="Add Image"
                    style={{ height:'100%', minHeight:'340px', aspectRatio:'unset' }}
                  />
                ) : (
                  images[o.slug]
                    ? <img src={images[o.slug]} alt={o.title} style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }}/>
                    : <div style={{ height:'100%', minHeight:'340px', background:'var(--parchment-deep)' }}/>
                )}
              </div>

              {/* Content */}
              <div style={{
                order: i % 2 === 0 ? 1 : 0,
                padding:'4rem',
                display:'flex',
                flexDirection:'column',
                justifyContent:'center',
                background: i % 3 === 0 ? 'var(--parchment)' : i % 3 === 1 ? 'var(--parchment-mid)' : 'var(--forest-50)',
              }}>
                <div style={{ fontFamily:'Inter,sans-serif', fontSize:'0.6rem', fontWeight:600, letterSpacing:'0.18em', textTransform:'uppercase', color:'var(--text-ghost)', marginBottom:'0.8rem' }}>{o.category}</div>
                <h2 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'2.4rem', fontWeight:300, color:'var(--forest-800)', marginBottom:'1rem', lineHeight:1.1 }}>{o.title}</h2>

                {/* Meta — inline, not a table */}
                <div style={{ fontFamily:'Inter,sans-serif', fontSize:'0.75rem', color:'var(--text-muted)', marginBottom:'1.5rem', display:'flex', gap:'1.5rem', flexWrap:'wrap' }}>
                  <span>{o.duration}</span>
                  <span style={{ color:'var(--border-strong)' }}>·</span>
                  <span>{o.format}</span>
                  <span style={{ color:'var(--border-strong)' }}>·</span>
                  <span style={{ fontWeight:600, color:'var(--gold-dark)' }}>{o.price}</span>
                </div>

                <p style={{ fontSize:'0.95rem', lineHeight:1.85, color:'var(--text-body)', marginBottom:'1.8rem' }}>{o.description}</p>

                {/* Callouts — not a bullet list, more natural */}
                <div style={{ marginBottom:'2rem' }}>
                  {o.callouts.map((c, ci) => (
                    <div key={ci} style={{ fontFamily:'Inter,sans-serif', fontSize:'0.83rem', color:'var(--text-muted)', lineHeight:1.65, paddingLeft:'1rem', borderLeft:`2px solid ${ci === 0 ? 'var(--gold)' : 'var(--border)'}`, marginBottom:'0.6rem', fontStyle: ci === 0 ? 'italic' : 'normal' }}>
                      {c}
                    </div>
                  ))}
                </div>

                <div>
                  <Link href="/book" className="btn btn-forest" style={{ fontSize:'0.65rem' }}>Book this</Link>
                </div>
              </div>
            </div>
          </RevealWrapper>
        ))}
      </section>

      {/* Footer CTA — no decorative SVG, just text */}
      <section style={{ background:'var(--forest-800)', padding:'7rem 0' }}>
        <div className="container">
          <div className="nn-rg" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'4rem', alignItems:'center' }}>
            <div>
              <h2 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'2.2rem', fontWeight:300, color:'var(--parchment)', lineHeight:1.2, marginBottom:'1rem' }}>
                Not sure where to start?
              </h2>
              <p style={{ color:'rgba(168,192,158,0.6)', fontSize:'0.95rem', lineHeight:1.8 }}>
                Honestly, it doesn't matter much. People who come for a hike end up at a Friday workshop. People who book one retreat for their team come back for another, and bring a different team next time. Start with whatever sounds the least like a chore. The rest tends to reveal itself.
              </p>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:'1rem', alignItems:'flex-start' }}>
              <Link href="/book" className="btn btn-parchment">Book a Free Info Call</Link>
              <Link href="/contact" className="btn btn-light">Send a message first</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
