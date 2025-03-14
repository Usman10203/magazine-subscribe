import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: { type: String, required: [true, "Please provide a username"] },
    email: {
        type: String,
        required: [true, "Please provide a email"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
    },
    forgotPasswordToken: { type: String },
    forgotPasswordTokenExpiry: { type: Date },
})

const User = mongoose.models.users || mongoose.model("users", userSchema);

export default User;