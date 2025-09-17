"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import SearchPopup from "@/components/ui/search-popup";

export default function SearchSection() {
    const [searchTerm, setSearchTerm] = useState("");
    const [isSearchPopupOpen, setIsSearchPopupOpen] = useState(false);

    const handleSearch = () => {
        if (searchTerm.trim()) {
            setIsSearchPopupOpen(true);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    return (
        <>
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search products, suppliers, or categories..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none shadow-lg"
                    />
                    <Button
                        onClick={handleSearch}
                        className="absolute right-2 top-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-6 py-2"
                    >
                        Search
                    </Button>
                </div>
            </div>

            {/* Search Popup */}
            <SearchPopup
                isOpen={isSearchPopupOpen}
                onClose={() => setIsSearchPopupOpen(false)}
                searchTerm={searchTerm}
            />
        </>
    );
}
