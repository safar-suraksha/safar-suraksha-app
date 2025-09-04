import { Schema, Types, model } from "mongoose";

const LiveTrackingSchema = new Schema({
    userId: {
        type: Types.ObjectId,
        ref: "User",
        required: true
    },
    currentLocation: {
        lat: {
            type: Number,
            required: true
        },
        lng: {
            type: Number,
            required: true
        }
    },
    sharedWith: [{
        type: Types.ObjectId,
        ref: "User"
    }], // family/police
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

export const LiveTracking = model("LiveTracking", LiveTrackingSchema);
