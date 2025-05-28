"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import HomeIcon from "../components/HomeIcon";
import { Cog6ToothIcon } from '@heroicons/react/24/outline';

export default function Header({ isLoggedIn }: { isLoggedIn: boolean }) {
    const [submenuOpen, setSubmenuOpen] = useState(false);
    const cogRef = useRef<HTMLButtonElement>(null);
    const submenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Close the submenu when clicking outside of it
        function handleClickOutside(event: MouseEvent) {
            if (
                submenuRef.current &&
                !submenuRef.current.contains(event.target as Node) &&
                cogRef.current &&
                !cogRef.current.contains(event.target as Node)
            ) {
                setSubmenuOpen(false);
            }
        }
        if (submenuOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [submenuOpen]);

    return (
        <header className="w-full flex justify-between items-center px-8 py-2">
            <Link
                href="/"
                className="flex items-center text-lg font-bold text-blue-800 hover:underline group"
            >
                <HomeIcon className="w-6 h-6 mr-2 transition-transform duration-200 group-hover:-translate-y-1 group-hover:scale-110" />
            </Link>
            <div className="flex items-center gap-6">
                <div className="relative">
                    <button
                        ref={cogRef}
                        type="button"
                        aria-haspopup="true"
                        aria-expanded={submenuOpen}
                        onClick={() => setSubmenuOpen((v) => !v)}
                        className="text-blue-600 hover:underline font-medium group focus:outline-none"
                    >
                        <Cog6ToothIcon className="h-6 w-6 transition-transform duration-200 group-hover:rotate-90 group-hover:scale-110" />
                    </button>
                    {submenuOpen && (
                        <div
                            ref={submenuRef}
                            className="absolute right-0 mt-2 w-40 bg-white border border-blue-200 rounded shadow-lg z-50 animate-fade-in"
                        >
                            <Link
                                href="/admin"
                                className="block px-4 py-2 text-blue-800 hover:bg-blue-50 hover:underline"
                                onClick={() => setSubmenuOpen(false)}
                            >
                                Admin Panel
                            </Link>

                            {isLoggedIn && (<Link
                                href="/logout"
                                className="block px-4 py-2 text-blue-800 hover:bg-blue-50 hover:underline"
                                onClick={() => setSubmenuOpen(false)}
                            >
                                Log out
                            </Link>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
