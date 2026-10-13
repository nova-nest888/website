import mongoose, { Schema, Document, Model } from 'mongoose'

/**
 * Singleton document holding the admin-edited copy for the Home, About and
 * Offerings pages: data = { home?, about?, offerings? }. A missing section
 * means "use the built-in defaults" (lib/siteContent.defaults.ts).
 */
export interface ISiteContent extends Document {
  singleton: string
  data: Record<string, unknown>
}

const SiteContentSchema = new Schema<ISiteContent>(
  {
    singleton: { type: String, default: 'main', unique: true },
    data:      { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true, minimize: false }
)

export const SiteContentModel: Model<ISiteContent> =
  mongoose.models.SiteContent ?? mongoose.model<ISiteContent>('SiteContent', SiteContentSchema)
