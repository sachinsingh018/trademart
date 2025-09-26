import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Service images for different categories
const serviceImages = {
    'Technology': [
        'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&h=300&fit=crop', // Web development
        'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=300&fit=crop', // Mobile development
        'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=300&fit=crop', // AI/ML
        'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=300&fit=crop', // Cloud services
        'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=300&fit=crop', // Cybersecurity
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop', // Data analytics
    ],
    'Finance': [
        'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop', // Accounting
        'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&h=300&fit=crop', // Tax services
        'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop', // Financial planning
        'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&h=300&fit=crop', // Investment advisory
        'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop', // Insurance
        'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&h=300&fit=crop', // Auditing
    ],
    'Marketing': [
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop', // Digital marketing
        'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop', // Content creation
        'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=300&fit=crop', // SEO/SEM
        'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop', // Social media
        'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop', // Branding
        'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=300&fit=crop', // Advertising
    ],
    'Consulting': [
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop', // Business strategy
        'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop', // Management consulting
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop', // Operations
        'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop', // HR consulting
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop', // IT consulting
        'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop', // Financial consulting
    ],
    'Design': [
        'https://images.unsplash.com/photo-1558655146-d09347e92766?w=400&h=300&fit=crop', // Graphic design
        'https://images.unsplash.com/photo-1558655146-9a401e19b6c8?w=400&h=300&fit=crop', // UI/UX design
        'https://images.unsplash.com/photo-1558655146-d09347e92766?w=400&h=300&fit=crop', // Web design
        'https://images.unsplash.com/photo-1558655146-9a401e19b6c8?w=400&h=300&fit=crop', // Product design
        'https://images.unsplash.com/photo-1558655146-d09347e92766?w=400&h=300&fit=crop', // Interior design
        'https://images.unsplash.com/photo-1558655146-9a401e19b6c8?w=400&h=300&fit=crop', // Architecture
    ],
    'Legal': [
        'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&h=300&fit=crop', // Corporate law
        'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&h=300&fit=crop', // Contract law
        'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&h=300&fit=crop', // Intellectual property
        'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&h=300&fit=crop', // Employment law
        'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&h=300&fit=crop', // Real estate law
        'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&h=300&fit=crop', // Litigation
    ],
    'Healthcare': [
        'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop', // Medical services
        'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop', // Telemedicine
        'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop', // Health consulting
        'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop', // Medical research
        'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop', // Healthcare IT
        'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop', // Wellness
    ],
    'Education': [
        'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop', // Training
        'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop', // Tutoring
        'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop', // Curriculum development
        'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop', // Educational technology
        'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop', // Language learning
        'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop', // Professional development
    ],
    'Logistics': [
        'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=300&fit=crop', // Supply chain
        'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=300&fit=crop', // Transportation
        'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=300&fit=crop', // Warehousing
        'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=300&fit=crop', // Inventory management
        'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=300&fit=crop', // Fulfillment
        'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=300&fit=crop', // Last mile delivery
    ],
    'Other': [
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop', // General services
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop', // Custom solutions
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop', // Specialized services
    ]
};

const serviceCategories = [
    'Technology',
    'Finance',
    'Marketing',
    'Consulting',
    'Design',
    'Legal',
    'Healthcare',
    'Education',
    'Logistics',
    'Other'
];

const subcategories = {
    'Technology': ['Web Development', 'Mobile Development', 'AI/ML', 'Cloud Services', 'Cybersecurity', 'Data Analytics'],
    'Finance': ['Accounting', 'Tax Services', 'Financial Planning', 'Investment Advisory', 'Insurance', 'Auditing'],
    'Marketing': ['Digital Marketing', 'Content Creation', 'SEO/SEM', 'Social Media', 'Branding', 'Advertising'],
    'Consulting': ['Business Strategy', 'Management Consulting', 'Operations', 'HR Consulting', 'IT Consulting', 'Financial Consulting'],
    'Design': ['Graphic Design', 'UI/UX Design', 'Web Design', 'Product Design', 'Interior Design', 'Architecture'],
    'Legal': ['Corporate Law', 'Contract Law', 'Intellectual Property', 'Employment Law', 'Real Estate Law', 'Litigation'],
    'Healthcare': ['Medical Services', 'Telemedicine', 'Health Consulting', 'Medical Research', 'Healthcare IT', 'Wellness'],
    'Education': ['Training', 'Tutoring', 'Curriculum Development', 'Educational Technology', 'Language Learning', 'Professional Development'],
    'Logistics': ['Supply Chain', 'Transportation', 'Warehousing', 'Inventory Management', 'Fulfillment', 'Last Mile Delivery'],
    'Other': ['General Services', 'Custom Solutions', 'Specialized Services']
};

