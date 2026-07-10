import mongoose, { Schema, Document, Model } from 'mongoose'

/**
 * Singleton settings document. Currently holds `images`, a flat map of
 * key -> Cloudinary URL, so any image slot on the site (hero, about portrait,
 * per-offering photos, etc.) can be persisted the same way without needing a
 * dedicated schema field for each one. Keys in use:
 *   'hero'                          — homepage hero background
 *   'about-portrait'                — About page portrait
 *   'offering:<slug>'                — one per card on /offerings
 */
export interface ISiteSettings extends Document {
  singleton: string
  images: Record<string, string>
  createdAt: Date
  updatedAt: Date
}

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    singleton: { type: String, default: 'main', unique: true },
    images:    { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
)

export const SiteSettings: Model<ISiteSettings> =
  mongoose.models.SiteSettings ?? mongoose.model<ISiteSettings>('SiteSettings', SiteSettingsSchema)
