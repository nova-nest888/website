import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IAvailability extends Document {
  dayOfWeek: number
  startTime: string
  endTime: string
  isActive: boolean
}

const AvailabilitySchema = new Schema<IAvailability>(
  {
    dayOfWeek: { type: Number, required: true, min: 0, max: 6, unique: true },
    startTime: { type: String, required: true },
    endTime:   { type: String, required: true },
    isActive:  { type: Boolean, default: true },
  },
  {
    
    toJSON: {
      virtuals: true,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      transform: (_doc: any, ret: any) => { delete ret._id; delete ret.__v },
    },
  }
)

AvailabilitySchema.virtual('id').get(function (this: IAvailability) {
  return (this._id as mongoose.Types.ObjectId).toHexString()
})



export const Availability: Model<IAvailability> =
  mongoose.models.Availability ?? mongoose.model<IAvailability>('Availability', AvailabilitySchema)
