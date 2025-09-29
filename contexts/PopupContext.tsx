"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

interface PopupContextType {
    isPopupActive: boolean;
    setIsPopupActive: (active: boolean) => void;
}

const PopupContext = createContext<PopupContextType | undefined>(undefined);

export function PopupProvider({ children }: { children: ReactNode }) {
    const [isPopupActive, setIsPopupActive] = useState(false);

    return (
        <PopupContext.Provider value={{ isPopupActive, setIsPopupActive }}>
            {children}
        </PopupContext.Provider>
    );
}

export function usePopup() {
    const context = useContext(PopupContext);
    if (context === undefined) {
        throw new Error('usePopup must be used within a PopupProvider');
    }
    return context;
}
