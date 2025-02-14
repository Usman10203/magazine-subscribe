import connectDB from "@/utils/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {

    try {
        const reqBody = await request.json()
        const { token } = reqBody

        if (!token) {
            return NextResponse.json({ success: false, error: "Token is required." }, { status: 400 });
        }

        const user = await User.findOne({ forgotPasswordToken: token, forgotPasswordTokenExpiry: { $gt: Date.now() } });

        if (!user) {
            return NextResponse.json({ error: "Invalid token" }, { status: 400 });
        }

        user.forgotPasswordToken = undefined;
        user.forgotPasswordTokenExpiry = undefined;
        await user.save();

        return NextResponse.json({ message: "Verified Password reset email successfully", success: true, data: { id: user._id.toString() } });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
