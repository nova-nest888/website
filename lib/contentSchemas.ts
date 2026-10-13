import type { Field } from '@/components/admin/SchemaEditor'
import { newOfferingItem } from '@/lib/siteContent.defaults'

const t  = (key: string, label: string, help?: string): Field => ({ key, label, type: 'text', help })
const num = (key: string, label: string, help?: string): Field => ({ key, label, type: 'number', help })
const ta = (key: string, label: string, rows = 3, help?: string): Field => ({ key, label, type: 'textarea', rows, help })

// ─── Home ────────────────────────────────────────────────────────────────────
export const HOME_SCHEMA: Field[] = [
  { key: 'hero', label: 'Hero (top of the page)', type: 'object', fields: [
    t('eyebrow', 'Small line above the headline'),
    t('line1', 'Headline — line 1'), t('line2', 'Headline — line 2'), t('emphasis', 'Headline — last line (italic)'),
    ta('paragraph', 'Paragraph under the headline'),
    t('primaryButton', 'Main button label'), t('secondaryButton', 'Second button label'),
  ] },
  { key: 'intro', label: 'Intro section', type: 'object', fields: [
    t('quote', 'Quote', 'Include the quotation marks yourself.'),
    ta('paragraph', 'Paragraph', 5), t('button', 'Button label ("Read our story")'),
    t('sideHeading', 'Heading for the list on the right'),
    { key: 'moments', label: '"What surprises people" items', type: 'list', itemLabel: 'item', titleKey: 'heading',
      blank: () => ({ tag: '', heading: '', body: '' }),
      fields: [t('tag', 'Small label'), t('heading', 'Heading'), ta('body', 'Text', 3)] },
    ta('sideNote', 'Note under the list', 2),
  ] },
  { key: 'expect', label: '"Expect" strip', type: 'object', fields: [
    t('label', 'Label'),
    { key: 'items', label: 'Three items', type: 'list', itemLabel: 'item', titleKey: 'title', blank: () => ({ title: '', text: '' }),
      help: 'Each item has a small icon in the design. The first three keep their icons; extra items show without one.',
      fields: [t('title', 'Bold word (e.g. Nature)'), t('text', 'Rest of the line (e.g. meets growth.)')] },
    t('highlight', 'Bottom line — italic part'), t('highlightRest', 'Bottom line — rest'),
  ] },
  { key: 'ways', label: '"Ways to join in" cards', type: 'object', fields: [
    t('title', 'Section title'), t('linkLabel', 'Link label'),
    { key: 'big', label: 'Large card', type: 'object', fields: [t('title', 'Title'), ta('text', 'Text', 4), t('button', 'Button label')] },
    { key: 'small', label: 'Two smaller cards', type: 'list', itemLabel: 'card', titleKey: 'title', blank: () => ({ category: '', title: '', text: '', href: '/offerings' }),
      fields: [t('category', 'Small label'), t('title', 'Title'), ta('text', 'Text', 3), t('href', 'Link', 'e.g. /offerings#sound-healing')] },
    { key: 'row', label: 'Row of three cards', type: 'list', itemLabel: 'card', titleKey: 'title', blank: () => ({ category: '', title: '', text: '', href: '/offerings' }),
      fields: [t('category', 'Small label'), t('title', 'Title'), ta('text', 'Text', 3), t('href', 'Link', 'e.g. /offerings#mind-brain-behaviour')] },
  ] },
  { key: 'testimonials', label: 'Testimonials heading', type: 'object',
    help: 'The testimonials themselves are managed in Admin → Testimonials. The section is hidden when there are none.',
    fields: [t('eyebrow', 'Small label'), t('heading', 'Heading (start)'), t('headingEm', 'Heading (italic end)'), ta('sub', 'Sub-text', 2)] },
  { key: 'cta', label: 'Bottom call-to-action', type: 'object', fields: [
    t('line1', 'Heading — line 1'), t('emphasis', 'Heading — line 2 (italic)'), ta('paragraph', 'Paragraph', 3),
    t('primaryButton', 'Main button label'), t('secondaryButton', 'Second button label'),
  ] },
]

// ─── About ───────────────────────────────────────────────────────────────────
export const ABOUT_SCHEMA: Field[] = [
  { key: 'header', label: 'Page header', type: 'object', fields: [
    t('eyebrow', 'Small label'),
    ta('headline', 'Headline', 3, 'Press Enter to start a new line.'),
    ta('quote', 'Quote on the right', 2, 'Include the quotation marks yourself.'),
  ] },
  { key: 'story', label: 'Our story', type: 'object', fields: [
    t('label', 'Small label'), ta('quote', 'Opening quote', 2),
    { key: 'chapters', label: 'Chapters (numbered automatically)', type: 'list', itemLabel: 'chapter', titleKey: 'title',
      blank: () => ({ title: '', hook: '', kind: 'para', body: '', emphasis: '' }),
      fields: [
        t('title', 'Chapter title'), t('hook', 'Highlighted line'),
        { key: 'kind', label: 'Style', type: 'select', options: ['para', 'quote'], help: '"para" = normal paragraphs. "quote" = italic lines.' },
        ta('body', 'Text', 6, 'Leave a blank line between paragraphs. In "quote" style each line is shown on its own.'),
        t('emphasis', 'Closing italic line (optional)'),
      ] },
    t('primaryButton', 'Main button label'), t('secondaryButton', 'Second button label'),
  ] },
  t('portraitCaption', 'Caption under the portrait photo'),
  { key: 'pillars', label: '"Built on" section', type: 'object', fields: [
    t('eyebrow', 'Small label'), t('heading', 'Heading'), ta('intro', 'Intro paragraph', 3),
    { key: 'items', label: 'Pillars (numbered automatically)', type: 'list', itemLabel: 'pillar', titleKey: 'title', blank: () => ({ title: '', body: '' }),
      fields: [t('title', 'Title'), ta('body', 'Text', 5)] },
  ] },
  { key: 'timeline', label: 'Timeline', type: 'object', fields: [
    t('eyebrow', 'Small label'), t('heading', 'Heading'),
    { key: 'items', label: 'Steps', type: 'list', itemLabel: 'step', titleKey: 'year', blank: () => ({ year: '', text: '' }),
      fields: [t('year', 'When (e.g. Year 1, Today)'), ta('text', 'What happened', 3)] },
  ] },
  { key: 'audience', label: '"Who this is for"', type: 'object', fields: [
    t('eyebrow', 'Small label'), t('heading', 'Heading'),
    t('peopleLabel', 'Left column title'),
    { key: 'people', label: 'Left column lines', type: 'strings', addLabel: 'Add line' },
    t('teamsLabel', 'Right column title'),
    { key: 'teams', label: 'Right column lines', type: 'strings', addLabel: 'Add line' },
    t('teamsButton', 'Button label (right column)'),
  ] },
]

