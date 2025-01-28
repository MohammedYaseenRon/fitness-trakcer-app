"use client";

// pages/profile.tsx
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Profile() {
    const { data: session, status } = useSession();
    const router = useRouter();

    if (status === "loading") {
        return <p>Loading...</p>;
    }

    if (!session) {
        router.push("/login");
        return null;
    }

    const handleSignOut = async() => {
        await signOut({ redirect: true, callbackUrl: "/" }); // Redirect to home page after sign-out

    }

    return (
        <div className="mt-8 p-4 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-4">Profile</h1>
            <p className="text-gray-700">Name: {session.user?.name}</p>
            <p className="text-gray-700">Email: {session.user?.email}</p>
            <button
                onClick={handleSignOut}
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
                Sign Out
            </button>
        </div>
    );
}