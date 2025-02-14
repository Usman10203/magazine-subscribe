
import { NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConfig';
import Subscription from '@/models/subscriptionModel';
import Magazine from '@/models/magazineModel';
import Plan from '@/models/planModel';
import { checkAuth } from '@/utils/checkAuth';
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    await dbConnect();

    try {
        const userId = await checkAuth(request);
        if (!userId) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const { magazineId, planId } = await request.json();

        const magazine = await Magazine.findById(magazineId);
        if (!magazine) {
            return NextResponse.json({ success: false, message: "Magazine not found" }, { status: 404 });
        }

        const plan = await Plan.findById(planId);
        if (!plan) {
            return NextResponse.json({ success: false, message: "Plan not found" }, { status: 404 });
        }

        const existingSubscription = await Subscription.findOne({
            user_id: userId,
            magazine_id: magazineId,
            is_active: true,
        });

        if (existingSubscription) {
            if (existingSubscription.plan_id.toString() === planId) {
                return NextResponse.json({ success: false, message: "Subscription already exists" }, { status: 400 });
            }
            existingSubscription.is_active = false;
            await existingSubscription.save();
        }

        const discountRate = plan.discount > 1 ? plan.discount / 100 : plan.discount;

        const priceAfterDiscount = magazine.base_price * (1 - discountRate);

        const newDate = new Date();
        newDate.setMonth(newDate.getMonth() + plan.renewalPeriod);
        const renewalDate = newDate;

        const subscription = await Subscription.create({
            user_id: userId,
            magazine_id: magazineId,
            plan_id: planId,
            price: priceAfterDiscount,
            renewal_date: renewalDate,
            is_active: true,
        });

        return NextResponse.json({ success: true, subscription }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
    }
};

export async function GET(request: NextRequest) {

    await dbConnect();

    try {
        const userId = await checkAuth(request);
        if (!userId) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const subscriptions = await Subscription.find({
            user_id: userId,
            is_active: true
        }).select("magazine_id plan_id -_id");

        return NextResponse.json({ success: true, subscriptions }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
    }
};

export async function DELETE(request: NextRequest) {
    await dbConnect();

    try {
        const userId = await checkAuth(request);
        if (!userId) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const { magazineId } = await request.json();

        const subscription = await Subscription.findOne({
            user_id: userId,
            magazine_id: magazineId,
            is_active: true,
        });

        if (!subscription) {
            return NextResponse.json({ success: false, message: "Subscription not found" }, { status: 404 });
        }

        subscription.is_active = false;
        await subscription.save();

        return NextResponse.json({ success: true, message: "Subscription canceled successfully" }, { status: 200 });
    }
    catch (error: any) {
        return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
    }
}