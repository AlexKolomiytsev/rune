import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  firstName: { type: String },
  lastName: { type: String },
  password: { type: String },
});

export default model('User', userSchema);
