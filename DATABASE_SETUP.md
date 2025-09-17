# 🗄️ Database Setup & Data Management Guide

## Overview

This guide explains how to set up the TradeMart database with comprehensive tables for suppliers, products, RFQs, and quotes, plus how suppliers can insert and manage their data through the dashboard.

## 📋 Database Schema

### Core Tables Created

#### 1. **Supplier Table** (`suppliers`)
```sql
- id (String, Primary Key)
- userId (String, Foreign Key to users)
- companyName (String)
- industry (String)
- businessType (String)
- website (String)
- description (String)
- country, city, address, postalCode (String)
- phone (String)
- verified (Boolean)
- rating (Decimal 3,2)
- totalOrders (Int)
- responseTime (String)
- minOrderValue (Decimal 12,2)
- currency (String)
- establishedYear (Int)
- employees (String)
- specialties (String[])
- certifications (String[])
- contactEmail, contactPhone (String)
- businessInfo (JSON)
- lastActive (DateTime)
- createdAt, updatedAt (DateTime)
```

#### 2. **Product Table** (`products`)
```sql
- id (String, Primary Key)
- supplierId (String, Foreign Key to suppliers)
- name (String)
- description (String)
- category, subcategory (String)
- price (Decimal 12,2)
- currency (String)
- minOrderQuantity (Int)
- unit (String)
- specifications (JSON)
- features (String[])
- tags (String[])
- images (String[])
- inStock (Boolean)
- stockQuantity (Int)
- leadTime (String)
- views, orders (Int)
- createdAt, updatedAt (DateTime)
```

#### 3. **RFQ Table** (`rfqs`)
```sql
- id (String, Primary Key)
- buyerId (String, Foreign Key to users)
- title (String)
- description (String)
- category, subcategory (String)
- quantity (Int)
- unit (String)
- budget (Decimal 12,2)
- currency (String)
- status (String: open|quoted|closed)
- requirements (String[])
- specifications (JSON)
- attachments (String[])
- additionalInfo (String)
- expiresAt (DateTime)
- createdAt, updatedAt (DateTime)
```

#### 4. **Quote Table** (`quotes`)
```sql
- id (String, Primary Key)
- rfqId (String, Foreign Key to rfqs)
- supplierId (String, Foreign Key to suppliers)
- price (Decimal 12,2)
- currency (String)
- leadTimeDays (Int)
- notes (String)
- status (String: pending|accepted|rejected)
- whatsappSent (Boolean)
- createdAt, updatedAt (DateTime)
```

#### 5. **Review Tables**
- **SupplierReview** (`supplier_reviews`)
- **ProductReview** (`product_reviews`)

## 🚀 Setup Instructions

### Step 1: Environment Setup

Create a `.env.local` file in your project root:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/trademart?schema=trademart"

# NextAuth.js
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Optional: OAuth Providers
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### Step 2: Database Migration

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database (for development)
npm run db:push

# Or create migration (for production)
npm run db:migrate
```

### Step 3: Populate with Sample Data

```bash
# Run the database population script
npm run db:populate
```

This will create:
- ✅ Test users (buyer and supplier accounts)
- ✅ Sample suppliers with comprehensive profiles
- ✅ Sample products with specifications
- ✅ Sample RFQs with requirements
- ✅ Sample quotes and reviews

## 🔧 Supplier Dashboard Features

### 1. **Profile Management**
- **Company Information**: Name, industry, business type, website
- **Location Details**: Country, city, address, postal code
- **Business Details**: Established year, employees, specialties, certifications
- **Contact Information**: Email, phone, response time
- **Order Settings**: Minimum order value, currency

### 2. **Product Management**
- **Add Products**: Complete product creation form
- **Product Details**: Name, description, category, pricing
- **Specifications**: JSON format for flexible product specs
- **Inventory**: Stock quantity, lead time, availability
- **Features & Tags**: Comma-separated lists for easy management

### 3. **Analytics Dashboard**
- **Performance Metrics**: Views, orders, conversion rates
- **Business Statistics**: Rating, total orders, response time
- **Product Analytics**: Individual product performance

## 📊 API Endpoints

### Supplier Management
```typescript
// Update supplier profile
POST /api/suppliers/upsert
Body: {
  companyName: string,
  industry: string,
  businessType: string,
  website?: string,
  description: string,
  country: string,
  city: string,
  // ... other fields
}

// Get suppliers with filtering
GET /api/suppliers?search=electronics&industry=Electronics&country=China&sortBy=rating&page=1&limit=20
```

### Product Management
```typescript
// Create new product
POST /api/products/create
Body: {
  name: string,
  description: string,
  category: string,
  subcategory?: string,
  price: number,
  currency: string,
  minOrderQuantity: number,
  unit: string,
  specifications?: string, // JSON string
  features?: string, // comma-separated
  tags?: string, // comma-separated
  images?: string, // comma-separated URLs
  inStock?: boolean,
  stockQuantity?: number,
  leadTime?: string
}

