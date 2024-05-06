import { InternalUser, Role } from "@/utils/types";
import mongoose from "mongoose";

const { Schema } = mongoose;


const UserSchema = new Schema<InternalUser>(
    {
        _id: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        passwordHash: {
            type: String,
            required: true,

        },
        verified: {
            type: Boolean,
            required: true,
            default: false,
        },
        roles: {
            type: [String],
            required: true,
            enum: Object.values(Role),
            default: [],
        },
    } as const,
    {
        _id: false, timestamps: {
            createdAt: true,
            updatedAt: true
        }
    },
);

export const UserModel =
    (mongoose.models.User as mongoose.Model<InternalUser>) ??
    mongoose.model("User", UserSchema);
