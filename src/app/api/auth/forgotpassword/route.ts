import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import connectDB from "@/utils/dbConfig";
import { sendEmail } from "@/utils/sendEmail";

export async function POST(request: NextRequest) {
    await connectDB();
    try {
        const reqBody = await request.json()

        const { email } = reqBody;

        if (!email) {
            return NextResponse.json(
                { success: false, error: "Email is  required." },
                { status: 400 }
            );
        }

        const user = await User.findOne({ email })
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 400 })
        }

        await sendEmail({ email, emailType: "RESET", userId: user._id.toString() })

        const response = NextResponse.json({
            message: "Verify Email successfully send ",
            success: true,
        })

        return response;

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}