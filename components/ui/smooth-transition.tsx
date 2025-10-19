"use client";

import { useState, useEffect, ReactNode } from 'react';
import { useLanguageChange } from '@/lib/i18n';

interface SmoothTransitionProps {
    children: ReactNode;
    className?: string;
}

export default function SmoothTransition({ children, className = "" }: SmoothTransitionProps) {
    const [isVisible, setIsVisible] = useState(true);

    // Listen for language changes with smooth transition
    useLanguageChange((newLocale: string) => {
        // Start fade out
        setIsVisible(false);

        // After fade out completes, fade back in
        setTimeout(() => {
            setIsVisible(true);
        }, 150); // Half of transition duration
    });

    return (
        <div
            className={`transition-all duration-300 ease-in-out ${isVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-2'
                } ${className}`}
        >
            {children}
        </div>
    );
}
