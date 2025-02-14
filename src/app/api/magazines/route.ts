import dbConnect from '@/utils/dbConfig';
import Magazine from '@/models/magazineModel';
import Plan from '@/models/planModel';
import { checkAuth } from '@/utils/checkAuth';
import { NextRequest, NextResponse } from "next/server";
export async function GET(request: NextRequest) {
    await dbConnect();
    const userId = await checkAuth(request);

    if (!userId) {
        return NextResponse.json({ success: false, message: "No user Found/Unauthorized" }, { status: 500 });
    }


    try {
        const magazines = await Magazine.find({});
        const plans = await Plan.find({});

        const magazineList = magazines.map((mag) => {
            const magazinePlans = plans.map((plan) => ({
                _id: plan._id,
                title: plan.title,
                description: plan.description,
                renewalPeriod: plan.renewalPeriod,
                tier: plan.tier,
                discount: plan.discount,
                priceAfterDiscount: mag.base_price * (1 - plan.discount),
            }));

            return {
                _id: mag._id,
                name: mag.name,
                description: mag.description,
                base_price: mag.base_price,
                plans: magazinePlans,
            };
        });

        return NextResponse.json({ success: true, magazines: magazineList });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
