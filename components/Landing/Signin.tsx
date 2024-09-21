"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function Signin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSignin = async () => {
        try {
            const response = await axios.post("/api/signin", {
                email,
                password,
            });
            if (response.status === 200) {
                // Handle successful login (e.g., save token, redirect, etc.)
                // router.push("/dashboard"); // Adjust as needed
            }
        } catch (err: any) {
            console.error("Signin failed:", err.response?.data?.error || err.message);
            setError(err.response?.data?.error || "Signin failed. Please try again.");
        }
    };

    return (
        <div className="h-screen bg-gray-700 flex justify-center flex-col">
            <div className="flex justify-center">
                <div className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100">
                    <div>
                        <div className="px-10">
                            <div className="text-3xl font-extrabold">Sign in</div>
                        </div>
                        {error && <p className="text-red-500">{error}</p>}
                        <div className="pt-2">
                            <LabelledInput
                                onChange={(e) => setEmail(e.target.value)}
                                label="Email"
                                placeholder="john@example.com"
                                type="email"
                            />
                            <LabelledInput
                                onChange={(e) => setPassword(e.target.value)}
                                label="Password"
                                type="password"
                                placeholder="********"
                            />
                            <button
                                onClick={handleSignin}
                                type="button"
                                className="mt-8 w-full text-white bg-gray-800 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5"
                            >
                                Sign In
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function LabelledInput({ label, placeholder, type, onChange }: LabelledInputType) {
    return (
        <div>
            <label className="block mb-2 text-sm text-black font-semibold pt-4">{label}</label>
            <input
                onChange={onChange}
                type={type || "text"}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder={placeholder}
                required
            />
        </div>
    );
}

interface LabelledInputType {
    label: string;
    placeholder: string;
    type?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
