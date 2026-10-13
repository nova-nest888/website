'use client'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import RevealWrapper from '@/components/ui/RevealWrapper'
import ImageUpload from '@/components/ui/ImageUpload'
import Media from '@/components/ui/Media'
import { saveSiteImage } from '@/lib/saveSiteImage'
import type { AboutContent } from '@/lib/siteContent.defaults'

export default function AboutClient({ siteImages, content: c }: { siteImages: Record<string, string>; content: AboutContent }) {
  const num = (i: number) => String(i + 1).padStart(2, '0')
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
                {c.header.eyebrow}
              </div>
              <h1 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'clamp(2.6rem,6vw,5rem)', fontWeight:300, color:'var(--parchment)', lineHeight:1.05, letterSpacing:'-0.02em' }}>
                {c.header.headline.split('\n').map((line, li, arr) => (<span key={li}>{line}{li < arr.length - 1 && <br/>}</span>))}
              </h1>
            </div>
            <div style={{ paddingBottom:'0.5rem' }}>
              <p style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'1.2rem', fontWeight:300, fontStyle:'italic', color:'rgba(200,217,195,0.65)', lineHeight:1.7 }}>
                {c.header.quote}
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
                  {c.story.label}
                </div>
                <p style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'1.5rem', fontWeight:300, color:'var(--forest-700)', lineHeight:1.5, marginBottom:'3rem', fontStyle:'italic' }}>
                  {c.story.quote}
                </p>
              </RevealWrapper>

              {c.story.chapters.map((chap, i) => { const ch = { ...chap, n: num(i), t: chap.title }; return (
                <RevealWrapper key={ch.n} delay={i*40}>
                  <div style={{ marginBottom:'2.2rem', paddingBottom:'2.2rem', borderBottom: i < c.story.chapters.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <div style={{ display:'flex', gap:'1.4rem', alignItems:'baseline' }}>
                      <div style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'1rem', fontStyle:'italic', color:'var(--gold)', flexShrink:0 }}>{ch.n}</div>
                      <div style={{ flex:1 }}>
                        {ch.t && (
                          <div style={{ fontFamily:'Inter,sans-serif', fontSize:'0.68rem', fontWeight:600, letterSpacing:'0.14em', textTransform:'uppercase', color:'var(--forest-500)', marginBottom:'0.7rem' }}>
                            {ch.t}
                          </div>
                        )}
                        {ch.hook && (
                          <p style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'1.2rem', fontWeight:400, color:'var(--forest-800)', lineHeight:1.4, marginBottom:'0.8rem' }}>
                            {ch.hook}
                          </p>
                        )}
                        {ch.kind === 'quote' ? (
                          ch.body.split('\n').map((line, li) => (
                            <p key={li} style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'1.35rem', fontWeight:300, fontStyle:'italic', color:'var(--forest-700)', lineHeight:1.5, marginBottom: li < ch.body.split('\n').length-1 ? '0.3rem' : 0 }}>
                              {line}
                            </p>
                          ))
                        ) : (
                          ch.body.split('\n\n').map((para, pi) => (
                            <p key={pi} style={{ fontSize:'0.97rem', lineHeight:1.9, color:'var(--text-body)', marginBottom: pi < ch.body.split('\n\n').length-1 ? '1.2rem' : 0 }}>
                              {para}
                            </p>
                          ))
                        )}
                        {ch.emphasis && (
                          <p style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'1.15rem', fontWeight:500, fontStyle:'italic', color:'var(--forest-700)', lineHeight:1.5, marginTop:'0.6rem' }}>
                            {ch.emphasis}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </RevealWrapper>
              ) })}

              <RevealWrapper delay={280}>
                <div style={{ display:'flex', gap:'1rem', flexWrap:'wrap', marginTop:'1rem' }}>
                  <Link href="/book" className="btn btn-forest">{c.story.primaryButton}</Link>
                  <Link href="/contact" className="btn btn-outline">{c.story.secondaryButton}</Link>
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
                    ? <Media src={portrait} alt="Portrait" style={{ width:'100%', aspectRatio:'3/4', objectFit:'cover', display:'block' }}/>
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
                  {c.portraitCaption}
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
                {c.pillars.eyebrow}
              </div>
              <h2 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'2.5rem', fontWeight:300, color:'var(--parchment)', lineHeight:1.15 }}>
                {c.pillars.heading}
              </h2>
              <p style={{ fontFamily:'Inter,sans-serif', fontSize:'0.92rem', color:'rgba(168,192,158,0.55)', marginTop:'1rem', maxWidth:'560px', lineHeight:1.7 }}>
                {c.pillars.intro}
              </p>
            </div>
          </RevealWrapper>

          {c.pillars.items.map((it, i) => { const p = { ...it, n: num(i), t: it.title }; return (
            <RevealWrapper key={i} delay={i*80}>
              <div className="nn-rg-timeline" style={{ display:'grid', gridTemplateColumns:'80px 1fr', gap:'3rem', padding:'3.5rem 0', borderBottom: i < c.pillars.items.length - 1 ? '1px solid rgba(61,82,50,0.22)' : 'none', alignItems:'start' }}>
                <div style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'4rem', fontWeight:200, color:'var(--forest-600)', lineHeight:1, opacity:0.4, paddingTop:'0.2rem' }}>
                  {p.n}
                </div>
                <div>
                  <h3 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'2rem', fontWeight:300, fontStyle:'italic', color:'var(--parchment)', marginBottom:'1rem' }}>{p.t}</h3>
                  <p style={{ color:'rgba(168,192,158,0.6)', fontSize:'0.93rem', lineHeight:1.85 }}>{p.body}</p>
                </div>
              </div>
            </RevealWrapper>
          ) })}
        </div>
      </section>

      {/* Training timeline — no dots on a line, just text */}
      <section style={{ background:'var(--parchment-mid)', padding:'7rem 0' }}>
        <div className="container" style={{ maxWidth:'720px' }}>
          <RevealWrapper>
            <div style={{ marginBottom:'3.5rem' }}>
              <div style={{ fontFamily:'Inter,sans-serif', fontSize:'0.6rem', fontWeight:600, letterSpacing:'0.2em', textTransform:'uppercase', color:'var(--text-ghost)', marginBottom:'1rem' }}>{c.timeline.eyebrow}</div>
              <h2 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'2.2rem', fontWeight:300, color:'var(--forest-800)' }}>{c.timeline.heading}</h2>
            </div>
          </RevealWrapper>
          {c.timeline.items.map((item, i) => (
            <RevealWrapper key={i} delay={i*70}>
              <div className="nn-rg-timeline" style={{ display:'grid', gridTemplateColumns:'80px 1fr', gap:'2rem', padding:'1.5rem 0', borderBottom: i < c.timeline.items.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <div style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'1rem', fontStyle:'italic', color:'var(--gold)', paddingTop:'3px', textAlign:'right' }}>{item.year}</div>
                <div style={{ fontFamily:'Inter,sans-serif', fontSize:'0.9rem', color:'var(--text-body)', lineHeight:1.65 }}>{item.text}</div>
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
                {c.audience.eyebrow}
              </div>
              <h2 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'2.4rem', fontWeight:300, color:'var(--parchment)', lineHeight:1.2 }}>
                {c.audience.heading}
              </h2>
            </div>
          </RevealWrapper>
          <div className="nn-rg" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'5rem' }}>
            <RevealWrapper delay={70}>
              <div style={{ fontFamily:'Inter,sans-serif', fontSize:'0.62rem', fontWeight:600, letterSpacing:'0.18em', textTransform:'uppercase', color:'var(--gold-light)', marginBottom:'1.5rem' }}>{c.audience.peopleLabel}</div>
              {c.audience.people.map((t, i) => (
                <div key={i} style={{ fontSize:'0.92rem', color:'rgba(200,217,195,0.68)', lineHeight:1.7, paddingBottom:'1rem', marginBottom:'1rem', borderBottom: i < c.audience.people.length - 1 ? '1px solid rgba(92,122,82,0.2)' : 'none' }}>{t}</div>
              ))}
            </RevealWrapper>
            <RevealWrapper delay={140}>
              <div style={{ fontFamily:'Inter,sans-serif', fontSize:'0.62rem', fontWeight:600, letterSpacing:'0.18em', textTransform:'uppercase', color:'var(--gold-light)', marginBottom:'1.5rem' }}>{c.audience.teamsLabel}</div>
              {c.audience.teams.map((t, i) => (
                <div key={i} style={{ fontSize:'0.92rem', color:'rgba(200,217,195,0.68)', lineHeight:1.7, paddingBottom:'1rem', marginBottom:'1rem', borderBottom: i < c.audience.teams.length - 1 ? '1px solid rgba(92,122,82,0.2)' : 'none' }}>{t}</div>
              ))}
              <Link href="/contact" className="btn btn-outline" style={{ marginTop:'1.5rem', borderColor:'rgba(92,122,82,0.4)', color:'var(--forest-200)' }}>
                {c.audience.teamsButton}
              </Link>
            </RevealWrapper>
          </div>
        </div>
      </section>
    </>
  )
}
