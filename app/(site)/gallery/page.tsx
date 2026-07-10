import type { Metadata } from 'next'
import { connectDB } from '@/lib/mongoose'
import { Photo }     from '@/lib/models/Photo'
import { serialize } from '@/lib/utils'
import type { PhotoDoc } from '@/types'

export const metadata: Metadata = { title: 'Gallery' }
export const revalidate = 3600

async function getPhotos(): Promise<PhotoDoc[]> {
  try {
    await connectDB()
    return serialize(await Photo.find({ isActive: true }).sort({ order: 1, createdAt: -1 }).lean()) as unknown as PhotoDoc[]
  } catch { return [] }
}

export default async function GalleryPage() {
  const photos = await getPhotos()

  return (
    <>
      <section style={{ paddingTop:'9rem', paddingBottom:'5rem', background:'var(--forest-900)', position:'relative', overflow:'hidden' }}>
        <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', opacity:0.07 }} viewBox="0 0 1440 400" preserveAspectRatio="xMidYMid slice">
          <path d="M0 400 Q480 150 960 250 Q1200 80 1440 160 L1440 400Z" fill="var(--forest-400)"/>
        </svg>
        <div className="container" style={{ position:'relative', zIndex:2 }}>
          <div className="overline" style={{ color:'var(--gold-light)' }}>Photos & Moments</div>
          <div className="rule" style={{ background:'var(--gold)' }}/>
          <h1 className="headline" style={{ color:'var(--parchment)', marginBottom:'1rem' }}>Gallery</h1>
          <p style={{ color:'rgba(168,192,158,0.65)', maxWidth:'520px', fontSize:'1.05rem' }}>
            Hikes, circles, dance floors, and the odd very good campfire — a running record of what actually happens at NovaNest.
          </p>
        </div>
      </section>

      <section style={{ background:'var(--parchment)', padding:'5rem 0' }}>
        <div className="container">
          {photos.length === 0 ? (
            <div style={{ background:'white', padding:'5rem 2rem', textAlign:'center' }}>
              <p style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'1.5rem', fontStyle:'italic', color:'var(--text-ghost)' }}>
                The gallery is empty for now.
              </p>
              <p style={{ fontFamily:'Inter,sans-serif', fontSize:'0.85rem', color:'var(--text-muted)', marginTop:'0.8rem' }}>
                Photos added from the admin dashboard will show up here.
              </p>
            </div>
          ) : (
            <div className="nn-gallery-grid">
              {photos.map(p => (
                <a
                  key={p.id}
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nn-gallery-item"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.url} alt={p.caption ?? ''} loading="lazy" />
                  {p.caption && <span className="nn-gallery-caption">{p.caption}</span>}
                </a>
              ))}
            </div>
          )}
        </div>
      </section>

      <style>{`
        .nn-gallery-grid {
          column-count: 3;
          column-gap: 2px;
        }
        .nn-gallery-item {
          display: block;
          position: relative;
          margin-bottom: 2px;
          break-inside: avoid;
          overflow: hidden;
          text-decoration: none;
        }
        .nn-gallery-item img {
          width: 100%;
          display: block;
          transition: transform 0.5s ease;
        }
        .nn-gallery-item:hover img { transform: scale(1.04); }
        .nn-gallery-caption {
          position: absolute;
          left: 0; right: 0; bottom: 0;
          padding: 1.4rem 1rem 0.9rem;
          background: linear-gradient(to top, rgba(26,36,20,0.75), transparent);
          color: var(--parchment);
          font-family: Inter, sans-serif;
          font-size: 0.78rem;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .nn-gallery-item:hover .nn-gallery-caption { opacity: 1; }
        @media (max-width: 900px) { .nn-gallery-grid { column-count: 2; } }
        @media (max-width: 560px) { .nn-gallery-grid { column-count: 1; } }
      `}</style>
    </>
  )
}
