"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Magazine, Plan, Subscription } from "@/types/interfaces";

export default function Magazines() {
    const [magazines, setMagazines] = useState<Magazine[]>([]);
    const [magazinesLoading, setMagazinesLoading] = useState<boolean>(true);
    const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
    const [subscribedPlans, setSubscribedPlans] = useState<{ [magazineId: string]: string }>({});

    const fetchMagazines = async () => {
        try {
            setMagazinesLoading(true);
            const { data } = await axios.get<{ magazines: Magazine[] }>("/api/magazines");
            setMagazines(data.magazines);
        } catch (error) {
        } finally {
            setMagazinesLoading(false);
        }
    };

    const fetchSubscriptions = async () => {
        try {
            const { data } = await axios.get<{ success: boolean; subscriptions: Subscription[] }>("/api/subscription");
            if (data.success) {
                const subsMap = data.subscriptions.reduce((acc, sub) => {
                    acc[sub.magazine_id] = sub.plan_id;
                    return acc;
                }, {} as { [magazineId: string]: string });
                setSubscribedPlans(subsMap);
            }
        } catch (error) {
            console.error("Error fetching subscriptions:", error);
        }
    };

    useEffect(() => {
        fetchMagazines();
        fetchSubscriptions();
    }, []);


    const handleSubscribe = async (magazineId: string, planId: string) => {
        const confirmed = window.confirm("Are you sure you want to Subscribe?");
        if (!confirmed) return;
        const uniqueKey = `${magazineId}-${planId}`;
        setLoading((prev) => ({ ...prev, [uniqueKey]: true }));
        try {
            const { data } = await axios.post("/api/subscription", { magazineId, planId });
            if (data.success) {
                toast.success("Subscription successful!");
                setSubscribedPlans((prev) => ({ ...prev, [magazineId]: planId }));
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Subscription failed");
        } finally {
            setLoading((prev) => ({ ...prev, [uniqueKey]: false }));
        }
    };

    const handleCancel = async (magazineId: string) => {
        const confirmed = window.confirm("Are you sure you want to cancel your subscription?");
        if (!confirmed) return;
        try {
            const { data } = await axios.delete("/api/subscription", { data: { magazineId } });
            if (data.success) {
                toast.success("Subscription canceled");
                setSubscribedPlans((prev) => {
                    const updated = { ...prev };
                    delete updated[magazineId];
                    return updated;
                });
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Cancellation failed");
        }
    };

    return (
        <div className="min-h-screen p-24">
            <h1 className="text-3xl font-bold text-center mb-6">Subscribe to Our Magazines</h1>
            {magazinesLoading ? (
                <div className="text-2xl text-center">Loading magazines...</div>
            ) : magazines.length === 0 ? (
                <div className="text-center text-gray-600">No magazines available right now</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {magazines.map((mag) => {
                        const activePlanId = subscribedPlans[mag._id];
                        return (
                            <div key={mag._id} className={`p-4 rounded-xl shadow-md bg-slate-300 ${activePlanId ? "border-4 border-green-500" : ""}`}>
                                <h2 className="text-black text-xl font-semibold ">{mag.name}</h2>
                                <p className="text-gray-600">{mag.description}</p>
                                <h3 className="mt-3 text-lg font-bold text-black text-center">Plans</h3>
                                <ul>
                                    {mag.plans.map((plan) => {
                                        const isActivePlan = activePlanId === plan._id;
                                        const uniqueKey = `${mag._id}-${plan._id}`;
                                        const btnText = loading[uniqueKey] ? "Subscribing..." : activePlanId ? isActivePlan ? "Subscribed" : "Upgrade" : "Subscribe";
                                        return (
                                            <li key={plan._id} className="bg-blue-100 p-2 rounded-md mt-2">
                                                <strong className="text-gray-800">{plan.title}</strong> -{" "}
                                                <span className="text-green-600 font-bold">
                                                    ${plan.priceAfterDiscount.toFixed(2)}
                                                </span>
                                                <p className="text-sm text-gray-600">{plan.description}</p>
                                                <p className="text-sm text-gray-700">
                                                    <span className="font-semibold">Discount:</span> {plan.discount * 100}%
                                                </p>
                                                <button className={`mt-2 py-1 px-3 rounded-md ${activePlanId && isActivePlan ? "bg-green-600 text-white" : "bg-blue-600 text-white hover:bg-blue-700"} disabled:bg-gray-400`} onClick={() => handleSubscribe(mag._id, plan._id)} disabled={!!loading[uniqueKey] || !!(activePlanId && isActivePlan)} > {btnText} </button>
                                            </li>
                                        );
                                    })}
                                </ul>
                                {activePlanId && (
                                    <button className="mt-4 py-1 px-3 rounded bg-red-600 text-white hover:bg-red-700" onClick={() => handleCancel(mag._id)} > Cancel Subscription </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