// Get products with filtering
GET /api/products?search=headphones&category=Electronics&subcategory=Audio&sortBy=popular&page=1&limit=20
```

## 🎯 Data Insertion Workflow

### For Suppliers:

1. **Sign Up** as a supplier role
2. **Access Dashboard** at `/dashboard`
3. **Complete Profile** in the Profile tab
4. **Add Products** in the Products tab
5. **Monitor Performance** in the Analytics tab

### Profile Completion Process:
```
1. Company Information → Basic business details
2. Location & Contact → Address and communication
3. Business Details → Specialties and certifications
4. Order Settings → Minimum order requirements
5. Save Profile → Data stored in database
```

### Product Creation Process:
```
1. Basic Info → Name, description, category
2. Pricing → Price, currency, minimum order
3. Specifications → JSON format for flexibility
4. Features & Tags → Comma-separated lists
5. Inventory → Stock and lead time
6. Create Product → Added to catalog
```

## 🔍 Data Structure Examples

### Supplier Data Example:
```json
{
  "companyName": "GlobalTech Solutions",
  "industry": "Electronics",
  "businessType": "Manufacturer",
  "website": "https://globaltech.com",
  "description": "Leading manufacturer of electronic components...",
  "country": "China",
  "city": "Shenzhen",
  "specialties": ["Smartphones", "Tablets", "Wearables"],
  "certifications": ["ISO 9001", "CE", "FCC", "RoHS"],
  "businessInfo": {
    "annualRevenue": "$50M - $100M",
    "exportMarkets": ["North America", "Europe", "Asia Pacific"],
    "mainProducts": ["Consumer Electronics", "IoT Devices"]
  }
}
```

### Product Data Example:
```json
{
  "name": "Wireless Bluetooth Headphones",
  "description": "High-quality wireless headphones with noise cancellation",
  "category": "Electronics",
  "subcategory": "Audio",
  "price": 45.00,
  "currency": "USD",
  "minOrderQuantity": 100,
  "unit": "pieces",
  "specifications": {
    "material": "Plastic, Metal, Memory Foam",
    "color": "Black, White, Blue",
    "size": "20cm x 15cm x 8cm",
    "weight": "250g",
    "certification": "CE, FCC, RoHS"
  },
  "features": ["Noise Cancellation", "30h Battery", "Quick Charge"],
  "tags": ["wireless", "bluetooth", "premium", "audio"]
}
```

## 🛠️ Development Commands

```bash
# Database operations
npm run db:generate    # Generate Prisma client
npm run db:push        # Push schema to database
npm run db:migrate     # Create migration
npm run db:populate    # Populate with sample data

# Development
npm run dev           # Start development server
npm run build         # Build for production
npm run start         # Start production server
```

## 🔒 Security & Validation

### Data Validation:
- **Required Fields**: Company name, industry, country, city
- **Data Types**: Proper type checking for numbers, dates, arrays
- **JSON Validation**: Specifications must be valid JSON
- **Array Processing**: Comma-separated strings converted to arrays

### Access Control:
- **Authentication**: NextAuth.js session required
- **Authorization**: Supplier role required for data insertion
- **User Isolation**: Users can only modify their own data

## 📈 Performance Considerations

### Database Optimization:
- **Indexes**: Added on frequently queried fields
- **Pagination**: All list endpoints support pagination
- **Filtering**: Efficient WHERE clauses for search
- **Relations**: Proper foreign key relationships

### API Optimization:
- **Caching**: Consider Redis for frequently accessed data
- **Rate Limiting**: Implement API rate limiting
- **Validation**: Server-side validation for all inputs

## 🚨 Troubleshooting

### Common Issues:

1. **Database Connection Error**
   - Check DATABASE_URL in .env.local
   - Ensure PostgreSQL is running
   - Verify database exists

2. **Prisma Client Error**
   - Run `npm run db:generate`
   - Check schema syntax
   - Verify migrations

3. **Authentication Issues**
   - Check NEXTAUTH_SECRET
   - Verify session configuration
   - Ensure user role is "supplier"

4. **Data Insertion Fails**
   - Check required fields
   - Validate JSON format for specifications
   - Ensure user has supplier role

## 🔮 Future Enhancements

### Planned Features:
1. **Bulk Import**: CSV/Excel product import
2. **Image Upload**: Direct image upload to cloud storage
3. **Advanced Analytics**: Detailed performance metrics
4. **API Rate Limiting**: Protect against abuse
5. **Data Export**: Export supplier/product data
6. **Real-time Updates**: WebSocket for live data updates

---

**Note**: This database setup provides a solid foundation for a B2B marketplace with comprehensive supplier and product management capabilities. The system is designed to scale and can be easily extended with additional features as needed.
