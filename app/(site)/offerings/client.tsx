'use client'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import RevealWrapper from '@/components/ui/RevealWrapper'
import ImageUpload from '@/components/ui/ImageUpload'
import Media from '@/components/ui/Media'
import { saveSiteImage } from '@/lib/saveSiteImage'

<<<<<<< HEAD
import type { OfferingsContent, OfferingItem } from '@/lib/siteContent.defaults'

export default function OfferingsClient({ siteImages, content: c, servicePrices }: { siteImages: Record<string, string>; content: OfferingsContent; servicePrices: Record<string, number> }) {
  const OFFERINGS = c.items
  // One source of truth for price: if the linked service (Admin → Services) has a price, use it;
  // otherwise fall back to the text typed into the offering itself.
  const priceFor = (o: OfferingItem): string => {
    const p = (o.serviceSlug ? servicePrices[o.serviceSlug] : undefined) || o.priceAmount
    return p ? `From $${p}${o.priceUnit ?? ''}` : (o.priceText ?? '')
  }
  const variantPrice = (v: NonNullable<OfferingItem['variant']>): string =>
    v.priceAmount ? `From $${v.priceAmount}${v.priceUnit ?? '/person'}` : (v.price ?? '')
  const tierPriceLine = (t: OfferingItem['tiers'][number]): string =>
    [t.note, (t.prices ?? [])
      .map(pl => { const a = (pl.serviceSlug ? servicePrices[pl.serviceSlug] : undefined) || pl.amount; return a ? `${pl.label} from $${a}` : '' })
      .filter(Boolean).join(' · ')].filter(Boolean).join(' ')
=======
// People don't think in categories, they think in what they're craving.
// This groups the same offerings by feeling instead of by activity type,
// as a way in for anyone who lands here without a clue where to start.
const FEELINGS = [
  {
    prompt: 'I want to slow down',
    items: ['Nature Experiences', 'Sound Healing', 'Breathwork'],
  },
  {
    prompt: 'I want to meet new people',
    items: ['Weekly Gatherings', 'Community Circles', 'Saturday Events'],
  },
  {
    prompt: 'I want to move my body',
    items: ['Movement & Expression', 'Dance', 'Hiking / Adventure'],
  },
  {
    prompt: 'I want to reconnect with my team',
    items: ['Team Retreats', 'Mind, Brain & Behaviour — Team & Corporate', 'Customized Experiences'],
  },
  {
    prompt: 'I want to grow',
    items: ['Mind, Brain & Behaviour — 1:1 Sessions', 'Reflection Sessions', 'Creative Workshops'],
  },
]

interface Tier {
  label: string
  tagline: string
  description: string
  meta: string
  note?: string
  cta: string
}

interface Offering {
  slug: string
  category: string
  title: string
  duration?: string
  format?: string
  price?: string
  description: string
  callouts?: string[]
  ctaLabel?: string
  // For offerings that need more than a single price/description block
  intro?: string
  bullets?: string[]
  closingLine?: string
  approach?: string
  tiers?: Tier[]
}

const OFFERINGS: Offering[] = [
  {
    slug:'kathmandu-valley-hikes', category:'Nature', title:'Kathmandu Valley Guided Hikes',
    duration:'Half day', format:'Small-group', price:'Rs. 350/person',
    description:"Explore the hills around Kathmandu with a NovaNest guide — walking, noticing, talking, and taking a proper break from the usual routine.",
    callouts: [
      "Tickets and entry fees are not included",
      "Guided by NovaNest with all safety meds and equipment",
      "Small-group experience",
    ],
  },
  {
    slug:'beyond-the-valley', category:'Nature', title:'Beyond the Valley',
    duration:'Full day · varies by destination', format:'Small-group', price:'Rs. 1,500–3,000/person',
    description:"We also organize guided hikes and nature experiences outside the Kathmandu valley, with transportation arranged both ways.",
    callouts: [
      "Includes transportation + guided experience — destination-specific entry fees mentioned before booking",
      "Guided hike with all safety meds and equipment",
      "Destination-specific experience, small-group setting",
    ],
  },
  {
    slug:'movement-expression', category:'Movement', title:'Movement & Expression',
    duration:'75 minutes', format:'Public group or private/retreat', price:'From $15/person',
    description:"A space to explore movement, play, and self-expression — guided by the music, the moment, and your own way of moving. No dance experience needed. Come as you are.",
    callouts: [
      "Private / retreat groups: custom quote",
      "Public group sessions: from $15/person",
      "No dance experience needed — just a willingness to move",
    ],
    ctaLabel: 'Book an Experience',
  },
  {
    slug:'sound-healing', category:'Presence', title:'Sound Healing',
    duration:'60 min', format:'Individual or group', price:'From $25/person',
    description:"Put down the noise for a while. A guided sound experience with Tibetan singing bowls and crystal frequencies of gentle tones — a chance to slow down, listen inward, and simply be still for a while.",
    callouts: [
      "Private & retreat groups available",
      "Comfortable clothing recommended",
      "No experience needed — just show up and lie down",
    ],
  },
  {
    slug:'breathwork', category:'Presence', title:'Breathwork',
    duration:'75 min', format:'Individual or group', price:'From $25/person',
    description:"A guided breathing experience to slow down, reconnect with your body, and notice what's happening within. Through conscious breathing, music, and gentle guidance, you'll explore breath as a way to shift your state, settle your attention, and create space to pause.",
    callouts: [
      "No previous experience needed",
      "Comfortable clothing recommended",
      "Private & retreat groups available",
    ],
  },
  {
    slug:'mind-brain-behaviour', category:'Growth', title:'Mind, Brain & Behaviour',
    description:"Maybe you're looking for something, but you're not quite sure what to call it.",
    intro:"Maybe you're looking for something, but you're not quite sure what to call it.",
    bullets: [
      "You keep overthinking the same situation.",
      "You know what you want to do, but keep getting in your own way.",
      "You want to communicate differently, handle pressure better, or understand why you keep falling into the same patterns.",
    ],
    closingLine: "Start with what's happening. We'll explore the rest together.",
    approach: "Our approach: Neuroscience · NLP · Behavioural Psychology · Mindfulness",
    tiers: [
      {
        label: '1:1 Sessions', tagline: 'For when you want to work on something personal.',
        description: "A private, practical session using NLP tools, behavioural psychology, and neuroscience-informed approaches to explore patterns in thinking, emotion, attention, communication, and behaviour.",
        meta: 'Solo · 60–90 min · By appointment',
        note: 'For a deeper exploration, 90-minute sessions start from $65.',
        cta: 'Book a 1:1 Session →',
      },
      {
        label: 'Group & Corporate Experiences', tagline: 'For when the question belongs to a whole team.',
        description: "Interactive experiences exploring how people think, communicate, make decisions, respond under pressure, and work together — through activities, conversation, and accessible neuroscience.",
        meta: 'Teams · Corporate groups · Private groups · Custom duration',
        note: 'Private groups from $200 · Corporate teams from $300',
        cta: 'Create a Group Experience →',
      },
    ],
  },
  {
    slug:'design-your-nepal-experience', category:'Immersion', title:"Let's Design Your Nepal Experience",
    description:"Nepal doesn't come in one size: a retreat could mean a comfortable farm stay close to Kathmandu, a mountain village, a riverside escape, or a deeper journey into the landscape. Tell us what you're looking for, and we'll shape the experience around your group — from fitness level and travel style to comfort, curiosity, pace, interests, and the kind of challenge you're up for.",
    intro: 'For private groups, teams & international groups — we\'ll talk about:',
    bullets: [
      "Where you want to go",
      "How adventurous or comfortable you want it to be",
      "Your group's fitness and experience level",
      "What you'd like to explore, learn, or simply experience",
      "How much time you have",
      "Your budget and travel preferences",
    ],
    closingLine: "Then we'll suggest a route and experience that fits.",
    ctaLabel: 'Book a Free Planning Call →',
  },
]

export default function OfferingsClient({ siteImages }: { siteImages: Record<string, string> }) {
>>>>>>> 0535e7cc738eba828f46f7a78b8fc6434e5c1a86
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
<<<<<<< HEAD
              {c.header.eyebrow}
            </div>
            <h1 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'clamp(2.5rem,6vw,5rem)', fontWeight:300, color:'var(--parchment)', lineHeight:1.05, marginBottom:'1.5rem' }}>
              {c.header.headline}<br/><em>{c.header.headlineEm}</em>
            </h1>
            <p style={{ color:'rgba(168,192,158,0.6)', fontSize:'1.05rem', lineHeight:1.8, fontFamily:'Inter,sans-serif' }}>
              {c.header.paragraph}
