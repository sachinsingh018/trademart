import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";


export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (session.user.role !== "supplier") {
            return NextResponse.json({ error: "Access denied. Supplier role required." }, { status: 403 });
        }

        const data = await request.json();

        // Validate required fields
        const requiredFields = ["name", "description", "category", "price", "minOrderQuantity", "unit"];
        for (const field of requiredFields) {
            if (!data[field]) {
                return NextResponse.json(
                    { error: `Missing required field: ${field}` },
                    { status: 400 }
                );
            }
        }

        // Get supplier ID
        const supplier = await prisma.supplier.findUnique({
            where: { userId: session.user.id },
        });

        if (!supplier) {
            return NextResponse.json(
                { error: "Supplier profile not found. Please complete your supplier profile first." },
                { status: 404 }
            );
        }

        // Process arrays
        const features = data.features ?
            data.features.split(",").map((f: string) => f.trim()).filter(Boolean) : [];
        const tags = data.tags ?
            data.tags.split(",").map((t: string) => t.trim()).filter(Boolean) : [];
        const images = data.images ?
            data.images.split(",").map((i: string) => i.trim()).filter(Boolean) : [];

        // Parse specifications JSON
        let specifications = null;
        if (data.specifications) {
            try {
                specifications = JSON.parse(data.specifications);
            } catch {
                return NextResponse.json(
                    { error: "Invalid specifications JSON format" },
                    { status: 400 }
                );
            }
        }

        // Create product
        const product = await prisma.product.create({
            data: {
                supplierId: supplier.id,
                name: data.name,
                description: data.description,
                category: data.category,
                subcategory: data.subcategory,
                price: parseFloat(data.price),
                currency: data.currency || "USD",
                minOrderQuantity: parseInt(data.minOrderQuantity),
                unit: data.unit,
                specifications,
                features,
                tags,
                images,
                inStock: data.inStock !== false, // Default to true
                stockQuantity: data.stockQuantity ? parseInt(data.stockQuantity) : null,
                leadTime: data.leadTime,
            },
        });

        return NextResponse.json({
            success: true,
            message: "Product created successfully",
            data: product,
        });
    } catch (error) {
        console.error("Product creation error:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Failed to create product",
                details: error instanceof Error ? error.message : "Unknown error"
            },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}
