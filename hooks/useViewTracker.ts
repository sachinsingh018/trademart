'use client';

import { useEffect } from 'react';

interface UseViewTrackerProps {
    type: 'product' | 'service' | 'supplier' | 'rfq';
    id: string;
}

export function useViewTracker({ type, id }: UseViewTrackerProps) {
    useEffect(() => {
        if (!id) return;

        const trackView = async () => {
            try {
                await fetch('/api/views/track', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ type, id })
                });
            } catch (error) {
                console.error('Failed to track view:', error);
            }
        };

        // Track view after a short delay to ensure page is fully loaded
        const timer = setTimeout(trackView, 1000);

        return () => clearTimeout(timer);
    }, [type, id]);
}
