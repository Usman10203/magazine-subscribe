"use client";

import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function Navbar() {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            const { data } = await axios.post("/api/auth/logout");
            if (data.success) {
                toast.success("Logout successful");
                router.push("/login");
            }
        } catch (error: any) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <nav className="bg-gray-800 p-3">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                {/* Home Link (Magazine) */}
                <Link href="/">
                    <div className="text-white text-lg sm:text-xl font-bold">Magazines</div>
                </Link>

                <div className="flex space-x-4">
                    {/* Profile Link */}
                    <Link href="/profile">
                        <div className="text-gray-300 text-sm sm:text-base hover:text-white">
                            Profile
                        </div>
                    </Link>
                    {/* Logout Button */}
                    <button
                        className="text-gray-300 text-sm sm:text-base hover:text-white"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
}
