'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const LINKS = [
  { href: '/offerings', label: 'Experiences' },
  { href: '/about',     label: 'About'     },
  { href: '/gallery',   label: 'Gallery'   },
  { href: '/journal',   label: 'Journal'   },
  { href: '/contact',   label: 'Contact'   },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen]         = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 48)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        padding: scrolled ? '0.85rem 2rem' : '1.5rem 2rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: scrolled ? 'rgba(240,237,230,0.94)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(61,82,50,0.1)' : 'none',
        transition: 'all 0.35s ease',
      }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1.45rem', fontWeight: 300, letterSpacing: '-0.01em', color: scrolled ? 'var(--forest-800)' : 'var(--parchment)', transition: 'color 0.35s ease' }}>
            Nova<em>Nest</em>
          </div>
          <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.48rem', letterSpacing: '0.26em', textTransform: 'uppercase', color: scrolled ? 'var(--gold)' : 'rgba(200,217,195,0.7)', marginTop: '1px', transition: 'color 0.35s ease' }}>
            A New Way of Living
          </div>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }} className="nn-desk">
          {LINKS.map(l => (
            <Link key={l.href} href={l.href} style={{
              fontFamily: 'Inter, sans-serif', fontSize: '0.66rem', fontWeight: 500,
              letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none',
              color: scrolled ? 'var(--forest-700)' : 'rgba(240,237,230,0.8)',
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.color = scrolled ? 'var(--forest-500)' : 'var(--parchment)'}
            onMouseLeave={e => e.currentTarget.style.color = scrolled ? 'var(--forest-700)' : 'rgba(240,237,230,0.8)'}
            >{l.label}</Link>
          ))}
          <Link href="/book" className={`btn ${scrolled ? 'btn-forest' : 'btn-light'}`} style={{ padding: '0.6rem 1.4rem', fontSize: '0.62rem' }}>
            Book an Experience
          </Link>
        </div>

        <button onClick={() => setOpen(!open)} style={{ background:'none', border:'none', cursor:'pointer', display:'none', flexDirection:'column', gap:'5px', padding:'4px' }} className="nn-burger" aria-label="Menu">
          {[0,1,2].map(i => (
            <span key={i} style={{
              display:'block', width:'22px', height:'1.5px',
              background: scrolled ? 'var(--forest-700)' : 'var(--parchment)',
              transition:'all 0.25s ease',
              opacity: open && i===1 ? 0 : 1,
              transform: open ? (i===0 ? 'rotate(45deg) translate(4.5px,4.5px)' : i===2 ? 'rotate(-45deg) translate(4.5px,-4.5px)' : 'none') : 'none',
            }}/>
          ))}
        </button>
      </nav>

      {open && (
        <div style={{ position:'fixed', inset:0, zIndex:199, background:'var(--forest-900)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'2rem' }}>
          {[...LINKS, { href:'/book', label:'Book an Experience' }].map(l => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} style={{ fontFamily:"'Cormorant Garamond', Georgia, serif", fontSize:'2.5rem', fontWeight:300, color:'var(--parchment)', textDecoration:'none' }}>{l.label}</Link>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width:768px) { .nn-desk{display:none!important} .nn-burger{display:flex!important} }
      `}</style>
    </>
  )
}
