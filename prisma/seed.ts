import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Starting seed...')

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 12)
    const admin = await prisma.user.upsert({
        where: { email: 'admin@trademart.com' },
        update: {},
        create: {
            name: 'Admin User',
            email: 'admin@trademart.com',
            passwordHash: adminPassword,
            role: 'admin',
        },
    })

    // Create buyer users
    const buyerPassword = await bcrypt.hash('buyer123', 12)
    const buyer1 = await prisma.user.upsert({
        where: { email: 'buyer1@example.com' },
        update: {},
        create: {
            name: 'John Smith',
            email: 'buyer1@example.com',
            passwordHash: buyerPassword,
            role: 'buyer',
        },
    })

    const buyer2 = await prisma.user.upsert({
        where: { email: 'buyer2@example.com' },
        update: {},
        create: {
            name: 'Sarah Johnson',
            email: 'buyer2@example.com',
            passwordHash: buyerPassword,
            role: 'buyer',
        },
    })

    // Create supplier users
    const supplierPassword = await bcrypt.hash('supplier123', 12)
    const supplier1 = await prisma.user.upsert({
        where: { email: 'supplier1@example.com' },
        update: {},
        create: {
            name: 'Mike Chen',
            email: 'supplier1@example.com',
            passwordHash: supplierPassword,
            role: 'supplier',
        },
    })

    const supplier2 = await prisma.user.upsert({
        where: { email: 'supplier2@example.com' },
        update: {},
        create: {
            name: 'Lisa Wang',
            email: 'supplier2@example.com',
            passwordHash: supplierPassword,
            role: 'supplier',
        },
    })

    const supplier3 = await prisma.user.upsert({
        where: { email: 'supplier3@example.com' },
        update: {},
        create: {
            name: 'David Rodriguez',
            email: 'supplier3@example.com',
            passwordHash: supplierPassword,
            role: 'supplier',
        },
    })

    // Create supplier profiles
    const supplier1Profile = await prisma.supplier.upsert({
        where: { userId: supplier1.id },
        update: {},
        create: {
            userId: supplier1.id,
            companyName: 'TechCorp Electronics',
            industry: 'Electronics',
            verified: true,
            rating: 4.8,
        },
    })

    const supplier2Profile = await prisma.supplier.upsert({
        where: { userId: supplier2.id },
        update: {},
        create: {
            userId: supplier2.id,
            companyName: 'Global Textiles Ltd',
            industry: 'Textiles',
            verified: true,
            rating: 4.6,
        },
    })

    const supplier3Profile = await prisma.supplier.upsert({
        where: { userId: supplier3.id },
        update: {},
        create: {
            userId: supplier3.id,
            companyName: 'Industrial Solutions Inc',
            industry: 'Machinery',
            verified: false,
            rating: 4.2,
        },
    })

    // Create sample RFQs
    const rfq1 = await prisma.rfq.create({
        data: {
            buyerId: buyer1.id,
            title: 'Custom PCB Assembly Services',
            description: 'Looking for a reliable supplier to provide custom PCB assembly services for our IoT devices. Need high-quality components and fast turnaround times.',
            category: 'Electronics',
            status: 'open',
        },
    })

    const rfq2 = await prisma.rfq.create({
        data: {
            buyerId: buyer1.id,
            title: 'Cotton Fabric for Apparel Manufacturing',
            description: 'Need high-quality cotton fabric in various colors for our clothing line. Minimum order quantity 1000 yards per color.',
            category: 'Textiles',
            status: 'open',
        },
    })

    const rfq3 = await prisma.rfq.create({
        data: {
            buyerId: buyer2.id,
            title: 'Industrial Conveyor Belt System',
            description: 'Looking for a complete conveyor belt system for our manufacturing facility. Need installation and maintenance services included.',
            category: 'Machinery',
            status: 'open',
        },
    })

    const rfq4 = await prisma.rfq.create({
        data: {
            buyerId: buyer2.id,
            title: 'LED Display Panels',
            description: 'Need LED display panels for outdoor advertising. Looking for energy-efficient, weather-resistant panels with good warranty.',
            category: 'Electronics',
            status: 'quoted',
        },
    })

    // Create sample quotes
    await prisma.quote.create({
        data: {
            rfqId: rfq1.id,
            supplierId: supplier1Profile.id,
            price: 2500.00,
            leadTimeDays: 14,
            notes: 'We can provide high-quality PCB assembly with 99.9% accuracy. All components are sourced from certified suppliers.',
            status: 'pending',
        },
    })

    await prisma.quote.create({
        data: {
            rfqId: rfq2.id,
            supplierId: supplier2Profile.id,
            price: 8500.00,
            leadTimeDays: 21,
            notes: 'Premium cotton fabric with excellent color fastness. We can provide samples before bulk production.',
            status: 'pending',
        },
    })

    await prisma.quote.create({
        data: {
            rfqId: rfq3.id,
            supplierId: supplier3Profile.id,
            price: 45000.00,
            leadTimeDays: 45,
            notes: 'Complete conveyor system with 2-year warranty. Installation and training included. Can customize based on your specific requirements.',
            status: 'pending',
        },
    })

    await prisma.quote.create({
        data: {
            rfqId: rfq4.id,
            supplierId: supplier1Profile.id,
            price: 12000.00,
            leadTimeDays: 30,
            notes: 'High-quality LED panels with 5-year warranty. Weatherproof and energy-efficient design.',
            status: 'accepted',
        },
    })

    // Create a transaction for the accepted quote
    await prisma.transaction.create({
        data: {
            buyerId: buyer2.id,
            supplierId: supplier1Profile.id,
            rfqId: rfq4.id,
            amount: 12000.00,
            status: 'held',
        },
    })

    console.log('✅ Seed completed successfully!')
    console.log('📧 Test accounts created:')
    console.log('   Admin: admin@trademart.com / admin123')
    console.log('   Buyer: buyer1@example.com / buyer123')
    console.log('   Buyer: buyer2@example.com / buyer123')
    console.log('   Supplier: supplier1@example.com / supplier123')
    console.log('   Supplier: supplier2@example.com / supplier123')
    console.log('   Supplier: supplier3@example.com / supplier123')
}

main()
    .catch((e) => {
        console.error('❌ Seed failed:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
