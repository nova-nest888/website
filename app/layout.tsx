import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, Inter } from 'next/font/google'
import './globals.css'
import SiteShell from '@/components/layout/SiteShell'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'], weight: ['300','400','500','600'],
  style: ['normal','italic'], variable: '--font-cormorant', display: 'swap',
})
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })

export const viewport: Viewport = { themeColor: '#2D3D2A' }

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL ?? 'https://novanest.com'),
  title: { default: 'NovaNest — A New Way of Living', template: '%s — NovaNest' },
  description: "NovaNest is a community-driven experience company creating meaningful spaces to reconnect with yourself, others, and nature — through weekly gatherings, outdoor experiences, workshops, and retreats.",
  keywords: ['community experiences','nature retreat','outdoor gatherings','team retreats','workshops','sound healing','breathwork','NovaNest'],
  authors: [{ name: 'NovaNest' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'NovaNest',
    title: 'NovaNest — A New Way of Living',
    description: 'What if clarity lives somewhere between laughter, connection, and nature?',
    images: [{ url: '/images/og.jpg', width: 1200, height: 630, alt: 'NovaNest' }],
  },
  twitter: { card: 'summary_large_image', title: 'NovaNest', description: 'What if clarity lives somewhere between laughter, connection, and nature?' },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <body>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  )
}
