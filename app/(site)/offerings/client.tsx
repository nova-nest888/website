'use client'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import RevealWrapper from '@/components/ui/RevealWrapper'
import ImageUpload from '@/components/ui/ImageUpload'
import Media from '@/components/ui/Media'
import { saveSiteImage } from '@/lib/saveSiteImage'

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
  // Where each "how you want to feel" suggestion scrolls to. Known wording first, then a loose
  // match against experience titles/slugs, so admin-edited suggestions keep working.
  const FEELING_ALIASES: Record<string, string> = {
    'nature experiences': 'kathmandu-valley-hikes',
    'hiking adventure': 'kathmandu-valley-hikes',
    'hiking': 'kathmandu-valley-hikes',
    'dance': 'movement-expression',
    'team retreats': 'design-your-nepal-experience',
    'customized experiences': 'design-your-nepal-experience',
    'customised experiences': 'design-your-nepal-experience',
    'reflection sessions': 'mind-brain-behaviour',
  }
  const norm = (t: string) => t.toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, ' ').trim()
  const slugFor = (label: string): string | null => {
    const n = norm(label)
    const slugs = new Set(OFFERINGS.map(o => o.slug))
    const alias = FEELING_ALIASES[n]
    if (alias && slugs.has(alias)) return alias
    const exact = OFFERINGS.find(o => norm(o.title) === n || o.slug === n.replace(/ /g, '-'))
    if (exact) return exact.slug
    const loose = OFFERINGS.find(o => { const t = norm(o.title); return t.includes(n) || n.includes(t) })
    return loose ? loose.slug : null
  }
  const goTo = (e: React.MouseEvent, slug: string) => {
    const el = document.getElementById(slug)
    if (!el) return
    e.preventDefault()
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    history.replaceState(null, '', `#${slug}`)
  }
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
              {c.header.eyebrow}
            </div>
            <h1 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'clamp(2.5rem,6vw,5rem)', fontWeight:300, color:'var(--parchment)', lineHeight:1.05, marginBottom:'1.5rem' }}>
              {c.header.headline}<br/><em>{c.header.headlineEm}</em>
            </h1>
            <p style={{ color:'rgba(168,192,158,0.6)', fontSize:'1.05rem', lineHeight:1.8, fontFamily:'Inter,sans-serif' }}>
              {c.header.paragraph}
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
                {c.feelings.eyebrow}
              </div>
              <h2 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'clamp(1.8rem,3.5vw,2.6rem)', fontWeight:300, color:'var(--forest-800)', lineHeight:1.2 }}>
                {c.feelings.heading}
              </h2>
            </div>
          </RevealWrapper>
          <div className="nn-rg3" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'2px' }}>
            {c.feelings.items.map((f, i) => (
              <RevealWrapper key={f.prompt} delay={i*60}>
                <div style={{ background:'var(--parchment)', padding:'2.2rem', height:'100%' }}>
                  <div style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'1.3rem', fontWeight:300, fontStyle:'italic', color:'var(--forest-700)', marginBottom:'1.2rem', lineHeight:1.3 }}>
                    {f.prompt}
                  </div>
                  {f.items.map(item => {
                    const target = slugFor(item)
                    const boxStyle = { display:'block', fontFamily:'Inter,sans-serif', fontSize:'0.85rem', color:'var(--text-body)', lineHeight:1.6, paddingLeft:'0.9rem', borderLeft:'2px solid var(--border)', marginBottom:'0.55rem', textDecoration:'none' } as const
                    return target ? (
                      <a key={item} href={`#${target}`} onClick={e => goTo(e, target)} className="nn-feel-link" style={boxStyle}>
                        {item}
                      </a>
                    ) : (
                      <div key={item} style={boxStyle}>{item}</div>
                    )
                  })}
                </div>
              </RevealWrapper>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        .nn-feel-link { cursor: pointer; transition: color .2s ease, border-color .2s ease, padding-left .2s ease; }
        .nn-feel-link:hover, .nn-feel-link:focus-visible { color: var(--forest-800); border-left-color: var(--gold); padding-left: 1.15rem !important; }
      `}</style>

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

                {o.tiers?.length ? (
                  // ── Multi-tier layout (Mind, Brain & Behaviour) ──
                  <>
                    <p style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'1.2rem', fontStyle:'italic', fontWeight:300, color:'var(--forest-700)', lineHeight:1.5, marginBottom:'1.2rem' }}>
                      {o.intro}
                    </p>
                    {o.bullets?.length > 0 && (
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
                          {tierPriceLine(t) && <div style={{ fontFamily:'Inter,sans-serif', fontSize:'0.75rem', color:'var(--gold-dark)', fontWeight:600, marginBottom:'0.9rem' }}>{tierPriceLine(t)}</div>}
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
                ) : o.bullets?.length ? (
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
                            {c}
                          </div>
                        ))}
                      </div>
                    )}

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
                {c.cta.heading}
              </h2>
              <p style={{ color:'rgba(168,192,158,0.6)', fontSize:'0.95rem', lineHeight:1.8 }}>
                {c.cta.paragraph}
              </p>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:'1rem', alignItems:'flex-start' }}>
              <Link href="/book" className="btn btn-parchment">{c.cta.primaryButton}</Link>
              <Link href="/contact" className="btn btn-light">{c.cta.secondaryButton}</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
