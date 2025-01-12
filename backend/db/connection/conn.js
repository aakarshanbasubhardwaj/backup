import mongoose from "mongoose";

async function connectToDatabase(){
    try {
        await mongoose.connect("mongodb://localhost:27017/backup");
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB", error);
        process.exit(1);
    }

    mongoose.connection.on("error", (err) => {
        console.error("MongoDB connection error:", err);
    });
}

export default { connectToDatabase };