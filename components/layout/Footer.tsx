'use client'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer style={{ background: 'var(--forest-900)', padding: '5rem 0 2.5rem' }}>
      <div className="container">
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(190px,1fr))', gap:'3rem', marginBottom:'4rem' }}>
          <div>
            <div style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'1.8rem', fontWeight:300, color:'var(--parchment)', marginBottom:'0.2rem' }}>Nova<em>Nest</em></div>
            <div style={{ fontFamily:'Inter,sans-serif', fontSize:'0.52rem', letterSpacing:'0.26em', textTransform:'uppercase', color:'var(--gold-light)', marginBottom:'1.5rem' }}>A New Way of Living</div>
            <p style={{ color:'rgba(168,192,158,0.6)', fontSize:'0.88rem', lineHeight:1.8, maxWidth:'260px' }}>
              A community-driven experience company for people who'd rather laugh their way to clarity than sit through another lecture.
            </p>
            <p style={{ fontFamily:'Inter,sans-serif', fontSize:'0.7rem', fontStyle:'italic', color:'var(--gold-light)', marginTop:'1.2rem', letterSpacing:'0.04em' }}>Growth doesn't have to be serious.</p>
          </div>
          <div>
            <div className="overline" style={{ color:'var(--forest-300)', marginBottom:'1.2rem' }}>Explore</div>
            {['/', '/offerings', '/about', '/journal', '/book', '/contact'].map((href, i) => {
              const labels = ['Home','Offerings','About','Journal','Book a Session','Contact']
              return (
                <div key={href} style={{ marginBottom:'0.6rem' }}>
                  <Link href={href} style={{ fontFamily:'Inter,sans-serif', fontSize:'0.83rem', color:'rgba(168,192,158,0.5)', textDecoration:'none', transition:'color 0.2s ease' }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--forest-100)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(168,192,158,0.5)'}
                  >{labels[i]}</Link>
                </div>
              )
            })}
          </div>
          <div>
            <div className="overline" style={{ color:'var(--forest-300)', marginBottom:'1.2rem' }}>What to Expect</div>
            {['Nature meets growth','Movement meets mindfulness','Strangers become community','Fun meets reflection'].map(t => (
              <div key={t} style={{ display:'flex', gap:'0.6rem', marginBottom:'0.7rem', alignItems:'flex-start' }}>
                <span style={{ color:'var(--gold)', flexShrink:0, marginTop:'2px', fontSize:'0.7rem' }}>◇</span>
                <span style={{ fontFamily:'Inter,sans-serif', fontSize:'0.82rem', color:'rgba(168,192,158,0.55)', lineHeight:1.6 }}>{t}</span>
              </div>
            ))}
          </div>
          <div>
            <div className="overline" style={{ color:'var(--forest-300)', marginBottom:'1.2rem' }}>Connect</div>
            <a href="https://instagram.com/novanest_777" target="_blank" rel="noopener" style={{ display:'block', fontFamily:'Inter,sans-serif', fontSize:'0.83rem', color:'rgba(168,192,158,0.55)', textDecoration:'none', marginBottom:'0.5rem' }}>Instagram @novanest_777</a>
            <Link href="/book" className="btn btn-outline" style={{ marginTop:'1.5rem', borderColor:'rgba(92,122,82,0.4)', color:'var(--forest-200)', fontSize:'0.62rem', padding:'0.65rem 1.2rem' }}>
              Book Now
            </Link>
          </div>
        </div>
        <div style={{ borderTop:'1px solid rgba(61,82,50,0.22)', paddingTop:'2rem', display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:'1rem' }}>
          <p style={{ fontFamily:'Inter,sans-serif', fontSize:'0.7rem', color:'rgba(155,170,150,0.35)' }}>© {new Date().getFullYear()} NovaNest. All rights reserved.</p>
          <Link href="/admin" style={{ fontFamily:'Inter,sans-serif', fontSize:'0.65rem', color:'rgba(155,170,150,0.2)', textDecoration:'none' }}>Admin ↗</Link>
        </div>
      </div>
    </footer>
  )
}
