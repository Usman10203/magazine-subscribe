"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { User } from "@/types/interfaces";

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const getUserDetails = async () => {
            try {
                const res = await axios.get("/api/user/profile");
                if (res.data && res.data.data) {
                    setUser(res.data.data);
                }
            } catch (error: any) {
                toast.error("Failed to fetch user details");
            } finally {
                setLoading(false);
            }
        };
        getUserDetails();
    }, []);

    const logout = async () => {
        try {
            const { data } = await axios.post("/api/auth/logout");
            if (data.success) {
                toast.success("Logout successful");
                router.push("/login");
            }

        } catch (error: any) {
            toast.error(error.message);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-2xl">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-8 px-4 ">
            <div className="max-w-4xl mx-auto  shadow-md rounded p-6">
                <h1 className="text-3xl font-bold text-center mb-6">Profile</h1>
                {user ? (
                    <table className="w-full border-collapse ">
                        <tbody className="bg-slate-700">
                            <tr className="border-b">
                                <th className="py-2 px-4  font-medium text-left">Username</th>
                                <td className="py-2 px-4 ">{user.username}</td>
                            </tr>
                            <tr className="border-b">
                                <th className="py-2 px-4  font-medium text-left">Email</th>
                                <td className="py-2 px-4 ">{user.email}</td>
                            </tr>
                        </tbody>
                    </table>
                ) : (
                    <div className="text-center ">No user data found</div>
                )}
                <div className="flex justify-center mt-6 space-x-4">
                    <button
                        onClick={logout}
                        className="bg-cyan-500 hover:bg-cyan-600 text-white  font-bold py-2 px-4 rounded"
                    >
                        Logout
                    </button>

                </div>
            </div>
        </div>
    );
}
