import type { Metadata } from 'next'
import Link from 'next/link'
import { connectDB } from '@/lib/mongoose'
import { Post }      from '@/lib/models/Post'
import { serialize, formatDate } from '@/lib/utils'
import type { PostDoc } from '@/types'
import { JOURNAL_PLACEHOLDERS } from '@/lib/journalPlaceholders'

export const metadata: Metadata = { title: 'Journal' }
export const revalidate = 3600

async function getPosts(): Promise<PostDoc[]> {
  try {
    await connectDB()
    return serialize(await Post.find({ published: true }).sort({ publishedAt: -1 }).lean()) as unknown as PostDoc[]
  } catch { return [] }
}

export default async function JournalPage() {
  const posts = await getPosts()
  const display = posts.length > 0 ? posts : JOURNAL_PLACEHOLDERS
  const [featured, ...rest] = display

  return (
    <>
      <section style={{ paddingTop:'9rem', paddingBottom:'5rem', background:'var(--forest-900)', position:'relative', overflow:'hidden' }}>
        <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', opacity:0.07 }} viewBox="0 0 1440 400" preserveAspectRatio="xMidYMid slice">
          <path d="M0 400 Q480 150 960 250 Q1200 80 1440 160 L1440 400Z" fill="var(--forest-400)"/>
        </svg>
        <div className="container" style={{ position:'relative', zIndex:2 }}>
          <div className="overline" style={{ color:'var(--gold-light)' }}>Notes & Stories</div>
          <div className="rule" style={{ background:'var(--gold)' }}/>
          <h1 className="headline" style={{ color:'var(--parchment)', marginBottom:'1rem' }}>The Journal</h1>
          <p style={{ color:'rgba(168,192,158,0.65)', maxWidth:'500px', fontSize:'1.05rem' }}>Stories from the trail, the circle, and the odd Tuesday that turned into something worth writing down.</p>
        </div>
      </section>

      {/* Featured */}
      <section style={{ background:'var(--parchment-mid)', padding:'5rem 0', borderBottom:'1px solid var(--border)' }}>
        <div className="container">
          <Link href={`/journal/${featured.slug}`} style={{ textDecoration:'none', display:'block' }}>
            <div className="nn-rg" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'4rem', alignItems:'center' }}>
              <div style={{ aspectRatio:'4/3', background:'linear-gradient(140deg,var(--forest-700),var(--forest-400))', position:'relative', overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'center' }}>
                {featured.coverImage
                  ? <img src={featured.coverImage} alt={featured.title} style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover' }}/>
                  : <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%' }} viewBox="0 0 500 375"><path d="M0 375 Q125 200 250 280 Q375 150 500 220 L500 375Z" fill="rgba(28,43,26,0.4)"/></svg>
                }
              </div>
              <div>
                <div className="overline" style={{ marginBottom:'0.8rem' }}>Featured · {featured.category}</div>
                <h2 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'2.2rem', fontWeight:300, color:'var(--forest-800)', lineHeight:1.15, marginBottom:'1rem' }}>{featured.title}</h2>
                <p style={{ color:'var(--text-body)', lineHeight:1.8, marginBottom:'1.5rem' }}>{featured.excerpt}</p>
                <span style={{ fontFamily:'Inter,sans-serif', fontSize:'0.68rem', fontWeight:600, letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--gold)' }}>Read →</span>
              </div>
            </div>
          </Link>
        </div>
      </section>

      <section style={{ background:'var(--parchment)', padding:'5rem 0' }}>
        <div className="container">
          {rest.length > 0 ? (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))', gap:'2.5rem' }}>
              {rest.map((post: PostDoc) => (
                <Link key={post.id} href={`/journal/${post.slug}`} style={{ textDecoration:'none' }}>
                  <article>
                    <div style={{ aspectRatio:'16/9', background:'linear-gradient(120deg,var(--forest-100),var(--parchment-deep))', marginBottom:'1.5rem', position:'relative', overflow:'hidden' }}>
                      {post.coverImage && <img src={post.coverImage} alt={post.title} style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover' }}/>}
                    </div>
                    <div className="overline" style={{ marginBottom:'0.5rem' }}>{post.category}</div>
                    <h3 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'1.4rem', fontWeight:300, color:'var(--forest-800)', lineHeight:1.2, marginBottom:'0.6rem' }}>{post.title}</h3>
                    <p style={{ fontSize:'0.87rem', color:'var(--text-body)', lineHeight:1.75, marginBottom:'0.8rem' }}>{post.excerpt}</p>
                    <span style={{ fontFamily:'Inter,sans-serif', fontSize:'0.65rem', fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--gold)' }}>Read →</span>
                  </article>
                </Link>
              ))}
            </div>
          ) : (
            <p style={{ textAlign:'center', fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'1.4rem', fontStyle:'italic', color:'var(--text-ghost)' }}>More writing is coming.</p>
          )}
        </div>
      </section>
    </>
  )
}
