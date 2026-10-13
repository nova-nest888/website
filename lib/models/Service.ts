import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IService extends Document {
  title: string
  slug: string
  description: string
  duration: number
  price: number
  category: import('@/types').ServiceCategory
  calSlug: string
<<<<<<< HEAD
  optionGroups: import('@/types').ServiceOptionGroup[]
=======
>>>>>>> 0535e7cc738eba828f46f7a78b8fc6434e5c1a86
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

<<<<<<< HEAD
const ChoiceSchema = new Schema(
  {
    label:       { type: String, required: true, trim: true },
    description: { type: String, default: '', trim: true },
    price:       { type: Number, min: 0 },
    calSlug:     { type: String, default: '', trim: true },
  },
  { _id: false }
)
const OptionGroupSchema = new Schema(
  {
    label:   { type: String, required: true, trim: true },
    choices: { type: [ChoiceSchema], default: [] },
  },
  { _id: false }
)

=======
>>>>>>> 0535e7cc738eba828f46f7a78b8fc6434e5c1a86
const ServiceSchema = new Schema<IService>(
  {
    title:       { type: String, required: true, trim: true },
    slug:        { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, default: '' },
    duration:    { type: Number, required: true, min: 15 },
    price:       { type: Number, default: 0, min: 0 },
    category:    { type: String, required: true, enum: ['Nature','Movement','Presence','Growth','Immersion','Community'] },
    calSlug:     { type: String, default: '' },
<<<<<<< HEAD
    optionGroups:{ type: [OptionGroupSchema], default: [] },
=======
>>>>>>> 0535e7cc738eba828f46f7a78b8fc6434e5c1a86
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
