import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { deleteFromS3 } from "@/lib/aws-s3";

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { attachmentKeys } = await request.json();
        const { id: rfqId } = await params;

        // Verify the RFQ belongs to the user
        const rfq = await prisma.rfq.findFirst({
            where: {
                id: rfqId,
                buyerId: session.user.id
            }
        });

        if (!rfq) {
            return NextResponse.json({ error: "RFQ not found" }, { status: 404 });
        }

        // Update RFQ with attachment keys
        const updatedRfq = await prisma.rfq.update({
            where: { id: rfqId },
            data: {
                attachments: attachmentKeys
            }
        });

        return NextResponse.json({
            success: true,
            rfq: updatedRfq
        });
    } catch (error) {
        console.error("Error adding RFQ attachments:", error);
        return NextResponse.json(
            { error: "Failed to add attachments" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { attachmentKey } = await request.json();
        const { id: rfqId } = await params;

        // Verify the RFQ belongs to the user
        const rfq = await prisma.rfq.findFirst({
            where: {
                id: rfqId,
                buyerId: session.user.id
            }
        });

        if (!rfq) {
            return NextResponse.json({ error: "RFQ not found" }, { status: 404 });
        }

        // Remove attachment key from RFQ attachments array
        const updatedAttachments = rfq.attachments.filter((att: string) => att !== attachmentKey);

        const updatedRfq = await prisma.rfq.update({
            where: { id: rfqId },
            data: {
                attachments: updatedAttachments
            }
        });

        // Delete file from S3
        try {
            await deleteFromS3(attachmentKey);
        } catch (s3Error) {
            console.error("Error deleting file from S3:", s3Error);
            // Continue even if S3 deletion fails
        }

        return NextResponse.json({
            success: true,
            rfq: updatedRfq
        });
    } catch (error) {
        console.error("Error removing RFQ attachment:", error);
        return NextResponse.json(
            { error: "Failed to remove attachment" },
            { status: 500 }
        );
    }
}
