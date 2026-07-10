'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const [email, setEmail]     = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const router                = useRouter()

  const login = async () => {
    if (!email || !password) return
    setLoading(true); setError('')
    const res = await signIn('credentials', { email, password, redirect: false })
    if (res?.ok) {
      router.push('/admin')
    } else {
      setError('Invalid email or password.')
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight:'100vh', background:'var(--forest-900)', display:'flex', alignItems:'center', justifyContent:'center', position:'relative', overflow:'hidden' }}>
      <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', opacity:0.06 }} viewBox="0 0 800 800">
        <circle cx="400" cy="400" r="300" fill="none" stroke="var(--forest-400)" strokeWidth="100"/>
        <circle cx="400" cy="400" r="160" fill="none" stroke="var(--gold)"        strokeWidth="30" opacity="0.5"/>
      </svg>

      <div style={{ background:'var(--parchment)', padding:'3.5rem', width:'100%', maxWidth:'400px', position:'relative', zIndex:2 }}>
        <div style={{ textAlign:'center', marginBottom:'2.5rem' }}>
          <div style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'2rem', fontWeight:300, color:'var(--forest-800)', letterSpacing:'-0.01em' }}>Nova<em>Nest</em></div>
          <div style={{ fontFamily:'Inter,sans-serif', fontSize:'0.55rem', letterSpacing:'0.24em', textTransform:'uppercase', color:'var(--gold)', marginTop:'4px' }}>Admin</div>
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:'1.2rem' }}>
          <div>
            <label className="field-label">Email</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==='Enter'&&login()} className="field-input" placeholder="admin@novanest.com" autoComplete="email"/>
          </div>
          <div>
            <label className="field-label">Password</label>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==='Enter'&&login()} className="field-input" placeholder="••••••••" autoComplete="current-password"/>
          </div>

          {error && <div style={{ fontFamily:'Inter,sans-serif', fontSize:'0.78rem', color:'#c0392b', textAlign:'center', padding:'0.6rem', background:'#fef2f2', border:'1px solid #fecaca' }}>{error}</div>}

          <button onClick={login} disabled={loading || !email || !password} className="btn btn-forest" style={{ justifyContent:'center', marginTop:'0.5rem', opacity:(!email||!password)?0.4:1, cursor:(!email||!password)?'not-allowed':'pointer' }}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </div>

        <p style={{ fontFamily:'Inter,sans-serif', fontSize:'0.68rem', color:'var(--text-ghost)', textAlign:'center', marginTop:'1.5rem', lineHeight:1.6 }}>
          Default: admin@novanest.com / novanest2024!<br/>Change this immediately after first login.
        </p>
      </div>
    </div>
  )
}