// ─── Offerings ───────────────────────────────────────────────────────────────
export const OFFERINGS_SCHEMA: Field[] = [
  { key: 'header', label: 'Page header', type: 'object', fields: [
    t('eyebrow', 'Small label'), t('headline', 'Headline'), t('headlineEm', 'Headline — italic word(s)'), ta('paragraph', 'Paragraph', 3),
  ] },
  { key: 'feelings', label: '"Start with how you want to feel"', type: 'object', fields: [
    t('eyebrow', 'Small label'), t('heading', 'Heading'),
    { key: 'items', label: 'Feelings', type: 'list', itemLabel: 'feeling', titleKey: 'prompt', blank: () => ({ prompt: '', items: [] }),
      fields: [t('prompt', 'Feeling (e.g. I want to slow down)'), { key: 'items', label: 'Suggestions', type: 'strings', addLabel: 'Add suggestion' }] },
  ] },
  { key: 'items', label: 'Experiences', type: 'list', itemLabel: 'experience', titleKey: 'title',
    help: 'Shown in this order on the Experiences page. Price: link a service (below) and its price from Admin → Services is shown automatically.',
    blank: () => newOfferingItem(),
    fields: [
      t('title', 'Title'),
      t('category', 'Category label (e.g. Nature)'),
      t('slug', 'Link name (slug)', 'Lowercase letters, numbers and dashes. Used in links like /offerings#sound-healing — don\'t change it for existing cards unless you update links.'),
      t('serviceSlug', 'Linked service (slug) — price comes from here', 'Slug of a service in Admin → Services, e.g. nature-half-day. If that service has a price, it replaces the text price below.'),
      num('priceAmount', 'Price ($) — used when there is no linked service price', 'Shown as "From $X". Tip: Admin → Prices lists every price in one place.'),
      t('priceUnit', 'Price unit shown after the price', 'Usually /person'),
      t('duration', 'Duration (e.g. Half day · 75 min)'), t('format', 'Format (e.g. Small-group)'),
      t('tagline', 'Tagline (italic line, optional)'),
      ta('description', 'Description', 5),
      t('includesTitle', 'Title above the list (e.g. Includes)'),
      { key: 'callouts', label: 'List (what\'s included / notes)', type: 'strings', addLabel: 'Add line' },
      ta('footnote', 'Footnote', 2), t('destinations', 'Destinations line (optional)'),
      { key: 'variant', label: 'Second version box (e.g. "in Nature")', type: 'object', optional: true,
        blank: () => ({ title: '', priceAmount: undefined, priceUnit: '/person', description: '', meta: '', footnote: '' }),
        fields: [t('title', 'Title'), num('priceAmount', 'Price ($)'), t('priceUnit', 'Price unit (e.g. /person)'), ta('description', 'Description', 3), t('meta', 'Details line'), t('footnote', 'Footnote')] },
      t('ctaLabel', 'Button label (default: Book this)'),
      { key: 'intro', label: 'Intro line (for list layout)', type: 'textarea', rows: 2, help: 'Fill "Bullets" to switch this card to a list-style layout.' },
      { key: 'bullets', label: 'Bullets', type: 'strings', addLabel: 'Add bullet' },
      t('closingLine', 'Closing line'),
      { key: 'tiers', label: 'Tiers (options with their own button)', type: 'list', itemLabel: 'tier', titleKey: 'label',
        help: 'Fill tiers to switch this card to a multi-option layout (like Mind, Brain & Behaviour).',
        blank: () => ({ label: '', tagline: '', description: '', meta: '', note: '', cta: '', prices: [] }),
        fields: [t('label', 'Name'), t('tagline', 'Tagline'), ta('description', 'Description', 4), t('meta', 'Details line'), t('note', 'Note (no prices here — use the price lines below)'),
          { key: 'prices', label: 'Price lines', type: 'list', itemLabel: 'price line', titleKey: 'label',
            help: 'Shown as "Label from $amount". Optionally link a service slug so its Admin → Services price is used instead.',
            blank: () => ({ label: '', amount: undefined, serviceSlug: '' }),
            fields: [t('label', 'Label (e.g. Private groups)'), num('amount', 'Price ($)'), t('serviceSlug', 'Linked service slug (optional)')] },
          t('cta', 'Button label')] },
      t('approach', 'Approach line (under tiers)'),
    ] },
  { key: 'cta', label: 'Bottom call-to-action', type: 'object', fields: [
    t('heading', 'Heading'), ta('paragraph', 'Paragraph', 4), t('primaryButton', 'Main button label'), t('secondaryButton', 'Second button label'),
  ] },
]
