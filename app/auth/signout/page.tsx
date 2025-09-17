"use client";

import { useEffect } from "react";
import { signOut } from "next-auth/react";

export default function SignOutPage() {
    useEffect(() => {
        signOut({ callbackUrl: "/" });
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <div className="text-2xl mb-2">👋</div>
                <p className="text-gray-600">Signing you out...</p>
            </div>
        </div>
    );
}
