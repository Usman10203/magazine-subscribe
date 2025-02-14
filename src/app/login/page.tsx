"use client";
import Link from "next/link";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useState } from "react";


export default function LoginPage() {
    const router = useRouter();
    const [user, setUser] = useState({
        email: "",
        password: "",
    });
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [loading, setLoading] = useState(false);

    const onLogin = async () => {
        try {
            setLoading(true);
            const response = await axios.post("/api/auth/login", user);
            if (response.status === 200) {
                toast.success(response.data.message);
                router.push("/");
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
        if (user.email.length > 0 && user.password.length > 0) {
            setButtonDisabled(false);
        } else {
            setButtonDisabled(true);
        }
    }, [user]);

    return (
        <div className="flex items-center justify-center min-h-screen  px-4">
            <div className="w-full max-w-sm  p-8 rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold text-center mb-6">
                    {loading ? "Processing..." : "Login"}
                </h1>
                <div className="space-y-4">
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
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-600 text-black"
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
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-600 text-black"
                        />
                    </div>
                    <button
                        onClick={onLogin}
                        disabled={buttonDisabled || loading}
                        className={`w-full py-2 px-4 rounded-lg font-bold transition-colors duration-200 ${buttonDisabled || loading
                            ? "bg-gray-300  cursor-not-allowed"
                            : "bg-blue-500 text-white hover:bg-blue-600"
                            }`}
                    >
                        Login Here
                    </button>
                    <div className="flex justify-between text-sm ">
                        <Link href="/signup">
                            <div className="hover:text-blue-500">Visit Signup Page</div>
                        </Link>
                        <Link href="/forgotpassword">
                            <div className="hover:text-blue-500">Forgot Password?</div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}