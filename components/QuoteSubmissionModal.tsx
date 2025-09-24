"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, DollarSign, Clock, FileText } from "lucide-react";

interface QuoteSubmissionModalProps {
    isOpen: boolean;
    onClose: () => void;
    rfqId: string;
    rfqTitle: string;
    rfqBudget?: number;
    rfqCurrency?: string;
}

export default function QuoteSubmissionModal({
    isOpen,
    onClose,
    rfqId,
    rfqTitle,
    rfqBudget,
    rfqCurrency = "USD"
}: QuoteSubmissionModalProps) {
    const [formData, setFormData] = useState({
        price: "",
        leadTimeDays: "",
        notes: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");
        setSuccess("");

        try {
            const response = await fetch("/api/quotes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    rfqId,
                    price: parseFloat(formData.price),
                    leadTimeDays: parseInt(formData.leadTimeDays),
                    notes: formData.notes
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess("Quote submitted successfully!");
                setFormData({ price: "", leadTimeDays: "", notes: "" });
                setTimeout(() => {
                    onClose();
                    setSuccess("");
                }, 2000);
            } else {
                setError(data.error || "Failed to submit quote");
            }
        } catch (err) {
            setError("Network error. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle className="text-2xl font-bold text-gray-900">
                        Submit Quote
                    </CardTitle>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                        className="h-8 w-8 p-0"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </CardHeader>

                <CardContent className="space-y-6">
                    {/* RFQ Info */}
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <h3 className="font-semibold text-blue-900 mb-2">RFQ Details</h3>
                        <p className="text-blue-800">{rfqTitle}</p>
                        {rfqBudget && (
                            <p className="text-blue-700 text-sm mt-1">
                                Budget: {rfqCurrency} {rfqBudget.toLocaleString()}
                            </p>
                        )}
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Price */}
                        <div className="space-y-2">
                            <Label htmlFor="price" className="flex items-center gap-2">
                                <DollarSign className="h-4 w-4" />
                                Quote Price ({rfqCurrency})
                            </Label>
                            <Input
                                id="price"
                                name="price"
                                type="number"
                                step="0.01"
                                min="0"
                                value={formData.price}
                                onChange={handleInputChange}
                                placeholder="Enter your quote price"
                                required
                                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            />
                            {rfqBudget && (
                                <p className="text-sm text-gray-500">
                                    Buyer's budget: {rfqCurrency} {rfqBudget.toLocaleString()}
                                </p>
                            )}
                        </div>

                        {/* Lead Time */}
                        <div className="space-y-2">
                            <Label htmlFor="leadTimeDays" className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                Lead Time (Days)
                            </Label>
                            <Input
                                id="leadTimeDays"
                                name="leadTimeDays"
                                type="number"
                                min="1"
                                value={formData.leadTimeDays}
                                onChange={handleInputChange}
                                placeholder="How many days to deliver?"
                                required
                                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>

                        {/* Notes */}
                        <div className="space-y-2">
                            <Label htmlFor="notes" className="flex items-center gap-2">
                                <FileText className="h-4 w-4" />
                                Additional Notes
                            </Label>
                            <Textarea
                                id="notes"
                                name="notes"
                                value={formData.notes}
                                onChange={handleInputChange}
                                placeholder="Add any additional details, terms, or conditions..."
                                rows={4}
                                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>

                        {/* Submit Buttons */}
                        <div className="flex gap-3 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                className="flex-1"
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                            >
                                {isSubmitting ? "Submitting..." : "Submit Quote"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
