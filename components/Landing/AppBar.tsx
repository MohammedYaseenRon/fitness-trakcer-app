"use client";

import React, { useState } from "react";
import { Menu, X, Activity } from 'lucide-react';
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

interface NavItem {
    label: string;
    href: string;
}

const navItems: NavItem[] = [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: "Contact", href: "/contact" }
];

export const AppBar: React.FC = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    const toggleMenu = () => setMenuOpen(!menuOpen);

    const goToSignup = () => {
        router.push("/signup");
    };

    return (
        <div className="bg-blue-600 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/" className="flex-shrink-0">
                            <Activity className="h-8 w-8" />
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4 ml-4 md:space-x-6 md:ml-auto">
                        <div className="hidden md:flex md:items-center md:space-x-4">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`${
                                        pathname === item.href
                                            ? 'bg-blue-700 text-white'
                                            : 'text-white hover:bg-blue-500'
                                    } px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300`}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                        <div className="hidden md:flex">
                            <button
                                onClick={goToSignup}
                                className="bg-white text-blue-600 hover:bg-blue-100 px-4 py-2 rounded-md text-sm font-medium"
                            >
                                Sign Up
                            </button>
                        </div>
                        <div className="-mr-2 flex md:hidden">
                            <button
                                onClick={toggleMenu}
                                className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-white hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-500 focus:ring-white"
                            >
                                {menuOpen ? (
                                    <X className="block h-6 w-6" />
                                ) : (
                                    <Menu className="block h-6 w-6" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
                {menuOpen && (
                    <div className="md:hidden fixed inset-0 bg-blue-800 bg-opacity-90 z-50 flex flex-col">
                        <div className="px-2 py-2 space-y-1 sm:px-3 flex-grow overflow-auto">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`${
                                        pathname === item.href
                                            ? 'bg-blue-700 text-white'
                                            : 'text-white hover:bg-blue-500'
                                    } block px-3 py-2 rounded-md text-base font-medium transition-colors duration-300`}
                                >
                                    {item.label}
                                </Link>
                            ))}
                            <button
                                onClick={goToSignup}
                                className="block px-3 py-2 rounded-md text-base font-medium bg-white text-blue-600 hover:bg-blue-100"
                            >
                                Sign Up
                            </button>
                        </div>
                        <button
                            onClick={toggleMenu}
                            className="absolute top-4 right-4 text-white"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
