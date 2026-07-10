import mongoose, { Schema, Document, Model } from 'mongoose'
import type { UserRole } from '@/types'

export interface IUser extends Document {
  email: string
  password: string
  name?: string
  role: UserRole
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema<IUser>(
  {
    email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    name:     { type: String, trim: true },
    role:     { type: String, enum: ['admin', 'editor'], default: 'admin' },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      transform: (_doc: any, ret: any) => { delete ret._id; delete ret.__v; delete ret.password },
    },
  }
)

UserSchema.virtual('id').get(function (this: IUser) {
  return (this._id as mongoose.Types.ObjectId).toHexString()
})

export const User: Model<IUser> =
  mongoose.models.User ?? mongoose.model<IUser>('User', UserSchema)
