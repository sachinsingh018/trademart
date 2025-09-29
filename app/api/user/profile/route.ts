import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        // Fetch user data with supplier information if exists
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            include: {
                supplier: true
            }
        });

        if (!user) {
            return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
        }

        // Format the response data
        const profileData = {
            id: user.id,
            name: user.name || '',
            email: user.email,
            phone: user.phone || '',
            role: user.role,
            createdAt: user.createdAt,
            // Supplier specific data
            company: user.supplier?.companyName || '',
            industry: user.supplier?.industry || '',
            businessType: user.supplier?.businessType || '',
            website: user.supplier?.website || '',
            description: user.supplier?.description || '',
            country: user.supplier?.country || '',
            city: user.supplier?.city || '',
            address: user.supplier?.address || '',
            postalCode: user.supplier?.postalCode || '',
            contactPhone: user.supplier?.contactPhone || '',
            contactEmail: user.supplier?.contactEmail || '',
            verified: user.supplier?.verified || false,
            rating: user.supplier?.rating || 0,
            totalOrders: user.supplier?.totalOrders || 0,
            establishedYear: user.supplier?.establishedYear || null,
            employees: user.supplier?.employees || '',
            specialties: user.supplier?.specialties || [],
            certifications: user.supplier?.certifications || [],
            companyLogo: user.supplier?.companyLogo || '',
            businessInfo: user.supplier?.businessInfo || null
        };

        return NextResponse.json({
            success: true,
            data: profileData
        });

    } catch (error) {
        console.error('Error fetching user profile:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const {
            name,
            email,
            phone,
            company,
            industry,
            businessType,
            website,
            description,
            country,
            city,
            address,
            postalCode,
            contactPhone,
            contactEmail,
            establishedYear,
            employees,
            specialties,
            certifications
        } = body;

        // Start a transaction to update both User and Supplier tables
        const result = await prisma.$transaction(async (tx) => {
            // Update User table
            const updatedUser = await tx.user.update({
                where: { id: session.user.id },
                data: {
                    name: name || undefined,
                    email: email || undefined,
                    phone: phone || undefined,
                }
            });

            // Update or create Supplier record if user is a supplier
            let updatedSupplier = null;
            if (session.user.role === 'supplier') {
                const supplierData = {
                    companyName: company || 'My Company', // Default value for required field
                    industry: industry || undefined,
                    businessType: businessType || undefined,
                    website: website || undefined,
                    description: description || undefined,
                    country: country || undefined,
                    city: city || undefined,
                    address: address || undefined,
                    postalCode: postalCode || undefined,
                    contactPhone: contactPhone || undefined,
                    contactEmail: contactEmail || undefined,
                    establishedYear: establishedYear ? parseInt(establishedYear) : undefined,
                    employees: employees || undefined,
                    specialties: specialties || undefined,
                    certifications: certifications || undefined,
                };

                // Remove undefined values for update, but keep all values for create
                const cleanSupplierData = Object.fromEntries(
                    Object.entries(supplierData).filter(([, value]) => value !== undefined)
                );

                updatedSupplier = await tx.supplier.upsert({
                    where: { userId: session.user.id },
                    update: cleanSupplierData,
                    create: {
                        userId: session.user.id,
                        ...supplierData
                    }
                });
            }

            return { user: updatedUser, supplier: updatedSupplier };
        });

        // Format the response data
        const profileData = {
            id: result.user.id,
            name: result.user.name || '',
            email: result.user.email,
            phone: result.user.phone || '',
            role: result.user.role,
            createdAt: result.user.createdAt,
            // Supplier specific data
            company: result.supplier?.companyName || '',
            industry: result.supplier?.industry || '',
            businessType: result.supplier?.businessType || '',
            website: result.supplier?.website || '',
            description: result.supplier?.description || '',
            country: result.supplier?.country || '',
            city: result.supplier?.city || '',
            address: result.supplier?.address || '',
            postalCode: result.supplier?.postalCode || '',
            contactPhone: result.supplier?.contactPhone || '',
            contactEmail: result.supplier?.contactEmail || '',
            verified: result.supplier?.verified || false,
            rating: result.supplier?.rating || 0,
            totalOrders: result.supplier?.totalOrders || 0,
            establishedYear: result.supplier?.establishedYear || null,
            employees: result.supplier?.employees || '',
            specialties: result.supplier?.specialties || [],
            certifications: result.supplier?.certifications || [],
            companyLogo: result.supplier?.companyLogo || '',
            businessInfo: result.supplier?.businessInfo || null
        };

        return NextResponse.json({
            success: true,
            data: profileData,
            message: 'Profile updated successfully'
        });

    } catch (error) {
        console.error('Error updating user profile:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
