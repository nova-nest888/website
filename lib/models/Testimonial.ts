import mongoose, { Schema, Document, Model } from 'mongoose'

export interface ITestimonial extends Document {
  name: string
  role?: string
  content: string
  rating: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const TestimonialSchema = new Schema<ITestimonial>(
  {
    name:     { type: String, required: true, trim: true },
    role:     { type: String, trim: true },
    content:  { type: String, required: true },
    rating:   { type: Number, default: 5, min: 1, max: 5 },
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

TestimonialSchema.virtual('id').get(function (this: ITestimonial) {
  return (this._id as mongoose.Types.ObjectId).toHexString()
})



export const Testimonial: Model<ITestimonial> =
  mongoose.models.Testimonial ?? mongoose.model<ITestimonial>('Testimonial', TestimonialSchema)
