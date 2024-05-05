import { Session } from "@/utils/types";
import mongoose from "mongoose";

const { Schema } = mongoose;


const SessionSchema = new Schema<Session>(
    {
        _id: {
            type: String,
            required: true
        },
        user_id: {
            type: String,
            required: true
        },
        expires_at: {
            type: Date,
            required: true
        }
    } as const,

    { _id: false },
);

export const SessionModel =
    (mongoose.models.Session as mongoose.Model<Session>) ??
    mongoose.model("Session", SessionSchema);