const serviceNames = {
    'Technology': [
        'Full-Stack Web Development', 'Mobile App Development', 'AI/ML Solutions', 'Cloud Migration Services',
        'Cybersecurity Assessment', 'Data Analytics & BI', 'DevOps Implementation', 'Blockchain Development',
        'IoT Solutions', 'API Development & Integration'
    ],
    'Finance': [
        'Financial Planning & Advisory', 'Tax Preparation & Filing', 'Accounting Services', 'Investment Management',
        'Insurance Consulting', 'Audit & Compliance', 'Bookkeeping Services', 'Financial Modeling',
        'Risk Management', 'Merger & Acquisition Advisory'
    ],
    'Marketing': [
        'Digital Marketing Strategy', 'Content Marketing', 'SEO/SEM Services', 'Social Media Management',
        'Brand Identity Design', 'PPC Advertising', 'Email Marketing', 'Influencer Marketing',
        'Marketing Automation', 'Performance Analytics'
    ],
    'Consulting': [
        'Business Strategy Consulting', 'Management Consulting', 'Operations Optimization', 'HR Consulting',
        'IT Strategy Consulting', 'Financial Consulting', 'Change Management', 'Process Improvement',
        'Organizational Development', 'Project Management'
    ],
    'Design': [
        'Graphic Design Services', 'UI/UX Design', 'Web Design', 'Product Design',
        'Interior Design', 'Architectural Services', 'Logo Design', 'Brand Design',
        'Print Design', 'Motion Graphics'
    ],
    'Legal': [
        'Corporate Legal Services', 'Contract Review & Drafting', 'Intellectual Property Law', 'Employment Law',
        'Real Estate Law', 'Litigation Support', 'Legal Research', 'Compliance Consulting',
        'Business Formation', 'Legal Document Preparation'
    ],
    'Healthcare': [
        'Medical Consulting', 'Telemedicine Services', 'Health IT Solutions', 'Medical Research',
        'Healthcare Analytics', 'Wellness Programs', 'Medical Device Consulting', 'Healthcare Compliance',
        'Patient Care Management', 'Healthcare Training'
    ],
    'Education': [
        'Professional Training', 'Online Tutoring', 'Curriculum Development', 'Educational Technology',
        'Language Learning', 'Skills Development', 'Educational Consulting', 'Learning Management Systems',
        'Educational Content Creation', 'Assessment & Testing'
    ],
    'Logistics': [
        'Supply Chain Optimization', 'Transportation Management', 'Warehouse Operations', 'Inventory Management',
        'Last Mile Delivery', 'Logistics Consulting', 'Fleet Management', 'Distribution Network Design',
        'Procurement Services', 'Reverse Logistics'
    ],
    'Other': [
        'Custom Business Solutions', 'Specialized Consulting', 'Project Management', 'Quality Assurance',
        'Research & Development', 'Technical Writing', 'Translation Services', 'Event Management',
        'Virtual Assistant Services', 'General Consulting'
    ]
};

const pricingModels = ['fixed', 'hourly', 'project', 'custom'];
const deliveryMethods = ['remote', 'on-site', 'hybrid'];
const experienceLevels = ['1-2 years', '3-5 years', '5-10 years', '10+ years'];
const certifications = [
    'PMP', 'AWS Certified', 'Google Analytics', 'HubSpot Certified', 'Salesforce Certified',
    'Microsoft Certified', 'CISSP', 'CPA', 'CFA', 'PHR', 'SHRM-CP', 'Six Sigma', 'ITIL',
    'Agile Certified', 'Scrum Master', 'Lean Six Sigma', 'ISO 9001', 'ISO 27001'
];

const portfolioItems = [
    'E-commerce platform for retail client',
    'Mobile app with 100k+ downloads',
    'Cloud migration saving 40% costs',
    'SEO optimization increasing traffic by 200%',
    'Financial model for $50M acquisition',
    'Brand redesign for Fortune 500 company',
    'Legal compliance framework implementation',
    'Healthcare data analytics solution',
    'Educational platform for 10k+ students',
    'Supply chain optimization project'
];

