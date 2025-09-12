"use client";

import { useEffect } from "react";

interface PageTitleProps {
    title: string;
    description?: string;
}

export default function PageTitle({ title, description }: PageTitleProps) {
    useEffect(() => {
        const originalTitle = document.title;
        document.title = title;

        // Update meta description if provided
        if (description) {
            const metaDescription = document.querySelector('meta[name="description"]');
            if (metaDescription) {
                metaDescription.setAttribute('content', description);
            }
        }

        // Cleanup function to restore original title
        return () => {
            document.title = originalTitle;
        };
    }, [title, description]);

    return null; // This component doesn't render anything
}
