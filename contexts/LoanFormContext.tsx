'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface LoanFormData {
    fullName: string;
    email: string;
    phone: string;
    company: string;
    businessType: string;
    loanAmount: string;
    currency: string;
    loanPurpose: string;
    monthlyRevenue: string;
    businessAge: string;
    country: string;
    city: string;
    additionalInfo: string;
}

interface LoanFormContextType {
    formData: LoanFormData;
    updateFormData: (data: Partial<LoanFormData>) => void;
    clearFormData: () => void;
    hasFormData: boolean;
    saveFormDataToStorage: () => void;
    loadFormDataFromStorage: () => void;
}

const defaultFormData: LoanFormData = {
    fullName: '',
    email: '',
    phone: '',
    company: '',
    businessType: '',
    loanAmount: '',
    currency: 'INR',
    loanPurpose: '',
    monthlyRevenue: '',
    businessAge: '',
    country: '',
    city: '',
    additionalInfo: ''
};

const LoanFormContext = createContext<LoanFormContextType | undefined>(undefined);

export function LoanFormProvider({ children }: { children: ReactNode }) {
    const [formData, setFormData] = useState<LoanFormData>(defaultFormData);

    const updateFormData = (data: Partial<LoanFormData>) => {
        setFormData(prev => ({ ...prev, ...data }));
    };

    const clearFormData = () => {
        setFormData(defaultFormData);
        localStorage.removeItem('loanFormData');
        sessionStorage.removeItem('loanFormData');
    };

    const hasFormData = () => {
        return Object.values(formData).some(value => value !== '' && value !== 'USD');
    };

    const saveFormDataToStorage = () => {
        localStorage.setItem('loanFormData', JSON.stringify(formData));
        sessionStorage.setItem('loanFormData', JSON.stringify(formData));
    };

    const loadFormDataFromStorage = () => {
        try {
            const stored = localStorage.getItem('loanFormData') || sessionStorage.getItem('loanFormData');
            if (stored) {
                const parsedData = JSON.parse(stored);
                setFormData(parsedData);
                return true;
            }
        } catch (error) {
            console.error('Error loading form data from storage:', error);
        }
        return false;
    };

    // Load form data on mount only once
    useEffect(() => {
        const stored = localStorage.getItem('loanFormData') || sessionStorage.getItem('loanFormData');
        if (stored) {
            try {
                const parsedData = JSON.parse(stored);
                setFormData(parsedData);
            } catch (error) {
                console.error('Error loading form data from storage:', error);
            }
        }
    }, []); // Empty dependency array - only run once on mount

    // Save form data whenever it changes (but not on initial load)
    useEffect(() => {
        // Only save if we have actual data (not just the default empty state)
        const hasActualData = Object.entries(formData).some(([key, value]) =>
            key !== 'currency' && value !== '' && value !== 'INR'
        );

        if (hasActualData) {
            localStorage.setItem('loanFormData', JSON.stringify(formData));
            sessionStorage.setItem('loanFormData', JSON.stringify(formData));
        }
    }, [formData]);

    return (
        <LoanFormContext.Provider value={{
            formData,
            updateFormData,
            clearFormData,
            hasFormData: hasFormData(),
            saveFormDataToStorage,
            loadFormDataFromStorage
        }}>
            {children}
        </LoanFormContext.Provider>
    );
}

export function useLoanForm() {
    const context = useContext(LoanFormContext);
    if (context === undefined) {
        throw new Error('useLoanForm must be used within a LoanFormProvider');
    }
    return context;
}
