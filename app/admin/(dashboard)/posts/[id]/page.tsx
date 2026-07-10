'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import PostForm from '@/components/ui/PostForm'
import type { PostDoc } from '@/types'

export default function EditPost({ params }: { params: Promise<{ id: string }> }) {
  const router    = useRouter()
  const [id, setId]       = useState('')
  const [post, setPost]   = useState<PostDoc | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    params.then(p => {
      setId(p.id)
      fetch(`/api/posts/${p.id}`).then(r=>r.json()).then(d=>{ setPost(d.data); setLoading(false) }).catch(()=>setLoading(false))
    })
  }, [params])

  const save = async (data: Record<string, unknown>) => {
    const res = await fetch(`/api/posts/${id}`, { method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data) })
    const json = await res.json()
    if (!res.ok) throw new Error(json.error ?? 'Failed to save')
  }

  if (loading) return <div style={{ padding:'3rem', fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'1.2rem', fontStyle:'italic', color:'var(--text-ghost)' }}>Loading…</div>
  if (!post)   return <div style={{ padding:'3rem', fontFamily:'Inter,sans-serif', fontSize:'0.9rem', color:'#c0392b' }}>Post not found.</div>

  return (
    <div style={{ maxWidth:820 }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'2.5rem' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'1rem' }}>
          <button onClick={()=>router.back()} style={{ background:'none', border:'none', cursor:'pointer', fontFamily:'Inter,sans-serif', fontSize:'0.65rem', fontWeight:500, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--forest-500)', padding:0 }}>← Back</button>
          <h1 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'2rem', fontWeight:300, color:'var(--forest-800)' }}>Edit Post</h1>
        </div>
        {post.published && <Link href={`/journal/${post.slug}`} target="_blank" style={{ fontFamily:'Inter,sans-serif', fontSize:'0.65rem', color:'var(--forest-400)', textDecoration:'none' }}>View live ↗</Link>}
      </div>
      <PostForm initial={post} onSave={save} />
    </div>
  )
}
