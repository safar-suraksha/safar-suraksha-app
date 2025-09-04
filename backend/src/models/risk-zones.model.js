import { Schema, model } from "mongoose";

const GeoFenceSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ["safe", "restricted", "high-risk"],
        required: true
    },
    coordinates: [{
        lat: Number,
        lng: Number
    }], // polygon
    description: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export const GeoFence = model("GeoFence", GeoFenceSchema);
