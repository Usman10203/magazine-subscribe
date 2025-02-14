"use client";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";


export default function ResetPasswordPage({ params }: any) {
    const router = useRouter();
    const resolvedParams = React.use(params) as { id: string };

    const [user, setUser] = React.useState({
        password: "",
        confirm_password: ""
    });
    const [buttonDisabled, setButtonDisabled] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    const onSubmit = async () => {
        if (user.password !== user.confirm_password) {
            toast.error("Passwords do not match!");
            return;
        }

        try {
            setLoading(true);
            const response = await axios.put(`/api/auth/resetpassword`, {
                id: resolvedParams.id,
                password: user.password
            });
            if (response.data.success) {
                toast.success('Password Updated Successfully');
                router.push('/login');
            }
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        setButtonDisabled(user.password.length === 0 || user.confirm_password.length === 0 || user.password !== user.confirm_password);
    }, [user]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1>{loading ? "Processing" : "Reset Password"}</h1>
            <hr />

            <label htmlFor="password">Password</label>
            <input
                className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
                id="password"
                type="password"
                value={user.password}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
                placeholder="password"
            />
            <label htmlFor="confirm_password">Confirm Password</label>
            <input
                className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
                id="confirm_password"
                type="password"
                value={user.confirm_password}
                onChange={(e) => setUser({ ...user, confirm_password: e.target.value })}
                placeholder="confirm password"
            />
            <button
                onClick={onSubmit}
                disabled={buttonDisabled}
                className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 disabled:opacity-50"
            >
                Reset
            </button>
        </div>
    );
}