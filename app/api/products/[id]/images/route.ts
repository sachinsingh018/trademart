import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { deleteFileFromS3 } from "@/lib/aws-s3";

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { imageKeys } = await request.json();
        const productId = params.id;

        // Verify the product belongs to the user
        const product = await prisma.product.findFirst({
            where: {
                id: productId,
                supplier: {
                    userId: session.user.id
                }
            }
        });

        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        // Update product with image keys
        const updatedProduct = await prisma.product.update({
            where: { id: productId },
            data: {
                images: imageKeys
            }
        });

        return NextResponse.json({
            success: true,
            product: updatedProduct
        });
    } catch (error) {
        console.error("Error adding product images:", error);
        return NextResponse.json(
            { error: "Failed to add images" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { imageKey } = await request.json();
        const productId = params.id;

        // Verify the product belongs to the user
        const product = await prisma.product.findFirst({
            where: {
                id: productId,
                supplier: {
                    userId: session.user.id
                }
            }
        });

        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        // Remove image key from product images array
        const updatedImages = product.images.filter((img: string) => img !== imageKey);

        const updatedProduct = await prisma.product.update({
            where: { id: productId },
            data: {
                images: updatedImages
            }
        });

        // Delete file from S3
        try {
            await deleteFileFromS3(imageKey);
        } catch (s3Error) {
            console.error("Error deleting file from S3:", s3Error);
            // Continue even if S3 deletion fails
        }

        return NextResponse.json({
            success: true,
            product: updatedProduct
        });
    } catch (error) {
        console.error("Error removing product image:", error);
        return NextResponse.json(
            { error: "Failed to remove image" },
            { status: 500 }
        );
    }
}
