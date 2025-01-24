import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  googleId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  displayName: { type: String },
  // mfaSecret: { type: String, required: true },
  storageBaseUrl: { type: String, required: true},
});

const User = mongoose.model('User', UserSchema);

export default User;