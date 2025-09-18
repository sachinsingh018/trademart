import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { deleteFromS3 } from "@/lib/aws-s3";

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { logoKey } = await request.json();

        // Find the supplier for this user
        const supplier = await prisma.supplier.findFirst({
            where: {
                userId: session.user.id
            }
        });

        if (!supplier) {
            return NextResponse.json({ error: "Supplier not found" }, { status: 404 });
        }

        // Delete old logo if exists
        if (supplier.companyLogo) {
            try {
                await deleteFromS3(supplier.companyLogo);
            } catch (s3Error) {
                console.error("Error deleting old logo from S3:", s3Error);
                // Continue even if S3 deletion fails
            }
        }

        // Update supplier with new logo
        const updatedSupplier = await prisma.supplier.update({
            where: { id: supplier.id },
            data: {
                companyLogo: logoKey
            }
        });

        return NextResponse.json({
            success: true,
            supplier: updatedSupplier
        });
    } catch (error) {
        console.error("Error updating supplier logo:", error);
        return NextResponse.json(
            { error: "Failed to update logo" },
            { status: 500 }
        );
    }
}

export async function DELETE(_request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Find the supplier for this user
        const supplier = await prisma.supplier.findFirst({
            where: {
                userId: session.user.id
            }
        });

        if (!supplier) {
            return NextResponse.json({ error: "Supplier not found" }, { status: 404 });
        }

        // Delete logo from S3 if exists
        if (supplier.companyLogo) {
            try {
                await deleteFromS3(supplier.companyLogo);
            } catch (s3Error) {
                console.error("Error deleting logo from S3:", s3Error);
                // Continue even if S3 deletion fails
            }
        }

        // Remove logo from supplier
        const updatedSupplier = await prisma.supplier.update({
            where: { id: supplier.id },
            data: {
                companyLogo: null
            }
        });

        return NextResponse.json({
            success: true,
            supplier: updatedSupplier
        });
    } catch (error) {
        console.error("Error removing supplier logo:", error);
        return NextResponse.json(
            { error: "Failed to remove logo" },
            { status: 500 }
        );
    }
}
