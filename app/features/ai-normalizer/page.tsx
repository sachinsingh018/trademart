"use client";

import AISpecNormalizer from "@/components/ai-spec-normalizer";

export default function AINormalizerPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Spec Normalizer</h1>
                    <p className="text-gray-600">Convert rough RFQs into structured specifications with AI</p>
                </div>
                <AISpecNormalizer />
            </div>
        </div>
    );
}
