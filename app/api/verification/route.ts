import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notificationService } from "@/lib/notifications";

// Verification Service for TradeMart
class VerificationService {
    // GST Validation using GST API
    async validateGST(gstNumber: string) {
        try {
            // GST number format validation
            if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/.test(gstNumber)) {
                return { success: false, error: 'Invalid GST number format' };
            }

            // Extract PAN from GST
            const pan = gstNumber.substring(2, 12);

            // Mock GST API call (replace with actual GST API)
            const gstData = await this.callGSTAPI(gstNumber);

            if (gstData.success) {
                return {
                    success: true,
                    data: {
                        gstNumber,
                        pan,
                        businessName: gstData.data.businessName,
                        address: gstData.data.address,
                        status: gstData.data.status,
                        registrationDate: gstData.data.registrationDate,
                        lastUpdated: gstData.data.lastUpdated
                    }
                };
            } else {
                return { success: false, error: 'GST number not found or invalid' };
            }
        } catch (error) {
            console.error('GST validation error:', error);
            return { success: false, error: 'Failed to validate GST number' };
        }
    }

    // Trade License Validation
    async validateTradeLicense(licenseNumber: string, state: string) {
        try {
            // Mock trade license validation (replace with actual API)
            const licenseData = await this.callTradeLicenseAPI(licenseNumber, state);

            if (licenseData.success) {
                return {
                    success: true,
                    data: {
                        licenseNumber,
                        businessName: licenseData.data.businessName,
                        businessType: licenseData.data.businessType,
                        address: licenseData.data.address,
                        validFrom: licenseData.data.validFrom,
                        validTo: licenseData.data.validTo,
                        status: licenseData.data.status
                    }
                };
            } else {
                return { success: false, error: 'Trade license not found or invalid' };
            }
        } catch (error) {
            console.error('Trade license validation error:', error);
            return { success: false, error: 'Failed to validate trade license' };
        }
    }

    // Factory Verification
    async scheduleFactoryVerification(supplierId: string, verificationData: any) {
        try {
            const supplier = await prisma.supplier.findUnique({
                where: { id: supplierId },
                include: { user: true }
            });

            if (!supplier) {
                return { success: false, error: 'Supplier not found' };
            }

            // Create factory verification record
            const verification = await prisma.factoryVerification.create({
                data: {
                    supplierId,
                    inspectorId: verificationData.inspectorId,
                    scheduledDate: new Date(verificationData.scheduledDate),
                    address: verificationData.address,
                    contactPerson: verificationData.contactPerson,
                    contactPhone: verificationData.contactPhone,
                    verificationType: verificationData.type, // 'basic', 'comprehensive', 'audit'
                    status: 'scheduled',
                    notes: verificationData.notes
                }
            });

            // Send notification to supplier
            await notificationService.sendToUser(
                supplier.userId,
                {
                    type: 'factory_verification_scheduled',
                    title: 'Factory Verification Scheduled',
                    message: `Factory verification has been scheduled for ${verificationData.scheduledDate}`,
                    read: false,
                }
            );

            // WhatsApp notification removed - integration simplified

            return {
                success: true,
                data: verification
            };
        } catch (error) {
            console.error('Factory verification scheduling error:', error);
            return { success: false, error: 'Failed to schedule factory verification' };
        }
    }

    // Complete Factory Verification
    async completeFactoryVerification(verificationId: string, verificationResults: any) {
        try {
            const verification = await prisma.factoryVerification.findUnique({
                where: { id: verificationId },
                include: {
                    supplier: {
                        include: { user: true }
                    }
                }
            });

            if (!verification) {
                return { success: false, error: 'Verification not found' };
            }

            // Update verification record
            const updatedVerification = await prisma.factoryVerification.update({
                where: { id: verificationId },
                data: {
                    status: verificationResults.passed ? 'passed' : 'failed',
                    completedAt: new Date(),
                    inspectorNotes: verificationResults.notes,
                    photos: verificationResults.photos || [],
                    documents: verificationResults.documents || [],
                    score: verificationResults.score,
                    recommendations: verificationResults.recommendations
                }
            });

            // Update supplier verification tier
            if (verificationResults.passed) {
                await prisma.supplier.update({
                    where: { id: verification.supplierId },
                    data: {
                        verified: true,
                        verificationTier: verificationResults.tier || 'verified',
                        lastVerifiedAt: new Date()
                    }
                });

                // Send success notification
                await notificationService.sendToUser(
                    verification.supplier.userId,
                    {
                        type: 'factory_verification_passed',
                        title: 'Factory Verification Passed!',
                        message: `Congratulations! Your factory verification has been completed successfully.`,
                        read: false,
                    }
                );
            } else {
                // Send failure notification
                await notificationService.sendToUser(
                    verification.supplier.userId,
                    {
                        type: 'factory_verification_failed',
                        title: 'Factory Verification Failed',
                        message: `Factory verification failed. Please review the recommendations and reschedule.`,
                        read: false,
                    }
                );
            }

            return {
                success: true,
                data: updatedVerification
            };
        } catch (error) {
            console.error('Factory verification completion error:', error);
            return { success: false, error: 'Failed to complete factory verification' };
        }
    }

    // Get Verification Status
    async getVerificationStatus(supplierId: string) {
        try {
            const supplier = await prisma.supplier.findUnique({
                where: { id: supplierId },
                include: {
                    factoryVerifications: {
                        orderBy: { createdAt: 'desc' }
                    }
                }
            });

            if (!supplier) {
                return { success: false, error: 'Supplier not found' };
            }

            const verificationStatus = {
                gstVerified: !!supplier.gstNumber,
                tradeLicenseVerified: !!supplier.tradeLicenseNumber,
                factoryVerified: supplier.verified,
                verificationTier: supplier.verificationTier || 'unverified',
                lastVerifiedAt: supplier.lastVerifiedAt,
                totalVerifications: supplier.factoryVerifications.length,
                recentVerifications: supplier.factoryVerifications.slice(0, 5)
            };

            return {
                success: true,
                data: verificationStatus
            };
        } catch (error) {
            console.error('Verification status error:', error);
            return { success: false, error: 'Failed to get verification status' };
        }
    }

    // Mock GST API call
    private async callGSTAPI(gstNumber: string) {
        // In production, replace with actual GST API
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    data: {
                        businessName: 'Sample Business Name',
                        address: 'Sample Address, City, State',
                        status: 'Active',
                        registrationDate: '2020-01-01',
                        lastUpdated: '2024-01-01'
                    }
                });
            }, 1000);
        });
    }

    // Mock Trade License API call
    private async callTradeLicenseAPI(licenseNumber: string, state: string) {
        // In production, replace with actual trade license API
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    data: {
                        businessName: 'Sample Business Name',
                        businessType: 'Manufacturing',
                        address: 'Sample Address, City, State',
                        validFrom: '2020-01-01',
                        validTo: '2025-12-31',
                        status: 'Active'
                    }
                });
            }, 1000);
        });
    }
}

