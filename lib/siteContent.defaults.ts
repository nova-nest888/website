/**
 * Default site copy + the shape of everything editable from Admin → Site Content.
 * Pages read the saved version from the database and fall back to these defaults,
 * so the site always has text even before anyone edits anything.
 * Safe to import from both server and client code (plain data only).
 */

// ─── Types ───────────────────────────────────────────────────────────────────
export interface HomeContent {
  hero: { eyebrow: string; line1: string; line2: string; emphasis: string; paragraph: string; primaryButton: string; secondaryButton: string }
  intro: { quote: string; paragraph: string; button: string; sideHeading: string; moments: { tag: string; heading: string; body: string }[]; sideNote: string }
  expect: { label: string; items: { title: string; text: string }[]; highlight: string; highlightRest: string }
  ways: {
    title: string; linkLabel: string
    big: { title: string; text: string; button: string }
    small: { category: string; title: string; text: string; href: string }[]
    row: { category: string; title: string; text: string; href: string }[]
  }
  testimonials: { eyebrow: string; heading: string; headingEm: string; sub: string }
  cta: { line1: string; emphasis: string; paragraph: string; primaryButton: string; secondaryButton: string }
}

export interface AboutContent {
  header: { eyebrow: string; headline: string; quote: string }
  story: {
    label: string; quote: string
    chapters: { title: string; hook: string; kind: 'para' | 'quote'; body: string; emphasis: string }[]
    primaryButton: string; secondaryButton: string
  }
  portraitCaption: string
  pillars: { eyebrow: string; heading: string; intro: string; items: { title: string; body: string }[] }
  timeline: { eyebrow: string; heading: string; items: { year: string; text: string }[] }
  audience: { eyebrow: string; heading: string; peopleLabel: string; people: string[]; teamsLabel: string; teams: string[]; teamsButton: string }
}

/** A price line inside a tier, e.g. "Private groups from $200". If serviceSlug is set and that service has a price, the service price wins. */
export interface TierPrice { label: string; amount?: number; serviceSlug?: string }
export interface OfferingTier { label: string; tagline: string; description: string; meta: string; note: string; cta: string; prices?: TierPrice[] }
export interface OfferingItem {
  slug: string
  category: string
  title: string
  /** Slug of the bookable service (Admin → Services). If that service has a price, it is shown here automatically. */
  serviceSlug: string
  duration: string
  format: string
  /** Price in $ used when there is no linked service price. Shown as "From $X" + unit. */
  priceAmount?: number
  /** Legacy free-text price (only used if priceAmount is empty) */
  priceText?: string
  priceUnit: string
  tagline: string
  description: string
  includesTitle: string
  callouts: string[]
  footnote: string
  destinations: string
  variant?: { title: string; priceAmount?: number; priceUnit?: string; price?: string; description: string; meta: string; footnote: string }
  ctaLabel: string
  // "Intro + bullets" layout (used when bullets are filled in)
  intro: string
  bullets: string[]
  closingLine: string
  // "Tiers" layout (used when tiers are filled in)
  approach: string
  tiers: OfferingTier[]
}
export interface OfferingsContent {
  header: { eyebrow: string; headline: string; headlineEm: string; paragraph: string }
  feelings: { eyebrow: string; heading: string; items: { prompt: string; items: string[] }[] }
  items: OfferingItem[]
  cta: { heading: string; paragraph: string; primaryButton: string; secondaryButton: string }
}

export interface SiteContent { home: HomeContent; about: AboutContent; offerings: OfferingsContent }
export type SiteContentSection = keyof SiteContent

