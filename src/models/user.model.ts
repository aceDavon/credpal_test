import mongoose, { Document } from 'mongoose';

export interface IUser extends Document {
  name: string
  email: string
  password: string
}

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
});

export const User = mongoose.model('User', UserSchema);
