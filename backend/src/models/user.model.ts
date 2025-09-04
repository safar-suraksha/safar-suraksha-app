import { Schema, model, Types } from "mongoose";

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true
    },
    passwordHash: {
        type: String,
        required: true
    }, // bcrypt
    language: {
        type: String,
        default: "en"
    }
}, {
    timestamps: true
});

export const User = model("User", UserSchema);
