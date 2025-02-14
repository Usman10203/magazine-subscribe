"use client";

import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function VerifyEmailPage() {
    const [token, setToken] = useState("");
    const [verified, setVerified] = useState(false);
    const [error, setError] = useState(false);
    const [isPasswordReset, setIsPasswordReset] = useState(false);
    const [user, setUser] = useState();
    const router = useRouter();

    const verifyUserEmail = async () => {
        try {
            const endpoint = isPasswordReset ? '/api/auth/verifyToken' : '/api/auth/verifyemail';
            const response = await axios.post(endpoint, { token });
            if (response?.data?.success == true) {
                setUser(response?.data?.data?.id)
                setVerified(true);
            }

        } catch (error: any) {
            setError(true);
        }
    };

    useEffect(() => {

        const urlParams = new URLSearchParams(window.location.search);
        const urlToken = urlParams.get('token');
        const type = urlParams.get('type');
        setToken(urlToken || "");
        setIsPasswordReset(type === 'reset');
    }, []);

    useEffect(() => {
        if (token.length > 0) {
            verifyUserEmail();
        }
    }, [token]);

    useEffect(() => {
        if (verified && isPasswordReset && user) {

            router.push(`/resetpassword/${user}`);
        }
    }, [verified, isPasswordReset, router, user]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1 className="text-4xl">{isPasswordReset ? "Reset Password" : "Verify Email"}</h1>
            <h2 className="p-2 bg-orange-500 text-black">{token ? `${token}` : "no token"}</h2>
            {verified && !isPasswordReset && (
                <div>
                    <h2 className="text-2xl">Email Verified</h2>
                    <Link href="/login">Login</Link>
                </div>
            )}
            {error && (
                <div>
                    <h2 className="mt-4 text-2xl bg-red-500 text-black">Cant Verify,Try Again</h2>
                </div>
            )}
        </div>
    );
}