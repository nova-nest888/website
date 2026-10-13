'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { PostDoc } from '@/types'

export default function AdminPosts() {
  const [posts, setPosts]     = useState<PostDoc[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/posts').then(r=>r.json()).then(d=>{ setPosts(Array.isArray(d.data)?d.data:[]); setLoading(false) }).catch(()=>setLoading(false))
  }, [])

  const toggle = async (id: string, published: boolean) => {
    await fetch(`/api/posts/${id}`, { method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ published:!published }) })
    setPosts(p=>p.map(x=>x.id===id?{...x,published:!published}:x))
  }
  const del = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return
    await fetch(`/api/posts/${id}`, { method:'DELETE' })
    setPosts(p=>p.filter(x=>x.id!==id))
  }

  return (
    <div>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'2.5rem' }}>
        <div>
          <h1 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'2.2rem', fontWeight:300, color:'var(--forest-800)', marginBottom:'0.25rem' }}>Journal</h1>
          <p style={{ fontFamily:'Inter,sans-serif', fontSize:'0.8rem', color:'var(--text-muted)' }}>{posts.filter(p=>p.published).length} published · {posts.filter(p=>!p.published).length} drafts</p>
        </div>
        <Link href="/admin/posts/new" className="btn btn-forest" style={{ fontSize:'0.65rem' }}>+ New Post</Link>
      </div>

      {loading ? (
        <div style={{ padding:'3rem', fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'1.2rem', fontStyle:'italic', color:'var(--text-ghost)' }}>Loading…</div>
      ) : posts.length === 0 ? (
        <div style={{ background:'white', padding:'4rem', textAlign:'center' }}>
          <p style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'1.4rem', fontStyle:'italic', color:'var(--text-ghost)', marginBottom:'1.5rem' }}>No posts yet. Start writing.</p>
          <Link href="/admin/posts/new" className="btn btn-forest">Write First Post</Link>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:'2px' }}>
          {posts.map(p => (
            <div key={p.id} style={{ background:'white', padding:'1.4rem 2rem', display:'grid', gridTemplateColumns:'1fr auto', gap:'1.5rem', alignItems:'center', borderLeft:`3px solid ${p.published?'var(--forest-400)':'var(--border-strong)'}`, opacity:p.published?1:0.65 }}>
              <div>
                <div style={{ display:'flex', alignItems:'center', gap:'0.7rem', marginBottom:'0.25rem' }}>
                  <span style={{ fontFamily:'Inter,sans-serif', fontSize:'0.6rem', fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', color:p.published?'var(--forest-600)':'var(--text-ghost)', padding:'0.15rem 0.45rem', border:`1px solid ${p.published?'var(--forest-300)':'var(--border-strong)'}` }}>{p.published?'Published':'Draft'}</span>
                  <span className="overline">{p.category}</span>
                </div>
                <div style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'1.2rem', fontWeight:300, color:'var(--forest-800)', marginBottom:'0.2rem' }}>{p.title}</div>
                <div style={{ fontFamily:'Inter,sans-serif', fontSize:'0.68rem', color:'var(--text-ghost)' }}>
                  {new Date(p.createdAt).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}
                </div>
              </div>
              <div style={{ display:'flex', gap:'0.5rem', alignItems:'center', flexShrink:0 }}>
                {p.published && <Link href={`/journal/${p.slug}`} target="_blank" style={{ fontFamily:'Inter,sans-serif', fontSize:'0.62rem', fontWeight:500, letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--forest-400)', textDecoration:'none', padding:'0.32rem 0.6rem', border:'1px solid var(--border-strong)' }}>View ↗</Link>}
                <button onClick={()=>toggle(p.id,p.published)} style={{ fontFamily:'Inter,sans-serif', fontSize:'0.62rem', fontWeight:500, letterSpacing:'0.1em', textTransform:'uppercase', cursor:'pointer', padding:'0.32rem 0.65rem', border:'1.5px solid', borderColor:p.published?'var(--border-strong)':'var(--forest-400)', background:p.published?'transparent':'var(--forest-600)', color:p.published?'var(--text-muted)':'white', transition:'all 0.15s ease' }}>{p.published?'Unpublish':'Publish'}</button>
                <Link href={`/admin/posts/${p.id}`} style={{ fontFamily:'Inter,sans-serif', fontSize:'0.62rem', fontWeight:500, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--forest-700)', textDecoration:'none', padding:'0.32rem 0.65rem', border:'1.5px solid var(--border-strong)', display:'inline-block' }}>Edit</Link>
                <button onClick={()=>del(p.id,p.title)} style={{ fontFamily:'Inter,sans-serif', fontSize:'0.62rem', fontWeight:500, letterSpacing:'0.08em', textTransform:'uppercase', cursor:'pointer', padding:'0.32rem 0.6rem', border:'1px solid #fecaca', background:'none', color:'#c0392b' }}>✕</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
