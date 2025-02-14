import User from "@/models/userModel";
import connectDB from "@/utils/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";

export async function POST(request: NextRequest) {
    await connectDB();

    try {
        const reqBody = await request.json();
        const { username, email, password } = reqBody;

        if (!username || !email || !password) {
            return NextResponse.json(
                { success: false, error: "All fields  are required." },
                { status: 400 }
            );
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { success: false, error: "A user with this email already exists." },
                { status: 400 }
            );
        }

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);


        const newUser = new User({ username, email, password: hashedPassword, });

        const savedUser = await newUser.save();

        return NextResponse.json({ success: true, message: "User registered successfully.", user: { id: savedUser._id, username: savedUser.username, email: savedUser.email }, }, { status: 201 });
    }
    catch (error: any) {
        return NextResponse.json(
            { success: false, error: "Internal server error. Please try again later." },
            { status: 500 }
        );
    }
}
