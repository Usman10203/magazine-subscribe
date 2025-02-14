import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(
            process.env.MONGODB_URI as string
        );
        if (conn)
            console.log("MongoDB connected");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
};

export default connectDB;