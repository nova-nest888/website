'use client'
import { usePathname } from 'next/navigation'
import { SessionProvider } from 'next-auth/react'
import Nav from './Nav'
import Footer from './Footer'

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin  = pathname?.startsWith('/admin')

  // Admin pages have their own SessionProvider in their layout
  if (isAdmin) return <>{children}</>

  return (
    // Wrap public pages with SessionProvider so useSession() works
    // (e.g. to show/hide admin-only upload buttons)
    <SessionProvider>
      <Nav />
      <main>{children}</main>
      <Footer />
    </SessionProvider>
  )
}
