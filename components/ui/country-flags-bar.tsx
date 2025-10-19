"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { detectLocale, getMessages, useLanguageChange } from '@/lib/i18n';
import SmoothTransition from './smooth-transition';

const CountryFlagsBar = () => {
    const [locale, setLocale] = useState('en');
    const [messages, setMessages] = useState(getMessages('en'));

    useEffect(() => {
        const detectedLocale = detectLocale();
        setLocale(detectedLocale);
        setMessages(getMessages(detectedLocale));
    }, []);

    // Listen for language changes with smooth transition
    useLanguageChange((newLocale: string) => {
        setLocale(newLocale);
        setMessages(getMessages(newLocale));
    });

    const t = (key: string) => messages.ui?.[key as keyof typeof messages.ui] || key;
    const countries = [
        { name: "Brazil", code: "BR", flag: "🇧🇷" },
        { name: "Russia", code: "RU", flag: "🇷🇺" },
        { name: "India", code: "IN", flag: "🇮🇳" },
        { name: "China", code: "CN", flag: "🇨🇳" },
        { name: "South Africa", code: "ZA", flag: "🇿🇦" },
        { name: "Egypt", code: "EG", flag: "🇪🇬" },
        { name: "Iran", code: "IR", flag: "🇮🇷" },
        { name: "UAE", code: "AE", flag: "🇦🇪" },
        { name: "Indonesia", code: "ID", flag: "🇮🇩" },
        { name: "Saudi Arabia", code: "SA", flag: "🇸🇦" },
        { name: "Vietnam", code: "VN", flag: "🇻🇳" },
        { name: "Kazakhstan", code: "KZ", flag: "🇰🇿" },
        { name: "Nigeria", code: "NG", flag: "🇳🇬" },
        { name: "Turkey", code: "TR", flag: "🇹🇷" },
        { name: "Ethiopia", code: "ET", flag: "🇪🇹" },
        { name: "Pakistan", code: "PK", flag: "🇵🇰" },
        { name: "Bangladesh", code: "BD", flag: "🇧🇩" },
        { name: "Singapore", code: "SG", flag: "🇸🇬" },
        { name: "Malaysia", code: "MY", flag: "🇲🇾" },
        { name: "Kenya", code: "KE", flag: "🇰🇪" },
        { name: "China", code: "CN", flag: "🇨🇳" },
        { name: "India", code: "IN", flag: "🇮🇳" },
        { name: "Russia", code: "RU", flag: "🇷🇺" },
        { name: "Brazil", code: "BR", flag: "🇧🇷" },
    ];

    const duplicated = [...countries, ...countries];

    return (
        <div className="relative overflow-hidden py-8 bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 border-t border-b border-blue-700/40 backdrop-blur-md shadow-inner">
            {/* Header */}
            <SmoothTransition>
                <div className="text-center mb-6">
                    <h3 className="text-xl font-semibold text-white tracking-wide">
                        {t('connectedAcrossNations')}
                    </h3>
                    <p className="text-sm text-blue-200">
                        {t('empoweringTrade')}
                    </p>
                </div>
            </SmoothTransition>

            {/* Scrolling Flags Row */}
            <div className="overflow-hidden">
                <div className="flex whitespace-nowrap animate-marquee">
                    {duplicated.map((c, i) => (
                        <div
                            key={`${c.code}-${i}`}
                            className="flex items-center space-x-3 mx-6 flex-shrink-0 group hover:scale-110 transition-transform duration-300"
                        >
                            <div className="relative">
                                <Image
                                    src={`https://flagcdn.com/w40/${c.code.toLowerCase()}.png`}
                                    alt={c.name}
                                    width={40}
                                    height={30}
                                    className="rounded-sm shadow-lg group-hover:shadow-blue-400/50 transition-shadow duration-300"
                                    onError={(e) => {
                                        e.currentTarget.style.display = "none";
                                        const nextEl = e.currentTarget.nextElementSibling as HTMLElement;
                                        if (nextEl) nextEl.style.display = "inline";
                                    }}
                                />
                                <span
                                    className="text-3xl hidden absolute -top-1 left-0"
                                    style={{ display: "none" }}
                                >
                                    {c.flag}
                                </span>
                            </div>
                            <span className="text-sm text-blue-100 font-medium tracking-wide">
                                {c.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Edge gradient fades */}
            <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-blue-950 to-transparent pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-indigo-950 to-transparent pointer-events-none"></div>

            {/* Glow border */}
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>

            {/* Animations */}
            <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          display: inline-flex;
          animation: marquee 45s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-marquee {
            animation: none;
          }
        }
      `}</style>
        </div>
    );
};

export default CountryFlagsBar;
