import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IPhoto extends Document {
  url:       string
  caption?:  string
  category:  string
  order:     number
  isActive:  boolean
  createdAt: Date
  updatedAt: Date
}

const PhotoSchema = new Schema<IPhoto>(
  {
    url:      { type: String, required: true, trim: true },
    caption:  { type: String, trim: true },
    category: { type: String, default: 'general', enum: ['general','nature','movement','presence','growth','community','immersion'] },
    order:    { type: Number, default: 0 },
    isActive: { type: Boolean, default: true, index: true },
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

PhotoSchema.virtual('id').get(function (this: IPhoto) {
  return (this._id as mongoose.Types.ObjectId).toHexString()
})

PhotoSchema.index({ isActive: 1, order: 1 })

export const Photo: Model<IPhoto> =
  mongoose.models.Photo ?? mongoose.model<IPhoto>('Photo', PhotoSchema)
