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
        const requiredFields = ["companyName", "industry", "country", "city"];
        for (const field of requiredFields) {
            if (!data[field]) {
                return NextResponse.json(
                    { error: `Missing required field: ${field}` },
                    { status: 400 }
                );
            }
        }

        // Process specialties and certifications arrays
        const specialties = data.specialties ?
            data.specialties.split(",").map((s: string) => s.trim()).filter(Boolean) : [];
        const certifications = data.certifications ?
            data.certifications.split(",").map((c: string) => c.trim()).filter(Boolean) : [];

        // Prepare business info
        const businessInfo = {
            annualRevenue: data.annualRevenue || null,
            exportMarkets: data.exportMarkets || [],
            mainProducts: data.mainProducts || [],
        };

        // Upsert supplier data
        const supplier = await prisma.supplier.upsert({
            where: { userId: session.user.id },
            update: {
                companyName: data.companyName,
                industry: data.industry,
                businessType: data.businessType,
                website: data.website,
                description: data.description,
                country: data.country,
                city: data.city,
                address: data.address,
                postalCode: data.postalCode,
                phone: data.phone,
                responseTime: data.responseTime,
                minOrderValue: data.minOrderValue ? parseFloat(data.minOrderValue) : null,
                currency: data.currency || "USD",
                establishedYear: data.establishedYear ? parseInt(data.establishedYear) : null,
                employees: data.employees,
                specialties,
                certifications,
                contactEmail: data.contactEmail,
                contactPhone: data.contactPhone,
                businessInfo,
                lastActive: new Date(),
                updatedAt: new Date(),
            },
            create: {
                userId: session.user.id,
                companyName: data.companyName,
                industry: data.industry,
                businessType: data.businessType,
                website: data.website,
                description: data.description,
                country: data.country,
                city: data.city,
                address: data.address,
                postalCode: data.postalCode,
                phone: data.phone,
                responseTime: data.responseTime,
                minOrderValue: data.minOrderValue ? parseFloat(data.minOrderValue) : null,
                currency: data.currency || "USD",
                establishedYear: data.establishedYear ? parseInt(data.establishedYear) : null,
                employees: data.employees,
                specialties,
                certifications,
                contactEmail: data.contactEmail,
                contactPhone: data.contactPhone,
                businessInfo,
                lastActive: new Date(),
            },
        });

        return NextResponse.json({
            success: true,
            message: "Supplier profile updated successfully",
            data: supplier,
        });
    } catch (error) {
        console.error("Supplier upsert error:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Failed to update supplier profile",
                details: error instanceof Error ? error.message : "Unknown error"
            },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}
