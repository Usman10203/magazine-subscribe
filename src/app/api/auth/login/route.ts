import User from "@/models/userModel";
import connectDB from "@/utils/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const reqBody = await request.json()

        const { email, password } = reqBody;

        if (!email || !password) {
            return NextResponse.json(
                { success: false, message: "All fields are required." },
                { status: 400 }
            );
        }

        const user = await User.findOne({ email })
        if (!user) {
            return NextResponse.json({ error: "User does not exist" }, { status: 400 })
        }

        const validPassword = await bcryptjs.compare(password, user.password)
        if (!validPassword) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 400 })
        }

        const tokenData = {
            id: user._id,
            username: user.username,
            email: user.email
        }

        const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, { expiresIn: "7d" })

        const response = NextResponse.json({
            message: "Login successful",
            success: true,
            token: token
        }, { status: 200 })

        await response.cookies.set("authToken", token, {
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
            httpOnly: true,
        });

        return response;

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}