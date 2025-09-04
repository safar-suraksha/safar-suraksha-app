import { model, Schema, Types } from "mongoose";

const TouristIDSchema = new Schema({
    userId: {
        type: Types.ObjectId,
        ref: "User",
        required: true
    },
    idType: {
        type: String,
        enum: ["Passport", "Aadhar", "Driving License"],
        required: true
    },
    idNumber: {
        type: String,
        required: true
    },
    tripItinerary: [
        {
            type: String
        }
    ], // ex., ["Delhi", "Agra", "Jaipur"]
    blockchainHash: {
        type: String,
        required: true
    },
    validFrom: {
        type: Date,
        required: true
    },
    validTo: {
        type: Date,
        required: true
    },
    qrCode: {
        type: String,
        required: true
    }, // base64 / URL
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export const TouristID = model("TouristID", TouristIDSchema);
