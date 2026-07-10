import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IService extends Document {
  title: string
  slug: string
  description: string
  duration: number
  price: number
  category: import('@/types').ServiceCategory
  calSlug: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const ServiceSchema = new Schema<IService>(
  {
    title:       { type: String, required: true, trim: true },
    slug:        { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, default: '' },
    duration:    { type: Number, required: true, min: 15 },
    price:       { type: Number, default: 0, min: 0 },
    category:    { type: String, required: true, enum: ['Nature','Movement','Presence','Growth','Immersion','Community'] },
    calSlug:     { type: String, default: '' },
    isActive:    { type: Boolean, default: true },
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

ServiceSchema.virtual('id').get(function (this: IService) {
  return (this._id as mongoose.Types.ObjectId).toHexString()
})

ServiceSchema.index({ slug: 1 })
ServiceSchema.index({ isActive: 1, category: 1 })

export const Service: Model<IService> =
  mongoose.models.Service ?? mongoose.model<IService>('Service', ServiceSchema)
