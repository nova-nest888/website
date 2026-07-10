import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{ minHeight:'100vh', background:'var(--forest-900)', display:'flex', alignItems:'center', justifyContent:'center', textAlign:'center', position:'relative', overflow:'hidden' }}>
      <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', opacity:0.06 }} viewBox="0 0 800 800">
        <circle cx="400" cy="400" r="300" fill="none" stroke="var(--forest-400)" strokeWidth="100"/>
        <circle cx="400" cy="400" r="160" fill="none" stroke="var(--forest-300)" strokeWidth="40"/>
      </svg>
      <div style={{ position:'relative', zIndex:2, padding:'2rem' }}>
        <div style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'7rem', fontWeight:200, color:'var(--forest-600)', lineHeight:1, marginBottom:'1rem', opacity:0.3 }}>
          404
        </div>
        <h1 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'2rem', fontWeight:300, color:'var(--parchment)', marginBottom:'0.8rem' }}>
          This path leads nowhere.
        </h1>
        <p style={{ fontFamily:'Inter,sans-serif', fontSize:'0.9rem', color:'rgba(168,192,158,0.5)', marginBottom:'2.5rem', lineHeight:1.7 }}>
          Some paths circle back. Let&apos;s find yours.
        </p>
        <Link href="/" className="btn btn-light" style={{ display:'inline-flex' }}>
          Return Home
        </Link>
      </div>
    </div>
  )
}
