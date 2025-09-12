import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Starting database population...");

    try {
        // Create test users first
        const buyerUser = await prisma.user.upsert({
            where: { email: "buyer@example.com" },
            update: {},
            create: {
                email: "buyer@example.com",
                name: "John Buyer",
                phone: "+1-555-0123",
                role: "buyer",
                passwordHash: "hashed_password_123",
            },
        });

        const supplierUser = await prisma.user.upsert({
            where: { email: "supplier@example.com" },
            update: {},
            create: {
                email: "supplier@example.com",
                name: "Mike Chen",
                phone: "+86-138-0013-8000",
                role: "supplier",
                passwordHash: "hashed_password_123",
            },
        });

        console.log("✅ Users created");

        // Create suppliers
        const suppliers = [
            {
                userId: supplierUser.id,
                companyName: "GlobalTech Solutions",
                industry: "Electronics",
                businessType: "Manufacturer",
                website: "https://globaltech.com",
                description: "Leading manufacturer of electronic components and consumer electronics with 15+ years of experience in the industry.",
                country: "China",
                city: "Shenzhen",
                address: "123 Technology Park",
                postalCode: "518000",
                phone: "+86-138-0013-8000",
                verified: true,
                rating: 4.8,
                totalOrders: 1250,
                responseTime: "< 2 hours",
                minOrderValue: 500,
                currency: "USD",
                establishedYear: 2008,
                employees: "500-1000",
                specialties: ["Smartphones", "Tablets", "Wearables", "IoT Devices"],
                certifications: ["ISO 9001", "CE", "FCC", "RoHS"],
                contactEmail: "mike.chen@globaltech.com",
                contactPhone: "+86-138-0013-8000",
                businessInfo: {
                    annualRevenue: "$50M - $100M",
                    exportMarkets: ["North America", "Europe", "Asia Pacific", "Middle East"],
                    mainProducts: ["Consumer Electronics", "Electronic Components", "IoT Devices", "Audio Equipment"],
                },
                lastActive: new Date(),
            },
            {
                userId: buyerUser.id, // This will be updated to a real supplier user
                companyName: "Premium Textiles Ltd",
                industry: "Textiles",
                businessType: "Manufacturer",
                website: "https://premiumtextiles.com",
                description: "Sustainable textile manufacturer specializing in organic cotton and eco-friendly fabrics for global fashion brands.",
                country: "Bangladesh",
                city: "Dhaka",
                address: "456 Textile District",
                postalCode: "1000",
                phone: "+880-171-123-4567",
                verified: true,
                rating: 4.6,
                totalOrders: 890,
                responseTime: "< 4 hours",
                minOrderValue: 200,
                currency: "USD",
                establishedYear: 2010,
                employees: "200-500",
                specialties: ["Organic Cotton", "Sustainable Fabrics", "Custom Printing", "Bulk Orders"],
                certifications: ["GOTS", "OEKO-TEX", "Fair Trade", "ISO 14001"],
                contactEmail: "sarah.johnson@premiumtextiles.com",
                contactPhone: "+880-171-123-4567",
                businessInfo: {
                    annualRevenue: "$10M - $50M",
                    exportMarkets: ["North America", "Europe", "Australia"],
                    mainProducts: ["Organic Cotton", "Sustainable Fabrics", "Custom Printing"],
                },
                lastActive: new Date(),
            },
        ];

        // Create supplier users for the additional suppliers
        const supplier2User = await prisma.user.create({
            data: {
                email: "supplier2@example.com",
                name: "Sarah Johnson",
                phone: "+880-171-123-4567",
                role: "supplier",
                passwordHash: "hashed_password_123",
            },
        });

        suppliers[1].userId = supplier2User.id;

        for (const supplierData of suppliers) {
            await prisma.supplier.upsert({
                where: { userId: supplierData.userId },
                update: supplierData,
                create: supplierData,
            });
        }

        console.log("✅ Suppliers created");

        // Get supplier IDs for product creation
        const createdSuppliers = await prisma.supplier.findMany({
            where: { userId: { in: [supplierUser.id, supplier2User.id] } },
        });

        // Create products
        const products = [
            {
                supplierId: createdSuppliers[0].id,
                name: "Wireless Bluetooth Headphones",
                description: "High-quality wireless headphones with advanced noise cancellation technology, 30-hour battery life, and premium sound quality.",
                category: "Electronics",
                subcategory: "Audio",
                price: 45.00,
                currency: "USD",
                minOrderQuantity: 100,
                unit: "pieces",
                specifications: {
                    material: "Plastic, Metal, Memory Foam",
                    color: "Black, White, Blue, Red",
                    size: "20cm x 15cm x 8cm",
                    weight: "250g",
                    certification: "CE, FCC, RoHS, Bluetooth SIG",
                    warranty: "2 years",
                    power: "30 hours battery life",
                    battery: "Quick charge 15min = 3 hours",
                },
                features: [
                    "Active Noise Cancellation",
                    "30-hour Battery Life",
                    "Quick Charge Technology",
                    "Bluetooth 5.0 Connectivity",
                    "Premium Sound Quality",
                    "Comfortable Over-Ear Design",
                ],
                tags: ["wireless", "bluetooth", "noise-cancellation", "premium", "audio"],
                images: ["/products/headphones-1.jpg", "/products/headphones-2.jpg"],
                inStock: true,
                stockQuantity: 5000,
                leadTime: "7-14 days",
                views: 1250,
                orders: 89,
            },
            {
                supplierId: createdSuppliers[1].id,
                name: "Organic Cotton T-Shirts",
                description: "100% organic cotton t-shirts with custom printing options. Soft, comfortable, and eco-friendly.",
                category: "Textiles",
                subcategory: "Clothing",
                price: 8.50,
                currency: "USD",
                minOrderQuantity: 500,
                unit: "pieces",
                specifications: {
                    material: "100% Organic Cotton",
                    color: "White, Black, Navy, Gray",
                    size: "S, M, L, XL, XXL",
                    weight: "150g",
                    certification: "GOTS, OEKO-TEX",
                },
                features: [
                    "Organic Cotton",
                    "Custom Printing",
                    "Eco-Friendly",
                    "Soft Feel",
                    "Multiple Sizes",
                    "Bulk Pricing",
                ],
                tags: ["organic", "cotton", "custom", "eco-friendly", "clothing"],
                images: ["/products/tshirt-1.jpg", "/products/tshirt-2.jpg"],
                inStock: true,
                stockQuantity: 10000,
                leadTime: "10-15 days",
                views: 2100,
                orders: 156,
            },
        ];

        for (const productData of products) {
            await prisma.product.create({
                data: productData,
            });
        }

        console.log("✅ Products created");

        // Create RFQs
        const rfqs = [
            {
                buyerId: buyerUser.id,
                title: "Custom Logo T-Shirts - Bulk Order",
                description: "Looking for high-quality cotton t-shirts with custom logo printing for our company event. Need professional printing with color matching.",
                category: "Textiles",
                subcategory: "Clothing",
                quantity: 500,
                unit: "pieces",
                budget: 2500,
                currency: "USD",
                status: "open",
                requirements: ["100% Cotton", "Screen Printing", "Color Matching", "Quality Control"],
                specifications: {
                    material: "100% Cotton",
                    color: "White, Navy Blue",
                    size: "S, M, L, XL, XXL",
                    certification: "OEKO-TEX Standard 100",
                },
                attachments: ["logo-design.ai", "brand-guidelines.pdf"],
                additionalInfo: "Please provide samples before final order. Need delivery by March 15th, 2024.",
                expiresAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
            },
            {
                buyerId: buyerUser.id,
                title: "Industrial LED Strip Lights",
                description: "Need waterproof LED strip lights for outdoor commercial installation. Must be energy efficient and have long lifespan.",
                category: "Electronics",
                subcategory: "Lighting",
                quantity: 200,
                unit: "meters",
                budget: 1500,
                currency: "USD",
                status: "quoted",
                requirements: ["IP65 Waterproof", "Energy Efficient", "5+ Year Warranty", "Dimmable"],
                specifications: {
                    material: "Aluminum Housing",
                    color: "Warm White, Cool White",
                    size: "5m, 10m lengths",
                    certification: "CE, FCC, RoHS",
                },
                attachments: ["installation-guide.pdf"],
                additionalInfo: "Need installation support and warranty documentation.",
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
            },
        ];

        for (const rfqData of rfqs) {
            await prisma.rfq.create({
                data: rfqData,
            });
        }

        console.log("✅ RFQs created");

        // Create quotes
        const createdRfqs = await prisma.rfq.findMany({
            where: { buyerId: buyerUser.id },
        });

        const quotes = [
            {
                rfqId: createdRfqs[0].id,
                supplierId: createdSuppliers[1].id,
                price: 2.2,
                currency: "USD",
                leadTimeDays: 15,
                notes: "We can provide samples within 3 days. Our printing quality is excellent with color matching guarantee.",
                status: "pending",
                whatsappSent: true,
            },
            {
                rfqId: createdRfqs[1].id,
                supplierId: createdSuppliers[0].id,
                price: 7.5,
                currency: "USD",
                leadTimeDays: 12,
                notes: "Premium LED strips with 5-year warranty. Can provide installation support.",
                status: "pending",
                whatsappSent: false,
            },
        ];

        for (const quoteData of quotes) {
            await prisma.quote.create({
                data: quoteData,
            });
        }

        console.log("✅ Quotes created");

        // Create reviews
        const reviews = [
            {
                supplierId: createdSuppliers[0].id,
                buyerId: buyerUser.id,
                rating: 5,
                comment: "Excellent quality products and fast delivery. Mike's team is very professional and responsive.",
                orderValue: 15000,
            },
            {
                supplierId: createdSuppliers[1].id,
                buyerId: buyerUser.id,
                rating: 4,
                comment: "Good supplier with competitive pricing. Some minor communication issues but overall satisfied.",
                orderValue: 8500,
            },
        ];

        for (const reviewData of reviews) {
            await prisma.supplierReview.create({
                data: reviewData,
            });
        }

        console.log("✅ Reviews created");

        console.log("🎉 Database population completed successfully!");
        console.log("\n📊 Summary:");
        console.log(`- Users: ${await prisma.user.count()}`);
        console.log(`- Suppliers: ${await prisma.supplier.count()}`);
        console.log(`- Products: ${await prisma.product.count()}`);
        console.log(`- RFQs: ${await prisma.rfq.count()}`);
        console.log(`- Quotes: ${await prisma.quote.count()}`);
        console.log(`- Reviews: ${await prisma.supplierReview.count()}`);

    } catch (error) {
        console.error("❌ Error populating database:", error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    });