// ─── Home ────────────────────────────────────────────────────────────────────
export const DEFAULT_HOME: HomeContent = {
  hero: {
    eyebrow: 'A New Way of Living',
    line1: 'What if clarity lives',
    line2: 'somewhere between',
    emphasis: 'laughter and nature?',
    paragraph: 'NovaNest is a community-driven experience company creating spaces to pause, play, explore, connect, and see life a little differently — through outdoor adventures, creative workshops, spiritual experiences, gatherings, and retreats.',
    primaryButton: 'Find Your Experience',
    secondaryButton: 'See What We Do',
  },
  intro: {
    quote: "\"Growth doesn't have to be serious.\"",
    paragraph: 'Since NovaNest operates in this philosophy, we design weekly gatherings and lead hikes, neuroscience workshops, and immersive retreats — experiences that replace routine with curiosity, pressure with play, and small talk with genuine connection — helping people leave feeling lighter, clearer, and more alive.',
    button: 'Read our story',
    sideHeading: "Here's what surprises most people.",
    moments: [
      { tag: 'Arrival', heading: "You arrive wondering if you'll fit in.", body: 'Most people come alone — or know just one person. Somewhere between the trail, the tea, and the conversations, strangers quietly become familiar.' },
      { tag: 'Phone', heading: 'You forget your phone exists.', body: 'Not because anyone asks you to put it away. Because the people, the place, and the moment become more interesting than your screen.' },
      { tag: 'Self Discovery', heading: 'You discover things about yourself by doing, not just thinking.', body: "Whether you're moving, creating, or simply being present, the insights tend to arrive when you're not chasing them." },
      { tag: 'Leaving', heading: 'You leave lighter than you arrived.', body: "Sometimes it's a new friend. Sometimes it's a fresh perspective. Sometimes it's simply remembering how good it feels to be yourself." },
    ],
    sideNote: "No two NovaNest experiences are exactly the same. But these are the moments people talk about long after they're over.",
  },
  expect: {
    label: 'Expect',
    items: [
      { title: 'Nature', text: 'meets growth.' },
      { title: 'Movement', text: 'meets mindfulness.' },
      { title: 'Science', text: 'meets self-discovery.' },
    ],
    highlight: 'Strangers become community',
    highlightRest: '— and fun meets reflection.',
  },
  ways: {
    title: 'Ways to join in',
    linkLabel: 'See all experiences →',
    big: {
      title: 'Nature Experiences',
      text: "Guided hikes, nature walks, and outdoor reflection sessions built around noticing the things you don't notice indoors. We also run regular community gatherings outdoors — the best conversations tend to happen when nobody's trying to have one.",
      button: 'Book this',
    },
    small: [
      { category: 'Presence', title: 'Sound & Breathwork', text: "Sound healing and breathwork sessions for minds that don't slow down just because someone told them to relax.", href: '/offerings#sound-healing' },
      { category: 'Movement', title: 'Movement & Expression', text: 'Somatic sessions, free-form dance, and playful group activities. No steps to learn, no mirrors to check yourself in.', href: '/offerings#movement-expression' },
    ],
    row: [
      { category: 'Growth', title: 'Mind, Brain & Behaviour', text: 'NLP, behavioural psychology, and accessible neuroscience — for individuals and teams who learn by doing, not by sitting through slides.', href: '/offerings#mind-brain-behaviour' },
      { category: 'Immersion', title: 'Retreats', text: 'Weekend retreats, nature retreats, and fully customized team retreats. The thing people keep coming back to, years later.', href: '/offerings#design-your-nepal-experience' },
      { category: 'Community', title: 'Weekly Gatherings', text: 'Regular hikes, circles, and community events. The easiest way to meet people who feel like your people.', href: '/offerings' },
    ],
  },
  testimonials: {
    eyebrow: 'What people say',
    heading: 'The thing about NovaNest is what people ',
    headingEm: 'take home.',
    sub: 'Not a certificate. Usually a phone number, a memory, or a sentence they keep repeating to themselves weeks later.',
  },
  cta: {
    line1: 'Ready to try',
    emphasis: 'a new way of living?',
    paragraph: 'No experience needed, no gear list, no personality type required. Just show up — the rest tends to sort itself out.',
    primaryButton: 'Reserve Your Spot',
    secondaryButton: 'Ask a Question First',
  },
}

