import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IBooking extends Document {
  serviceId: mongoose.Types.ObjectId
  serviceName: string
  name: string
  email: string
  phone?: string
  date: Date
  time: string
  status: import('@/types').BookingStatus
  notes?: string
  calEventId?: string
  createdAt: Date
  updatedAt: Date
}

const BookingSchema = new Schema<IBooking>(
  {
    serviceId:   { type: Schema.Types.ObjectId, ref: 'Service', required: true },
    serviceName: { type: String, required: true },
    name:        { type: String, required: true, trim: true },
    email:       { type: String, required: true, lowercase: true, trim: true },
    phone:       { type: String },
    date:        { type: Date, required: true },
    time:        { type: String, required: true },
    status:      { type: String, enum: ['confirmed','cancelled','pending'], default: 'confirmed' },
    notes:       { type: String },
    calEventId:  { type: String, index: true },
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

BookingSchema.virtual('id').get(function (this: IBooking) {
  return (this._id as mongoose.Types.ObjectId).toHexString()
})

BookingSchema.index({ date: 1, status: 1 })
BookingSchema.index({ email: 1 })

export const Booking: Model<IBooking> =
  mongoose.models.Booking ?? mongoose.model<IBooking>('Booking', BookingSchema)
