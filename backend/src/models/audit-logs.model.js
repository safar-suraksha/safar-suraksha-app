import { model, Schema, Types } from "mongoose";

const AuditLogSchema = new Schema({
    action: {
        type: String,
        required: true
    },
    userId: {
        type: Types.ObjectId,
        ref: "User"
    },
    dataHash: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    verifiedOnChain: {
        type: Boolean,
        default: false
    }
});

export const AuditLog = model("AuditLog", AuditLogSchema);
