'use client'
import { SessionProvider, useSession, signOut } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'

const NAV = [
  { href:'/admin',                    label:'Overview',     icon:'◎', exact:true },
  { href:'/admin/bookings',           label:'Bookings',     icon:'◈' },
  { href:'/admin/availability',       label:'Availability', icon:'▷' },
  { href:'/admin/services',           label:'Services',     icon:'◇' },
  { href:'/admin/posts',              label:'Journal',      icon:'○' },
  { href:'/admin/testimonials',       label:'Testimonials', icon:'◉' },
  { href:'/admin/gallery',            label:'Gallery',      icon:'▦' },
  { href:'/admin/settings',           label:'Settings',     icon:'⚙' },
]

function DashShell({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const router   = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (status === 'unauthenticated') router.replace('/admin/login')
  }, [status, router])

  if (status === 'loading') return (
    <div style={{ minHeight:'100vh', background:'var(--parchment)', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'1.4rem', fontStyle:'italic', color:'var(--forest-500)' }}>Loading…</div>
    </div>
  )
  if (!session) return null

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'var(--parchment)' }}>
      {/* Sidebar */}
      <aside className="admin-sidebar" style={{ width:230, background:'var(--forest-900)', display:'flex', flexDirection:'column', flexShrink:0, position:'fixed', top:0, left:0, bottom:0, zIndex:50 }}>
        <div style={{ padding:'1.8rem 1.6rem', borderBottom:'1px solid rgba(61,82,50,0.22)' }}>
          <div style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'1.4rem', fontWeight:300, color:'var(--parchment)' }}>Nova<em>Nest</em></div>
          <div style={{ fontFamily:'Inter,sans-serif', fontSize:'0.5rem', letterSpacing:'0.24em', textTransform:'uppercase', color:'var(--gold-light)', marginTop:'2px' }}>Admin</div>
        </div>

        <nav className="admin-sidebar-nav" style={{ flex:1, padding:'1.2rem 0', overflowY:'auto' }}>
          {NAV.map(item => {
            const active = item.exact ? pathname === item.href : pathname.startsWith(item.href)
            return (
              <Link key={item.href} href={item.href} className={`admin-sidebar-link ${active ? 'active' : ''}`}>
                <span className="icon">{item.icon}</span>
                <span className="label">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div style={{ padding:'1.2rem 1.6rem', borderTop:'1px solid rgba(61,82,50,0.22)' }}>
          <div style={{ fontFamily:'Inter,sans-serif', fontSize:'0.66rem', color:'rgba(155,170,150,0.4)', marginBottom:'0.7rem', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
            {session.user?.email}
          </div>
          <div style={{ display:'flex', gap:'1.2rem' }}>
            <Link href="/" target="_blank" style={{ fontFamily:'Inter,sans-serif', fontSize:'0.62rem', color:'var(--forest-300)', textDecoration:'none' }}>View site ↗</Link>
            <button onClick={() => signOut({ callbackUrl:'/admin/login' })} style={{ background:'none', border:'none', cursor:'pointer', fontFamily:'Inter,sans-serif', fontSize:'0.62rem', color:'rgba(155,170,150,0.35)', padding:0 }}>Sign out</button>
          </div>
        </div>
      </aside>

      <main className="admin-main" style={{ marginLeft:230, flex:1, padding:'2.5rem 3rem', minHeight:'100vh' }}>
        {children}
      </main>
    </div>
  )
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <SessionProvider><DashShell>{children}</DashShell></SessionProvider>
}
