"use client";

import React from "react";

const CountryFlagsBar = () => {
    const countries = [
        { name: "United States", code: "US", flag: "🇺🇸" },
        { name: "United Kingdom", code: "GB", flag: "🇬🇧" },
        { name: "Canada", code: "CA", flag: "🇨🇦" },
        { name: "Australia", code: "AU", flag: "🇦🇺" },
        { name: "Germany", code: "DE", flag: "🇩🇪" },
        { name: "France", code: "FR", flag: "🇫🇷" },
        { name: "Japan", code: "JP", flag: "🇯🇵" },
        { name: "China", code: "CN", flag: "🇨🇳" },
        { name: "India", code: "IN", flag: "🇮🇳" },
        { name: "Singapore", code: "SG", flag: "🇸🇬" },
        { name: "Brazil", code: "BR", flag: "🇧🇷" },
        { name: "Mexico", code: "MX", flag: "🇲🇽" },
        { name: "Italy", code: "IT", flag: "🇮🇹" },
        { name: "Spain", code: "ES", flag: "🇪🇸" },
        { name: "Netherlands", code: "NL", flag: "🇳🇱" },
        { name: "Sweden", code: "SE", flag: "🇸🇪" },
        { name: "Norway", code: "NO", flag: "🇳🇴" },
        { name: "Denmark", code: "DK", flag: "🇩🇰" },
        { name: "Finland", code: "FI", flag: "🇫🇮" },
        { name: "Switzerland", code: "CH", flag: "🇨🇭" },
        { name: "Austria", code: "AT", flag: "🇦🇹" },
        { name: "Belgium", code: "BE", flag: "🇧🇪" },
        { name: "Poland", code: "PL", flag: "🇵🇱" },
        { name: "Czech Republic", code: "CZ", flag: "🇨🇿" },
        { name: "Hungary", code: "HU", flag: "🇭🇺" },
        { name: "Portugal", code: "PT", flag: "🇵🇹" },
        { name: "Greece", code: "GR", flag: "🇬🇷" },
        { name: "Turkey", code: "TR", flag: "🇹🇷" },
        { name: "Russia", code: "RU", flag: "🇷🇺" },
        { name: "South Korea", code: "KR", flag: "🇰🇷" },
        { name: "Thailand", code: "TH", flag: "🇹🇭" },
        { name: "Malaysia", code: "MY", flag: "🇲🇾" },
        { name: "Indonesia", code: "ID", flag: "🇮🇩" },
        { name: "Philippines", code: "PH", flag: "🇵🇭" },
        { name: "Vietnam", code: "VN", flag: "🇻🇳" },
        { name: "South Africa", code: "ZA", flag: "🇿🇦" },
        { name: "Egypt", code: "EG", flag: "🇪🇬" },
        { name: "Nigeria", code: "NG", flag: "🇳🇬" },
        { name: "Kenya", code: "KE", flag: "🇰🇪" },
        { name: "Morocco", code: "MA", flag: "🇲🇦" },
        { name: "Argentina", code: "AR", flag: "🇦🇷" },
        { name: "Chile", code: "CL", flag: "🇨🇱" },
        { name: "Colombia", code: "CO", flag: "🇨🇴" },
        { name: "Peru", code: "PE", flag: "🇵🇪" },
        { name: "Venezuela", code: "VE", flag: "🇻🇪" },
        { name: "Ecuador", code: "EC", flag: "🇪🇨" },
        { name: "Uruguay", code: "UY", flag: "🇺🇾" },
        { name: "Paraguay", code: "PY", flag: "🇵🇾" },
        { name: "Bolivia", code: "BO", flag: "🇧🇴" },
        { name: "Israel", code: "IL", flag: "🇮🇱" },
        { name: "Saudi Arabia", code: "SA", flag: "🇸🇦" },
        { name: "UAE", code: "AE", flag: "🇦🇪" },
        { name: "Qatar", code: "QA", flag: "🇶🇦" },
        { name: "Kuwait", code: "KW", flag: "🇰🇼" },
        { name: "Bahrain", code: "BH", flag: "🇧🇭" },
        { name: "Oman", code: "OM", flag: "🇴🇲" },
        { name: "Jordan", code: "JO", flag: "🇯🇴" },
        { name: "Lebanon", code: "LB", flag: "🇱🇧" },
        { name: "New Zealand", code: "NZ", flag: "🇳🇿" },
        { name: "Ireland", code: "IE", flag: "🇮🇪" },
        { name: "Iceland", code: "IS", flag: "🇮🇸" },
        { name: "Luxembourg", code: "LU", flag: "🇱🇺" },
        { name: "Malta", code: "MT", flag: "🇲🇹" },
        { name: "Cyprus", code: "CY", flag: "🇨🇾" },
        { name: "Estonia", code: "EE", flag: "🇪🇪" },
        { name: "Latvia", code: "LV", flag: "🇱🇻" },
        { name: "Lithuania", code: "LT", flag: "🇱🇹" },
        { name: "Slovenia", code: "SI", flag: "🇸🇮" },
        { name: "Slovakia", code: "SK", flag: "🇸🇰" },
        { name: "Croatia", code: "HR", flag: "🇭🇷" },
        { name: "Serbia", code: "RS", flag: "🇷🇸" },
        { name: "Romania", code: "RO", flag: "🇷🇴" },
        { name: "Bulgaria", code: "BG", flag: "🇧🇬" },
        { name: "Ukraine", code: "UA", flag: "🇺🇦" },
        { name: "Belarus", code: "BY", flag: "🇧🇾" },
        { name: "Moldova", code: "MD", flag: "🇲🇩" },
        { name: "Albania", code: "AL", flag: "🇦🇱" },
        { name: "Macedonia", code: "MK", flag: "🇲🇰" },
        { name: "Montenegro", code: "ME", flag: "🇲🇪" },
        { name: "Bosnia", code: "BA", flag: "🇧🇦" },
        { name: "Kosovo", code: "XK", flag: "🇽🇰" },
    ];

    // Duplicate the array to create seamless scrolling
    const duplicatedCountries = [...countries, ...countries];

    return (
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-50 to-green-50 py-6 border-y border-gray-200">
            <div className="text-center mb-3">
                <h3 className="text-lg font-bold text-gray-800 mb-1">🌍 Global Marketplace</h3>
                <p className="text-sm text-gray-600">Connecting businesses worldwide</p>
            </div>
            <div className="flex animate-scroll">
                {duplicatedCountries.map((country, index) => (
                    <div
                        key={`${country.name}-${index}`}
                        className="flex items-center space-x-3 mx-6 flex-shrink-0 hover:scale-105 transition-transform duration-200"
                    >
                        <div className="relative">
                            <img
                                src={`https://flagcdn.com/24x18/${country.code.toLowerCase()}.png`}
                                alt={`${country.name} flag`}
                                className="w-6 h-4 object-cover rounded-sm shadow-sm"
                                onError={(e) => {
                                    // Fallback to emoji if image fails to load
                                    e.currentTarget.style.display = 'none';
                                    e.currentTarget.nextElementSibling.style.display = 'inline';
                                }}
                            />
                            <span
                                className="text-2xl drop-shadow-sm hidden"
                                style={{ display: 'none' }}
                            >
                                {country.flag}
                            </span>
                        </div>
                        <span className="text-sm font-semibold text-gray-800 whitespace-nowrap">
                            {country.name}
                        </span>
                    </div>
                ))}
            </div>

            {/* Gradient overlays for smooth edges */}
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-blue-50 to-transparent pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-green-50 to-transparent pointer-events-none"></div>
        </div>
    );
};

export default CountryFlagsBar;
