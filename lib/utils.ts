// ─── General utilities ─────────────────────────────────────────────────────────

/**
 * Serialize Mongoose lean documents for safe JSON transfer.
 * `.lean()` gives back a plain object with only `_id` (an ObjectId) — it does NOT
 * include the `id` virtual Mongoose normally adds. Every *Doc type in types/index.ts
 * declares both `_id` and `id` as strings, so without this, `doc.id` is silently
 * `undefined` on every real document — which is why list keys (key={item.id}) were
 * empty/duplicated and React complained. This adds `id` back in, on both single
 * documents and arrays of them.
 */
export function serialize<T>(doc: T): T {
  const plain = JSON.parse(JSON.stringify(doc))
  const withId = (o: any) => (o && typeof o === 'object' && o._id && !o.id ? { ...o, id: o._id } : o)
  return (Array.isArray(plain) ? plain.map(withId) : withId(plain)) as T
}

/** Generate a URL-safe slug from a string */
export function toSlug(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/** Truncate text to n characters with ellipsis */
export function truncate(str: string, n: number): string {
  return str.length > n ? str.slice(0, n - 1) + '…' : str
}

/** Format a date for display */
export function formatDate(date: string | Date, opts?: Intl.DateTimeFormatOptions): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
    ...opts,
  })
}

/** Verify a Cal.com webhook signature */
export async function verifyCalWebhook(
  body: string,
  signature: string | null
): Promise<boolean> {
  const secret = process.env.CAL_WEBHOOK_SECRET
  if (!secret) return true // skip verification if not configured

  if (!signature) return false

  const { createHmac } = await import('crypto')
  const expected = createHmac('sha256', secret).update(body).digest('hex')
  return signature === `sha256=${expected}` || signature === expected
}

/** Build an API error response */
export function apiError(message: string, status = 400) {
  return Response.json({ error: message }, { status })
}

/** Build an API success response */
export function apiSuccess<T>(data: T, status = 200) {
  return Response.json({ data }, { status })
}
