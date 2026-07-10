import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { connectDB } from '@/lib/mongoose'
import { Post }      from '@/lib/models/Post'
import { serialize, formatDate } from '@/lib/utils'
import type { PostDoc } from '@/types'
import { JOURNAL_PLACEHOLDERS } from '@/lib/journalPlaceholders'

export const dynamic = 'force-dynamic'

async function getPost(slug: string): Promise<PostDoc | null> {
  try {
    await connectDB()
    const post = await Post.findOne({ slug }).lean()
    if (post) return serialize(post) as unknown as PostDoc
  } catch { /* DB unavailable — fall through to placeholders below */ }
  // No matching post in the database yet — check the same placeholder set
  // the listing page shows, so a post visible in /journal is never a dead link.
  return JOURNAL_PLACEHOLDERS.find(p => p.slug === slug) ?? null
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return { title: 'Post Not Found' }
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { title: post.title, description: post.excerpt, images: post.coverImage ? [post.coverImage] : [] },
  }
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) notFound()

  // Related posts
  let related: PostDoc[] = []
  try {
    await connectDB()
    related = serialize(await Post.find({ published:true, category:post.category, _id:{ $ne: post._id } }).limit(2).lean()) as unknown as PostDoc[]
  } catch {}

  return (
    <>
      <section style={{ paddingTop:'9rem', paddingBottom:'4rem', background:'var(--forest-900)', position:'relative', overflow:'hidden' }}>
        <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', opacity:0.07 }} viewBox="0 0 1440 400" preserveAspectRatio="xMidYMid slice">
          <path d="M0 400 Q360 180 720 260 Q1080 80 1440 180 L1440 400Z" fill="var(--forest-500)"/>
        </svg>
        <div className="container" style={{ position:'relative', zIndex:2, maxWidth:'820px' }}>
          <Link href="/journal" style={{ display:'inline-flex', alignItems:'center', gap:'0.4rem', fontFamily:'Inter,sans-serif', fontSize:'0.65rem', fontWeight:500, letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--gold-light)', textDecoration:'none', marginBottom:'2rem' }}>← Journal</Link>
          <div className="overline" style={{ color:'var(--gold-light)', marginBottom:'0.8rem' }}>{post.category}</div>
          <h1 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'clamp(2rem,5vw,3.5rem)', fontWeight:300, color:'var(--parchment)', lineHeight:1.1, marginBottom:'1.5rem' }}>{post.title}</h1>
          {post.publishedAt && <div style={{ fontFamily:'Inter,sans-serif', fontSize:'0.72rem', color:'rgba(168,192,158,0.4)', letterSpacing:'0.06em' }}>{formatDate(post.publishedAt, { weekday:'long' })}</div>}
        </div>
      </section>

      {post.coverImage && <div style={{ height:'380px', overflow:'hidden' }}><img src={post.coverImage} alt={post.title} style={{ width:'100%', height:'100%', objectFit:'cover' }}/></div>}

      <article style={{ background:'var(--parchment)', padding:'5rem 0' }}>
        <div className="container" style={{ maxWidth:'720px' }}>
          <div style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'1.15rem', lineHeight:2, color:'var(--text-body)' }}
            dangerouslySetInnerHTML={{ __html: post.content }}/>
          <div style={{ display:'flex', alignItems:'center', gap:'1rem', margin:'4rem 0 3rem' }}>
            <div style={{ flex:1, height:'1px', background:'var(--border-strong)' }}/>
            <span style={{ color:'var(--gold)', fontFamily:'serif' }}>◇</span>
            <div style={{ flex:1, height:'1px', background:'var(--border-strong)' }}/>
          </div>
          <div style={{ background:'var(--parchment-mid)', padding:'2rem', borderLeft:'3px solid var(--gold)' }}>
            <div className="overline" style={{ marginBottom:'0.4rem' }}>Written by</div>
            <div style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'1.25rem', fontWeight:300, color:'var(--forest-800)', marginBottom:'0.3rem' }}>The NovaNest Team</div>
            <p style={{ fontSize:'0.85rem', color:'var(--text-muted)' }}>Nature-based retreat facilitator. Believer that awareness should feel like relief.</p>
          </div>
          <div style={{ textAlign:'center', marginTop:'4rem', display:'flex', gap:'1rem', justifyContent:'center', flexWrap:'wrap' }}>
            <Link href="/book" className="btn btn-forest">Book a Session</Link>
            <Link href="/journal" className="btn btn-outline">← More Writing</Link>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section style={{ background:'var(--parchment-mid)', padding:'5rem 0', borderTop:'1px solid var(--border)' }}>
          <div className="container">
            <div className="overline" style={{ marginBottom:'0.8rem' }}>Continue Reading</div>
            <div className="rule"/>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:'2rem', marginTop:'2rem' }}>
              {related.map((r: PostDoc) => (
                <Link key={r.id} href={`/journal/${r.slug}`} style={{ textDecoration:'none', display:'block', background:'white', padding:'1.8rem' }}>
                  <div className="overline" style={{ marginBottom:'0.5rem' }}>{r.category}</div>
                  <h3 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'1.25rem', fontWeight:300, color:'var(--forest-800)', marginBottom:'0.5rem' }}>{r.title}</h3>
                  <p style={{ fontSize:'0.83rem', color:'var(--text-muted)' }}>{r.excerpt}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