// ─── About ───────────────────────────────────────────────────────────────────
export const DEFAULT_ABOUT: AboutContent = {
  header: {
    eyebrow: 'How it started',
    headline: 'A backyard, eleven\npeople, and a very\nordinary Tuesday.',
    quote: "\"We didn't set out to build a company. We just wanted our Tuesdays back.\"",
  },
  story: {
    label: 'Our story',
    quote: '"What if clarity lives somewhere between laughter, connection, and nature?"',
    chapters: [
      { title: 'Before NovaNest', hook: 'Somewhere along the way, life got busy.', kind: 'para', emphasis: '',
        body: 'Calendars filled up. Weekends became recovery time. We stayed connected online, but often felt disconnected from ourselves, nature, and each other.' },
      { title: 'The Question', hook: 'What if growth could feel different?', kind: 'para', emphasis: '',
        body: "Maybe people didn't need another lecture, course, or productivity hack. Maybe they simply needed a different kind of experience.\n\nSo we started creating the spaces we wished existed." },
      { title: 'We Started Experimenting', hook: 'Nature. Movement. Conversations. Music. Stillness. Play.', kind: 'para', emphasis: '',
        body: 'We brought different things together and watched what happened when people had the space to simply be, explore, and connect.' },
      { title: 'What We Discovered', hook: 'It was never really about the activity.', kind: 'para', emphasis: '',
        body: 'People remembered the laughter. The unexpected conversations. The feeling of being themselves.\n\nSomething shifted when people moved, explored, created, and connected together.' },
      { title: 'And Then, NovaNest', hook: "That's how NovaNest came to life.", kind: 'quote',
        body: 'Not as a retreat centre.\nNot as another wellness program.',
        emphasis: 'But as a new way of experiencing growth, connection, and life.' },
      { title: 'Our Philosophy', hook: "Growth doesn't have to be serious.", kind: 'para', emphasis: '',
        body: 'We believe people can learn, grow, reconnect, and discover something new about themselves. Since NovaNest operates in this philosophy, we design weekly gatherings and lead hikes, neuroscience workshops, and immersive retreats — each one built to replace routine with curiosity and pressure with play.' },
    ],
    primaryButton: 'Join an experience',
    secondaryButton: 'Say hi',
  },
  portraitCaption: "Growth doesn't have to be serious.",
  pillars: {
    eyebrow: 'What NovaNest is built on',
    heading: 'Three things, working together.',
    intro: "A world where growth feels natural, connection feels genuine, and people don't have to disconnect from life to find themselves — that's the world we're trying to build one Tuesday at a time.",
    items: [
      { title: 'Nature', body: "We're not big believers in escaping your life to go find yourself in the woods for ten days. We just think a trail, some fresh air, and a couple of hours away from a screen does something a conference room never will. Nature isn't the backdrop for NovaNest — it's usually where the actual conversation happens." },
      { title: 'Play', body: "Somewhere along the way, personal growth got associated with discipline, discomfort, and sitting cross-legged for an hour. We think that's backwards. Dancing badly in a room full of strangers, laughing until your stomach hurts, getting genuinely competitive over a silly game — that's when people actually let their guard down." },
      { title: 'Community', body: "You can't build real connection in a room full of people trying to network. NovaNest exists because strangers who show up to the same hike, the same circle, the same Friday gathering — again and again — eventually stop being strangers. That's not a happy accident. It's the entire model." },
    ],
  },
  timeline: {
    eyebrow: 'How we grew',
    heading: 'The path here',
    items: [
      { year: 'Year 1', text: 'A WhatsApp group of eleven friends, meeting on Saturday mornings for a hike none of us admitted we needed.' },
      { year: 'Year 2', text: 'First real workshop — part nature, part neuroscience, part group circle. Word spread faster than we expected.' },
      { year: 'Year 3', text: "First corporate retreat, for a team of forty that hadn't laughed together in longer than anyone wanted to say out loud." },
      { year: 'Today', text: 'Weekly gatherings, workshops, retreats, and a community that keeps showing up for each other — and for us.' },
    ],
  },
  audience: {
    eyebrow: 'Who this is actually for',
    heading: 'Probably you, if any of this sounds familiar.',
    peopleLabel: 'For people',
    people: [
      'Feel stuck in routine and want something different, without quitting their job to go find it.',
      'Want real connection, minus the awkward networking event energy.',
      'Are curious about mindfulness but bounce off anything that feels like homework.',
      'Feel ambitious but quietly overwhelmed, most weeks.',
      'Learn better by doing something than by being told about it.',
      'Believe growth can actually be fun.',
    ],
    teamsLabel: 'For teams and organizations',
    teams: [
      'Want a stronger team, not another trust-fall exercise.',
      'Want connection that outlasts the offsite.',
      'Want an experience people are still talking about a year later.',
    ],
    teamsButton: 'Plan a team retreat',
  },
}