export const verificationService = new VerificationService();

// API Routes for Verification
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const { action, ...data } = await request.json();

        switch (action) {
            case 'validate_gst':
                if (!data.gstNumber) {
                    return NextResponse.json({ success: false, error: 'GST number is required' }, { status: 400 });
                }
                return NextResponse.json(await verificationService.validateGST(data.gstNumber));

            case 'validate_trade_license':
                if (!data.licenseNumber || !data.state) {
                    return NextResponse.json({ success: false, error: 'License number and state are required' }, { status: 400 });
                }
                return NextResponse.json(await verificationService.validateTradeLicense(data.licenseNumber, data.state));

            case 'schedule_factory_verification':
                if (!data.supplierId || !data.scheduledDate) {
                    return NextResponse.json({ success: false, error: 'Supplier ID and scheduled date are required' }, { status: 400 });
                }
                return NextResponse.json(await verificationService.scheduleFactoryVerification(data.supplierId, data));

            case 'complete_factory_verification':
                if (!data.verificationId || !data.verificationResults) {
                    return NextResponse.json({ success: false, error: 'Verification ID and results are required' }, { status: 400 });
                }
                return NextResponse.json(await verificationService.completeFactoryVerification(data.verificationId, data.verificationResults));

            default:
                return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
        }
    } catch (error) {
        console.error('Verification API error:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const supplierId = searchParams.get('supplierId');

        if (!supplierId) {
            return NextResponse.json({ success: false, error: 'Supplier ID is required' }, { status: 400 });
        }

        return NextResponse.json(await verificationService.getVerificationStatus(supplierId));
    } catch (error) {
        console.error('Verification GET API error:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}
