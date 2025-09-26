import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// High-quality product images with professional graphics
const productImages = {
  'Electronics': [
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop', // MacBook Pro
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop', // iPhone
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop', // Headphones
    'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=300&fit=crop', // Smartwatch
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop', // Camera
    'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=400&h=300&fit=crop', // Laptop
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop', // Power Bank
  ],
  'Textiles': [
    'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=400&h=300&fit=crop', // Cotton fabric
    'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop', // Silk
    'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=300&fit=crop', // Denim
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop', // Wool
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop', // Leather
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop', // Canvas
  ],
  'Machinery': [
    'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop', // CNC Machine
    'https://images.unsplash.com/photo-1565813240240-4b8a0b8b8b8b?w=400&h=300&fit=crop', // Hydraulic Press
    'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop', // Conveyor Belt
    'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop', // Welding Equipment
    'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop', // Packaging Machine
    'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop', // Drill Press
  ],
  'Chemicals': [
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop', // Chemical Bottles
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop', // Cleaning Products
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop', // Adhesives
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop', // Paints
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop', // Lubricating Oil
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop', // Fertilizer
  ],
  'Automotive': [
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop', // Brake Pads
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop', // Oil Filter
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop', // LED Headlights
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop', // Car Battery
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop', // Seat Covers
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop', // Dash Cam
  ],
  'Food & Beverage': [
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop', // Coffee Beans - Premium Roasted
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop', // Olive Oil
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop', // Chocolate
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop', // Craft Beer
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop', // Spices
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop', // Cheese
  ],
  'Construction': [
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop', // Steel Rebar
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop', // Cement
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop', // Safety Helmet
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop', // Power Drill
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop', // Concrete Mixer
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop', // Safety Harness
  ],
  'Medical': [
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop', // Surgical Instruments
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop', // Medical Gloves
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop', // Stethoscope - Professional Medical
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop', // PPE Kit
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop', // Blood Pressure Monitor
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop', // First Aid Kit
  ],
  'Sports': [
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop', // Treadmill
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop', // Hiking Backpack
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop', // Basketball
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop', // Kayak Paddle - Cataract Oars
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop', // Ski Boots
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop', // Dumbbells
  ],
  'Home & Garden': [
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop', // Dining Table
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop', // Wall Art
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop', // Garden Tools
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop', // Cookware
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop', // LED Lights
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop', // Sofa
  ]
};

const categories = [
  'Electronics',
  'Textiles',
  'Machinery',
  'Chemicals',
  'Automotive',
  'Food & Beverage',
  'Construction',
  'Medical',
  'Sports',
  'Home & Garden'
];

const subcategories = {
  'Electronics': ['Smartphones', 'Laptops', 'Audio Equipment', 'Cameras', 'Wearables'],
  'Textiles': ['Cotton Fabric', 'Silk', 'Wool', 'Synthetic', 'Denim'],
  'Machinery': ['Industrial Equipment', 'Agricultural Machinery', 'Construction Equipment', 'Manufacturing Tools'],
  'Chemicals': ['Industrial Chemicals', 'Pharmaceuticals', 'Cosmetics', 'Cleaning Products'],
  'Automotive': ['Car Parts', 'Motorcycle Parts', 'Tires', 'Accessories'],
  'Food & Beverage': ['Packaged Food', 'Beverages', 'Spices', 'Dairy Products'],
  'Construction': ['Building Materials', 'Tools', 'Hardware', 'Safety Equipment'],
  'Medical': ['Medical Devices', 'Surgical Instruments', 'Diagnostic Equipment'],
  'Sports': ['Fitness Equipment', 'Outdoor Gear', 'Team Sports', 'Water Sports'],
  'Home & Garden': ['Furniture', 'Decor', 'Garden Tools', 'Kitchenware']
};

const countries = [
  'United States', 'China', 'India', 'Germany', 'Japan', 'South Korea',
  'United Kingdom', 'France', 'Italy', 'Canada', 'Australia', 'Brazil',
  'Mexico', 'Spain', 'Netherlands', 'Singapore', 'Thailand', 'Vietnam'
];

