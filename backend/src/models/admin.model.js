import { Schema, model } from "mongoose";

const AdminSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        enum: ["police", "gov", "super-admin"],
        required: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    station: {
        type: String
    }, // police station / authority office
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export const Admin = model("Admin", AdminSchema);
