import { NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConfig';
import Subscription from '@/models/subscriptionModel';
import Magazine from '@/models/magazineModel';
import Plan from '@/models/planModel';
import { checkAuth } from '@/utils/checkAuth';
import { NextRequest } from "next/server";
import User from '@/models/userModel';


export async function GET(request: NextRequest) {

    try {
        const userId = await checkAuth(request);
        if (!userId) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }
        const user = await User.findOne({ _id: userId }).select("-password");
        return NextResponse.json({
            mesaaage: "User found",
            data: user
        })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }

}