"use client";
import Link from "next/link";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";

const ForgotPassword = () => {
    const router = useRouter();
    const [user, setUser] = React.useState({
        email: "",
    });
    const [buttonDisabled, setButtonDisabled] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    const verifyEmail = async () => {
        try {
            setLoading(true);
            const response = await axios.post("/api/auth/forgotpassword", user);
            if (response.data.success === true) {
                toast.success("Verification Email sent to your email account");
            }
        } catch (error: any) {
            if (error.response) {
                const errorMessage = error.response.data.error || "An error occurred";
                toast.error(errorMessage);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user.email.length > 0) {
            setButtonDisabled(false);
        } else {
            setButtonDisabled(true);
        }
    }, [user]);

    return (
        <div className="flex items-center justify-center min-h-screen  px-4">
            <div className="w-full max-w-sm  p-8 rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold text-center mb-6">Forgot Password</h1>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block  font-medium mb-1">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            value={user.email}
                            onChange={(e) => setUser({ ...user, email: e.target.value })}
                            className="w-full p-2 border border-blue-300 rounded-lg focus:outline-none focus:border-blue-600 text-black"
                        />
                    </div>
                    <button
                        onClick={verifyEmail}
                        disabled={buttonDisabled || loading}
                        className={`w-full py-2 px-4 rounded-lg font-bold transition-colors duration-200 ${buttonDisabled || loading
                            ? "bg-blue-200 text-black cursor-not-allowed"
                            : "bg-blue-500 text-white hover:bg-blue-600"
                            }`}
                    >
                        {loading ? "Verifying..." : "Verify Email"}
                    </button>
                    <div className="text-center">
                        <Link href="/login">
                            <div className="text-blue-600 hover:underline">Visit Login page</div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;