const industries = [
  'Manufacturing', 'Technology', 'Textiles', 'Automotive', 'Electronics',
  'Food & Beverage', 'Construction', 'Medical', 'Sports', 'Fashion',
  'Agriculture', 'Chemical', 'Energy', 'Telecommunications', 'Logistics'
];

const businessTypes = [
  'Manufacturer', 'Distributor', 'Wholesaler', 'Retailer', 'Service Provider',
  'Trading Company', 'Import/Export', 'OEM', 'ODM'
];

const productNames = {
  'Electronics': [
    'MacBook Pro 16" M3 Max Laptop', 'iPhone 15 Pro Max 256GB', 'Sony WH-1000XM5 Noise Cancelling Headphones',
    'Samsung 65" QLED 4K Smart TV', 'Apple Watch Series 9 GPS', 'Canon EOS R5 Mirrorless Camera',
    'Dell XPS 13 Ultrabook', 'Bose QuietComfort 45 Headphones', 'iPad Pro 12.9" M2 Chip',
    'Anker PowerCore 20000mAh Power Bank'
  ],
  'Textiles': [
    'Premium Egyptian Cotton Bed Sheets Set', 'Italian Silk Scarf Collection', 'Raw Denim Jeans - Selvedge',
    'Cashmere Wool Sweater - Hand Knit', 'Linen Tablecloth Set - 8 Piece', 'Organic Cotton T-Shirt - Bulk Pack',
    'Genuine Leather Jacket - Full Grain', 'Canvas Tote Bag - Eco Friendly', 'Wool Blanket - Alpaca Blend',
    'Silk Pillowcase Set - Mulberry Silk'
  ],
  'Machinery': [
    'CNC Milling Machine - 3-Axis', 'Industrial Hydraulic Press - 100 Ton', 'Conveyor Belt System - Automated',
    'Packaging Machine - Multi-Head', 'Welding Equipment - TIG/MIG', 'Precision Cutting Machine - Laser',
    'Assembly Line Equipment - Modular', 'Quality Control Machine - Vision System', 'Drill Press - Industrial Grade',
    'Material Handling Equipment - Forklift'
  ],
  'Chemicals': [
    'Industrial Solvent - Isopropyl Alcohol 99%', 'Cleaning Chemical - Multi-Purpose', 'Epoxy Adhesive - High Strength',
    'Paint Thinner - Mineral Spirits', 'Synthetic Lubricating Oil - 10W-30', 'Laundry Detergent - Concentrated',
    'Surface Disinfectant - Hospital Grade', 'NPK Fertilizer - 20-20-20', 'Cosmetic Ingredient - Hyaluronic Acid',
    'Pharmaceutical Raw Material - API Grade'
  ],
  'Automotive': [
    'Ceramic Brake Pads - Performance Grade', 'Engine Oil Filter - OEM Quality', 'LED Headlight Assembly - H7',
    'Car Battery - AGM Technology', 'TPMS Sensor - Universal Fit', 'Leather Car Seat Covers - Custom Fit',
    'Dash Cam - 4K Recording', 'Wireless Car Charger - Fast Charge', 'Windshield Wiper Blades - All Weather',
    'Engine Air Filter - High Flow'
  ],
  'Food & Beverage': [
    'Organic Coffee Beans - Single Origin', 'Premium Olive Oil - Extra Virgin', 'Artisan Chocolate - Dark 70%',
    'Craft Beer - IPA Selection', 'Organic Spices - Turmeric Powder', 'Gourmet Cheese - Aged Cheddar',
    'Natural Honey - Raw & Unfiltered', 'Tea Leaves - Premium Blend', 'Organic Nuts - Mixed Variety',
    'Craft Spirits - Small Batch Whiskey'
  ],
  'Construction': [
    'Steel Rebar - Grade 60', 'Portland Cement - Type I', 'Insulation Board - R-Value 20',
    'Safety Helmet - ANSI Z89.1', 'Power Drill - Cordless 20V', 'Concrete Mixer - 3.5 Cubic Feet',
    'Scaffolding System - Modular', 'Safety Harness - Full Body', 'Hard Hat - High Visibility',
    'Construction Gloves - Cut Resistant'
  ],
  'Medical': [
    'Surgical Instruments - Stainless Steel', 'Medical Gloves - Nitrile Exam', 'Diagnostic Stethoscope - Digital',
    'PPE Kit - Complete Set', 'Pharmaceutical Tablets - Generic', 'Medical Device - Blood Pressure Monitor',
    'Surgical Masks - N95 Grade', 'Disposable Syringes - Sterile', 'Medical Bandages - Adhesive',
    'First Aid Kit - Comprehensive'
  ],
  'Sports': [
    'Fitness Equipment - Treadmill Pro', 'Outdoor Gear - Hiking Backpack', 'Team Sports - Basketball',
    'Water Sports - Kayak Paddle', 'Winter Sports - Ski Boots', 'Gym Equipment - Dumbbell Set',
    'Outdoor Camping - Tent 4-Person', 'Water Sports - Surfboard', 'Team Sports - Soccer Ball',
    'Fitness Equipment - Yoga Mat'
  ],
  'Home & Garden': [
    'Furniture - Solid Wood Dining Table', 'Home Decor - Wall Art Canvas', 'Garden Tools - Spade Set',
    'Kitchenware - Stainless Steel Cookware', 'Lighting - LED Pendant Lights', 'Furniture - Sectional Sofa',
    'Garden Tools - Pruning Shears', 'Kitchenware - Ceramic Dinnerware', 'Home Decor - Throw Pillows',
    'Lighting - Table Lamp - Modern'
  ]
};

