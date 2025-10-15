import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  googleId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  displayName: { type: String },
  // mfaSecret: { type: String, required: true },
  storageBaseUrl: { type: String, required: true},
  isAdmin: { type: Boolean, required: true},
  isActive: { type: Boolean, required: true},
});

const User = mongoose.model('User', UserSchema);

export default User;