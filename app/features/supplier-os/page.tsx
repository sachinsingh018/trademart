import SupplierOS from "@/components/supplier-os";

export default function SupplierOSPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Supplier OS</h1>
                    <p className="text-gray-600">Comprehensive business management dashboard for suppliers</p>
                </div>
                <SupplierOS />
            </div>
        </div>
    );
}
