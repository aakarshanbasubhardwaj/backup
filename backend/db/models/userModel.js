import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  googleId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  name: { type: String },
  mfaSecret: { type: String, required: true },
  uploadPath: { type: String, required: true},
});

const User = mongoose.model('User', UserSchema);

export default User;