// ─── Offerings ───────────────────────────────────────────────────────────────
const blankOffering = (): Omit<OfferingItem, 'slug' | 'category' | 'title' | 'description'> => ({
  serviceSlug: '', duration: '', format: '', priceUnit: '/person', tagline: '',
  includesTitle: '', callouts: [], footnote: '', destinations: '', ctaLabel: '',
  intro: '', bullets: [], closingLine: '', approach: '', tiers: [],
})

export const DEFAULT_OFFERINGS: OfferingsContent = {
  header: {
    eyebrow: 'What we do',
    headline: 'Ways to',
    headlineEm: 'reconnect',
    paragraph: 'Experiences designed to help you reconnect, recharge, and grow — without pressure, and without pretending you have to sit still to get there.',
  },
  feelings: {
    eyebrow: 'Not sure where to begin?',
    heading: 'Start with how you want to feel.',
    items: [
      { prompt: 'I want to slow down', items: ['Nature Experiences', 'Sound Healing', 'Breathwork'] },
      { prompt: 'I want to meet new people', items: ['Weekly Gatherings', 'Community Circles', 'Saturday Events'] },
      { prompt: 'I want to move my body', items: ['Movement & Expression', 'Dance', 'Hiking / Adventure'] },
      { prompt: 'I want to reconnect with my team', items: ['Team Retreats', 'Mind, Brain & Behaviour — Team & Corporate', 'Customized Experiences'] },
      { prompt: 'I want to grow', items: ['Mind, Brain & Behaviour — 1:1 Sessions', 'Reflection Sessions', 'Creative Workshops'] },
    ],
  },
  items: [
    {
      ...blankOffering(), slug: 'kathmandu-valley-hikes', category: 'Nature', title: 'Kathmandu Valley Guided Hikes',
      serviceSlug: 'nature-half-day', duration: 'Half day', format: 'Small-group', priceAmount: 40,
      description: 'Step out of the city and into the hills around Kathmandu. A guided half-day hike with a NovaNest trekking guide, simple awareness practices along the trail, and the practical details taken care of.',
      includesTitle: 'Includes',
      callouts: ['Guided hike', 'Entry / park fees', 'Basic first-aid kit', 'Simple mindfulness & awareness practices', 'Small-group experience'],
      footnote: 'Meeting point and final price vary by destination. Private transportation can be arranged if needed.',
    },
    {
      ...blankOffering(), slug: 'beyond-the-valley', category: 'Nature', title: 'Outer Valley Nature Escapes',
      duration: 'Full day', format: 'Small-group', priceAmount: 85, tagline: 'Go a little further.',
      description: 'Leave Kathmandu behind for a full day of walking, landscapes, local places, and time outdoors — with the journey and logistics taken care of.',
      includesTitle: 'Your experience includes',
      callouts: ['Transportation from Kathmandu & back', 'Guided hike with a NovaNest trekking guide', 'Entry / applicable fees', 'Basic first-aid kit', 'Simple awareness practices along the way', 'Small-group experience'],
      footnote: 'Vehicle type is matched to your group size — from a private car for smaller groups to a Scorpio or van for larger groups. Destination, group size and itinerary determine the final price.',
      destinations: 'Possible destinations: Nagarkot · Namobuddha · Balthali · Phulchowki · Kakani · and beyond.',
    },
    {
      ...blankOffering(), slug: 'movement-expression', category: 'Movement', title: 'Movement & Expression',
      serviceSlug: 'movement-expression', duration: 'Indoor session · 75 min', format: 'Private & group sessions available', priceAmount: 25,
      tagline: 'Move without having to perform.',
      description: 'A space to explore movement, play, and self-expression — guided by the music, the moment, and your own way of moving. No choreography, no experience required.',
      callouts: ['Come as you are. No dance experience needed.'],
      ctaLabel: 'Book an Experience',
      variant: { title: 'Movement in Nature', priceAmount: 110, priceUnit: '/person', description: 'Take movement outside and let the landscape become part of the experience. A private nature escape combining guided movement, play, exploration, transportation, and lunch.', meta: 'Private experience · Transportation & lunch included', footnote: 'Destination and group size determine the final price.' },
    },
    {
      ...blankOffering(), slug: 'sound-healing', category: 'Presence', title: 'Sound Healing',
      serviceSlug: 'sound-healing', duration: 'Indoor session · 60 min', format: 'Private & group sessions available', priceAmount: 25,
      tagline: 'Put down the noise for a while.',
      description: 'A guided sound experience with singing bowls and gentle tones — a chance to slow down, listen inward, and simply be still for a while.',
      callouts: ['Comfortable clothing recommended', 'No experience needed — just show up and lie down'],
      variant: { title: 'Sound Healing in Nature', priceAmount: 110, priceUnit: '/person', description: 'Take the experience outside the city — a private day in nature combining sound healing, a scenic setting, transportation, and lunch.', meta: 'Private experience · Transportation & lunch included', footnote: 'Destination and group size determine the final price.' },
    },
    {
      ...blankOffering(), slug: 'breathwork', category: 'Presence', title: 'Breathwork',
      serviceSlug: 'breathwork', duration: '75 min', format: 'Individual or group', priceAmount: 25,
      description: "A guided breathing experience to slow down, reconnect with your body, and notice what's happening within. Through conscious breathing, music, and gentle guidance, you'll explore breath as a way to shift your state, settle your attention, and connect with yourself.",
      callouts: ['No previous experience needed', 'Comfortable clothing recommended', 'Private & retreat groups available'],
    },
    {
      ...blankOffering(), slug: 'mind-brain-behaviour', category: 'Growth', title: 'Mind, Brain & Behaviour',
      description: "Maybe you're looking for something, but you're not quite sure what to call it.",
      intro: "Maybe you're looking for something, but you're not quite sure what to call it.",
      bullets: ['You keep overthinking the same situation.', 'You know what you want to do, but keep getting in your own way.', 'You want to communicate differently, handle pressure better, or understand why you keep falling into the same patterns.'],
      closingLine: "Start with what's happening. We'll explore the rest together.",
      approach: 'Our approach: Neuroscience · NLP · Behavioural Psychology · Mindfulness',
      tiers: [
        { label: '1:1 Sessions', tagline: 'For when you want to work on something personal.', description: 'A private, practical session using NLP tools, behavioural psychology, and neuroscience-informed approaches to explore patterns in thinking, emotion, attention, communication, and behaviour.', meta: 'Solo · 60–90 min · By appointment', note: 'For a deeper exploration.', cta: 'Book a 1:1 Session →', prices: [{ label: '90-minute sessions', amount: 65, serviceSlug: 'leadership-intro' }] },
        { label: 'Group & Corporate Experiences', tagline: 'For when the question belongs to a whole team.', description: 'Interactive experiences exploring how people think, communicate, make decisions, respond under pressure, and work together — through activities, conversation, and accessible neuroscience.', meta: 'Teams · Corporate groups · Private groups · Custom duration', note: '', cta: 'Create a Group Experience →', prices: [{ label: 'Private groups', amount: 200 }, { label: 'Corporate teams', amount: 300 }] },
      ],
    },
    {
      ...blankOffering(), slug: 'design-your-nepal-experience', category: 'Immersion', title: "Let's Design Your Nepal Experience",
      description: "Nepal doesn't come in one size: a retreat could mean a comfortable farm stay close to Kathmandu, a mountain village, a riverside escape, or a deeper journey into the landscape. Tell us what you're looking for, and we'll shape the experience around it.",
      intro: "For private groups, teams & international groups — we'll talk about:",
      bullets: ['Where you want to go', 'How adventurous or comfortable you want it to be', "Your group's fitness and experience level", "What you'd like to explore, learn, or simply experience", 'How much time you have', 'Your budget and travel preferences'],
      closingLine: "Then we'll suggest a route and experience that fits.",
      ctaLabel: 'Book a Free Planning Call →',
    },
  ],
  cta: {
    heading: 'Not sure where to start?',
    paragraph: "Honestly, it doesn't matter much. People who come for a hike end up at a Friday workshop. People who book one retreat for their team come back for another, and bring a different team next time. Start with whatever sounds the least like a chore.",
    primaryButton: 'Book a Free Info Call',
    secondaryButton: 'Send a message first',
  },
}

