import connectDB from "@/utils/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/utils/sendEmail";
import bcryptjs from 'bcryptjs'

export async function PUT(request: NextRequest) {
    try {

        const reqBody = await request.json()

        const { id, password } = reqBody;

        if (!id || !password) {
            return NextResponse.json({ success: false, error: "All fields are required." }, { status: 400 });
        }

        const user = await User.findOne({ _id: id })
        if (!user) {
            return NextResponse.json({ error: "User does not exist" }, { status: 400 })
        }

        const salt = await bcryptjs.genSalt(10)
        const hashedPassword = await bcryptjs.hash(password, salt)
        user.password = hashedPassword
        await user.save();

        return NextResponse.json({ message: "Password updated successfully", success: true, })

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}