=======
              What we do
            </div>
            <h1 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'clamp(2.5rem,6vw,5rem)', fontWeight:300, color:'var(--parchment)', lineHeight:1.05, marginBottom:'1.5rem' }}>
              Ways to<br/><em>reconnect</em>
            </h1>
            <p style={{ color:'rgba(168,192,158,0.6)', fontSize:'1.05rem', lineHeight:1.8, fontFamily:'Inter,sans-serif' }}>
              Experiences designed to help you reconnect, recharge, and grow — without pressure, and without pretending you have to sit still to get there.
>>>>>>> 0535e7cc738eba828f46f7a78b8fc6434e5c1a86
            </p>
          </div>
        </div>
      </section>

      {/* Not sure where to begin — organized by feeling, not activity type */}
      <section style={{ background:'var(--parchment-mid)', padding:'6rem 0' }}>
        <div className="container">
          <RevealWrapper>
            <div style={{ marginBottom:'3.5rem', maxWidth:'560px' }}>
              <div style={{ fontFamily:'Inter,sans-serif', fontSize:'0.6rem', fontWeight:600, letterSpacing:'0.2em', textTransform:'uppercase', color:'var(--text-ghost)', marginBottom:'1rem' }}>
<<<<<<< HEAD
                {c.feelings.eyebrow}
              </div>
              <h2 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'clamp(1.8rem,3.5vw,2.6rem)', fontWeight:300, color:'var(--forest-800)', lineHeight:1.2 }}>
                {c.feelings.heading}
