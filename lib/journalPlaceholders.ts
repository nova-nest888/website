/**
 * Fallback journal posts, shown only when the database has no published posts yet.
 * IMPORTANT: both /journal (listing) and /journal/[slug] (detail) import from this
 * same file, so a post visible in the list is always resolvable on click.
 * Once you publish real posts from /admin/posts, these are ignored automatically.
 */
import type { PostDoc } from '@/types'

export const JOURNAL_PLACEHOLDERS: PostDoc[] = [
  {
    _id: 'p1', id: 'p1',
    title: 'Why We Started Doing Circles Instead of Hangouts',
    slug: 'why-circles-instead-of-hangouts',
    excerpt: "Hanging out is easy to cancel on. A circle you've committed to, with people you've promised to show up for, is a different thing entirely — and it changes what people are willing to say.",
    category: 'community',
    published: true,
    publishedAt: new Date().toISOString(),
    coverImage: undefined,
    content: `<p>A "hangout" is the easiest plan in the world to cancel. Someone's tired, someone's running late, someone gets a better offer — and the group chat quietly agrees to reschedule to a week that never comes.</p>
<p>A circle is different. It has a time, a place, and a small group of people who said yes to each other, not just to an idea. That tiny bit of structure changes what people are willing to say once they're actually in the room.</p>
<p>We didn't design it that way on purpose. It just turned out that the Tuesday group that kept meeting, again and again, ended up being the one where people started telling the truth.</p>`,
    createdAt: '', updatedAt: '',
  },
  {
    _id: 'p2', id: 'p2',
    title: 'The Case for Dancing Badly in Public',
    slug: 'case-for-dancing-badly',
    excerpt: "Nobody's watching as closely as you think. And the people who came to genuinely watch are usually the ones dancing the worst themselves.",
    category: 'movement',
    published: true,
    publishedAt: new Date(Date.now() - 7 * 864e5).toISOString(),
    coverImage: undefined,
    content: `<p>Most adults haven't danced in a room full of strangers since a wedding, and even then, only after enough drinks to stop caring. That's a shame, because there's not much else that gets people out of their heads that fast.</p>
<p>The trick is that nobody's watching as closely as you think. Everyone's a little worried about how they look, which means everyone's mostly looking at themselves. The people who do notice you are usually the ones dancing worse, grateful someone else went first.</p>
<p>We run movement sessions specifically because talking about being present rarely works as well as just being forced into your body for twenty minutes.</p>`,
    createdAt: '', updatedAt: '',
  },
  {
    _id: 'p3', id: 'p3',
    title: "Why Your Team Retreat Probably Didn't Work",
    slug: 'why-your-team-retreat-didnt-work',
    excerpt: "Trust falls and forced icebreakers don't build trust — they build stories people tell about how awkward the retreat was. Here's what we do instead, and why it sticks.",
    category: 'growth',
    published: true,
    publishedAt: new Date(Date.now() - 14 * 864e5).toISOString(),
    coverImage: undefined,
    content: `<p>Most corporate retreats fail for the same reason: they ask people to perform vulnerability on command. A forced icebreaker doesn't build trust, it builds a story people tell each other later about how awkward the retreat was.</p>
<p>What actually works is giving a group something real to do together — a hike with no clear end point, a task that requires them to rely on each other, an hour with no phones and no agenda. Trust shows up as a side effect of a shared experience, not as the point of an exercise.</p>
<p>That's the whole model behind our team retreats. Less trust fall, more actual trail.</p>`,
    createdAt: '', updatedAt: '',
  },
]
