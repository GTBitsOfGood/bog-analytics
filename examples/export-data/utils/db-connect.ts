import mongoose from "mongoose";

export async function dbConnect(): Promise<void> {
    if (mongoose.connections[0].readyState) return;
    await mongoose
        .connect((process.env.DATABASE_URL as string) ?? "127.0.0.1:27017", {
            socketTimeoutMS: 360000,
            dbName: process.env.DATABASE_NAME ?? 'analytics-data',
        })
        .catch((error) => {
            console.error("Unable to connect to database.");

            throw error;
        });
}