=======
                Not sure where to begin?
              </div>
              <h2 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'clamp(1.8rem,3.5vw,2.6rem)', fontWeight:300, color:'var(--forest-800)', lineHeight:1.2 }}>
                Start with how you want to feel.
>>>>>>> 0535e7cc738eba828f46f7a78b8fc6434e5c1a86
              </h2>
            </div>
          </RevealWrapper>
          <div className="nn-rg3" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'2px' }}>
<<<<<<< HEAD
            {c.feelings.items.map((f, i) => (
=======
            {FEELINGS.map((f, i) => (
>>>>>>> 0535e7cc738eba828f46f7a78b8fc6434e5c1a86
              <RevealWrapper key={f.prompt} delay={i*60}>
                <div style={{ background:'var(--parchment)', padding:'2.2rem', height:'100%' }}>
                  <div style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'1.3rem', fontWeight:300, fontStyle:'italic', color:'var(--forest-700)', marginBottom:'1.2rem', lineHeight:1.3 }}>
                    {f.prompt}
                  </div>
                  {f.items.map(item => (
                    <div key={item} style={{ fontFamily:'Inter,sans-serif', fontSize:'0.85rem', color:'var(--text-body)', lineHeight:1.6, paddingLeft:'0.9rem', borderLeft:'2px solid var(--border)', marginBottom:'0.55rem' }}>
                      {item}
                    </div>
                  ))}
                </div>
              </RevealWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* Offerings — alternating layout, not a grid of identical cards */}
      <section style={{ background:'var(--parchment)' }}>
        {OFFERINGS.map((o, i) => (
          <RevealWrapper key={o.slug}>
            <div id={o.slug} className="nn-rg" style={{
              display:'grid',
              gridTemplateColumns: i % 2 === 0 ? '340px 1fr' : '1fr 340px',
              gap:0,
              borderBottom:'1px solid var(--border)',
              scrollMarginTop:'5.5rem',
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
                    ? <Media src={images[o.slug]} alt={o.title} style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }}/>
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

<<<<<<< HEAD
                {o.tiers?.length ? (
=======
                {o.tiers ? (
>>>>>>> 0535e7cc738eba828f46f7a78b8fc6434e5c1a86
                  // ── Multi-tier layout (Mind, Brain & Behaviour) ──
                  <>
                    <p style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'1.2rem', fontStyle:'italic', fontWeight:300, color:'var(--forest-700)', lineHeight:1.5, marginBottom:'1.2rem' }}>
                      {o.intro}
                    </p>
<<<<<<< HEAD
                    {o.bullets?.length > 0 && (
=======
                    {o.bullets && (
>>>>>>> 0535e7cc738eba828f46f7a78b8fc6434e5c1a86
                      <div style={{ marginBottom:'1.2rem' }}>
                        {o.bullets.map((b, bi) => (
                          <div key={bi} style={{ fontFamily:'Inter,sans-serif', fontSize:'0.87rem', color:'var(--text-body)', lineHeight:1.7, paddingLeft:'1rem', borderLeft:'2px solid var(--border)', marginBottom:'0.5rem' }}>
                            {b}
                          </div>
                        ))}
                      </div>
                    )}
                    {o.closingLine && (
                      <p style={{ fontSize:'0.9rem', color:'var(--text-muted)', fontStyle:'italic', marginBottom:'2rem' }}>{o.closingLine}</p>
                    )}
                    <div style={{ display:'flex', flexDirection:'column', gap:'1.75rem', marginBottom:'1.5rem' }}>
                      {o.tiers.map((t, ti) => (
                        <div key={ti} style={{ paddingTop: ti > 0 ? '1.75rem' : 0, borderTop: ti > 0 ? '1px solid var(--border)' : 'none' }}>
                          <div style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'1.3rem', fontWeight:400, color:'var(--forest-800)', marginBottom:'0.3rem' }}>{t.label}</div>
                          <div style={{ fontFamily:'Inter,sans-serif', fontSize:'0.8rem', fontStyle:'italic', color:'var(--text-muted)', marginBottom:'0.6rem' }}>{t.tagline}</div>
                          <p style={{ fontSize:'0.88rem', lineHeight:1.75, color:'var(--text-body)', marginBottom:'0.7rem' }}>{t.description}</p>
                          <div style={{ fontFamily:'Inter,sans-serif', fontSize:'0.75rem', color:'var(--text-muted)', marginBottom:'0.3rem' }}>{t.meta}</div>
<<<<<<< HEAD
                          {tierPriceLine(t) && <div style={{ fontFamily:'Inter,sans-serif', fontSize:'0.75rem', color:'var(--gold-dark)', fontWeight:600, marginBottom:'0.9rem' }}>{tierPriceLine(t)}</div>}
=======
                          {t.note && <div style={{ fontFamily:'Inter,sans-serif', fontSize:'0.75rem', color:'var(--gold-dark)', fontWeight:600, marginBottom:'0.9rem' }}>{t.note}</div>}
>>>>>>> 0535e7cc738eba828f46f7a78b8fc6434e5c1a86
                          <Link href="/book" className="btn btn-outline" style={{ fontSize:'0.65rem' }}>{t.cta}</Link>
                        </div>
                      ))}
                    </div>
                    {o.approach && (
                      <div style={{ fontFamily:'Inter,sans-serif', fontSize:'0.75rem', color:'var(--text-ghost)', letterSpacing:'0.02em', paddingTop:'1.5rem', borderTop:'1px solid var(--border)' }}>
                        {o.approach}
                      </div>
                    )}
                  </>
<<<<<<< HEAD
                ) : o.bullets?.length ? (
=======
                ) : o.bullets ? (
>>>>>>> 0535e7cc738eba828f46f7a78b8fc6434e5c1a86
                  // ── Description + bullet-list layout (Nepal Experience) ──
                  <>
                    <p style={{ fontSize:'0.95rem', lineHeight:1.85, color:'var(--text-body)', marginBottom:'1.5rem' }}>{o.description}</p>
                    {o.intro && (
                      <div style={{ fontFamily:'Inter,sans-serif', fontSize:'0.72rem', fontWeight:600, letterSpacing:'0.06em', color:'var(--forest-600)', marginBottom:'1rem' }}>{o.intro}</div>
                    )}
                    <div style={{ marginBottom:'1.2rem' }}>
                      {o.bullets.map((b, bi) => (
                        <div key={bi} style={{ fontFamily:'Inter,sans-serif', fontSize:'0.87rem', color:'var(--text-body)', lineHeight:1.7, paddingLeft:'1rem', borderLeft:'2px solid var(--border)', marginBottom:'0.5rem' }}>
                          {b}
                        </div>
                      ))}
                    </div>
                    {o.closingLine && (
                      <p style={{ fontSize:'0.9rem', color:'var(--text-muted)', fontStyle:'italic', marginBottom:'1.8rem' }}>{o.closingLine}</p>
                    )}
                    <div>
                      <Link href="/book" className="btn btn-forest" style={{ fontSize:'0.65rem' }}>{o.ctaLabel ?? 'Book this'}</Link>
                    </div>
                  </>
                ) : (
                  // ── Standard layout ──
                  <>
                    <div style={{ fontFamily:'Inter,sans-serif', fontSize:'0.75rem', color:'var(--text-muted)', marginBottom:'1.5rem', display:'flex', gap:'1.5rem', flexWrap:'wrap' }}>
                      {o.duration && <span>{o.duration}</span>}
                      {o.duration && o.format && <span style={{ color:'var(--border-strong)' }}>·</span>}
                      {o.format && <span>{o.format}</span>}
<<<<<<< HEAD
                      {priceFor(o) && (o.duration || o.format) && <span style={{ color:'var(--border-strong)' }}>·</span>}
                      {priceFor(o) && <span style={{ fontWeight:600, color:'var(--gold-dark)' }}>{priceFor(o)}</span>}
                    </div>

                    {o.tagline && (
                      <p style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'1.25rem', fontStyle:'italic', fontWeight:300, color:'var(--forest-700)', lineHeight:1.4, marginBottom:'0.8rem' }}>{o.tagline}</p>
                    )}
                    <p style={{ fontSize:'0.95rem', lineHeight:1.85, color:'var(--text-body)', marginBottom:'1.8rem' }}>{o.description}</p>

                    {o.callouts?.length > 0 && (
                      <div style={{ marginBottom:'1.6rem' }}>
                        {o.includesTitle && (
                          <div style={{ fontFamily:'Inter,sans-serif', fontSize:'0.62rem', fontWeight:600, letterSpacing:'0.16em', textTransform:'uppercase', color:'var(--forest-600)', marginBottom:'0.8rem' }}>{o.includesTitle}</div>
                        )}
                        {o.callouts.map((c, ci) => (
                          <div key={ci} style={{ fontFamily:'Inter,sans-serif', fontSize:'0.83rem', color:'var(--text-muted)', lineHeight:1.65, paddingLeft:'1rem', borderLeft:`2px solid ${ci === 0 && !o.includesTitle ? 'var(--gold)' : 'var(--border)'}`, marginBottom:'0.6rem' }}>
=======
                      {o.price && <span style={{ color:'var(--border-strong)' }}>·</span>}
                      {o.price && <span style={{ fontWeight:600, color:'var(--gold-dark)' }}>{o.price}</span>}
                    </div>

                    <p style={{ fontSize:'0.95rem', lineHeight:1.85, color:'var(--text-body)', marginBottom:'1.8rem' }}>{o.description}</p>

                    {o.callouts && (
                      <div style={{ marginBottom:'2rem' }}>
                        {o.callouts.map((c, ci) => (
                          <div key={ci} style={{ fontFamily:'Inter,sans-serif', fontSize:'0.83rem', color:'var(--text-muted)', lineHeight:1.65, paddingLeft:'1rem', borderLeft:`2px solid ${ci === 0 ? 'var(--gold)' : 'var(--border)'}`, marginBottom:'0.6rem', fontStyle: ci === 0 ? 'italic' : 'normal' }}>
>>>>>>> 0535e7cc738eba828f46f7a78b8fc6434e5c1a86
                            {c}
                          </div>
                        ))}
                      </div>
                    )}

<<<<<<< HEAD
                    {o.footnote && (
                      <p style={{ fontFamily:'Inter,sans-serif', fontSize:'0.76rem', fontStyle:'italic', color:'var(--text-muted)', lineHeight:1.7, marginBottom: o.destinations ? '0.6rem' : '1.8rem' }}>{o.footnote}</p>
                    )}
                    {o.destinations && (
                      <p style={{ fontFamily:'Inter,sans-serif', fontSize:'0.76rem', color:'var(--forest-600)', lineHeight:1.7, marginBottom:'1.8rem' }}>{o.destinations}</p>
                    )}

                    {o.variant && (
                      <div style={{ background:'rgba(255,255,255,0.55)', borderLeft:'3px solid var(--gold)', padding:'1.4rem 1.6rem', marginBottom:'1.8rem' }}>
                        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', flexWrap:'wrap', gap:'0.5rem', marginBottom:'0.6rem' }}>
                          <div style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'1.35rem', fontWeight:400, color:'var(--forest-800)' }}>{o.variant.title}</div>
                          <div style={{ fontFamily:'Inter,sans-serif', fontSize:'0.78rem', fontWeight:600, color:'var(--gold-dark)' }}>{variantPrice(o.variant)}</div>
                        </div>
                        <p style={{ fontSize:'0.88rem', lineHeight:1.75, color:'var(--text-body)', marginBottom:'0.7rem' }}>{o.variant.description}</p>
                        <div style={{ fontFamily:'Inter,sans-serif', fontSize:'0.74rem', color:'var(--text-muted)' }}>{o.variant.meta}</div>
                        {o.variant.footnote && <div style={{ fontFamily:'Inter,sans-serif', fontSize:'0.72rem', fontStyle:'italic', color:'var(--text-ghost)', marginTop:'0.3rem' }}>{o.variant.footnote}</div>}
                      </div>
                    )}

=======
>>>>>>> 0535e7cc738eba828f46f7a78b8fc6434e5c1a86
                    <div>
                      <Link href="/book" className="btn btn-forest" style={{ fontSize:'0.65rem' }}>{o.ctaLabel ?? 'Book this'}</Link>
                    </div>
                  </>
                )}
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
<<<<<<< HEAD
                {c.cta.heading}
              </h2>
              <p style={{ color:'rgba(168,192,158,0.6)', fontSize:'0.95rem', lineHeight:1.8 }}>
                {c.cta.paragraph}
              </p>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:'1rem', alignItems:'flex-start' }}>
              <Link href="/book" className="btn btn-parchment">{c.cta.primaryButton}</Link>
              <Link href="/contact" className="btn btn-light">{c.cta.secondaryButton}</Link>
=======
                Not sure where to start?
              </h2>
              <p style={{ color:'rgba(168,192,158,0.6)', fontSize:'0.95rem', lineHeight:1.8 }}>
                Honestly, it doesn't matter much. People who come for a hike end up at a Friday workshop. People who book one retreat for their team come back for another, and bring a different team next time. Start with whatever sounds the least like a chore. The rest tends to reveal itself.
              </p>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:'1rem', alignItems:'flex-start' }}>
              <Link href="/book" className="btn btn-parchment">Book a Free Info Call</Link>
              <Link href="/contact" className="btn btn-light">Send a message first</Link>
>>>>>>> 0535e7cc738eba828f46f7a78b8fc6434e5c1a86
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
