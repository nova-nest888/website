import Link from 'next/link'

export default function MaintenanceNotice({ title, message }: { title: string; message?: string }) {
  return (
    <section style={{ minHeight:'100vh', background:'var(--forest-900)', display:'flex', alignItems:'center', justifyContent:'center', padding:'8rem 1.5rem 5rem' }}>
      <div style={{ maxWidth:'560px', textAlign:'center' }}>
        <div style={{ fontFamily:'Inter,sans-serif', fontSize:'0.6rem', fontWeight:600, letterSpacing:'0.22em', textTransform:'uppercase', color:'var(--gold-light)', marginBottom:'1.5rem' }}>
          {title}
        </div>
        <h1 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'clamp(2.2rem,5vw,3.6rem)', fontWeight:300, color:'var(--parchment)', lineHeight:1.1, marginBottom:'1.5rem' }}>
          This page is <em>under maintenance</em>
        </h1>
        <p style={{ color:'rgba(168,192,158,0.65)', fontSize:'1.02rem', lineHeight:1.8, fontFamily:'Inter,sans-serif', marginBottom:'2.5rem' }}>
          {message?.trim() || "We're making a few improvements here. Please check back soon."}
        </p>
        <Link href="/" className="btn btn-light">Back to home</Link>
      </div>
    </section>
  )
}