const companyNames = [
  'GlobalTech Solutions', 'Premium Manufacturing Co.', 'Elite Trading Ltd.', 'Superior Industries',
  'Advanced Materials Inc.', 'Quality Products Corp.', 'Innovation Hub', 'Mega Suppliers',
  'Top Quality Ltd.', 'Best Source Trading', 'Reliable Manufacturing', 'Expert Solutions',
  'Professional Trading', 'Leading Suppliers', 'Prime Materials', 'Excellent Products',
  'Superior Trading', 'Quality Source', 'Premium Suppliers', 'Elite Manufacturing'
];

const reviewComments = [
  'Excellent quality products and fast delivery. Highly recommended!',
  'Great supplier with competitive prices and reliable service.',
  'Outstanding customer service and high-quality products.',
  'Very professional and trustworthy business partner.',
  'Fast response time and excellent communication throughout the process.',
  'Top-notch quality and on-time delivery. Will definitely order again.',
  'Reliable supplier with consistent product quality.',
  'Excellent experience working with this supplier.',
  'Great prices and good quality products.',
  'Professional service and high-quality products delivered on time.'
];

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clear existing data (in correct order to avoid foreign key constraints)
  await prisma.transaction.deleteMany();
  await prisma.supplierReview.deleteMany();
  await prisma.productReview.deleteMany();
  await prisma.quote.deleteMany();
  await prisma.rfq.deleteMany();
  await prisma.product.deleteMany();
  await prisma.supplier.deleteMany();
  await prisma.user.deleteMany();

  console.log('✅ Cleared existing data');

  // Create users and suppliers
  const suppliers = [];
  const users = [];

  for (let i = 0; i < 20; i++) {
    const hashedPassword = await bcrypt.hash('password123', 10);
    const country = countries[Math.floor(Math.random() * countries.length)];
    const industry = industries[Math.floor(Math.random() * industries.length)];
    const businessType = businessTypes[Math.floor(Math.random() * businessTypes.length)];
    const companyName = companyNames[i];

    const user = await prisma.user.create({
      data: {
        name: `Supplier ${i + 1}`,
        email: `supplier${i + 1}@example.com`,
        passwordHash: hashedPassword,
        role: 'supplier',
      },
    });

    const supplier = await prisma.supplier.create({
      data: {
        userId: user.id,
        companyName,
        industry,
        businessType,
        website: `https://www.${companyName.toLowerCase().replace(/\s+/g, '')}.com`,
        description: `Leading ${industry.toLowerCase()} company specializing in high-quality products and services. We have been serving customers worldwide for over ${Math.floor(Math.random() * 20) + 5} years with excellence and reliability.`,
        country,
        city: `${country} City ${i + 1}`,
        address: `${Math.floor(Math.random() * 9999) + 1} Main Street`,
        postalCode: `${Math.floor(Math.random() * 90000) + 10000}`,
        phone: `+1-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
        verified: Math.random() > 0.3, // 70% verified
        rating: Number((Math.random() * 2 + 3).toFixed(1)), // 3.0 to 5.0
        totalOrders: Math.floor(Math.random() * 1000) + 50,
        responseTime: `${Math.floor(Math.random() * 24) + 1} hours`, // 1-24 hours
        minOrderValue: Number((Math.random() * 5000 + 500).toFixed(2)),
        currency: 'USD',
        establishedYear: Math.floor(Math.random() * 30) + 1990,
        employees: `${Math.floor(Math.random() * 500) + 10}`,
        specialties: (subcategories as any)[industry]?.slice(0, Math.floor(Math.random() * 3) + 1) || [],
        certifications: ['ISO 9001', 'ISO 14001', 'CE Certification'].slice(0, Math.floor(Math.random() * 3) + 1),
        contactEmail: `contact@${companyName.toLowerCase().replace(/\s+/g, '')}.com`,
        contactPhone: `+1-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
        businessInfo: {
          annualRevenue: `$${(Math.floor(Math.random() * 50) + 5)}M`,
          exportMarkets: countries.slice(0, Math.floor(Math.random() * 5) + 3),
          mainProducts: (subcategories as any)[industry]?.slice(0, Math.floor(Math.random() * 3) + 1) || []
        },
        companyLogo: `https://ui-avatars.com/api/?name=${encodeURIComponent(companyName)}&background=3b82f6&color=ffffff&size=200`,
        lastActive: new Date(Date.now() - Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000), // Last 7 days
      },
    });

    users.push(user);
    suppliers.push(supplier);
  }

  console.log('✅ Created 20 suppliers');

  // Create buyer users for reviews
  const buyers = [];
  for (let i = 0; i < 50; i++) {
    const hashedPassword = await bcrypt.hash('password123', 10);
    const buyer = await prisma.user.create({
      data: {
        name: `Buyer ${i + 1}`,
        email: `buyer${i + 1}@example.com`,
        passwordHash: hashedPassword,
        role: 'buyer',
      },
    });
    buyers.push(buyer);
  }

  console.log('✅ Created 50 buyer users');

  // Create products
  const products = [];
  for (let i = 0; i < 100; i++) {
    const supplier = suppliers[Math.floor(Math.random() * suppliers.length)];
    const category = categories[Math.floor(Math.random() * categories.length)];
    const subcategory = (subcategories as any)[category]?.[Math.floor(Math.random() * ((subcategories as any)[category]?.length || 1))] || 'General';
    const productName = (productNames as any)[category]?.[Math.floor(Math.random() * ((productNames as any)[category]?.length || 1))] || `${category} Product ${i + 1}`;

    // Get category-specific images
    const categoryImages = (productImages as any)[category] || productImages['Electronics'];
    const selectedImages = categoryImages.slice(0, Math.floor(Math.random() * 3) + 1);

    const product = await prisma.product.create({
      data: {
        supplierId: supplier.id,
        name: productName,
        description: `Professional-grade ${productName.toLowerCase()} designed for commercial and industrial applications. Manufactured to the highest standards with premium materials and advanced technology. Features excellent durability, superior performance, and competitive pricing. Ideal for bulk orders and long-term business partnerships.`,
        category,
        subcategory,
        price: Number((Math.random() * 1000 + 10).toFixed(2)),
        currency: 'USD',
        minOrderQuantity: Math.floor(Math.random() * 100) + 1,
        unit: ['pcs', 'kg', 'tons', 'meters', 'liters', 'boxes'][Math.floor(Math.random() * 6)],
        specifications: {
          material: ['Steel', 'Aluminum', 'Plastic', 'Cotton', 'Leather', 'Glass'][Math.floor(Math.random() * 6)],
          color: ['Black', 'White', 'Blue', 'Red', 'Green', 'Silver'][Math.floor(Math.random() * 6)],
          size: `${Math.floor(Math.random() * 50) + 10}cm x ${Math.floor(Math.random() * 50) + 10}cm`,
          weight: `${Math.floor(Math.random() * 10) + 1}kg`
        },
        features: [
          'High Quality',
          'Durable',
          'Easy to Use',
          'Cost Effective',
          'Environmentally Friendly'
        ].slice(0, Math.floor(Math.random() * 3) + 2),
        tags: [category, subcategory, 'Premium', 'Quality', 'Reliable'],
        images: selectedImages,
        inStock: Math.random() > 0.2, // 80% in stock
        stockQuantity: Math.floor(Math.random() * 1000) + 100,
        leadTime: `${Math.floor(Math.random() * 30) + 7} days`, // 7-37 days
        views: Math.floor(Math.random() * 1000) + 10,
        orders: Math.floor(Math.random() * 100) + 1,
      },
    });

    products.push(product);
  }

  console.log('✅ Created 100 products');

  // Create supplier reviews
  for (let i = 0; i < 50; i++) {
    const supplier = suppliers[Math.floor(Math.random() * suppliers.length)];
    const buyer = buyers[i];

    await prisma.supplierReview.create({
      data: {
        supplierId: supplier.id,
        buyerId: buyer.id,
        rating: Math.floor(Math.random() * 2) + 4, // 4-5 stars
        comment: reviewComments[Math.floor(Math.random() * reviewComments.length)],
        orderValue: Number((Math.random() * 50000 + 1000).toFixed(2)),
      },
    });
  }

  console.log('✅ Created 50 supplier reviews');

  // Create product reviews
  for (let i = 0; i < 80; i++) {
    const product = products[Math.floor(Math.random() * products.length)];
    const buyer = buyers[Math.floor(Math.random() * buyers.length)];

    await prisma.productReview.create({
      data: {
        productId: product.id,
        buyerId: buyer.id,
        rating: Math.floor(Math.random() * 2) + 4, // 4-5 stars
        comment: reviewComments[Math.floor(Math.random() * reviewComments.length)],
      },
    });
  }

  console.log('✅ Created 80 product reviews');

  // Update supplier ratings based on reviews
  for (const supplier of suppliers) {
    const reviews = await prisma.supplierReview.findMany({
      where: { supplierId: supplier.id }
    });

    if (reviews.length > 0) {
      const avgRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
      const totalOrders = reviews.reduce((sum, review) => sum + 1, 0) + Math.floor(Math.random() * 50);

      await prisma.supplier.update({
        where: { id: supplier.id },
        data: {
          rating: Number(avgRating.toFixed(1)),
          totalOrders,
        },
      });
    }
  }

  console.log('✅ Updated supplier ratings');

  // Create a sample buyer user
  const buyerPassword = await bcrypt.hash('password123', 10);
  await prisma.user.create({
    data: {
      name: 'John Buyer',
      email: 'buyer@example.com',
      passwordHash: buyerPassword,
      role: 'buyer',
    },
  });

  console.log('✅ Created sample buyer user');

  console.log('🎉 Database seeding completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`- ${users.length} users created`);
  console.log(`- ${suppliers.length} suppliers created`);
  console.log(`- ${products.length} products created`);
  console.log('- 50 supplier reviews created');
  console.log('- 80 product reviews created');
  console.log('- 1 sample buyer created');
  console.log('\n🔑 Login credentials:');
  console.log('- Supplier: supplier1@example.com / password123');
  console.log('- Buyer: buyer@example.com / password123');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
