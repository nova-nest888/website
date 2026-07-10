import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IPost extends Document {
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage?: string
  published: boolean
  publishedAt?: Date
  category: import('@/types').PostCategory
  createdAt: Date
  updatedAt: Date
}

const PostSchema = new Schema<IPost>(
  {
    title:       { type: String, required: true, trim: true },
    slug:        { type: String, required: true, unique: true, lowercase: true, trim: true },
    excerpt:     { type: String, default: '' },
    content:     { type: String, default: '' },
    coverImage:  { type: String },
    published:   { type: Boolean, default: false, index: true },
    publishedAt: { type: Date },
    category:    { type: String, default: 'nature', enum: ['nature','movement','presence','growth','community','immersion'] },
  },
  {
    
    timestamps: true,
    toJSON: {
      virtuals: true,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      transform: (_doc: any, ret: any) => { delete ret._id; delete ret.__v },
    },
  }
)

PostSchema.virtual('id').get(function (this: IPost) {
  return (this._id as mongoose.Types.ObjectId).toHexString()
})

PostSchema.index({ slug: 1 })
PostSchema.index({ published: 1, publishedAt: -1 })

export const Post: Model<IPost> =
  mongoose.models.Post ?? mongoose.model<IPost>('Post', PostSchema)