export const DEFAULT_CONTENT: SiteContent = { home: DEFAULT_HOME, about: DEFAULT_ABOUT, offerings: DEFAULT_OFFERINGS }

// ─── Other defaults ───────────────────────────────────────────────────────────
/** Used by the "Apply default prices" button in Admin → Services (only fills services whose price is still 0). */
export const DEFAULT_SERVICE_PRICES: Record<string, number> = {
  'nature-half-day': 40,
  'movement-expression': 25,
  'sound-healing': 25,
  'breathwork': 25,
  'leadership-intro': 65,
}

/** Used by the "Import starter testimonials" button in Admin → Testimonials. */
export const STARTER_TESTIMONIALS = [
  { name: 'Mina Rawat',     role: 'Moment during village trip',            content: 'The local raksi tasted even better when I tasted it mindfully.' },
  { name: 'Preeti Thapa',   role: 'Moment during the cultural experience', content: "For the first time in years I laughed that hard with people I'd met an hour earlier. Didn't see that coming." },
  { name: 'Prashant Kuwar', role: 'Moment during Bonfire',                 content: "Our team hadn't actually talked — not about anything real — in over a year. This retreat cracked that open in a day." },
]

// ─── Merge helper ─────────────────────────────────────────────────────────────
type Plain = Record<string, unknown>
const isPlain = (v: unknown): v is Plain => !!v && typeof v === 'object' && !Array.isArray(v)

/** Saved values win; plain objects merge key-by-key; arrays and strings are replaced wholesale. */
export function deepMerge<T>(base: T, saved: unknown): T {
  if (!isPlain(base) || !isPlain(saved)) return (saved === undefined || saved === null ? base : (saved as T))
  const out: Plain = { ...base }
  for (const k of Object.keys(saved)) out[k] = k in base ? deepMerge((base as Plain)[k], saved[k]) : saved[k]
  return out as T
}

/** Blank card for "Add experience" in Admin → Site Content → Offerings */
export const newOfferingItem = (): OfferingItem => ({
  ...blankOffering(), slug: '', category: 'Nature', title: '', description: '',
})
