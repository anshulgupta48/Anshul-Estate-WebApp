import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        username: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        avatar: { type: String, default: 'https://firebasestorage.googleapis.com/v0/b/mern-estate-4276b.appspot.com/o/profile-icon.png?alt=media&token=93ed0bfe-6800-44e2-b08e-a068a47dce53' },
    },
    { timestamps: true },
);

const User = mongoose.model('User', userSchema);
export default User;