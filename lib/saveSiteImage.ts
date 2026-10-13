'use client'

/** Client-only. Persists one image slot (hero, about-portrait, offering:<slug>, ...). */
export async function saveSiteImage(key: string, url: string): Promise<void> {
  try {
    await fetch('/api/site-images', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, url }),
    })
  } catch {
    // Non-fatal: the image still shows for this admin's current session even if
    // the save failed (e.g. offline) — it just won't persist for other visitors.
  }
}
