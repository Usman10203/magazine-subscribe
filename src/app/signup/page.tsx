"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";


interface User {
    username: string;
    email: string;
    password: string;
}

export default function SignupPage() {
    const router = useRouter();
    const [user, setUser] = useState<User>({
        username: "",
        email: "",
        password: "",
    });
    const [buttonDisabled, setButtonDisabled] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);

    const onSignup = async () => {
        try {
            setLoading(true);
            const response = await axios.post("/api/auth/register", user);
            if (response.status === 201) {
                toast.success(response.data.message);
                router.push("/login");
            }
        } catch (error: any) {
            if (error.response) {
                const errorMessage =
                    error.response.data.error ||
                    error.response.data.message ||
                    "An error occurred";
                toast.error(errorMessage);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user.email.length > 0 && user.password.length > 0 && user.username.length > 0) {
            setButtonDisabled(false);
        } else {
            setButtonDisabled(true);
        }
    }, [user]);

    return (
        <div className="flex items-center justify-center min-h-screen  px-4">
            <div className="w-full max-w-sm  p-8 rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold text-center mb-6">
                    {loading ? "Processing..." : "Signup"}
                </h1>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="username" className="block font-medium mb-1">
                            Username
                        </label>
                        <input
                            id="username"
                            type="text"
                            placeholder="Username"
                            value={user.username}
                            onChange={(e) => setUser({ ...user, username: e.target.value })}
                            className="w-full p-2 border border-blue-300 rounded-lg focus:outline-none focus:border-blue-600 text-black"
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block  font-medium mb-1">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            placeholder="Email"
                            value={user.email}
                            onChange={(e) => setUser({ ...user, email: e.target.value })}
                            className="w-full p-2 border border-blue-300 rounded-lg focus:outline-none focus:border-blue-600 text-black"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block  font-medium mb-1">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Password"
                            value={user.password}
                            onChange={(e) => setUser({ ...user, password: e.target.value })}
                            className="w-full p-2 border border-blue-300 rounded-lg focus:outline-none focus:border-blue-600 text-black"
                        />
                    </div>
                    <button
                        onClick={onSignup}
                        disabled={buttonDisabled || loading}
                        className={`w-full py-2 px-4 rounded-lg font-bold transition-colors duration-200 ${buttonDisabled || loading
                            ? "bg-blue-200 text-black cursor-not-allowed"
                            : "bg-blue-500 text-white hover:bg-blue-600"
                            }`}
                    >
                        {buttonDisabled || loading ? "No signup" : "Signup"}
                    </button>
                    <div className="text-center">
                        <Link href="/login">
                            <div className="text-blue-600 hover:underline">Visit login page</div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}