async function main() {
    console.log('🌱 Starting services database seeding...');

    // Get existing suppliers
    const suppliers = await prisma.supplier.findMany({
        include: {
            user: true
        }
    });

    if (suppliers.length === 0) {
        console.log('❌ No suppliers found. Please run the main seed script first.');
        return;
    }

    console.log(`✅ Found ${suppliers.length} suppliers`);

    // Create services
    const services = [];
    for (let i = 0; i < 50; i++) {
        const supplier = suppliers[Math.floor(Math.random() * suppliers.length)];
        const category = serviceCategories[Math.floor(Math.random() * serviceCategories.length)];
        const subcategory = (subcategories as any)[category]?.[Math.floor(Math.random() * ((subcategories as any)[category]?.length || 1))] || 'General';
        const serviceName = (serviceNames as any)[category]?.[Math.floor(Math.random() * ((serviceNames as any)[category]?.length || 1))] || `${category} Service ${i + 1}`;

        // Get category-specific images
        const categoryImages = (serviceImages as any)[category] || serviceImages['Technology'];
        const selectedImages = categoryImages.slice(0, Math.floor(Math.random() * 3) + 1);

        const pricingModel = pricingModels[Math.floor(Math.random() * pricingModels.length)];
        const price = pricingModel === 'custom' ? null : Number((Math.random() * 10000 + 100).toFixed(2));
        const minDuration = Math.floor(Math.random() * 30) + 1;
        const maxDuration = minDuration + Math.floor(Math.random() * 60) + 7;

        const service = await prisma.service.create({
            data: {
                supplierId: supplier.id,
                name: serviceName,
                description: `Professional ${serviceName.toLowerCase()} service designed to deliver exceptional results. Our experienced team provides comprehensive solutions tailored to your specific needs. We combine industry expertise with cutting-edge methodologies to ensure optimal outcomes for your business.`,
                category,
                subcategory,
                price,
                currency: 'USD',
                pricingModel,
                minDuration,
                maxDuration,
                unit: 'project',
                specifications: {
                    experience: experienceLevels[Math.floor(Math.random() * experienceLevels.length)],
                    deliveryMethod: deliveryMethods[Math.floor(Math.random() * deliveryMethods.length)],
                    certifications: certifications.slice(0, Math.floor(Math.random() * 3) + 1)
                },
                features: [
                    'Professional Quality',
                    'Timely Delivery',
                    '24/7 Support',
                    'Competitive Pricing',
                    'Proven Track Record',
                    'Custom Solutions'
                ].slice(0, Math.floor(Math.random() * 4) + 3),
                tags: [category, subcategory, 'Professional', 'Quality', 'Reliable'],
                images: selectedImages,
                isAvailable: Math.random() > 0.1, // 90% available
                leadTime: `${Math.floor(Math.random() * 14) + 1} days`, // 1-14 days
                views: Math.floor(Math.random() * 500) + 10,
                orders: Math.floor(Math.random() * 50) + 1,
                rating: Number((Math.random() * 2 + 3).toFixed(1)), // 3.0 to 5.0
                reviews: Math.floor(Math.random() * 20) + 1,
                deliveryMethod: deliveryMethods[Math.floor(Math.random() * deliveryMethods.length)],
                experience: experienceLevels[Math.floor(Math.random() * experienceLevels.length)],
                certifications: certifications.slice(0, Math.floor(Math.random() * 3) + 1),
                portfolio: portfolioItems.slice(0, Math.floor(Math.random() * 3) + 1),
            },
        });

        services.push(service);
    }

    console.log('✅ Created 50 services');

    // Create service reviews
    const buyers = await prisma.user.findMany({
        where: { role: 'buyer' },
        take: 30
    });

    for (let i = 0; i < 40; i++) {
        const service = services[Math.floor(Math.random() * services.length)];
        const buyer = buyers[Math.floor(Math.random() * buyers.length)];

        await prisma.serviceReview.create({
            data: {
                serviceId: service.id,
                buyerId: buyer.id,
                rating: Math.floor(Math.random() * 2) + 4, // 4-5 stars
                comment: [
                    'Excellent service and professional delivery. Highly recommended!',
                    'Outstanding quality and exceeded expectations. Will definitely use again.',
                    'Great communication and timely delivery. Very satisfied with the results.',
                    'Professional approach and high-quality work. Highly recommended.',
                    'Excellent service provider with great attention to detail.',
                    'Outstanding work and excellent customer service. Very pleased.',
                    'Professional, reliable, and delivered exactly as promised.',
                    'Great experience working with this service provider.',
                    'High-quality work and excellent communication throughout.',
                    'Exceeded expectations and delivered on time. Highly recommended.'
                ][Math.floor(Math.random() * 10)],
            },
        });
    }

    console.log('✅ Created 40 service reviews');

    // Update service ratings based on reviews
    for (const service of services) {
        const reviews = await prisma.serviceReview.findMany({
            where: { serviceId: service.id }
        });

        if (reviews.length > 0) {
            const avgRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

            await prisma.service.update({
                where: { id: service.id },
                data: {
                    rating: Number(avgRating.toFixed(1)),
                    reviews: reviews.length,
                },
            });
        }
    }

    console.log('✅ Updated service ratings');

    console.log('🎉 Services database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`- ${services.length} services created`);
    console.log('- 40 service reviews created');
    console.log('- Service ratings updated');
}

main()
    .catch((e) => {
        console.error('❌ Error seeding services database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
