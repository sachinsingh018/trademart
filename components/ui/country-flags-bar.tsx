"use client";

import React from "react";
import Image from "next/image";

const CountryFlagsBar = () => {
    // MENA and BRICS countries with their allies - More BRICS prominence
    const countries = [
        // BRICS Core Members (Multiple occurrences)
        { name: "Brazil", code: "BR", flag: "🇧🇷" },
        { name: "Russia", code: "RU", flag: "🇷🇺" },
        { name: "India", code: "IN", flag: "🇮🇳" },
        { name: "China", code: "CN", flag: "🇨🇳" },
        { name: "South Africa", code: "ZA", flag: "🇿🇦" },

        // Repeat BRICS Core Members for prominence
        { name: "Brazil", code: "BR", flag: "🇧🇷" },
        { name: "Russia", code: "RU", flag: "🇷🇺" },
        { name: "India", code: "IN", flag: "🇮🇳" },
        { name: "China", code: "CN", flag: "🇨🇳" },
        { name: "South Africa", code: "ZA", flag: "🇿🇦" },

        // New BRICS Members (2024-2025) - Multiple occurrences
        { name: "Egypt", code: "EG", flag: "🇪🇬" },
        { name: "Ethiopia", code: "ET", flag: "🇪🇹" },
        { name: "Iran", code: "IR", flag: "🇮🇷" },
        { name: "Indonesia", code: "ID", flag: "🇮🇩" },
        { name: "UAE", code: "AE", flag: "🇦🇪" },

        // Repeat New BRICS Members for prominence
        { name: "Egypt", code: "EG", flag: "🇪🇬" },
        { name: "Iran", code: "IR", flag: "🇮🇷" },
        { name: "Indonesia", code: "ID", flag: "🇮🇩" },
        { name: "UAE", code: "AE", flag: "🇦🇪" },

        // BRICS Partner Countries - Multiple occurrences
        { name: "Vietnam", code: "VN", flag: "🇻🇳" },
        { name: "Belarus", code: "BY", flag: "🇧🇾" },
        { name: "Bolivia", code: "BO", flag: "🇧🇴" },
        { name: "Kazakhstan", code: "KZ", flag: "🇰🇿" },
        { name: "Nigeria", code: "NG", flag: "🇳🇬" },

        // Repeat BRICS Partners for prominence
        { name: "Vietnam", code: "VN", flag: "🇻🇳" },
        { name: "Belarus", code: "BY", flag: "🇧🇾" },
        { name: "Nigeria", code: "NG", flag: "🇳🇬" },

        // MENA Countries
        { name: "Algeria", code: "DZ", flag: "🇩🇿" },
        { name: "Bahrain", code: "BH", flag: "🇧🇭" },
        { name: "Iraq", code: "IQ", flag: "🇮🇶" },
        { name: "Israel", code: "IL", flag: "🇮🇱" },
        { name: "Jordan", code: "JO", flag: "🇯🇴" },
        { name: "Kuwait", code: "KW", flag: "🇰🇼" },
        { name: "Lebanon", code: "LB", flag: "🇱🇧" },
        { name: "Libya", code: "LY", flag: "🇱🇾" },
        { name: "Morocco", code: "MA", flag: "🇲🇦" },
        { name: "Oman", code: "OM", flag: "🇴🇲" },
        { name: "Palestine", code: "PS", flag: "🇵🇸" },
        { name: "Qatar", code: "QA", flag: "🇶🇦" },
        { name: "Saudi Arabia", code: "SA", flag: "🇸🇦" },
        { name: "Syria", code: "SY", flag: "🇸🇾" },
        { name: "Tunisia", code: "TN", flag: "🇹🇳" },
        { name: "Turkey", code: "TR", flag: "🇹🇷" },
        { name: "Yemen", code: "YE", flag: "🇾🇪" },

        // Additional BRICS prominence - Strategic repeats
        { name: "China", code: "CN", flag: "🇨🇳" },
        { name: "India", code: "IN", flag: "🇮🇳" },
        { name: "Russia", code: "RU", flag: "🇷🇺" },
        { name: "Brazil", code: "BR", flag: "🇧🇷" },

        // Key Allies and Strategic Partners
        { name: "Pakistan", code: "PK", flag: "🇵🇰" },
        { name: "Bangladesh", code: "BD", flag: "🇧🇩" },
        { name: "Sri Lanka", code: "LK", flag: "🇱🇰" },
        { name: "Myanmar", code: "MM", flag: "🇲🇲" },
        { name: "Cambodia", code: "KH", flag: "🇰🇭" },
        { name: "Laos", code: "LA", flag: "🇱🇦" },
        { name: "Thailand", code: "TH", flag: "🇹🇭" },
        { name: "Malaysia", code: "MY", flag: "🇲🇾" },
        { name: "Singapore", code: "SG", flag: "🇸🇬" },
        { name: "Philippines", code: "PH", flag: "🇵🇭" },
        { name: "Kenya", code: "KE", flag: "🇰🇪" },
        { name: "Tanzania", code: "TZ", flag: "🇹🇿" },
        { name: "Uganda", code: "UG", flag: "🇺🇬" },
        { name: "Ghana", code: "GH", flag: "🇬🇭" },
        { name: "Senegal", code: "SN", flag: "🇸🇳" },
        { name: "Mali", code: "ML", flag: "🇲🇱" },
        { name: "Niger", code: "NE", flag: "🇳🇪" },
        { name: "Burkina Faso", code: "BF", flag: "🇧🇫" },
        { name: "Côte d'Ivoire", code: "CI", flag: "🇨🇮" },
        { name: "Cameroon", code: "CM", flag: "🇨🇲" },
        { name: "Democratic Republic of Congo", code: "CD", flag: "🇨🇩" },
        { name: "Angola", code: "AO", flag: "🇦🇴" },
        { name: "Mozambique", code: "MZ", flag: "🇲🇿" },
        { name: "Zimbabwe", code: "ZW", flag: "🇿🇼" },
        { name: "Zambia", code: "ZM", flag: "🇿🇲" },
        { name: "Botswana", code: "BW", flag: "🇧🇼" },
        { name: "Namibia", code: "NA", flag: "🇳🇦" },
        { name: "Madagascar", code: "MG", flag: "🇲🇬" },
        { name: "Mauritius", code: "MU", flag: "🇲🇺" },
        { name: "Seychelles", code: "SC", flag: "🇸🇨" },
        { name: "Comoros", code: "KM", flag: "🇰🇲" },
        { name: "Djibouti", code: "DJ", flag: "🇩🇯" },
        { name: "Eritrea", code: "ER", flag: "🇪🇷" },
        { name: "Somalia", code: "SO", flag: "🇸🇴" },
        { name: "Sudan", code: "SD", flag: "🇸🇩" },
        { name: "South Sudan", code: "SS", flag: "🇸🇸" },
        { name: "Central African Republic", code: "CF", flag: "🇨🇫" },
        { name: "Chad", code: "TD", flag: "🇹🇩" },
        { name: "Rwanda", code: "RW", flag: "🇷🇼" },
        { name: "Burundi", code: "BI", flag: "🇧🇮" },
        { name: "Malawi", code: "MW", flag: "🇲🇼" },
        { name: "Lesotho", code: "LS", flag: "🇱🇸" },
        { name: "Eswatini", code: "SZ", flag: "🇸🇿" },

        // Final BRICS prominence - End of list
        { name: "South Africa", code: "ZA", flag: "🇿🇦" },
        { name: "China", code: "CN", flag: "🇨🇳" },
        { name: "India", code: "IN", flag: "🇮🇳" },
        { name: "Russia", code: "RU", flag: "🇷🇺" },
        { name: "Brazil", code: "BR", flag: "🇧🇷" },
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
                            <Image
                                src={`https://flagcdn.com/24x18/${country.code.toLowerCase()}.png`}
                                alt={`${country.name} flag`}
                                width={24}
                                height={18}
                                className="w-6 h-4 object-cover rounded-sm shadow-sm"
                                onError={(e) => {
                                    // Fallback to emoji if image fails to load
                                    e.currentTarget.style.display = 'none';
                                    const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                                    if (nextElement) {
                                        nextElement.style.display = 'inline';
                                    }
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
