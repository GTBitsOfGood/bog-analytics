import mongoose from "mongoose";

export async function dbConnect(): Promise<void> {
    if (mongoose.connections[0].readyState) return;

    await mongoose
        .connect(process.env.DATABASE_URL ?? "http://localhost:27017" as string, {
            socketTimeoutMS: 360000,
            dbName: process.env.DATABASE_NAME ?? "bog-analytics",
        })
        .catch((error) => {
            console.error("Unable to connect to database.");

            throw error;
        });
}