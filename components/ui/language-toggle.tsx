"use client";

import { useState, useEffect } from 'react';
import { detectLocale, getMessages, triggerLanguageChange } from '@/lib/i18n';

interface LanguageToggleProps {
    onLanguageChange?: (locale: string) => void;
}

const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
];

export default function LanguageToggle({ onLanguageChange }: LanguageToggleProps) {
    const [currentLocale, setCurrentLocale] = useState('en');
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const detectedLocale = detectLocale();
        setCurrentLocale(detectedLocale);
    }, []);

    const currentLanguage = languages.find(lang => lang.code === currentLocale) || languages[0];

    const handleLanguageChange = (locale: string) => {
        setCurrentLocale(locale);
        setIsOpen(false);

        // Trigger smooth language change
        triggerLanguageChange(locale);

        // Notify parent component
        if (onLanguageChange) {
            onLanguageChange(locale);
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group"
                aria-label="Select language"
            >
                <span className="text-lg">{currentLanguage.flag}</span>
                <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
                    {currentLanguage.name}
                </span>
                <svg
                    className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Dropdown */}
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-20 transform transition-all duration-200 ease-out scale-100 opacity-100">
                        {languages.map((language) => (
                            <button
                                key={language.code}
                                onClick={() => handleLanguageChange(language.code)}
                                className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors ${currentLocale === language.code
                                    ? 'bg-blue-50 text-blue-600'
                                    : 'text-gray-700'
                                    }`}
                            >
                                <span className="text-lg">{language.flag}</span>
                                <span className="text-sm font-medium">{language.name}</span>
                                {currentLocale === language.code && (
                                    <svg className="w-4 h-4 ml-auto text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                )}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
