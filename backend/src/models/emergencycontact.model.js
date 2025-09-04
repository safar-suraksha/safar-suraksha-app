import { Schema, Types, model } from "mongoose";

const EmergencyContactSchema = new Schema({
    userId: {
        type: Types.ObjectId,
        ref: "User",
        required: true
    },
    name: {
        type: String,
        required: true
    },
    relation: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String
    }
});

export const EmergencyContact = model("EmergencyContact", EmergencyContactSchema);