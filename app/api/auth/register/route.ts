import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
// import { notificationService } from "@/lib/notifications"

export async function POST(request: NextRequest) {
    try {
        const {
            name,
            email,
            phone,
            password,
            role = "buyer",
            companyName,
            industry,
            businessType,
            website,
            description,
            country,
            city,
            address,
            postalCode
        } = await request.json()

        // Basic validation
        if (!name || !email || !password) {
            return NextResponse.json(
                { error: "Name, email, and password are required" },
                { status: 400 }
            )
        }

        // Enhanced validation for suppliers
        if (role === "supplier" && !companyName) {
            return NextResponse.json(
                { error: "Company name is required for suppliers" },
                { status: 400 }
            )
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        })

        if (existingUser) {
            return NextResponse.json(
                { error: "User already exists" },
                { status: 400 }
            )
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 12)

        // Create user with enhanced data
        const userData: {
            name: string;
            email: string;
            phone: string | null;
            passwordHash: string;
            role: string;
        } = {
            name,
            email,
            phone: phone || null,
            passwordHash,
            role,
        };

        const user = await prisma.user.create({
            data: userData
        })

        // If user is a supplier, create comprehensive supplier record
        if (role === "supplier") {
            const supplierData: {
                userId: string;
                companyName: string;
                industry: string | null;
                businessType: string | null;
                website: string | null;
                description: string | null;
                country: string | null;
                city: string | null;
                address: string | null;
                postalCode: string | null;
                phone: string | null;
            } = {
                userId: user.id,
                companyName: companyName || name,
                industry: industry || "General",
                businessType: businessType || null,
                website: website || null,
                description: description || null,
                country: country || null,
                city: city || null,
                address: address || null,
                postalCode: postalCode || null,
                phone: phone || null,
            };

            await prisma.supplier.create({
                data: supplierData
            })
        }

        // Send welcome notification
        try {
            // await notificationService.sendToUser(
            //     user.id,
            //     {
            // userId: user.id,
            //     type: 'system',
            //         title: "Welcome to TradeMart!",
            //             message: `Welcome ${name}! Your ${role} account has been created successfully. You can now start using TradeMart to ${role === "buyer" ? "post RFQs and get quotes" : "submit quotes and grow your business"}.`,
            //                 read: false,
            //     // }
            // );
        }
        catch (error) {
            console.error("Error sending welcome notification:", error);
        }


        // TODO: Send welcome email using AWS SES
        // await sendWelcomeEmail(email, name, role);

        return NextResponse.json(
            {
                message: "User created successfully",
                userId: user.id,
                role: user.role,
                // Include additional info for frontend
                ...(role === "supplier" && {
                    supplierProfile: {
                        companyName: companyName || name,
                        industry: industry || "General"
                    }
                })
            },
            { status: 201 }
        )
    } catch (error) {
        console.error("Registration error:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}
