"use client";

import React, { useState, useEffect } from 'react';
import { CheckCircle, X, AlertCircle, Info, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ToastProps {
    id?: string;
    title?: string;
    message: string;
    type?: 'success' | 'error' | 'warning' | 'info';
    duration?: number;
    onClose?: () => void;
}

interface ToastState extends ToastProps {
    id: string;
    isVisible: boolean;
}

const Toast: React.FC<ToastProps> = ({
    id = Math.random().toString(36).substr(2, 9),
    title,
    message,
    type = 'success',
    duration = 4000,
    onClose
}) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        if (duration > 0) {
            const timer = setTimeout(() => {
                handleClose();
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [duration]);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => {
            onClose?.();
        }, 300);
    };

    const getIcon = () => {
        switch (type) {
            case 'success':
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'error':
                return <XCircle className="w-5 h-5 text-red-500" />;
            case 'warning':
                return <AlertCircle className="w-5 h-5 text-yellow-500" />;
            case 'info':
                return <Info className="w-5 h-5 text-blue-500" />;
            default:
                return <CheckCircle className="w-5 h-5 text-green-500" />;
        }
    };

    const getBgColor = () => {
        switch (type) {
            case 'success':
                return 'bg-green-50 border-green-200';
            case 'error':
                return 'bg-red-50 border-red-200';
            case 'warning':
                return 'bg-yellow-50 border-yellow-200';
            case 'info':
                return 'bg-blue-50 border-blue-200';
            default:
                return 'bg-green-50 border-green-200';
        }
    };

    if (!isVisible) return null;

    return (
        <div
            className={cn(
                "fixed top-4 right-4 z-50 max-w-sm w-full bg-white border rounded-lg shadow-lg transition-all duration-300 ease-in-out transform",
                getBgColor(),
                isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
            )}
            role="alert"
            aria-live="polite"
        >
            <div className="p-4">
                <div className="flex items-start">
                    <div className="flex-shrink-0">
                        {getIcon()}
                    </div>
                    <div className="ml-3 w-0 flex-1">
                        {title && (
                            <p className="text-sm font-medium text-gray-900 mb-1">
                                {title}
                            </p>
                        )}
                        <p className="text-sm text-gray-700">
                            {message}
                        </p>
                    </div>
                    <div className="ml-4 flex-shrink-0 flex">
                        <button
                            className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            onClick={handleClose}
                            aria-label="Close notification"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Toast Manager Hook
export const useToast = () => {
    const [toasts, setToasts] = useState<ToastState[]>([]);

    const addToast = (toast: Omit<ToastProps, 'id'>) => {
        const id = Math.random().toString(36).substr(2, 9);
        const newToast: ToastState = {
            ...toast,
            id,
            isVisible: true,
        };

        setToasts(prev => [...prev, newToast]);
    };

    const removeToast = (id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    const success = (message: string, title?: string) => {
        addToast({ type: 'success', message, title });
    };

    const error = (message: string, title?: string) => {
        addToast({ type: 'error', message, title });
    };

    const warning = (message: string, title?: string) => {
        addToast({ type: 'warning', message, title });
    };

    const info = (message: string, title?: string) => {
        addToast({ type: 'info', message, title });
    };

    return {
        toasts,
        addToast,
        removeToast,
        success,
        error,
        warning,
        info,
    };
};

// Toast Container Component
export const ToastContainer: React.FC<{ toasts: ToastState[]; onRemove: (id: string) => void }> = ({
    toasts,
    onRemove
}) => {
    return (
        <div className="fixed top-4 right-4 z-50 space-y-2">
            {toasts.map(toast => (
                <Toast
                    key={toast.id}
                    {...toast}
                    onClose={() => onRemove(toast.id)}
                />
            ))}
        </div>
    );
};

export default Toast;
