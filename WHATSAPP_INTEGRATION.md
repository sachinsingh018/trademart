# 📱 WhatsApp Business API Integration Guide

This guide explains how to integrate WhatsApp Business API with TradeMart for sending RFQ notifications to suppliers.

## 🎯 Overview

The WhatsApp integration allows TradeMart to:
- **Send RFQ notifications** to suppliers instantly
- **Notify about new quotes** to buyers
- **Send order updates** and status changes
- **Provide customer support** via WhatsApp

## 🔧 Setup Instructions

### Step 1: WhatsApp Business Account Setup

1. **Create WhatsApp Business Account**
   - Go to [business.whatsapp.com](https://business.whatsapp.com)
   - Create a business account
   - Verify your business phone number

2. **Get WhatsApp Business API Access**
   - Apply for WhatsApp Business API access
   - Choose between:
     - **WhatsApp Business API** (Official, requires approval)
     - **WhatsApp Business Platform** (Meta's cloud solution)
     - **Third-party providers** (Twilio, MessageBird, etc.)

### Step 2: Environment Variables

Add these to your `.env.local` file:

```env
# WhatsApp Business API Configuration
WHATSAPP_ACCESS_TOKEN=your_access_token_here
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
WHATSAPP_BUSINESS_ACCOUNT_ID=your_business_account_id
WHATSAPP_VERIFY_TOKEN=your_webhook_verify_token
WHATSAPP_WEBHOOK_URL=https://yourdomain.com/api/whatsapp/webhook

# Optional: Third-party provider (if using Twilio, etc.)
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
```

### Step 3: Install Dependencies

```bash
# For WhatsApp Business API
npm install axios

# For Twilio (alternative)
npm install twilio

# For WhatsApp Web.js (development only)
npm install whatsapp-web.js
```

## 📋 API Implementation

### 1. Send RFQ Notification

```typescript
// app/api/whatsapp/send-notification/route.ts
export async function POST(request: NextRequest) {
  const { quoteId, supplierPhone, rfqTitle, buyerCompany } = await request.json();
  
  const message = {
    messaging_product: "whatsapp",
    to: supplierPhone,
    type: "template",
    template: {
      name: "rfq_notification",
      language: { code: "en" },
      components: [
        {
          type: "body",
          parameters: [
            { type: "text", text: rfqTitle },
            { type: "text", text: buyerCompany }
          ]
        }
      ]
    }
  };

  const response = await fetch(`https://graph.facebook.com/v18.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message)
  });

  return NextResponse.json(await response.json());
}
```

### 2. Message Templates

Create approved message templates in WhatsApp Business Manager:

#### RFQ Notification Template
```
*New RFQ Available!* 🚀

RFQ: {{1}}
Buyer: {{2}}

View details and submit your quote:
{{3}}

TradeMart - Your B2B Marketplace
```

#### Quote Received Template
```
*Quote Received!* 💰

You have received a new quote for:
{{1}}

Quote Amount: {{2}}
Supplier: {{3}}

View quote details:
{{4}}

TradeMart - Your B2B Marketplace
```

### 3. Webhook Handler

```typescript
// app/api/whatsapp/webhook/route.ts
export async function POST(request: NextRequest) {
  const body = await request.json();
  
  // Handle message status updates
  if (body.entry?.[0]?.changes?.[0]?.value?.statuses) {
    const statuses = body.entry[0].changes[0].value.statuses;
    
    for (const status of statuses) {
      console.log(`Message ${status.id} status: ${status.status}`);
      
      // Update message status in database
      await updateMessageStatus(status.id, status.status);
    }
  }
  
  // Handle incoming messages
  if (body.entry?.[0]?.changes?.[0]?.value?.messages) {
    const messages = body.entry[0].changes[0].value.messages;
    
    for (const message of messages) {
      await handleIncomingMessage(message);
    }
  }
  
  return NextResponse.json({ status: "ok" });
}
```

## 🎨 Frontend Integration

### 1. Send WhatsApp Notification Button

```typescript
const sendWhatsAppNotification = async (quoteId: string) => {
  try {
    const response = await fetch('/api/whatsapp/send-notification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        quoteId,
        supplierPhone: supplier.phone,
        rfqTitle: rfq.title,
        buyerCompany: rfq.buyer.company
      })
    });
    
    if (response.ok) {
      setWhatsappSent(true);
      toast.success('WhatsApp notification sent!');
    }
  } catch (error) {
    toast.error('Failed to send notification');
  }
};
```

### 2. WhatsApp Status Indicators

```typescript
// Show WhatsApp status in quote cards
{quote.whatsappSent && (
  <Badge variant="outline" className="border-green-200 text-green-800">
    📱 WhatsApp Sent
  </Badge>
)}
```

## 🔄 Workflow Integration

### 1. RFQ Creation Flow
```
1. Buyer creates RFQ
2. System identifies relevant suppliers
3. Send WhatsApp notifications to suppliers
4. Track notification status
5. Allow suppliers to respond via WhatsApp or web
```

### 2. Quote Submission Flow
```
1. Supplier submits quote
2. Send WhatsApp notification to buyer
3. Buyer can respond via WhatsApp
4. Track conversation status
```

### 3. Order Management Flow
```
1. Order placed
2. Send WhatsApp updates to both parties
3. Track delivery status
4. Handle disputes via WhatsApp
```

## 📊 Analytics & Tracking

### 1. Message Metrics
- **Delivery rate**: % of messages delivered
- **Read rate**: % of messages read
- **Response rate**: % of messages responded to
- **Conversion rate**: % leading to quotes/orders

### 2. Performance Tracking
```typescript
interface WhatsAppMetrics {
  messageId: string;
  recipient: string;
  status: 'sent' | 'delivered' | 'read' | 'failed';
  timestamp: string;
  responseTime?: number;
  conversionRate?: number;
}
```

## 🚨 Error Handling

### 1. Common Issues
- **Invalid phone numbers**: Validate phone format
- **Rate limiting**: Implement retry logic
- **Template approval**: Use approved templates only
- **Webhook verification**: Proper token validation

### 2. Fallback Options
```typescript
const sendNotification = async (phone: string, message: string) => {
  try {
    // Try WhatsApp first
    await sendWhatsAppMessage(phone, message);
  } catch (error) {
    // Fallback to email
    await sendEmailNotification(phone, message);
    console.log('WhatsApp failed, sent email instead');
  }
};
```

## 💰 Cost Considerations

### WhatsApp Business API Pricing
- **Free tier**: 1,000 messages/month
- **Paid tier**: ~$0.005-0.05 per message
- **Template messages**: Usually cheaper than session messages

### Optimization Strategies
- **Batch notifications**: Send multiple messages together
- **Smart timing**: Send during business hours
- **Template reuse**: Use approved templates efficiently
- **User preferences**: Allow users to opt-out

## 🔒 Security & Compliance

### 1. Data Protection
- **Encrypt phone numbers** in database
- **Secure webhook endpoints** with verification
- **Rate limiting** to prevent abuse
- **GDPR compliance** for EU users

### 2. Message Content
- **No sensitive data** in messages
- **Use templates** for consistent messaging
- **Include opt-out** instructions
- **Respect user preferences**

## 🧪 Testing

### 1. Development Testing
```typescript
// Use WhatsApp Business API test numbers
const TEST_PHONE = "+14155238886"; // Twilio test number

// Mock responses for development
const mockWhatsAppResponse = {
  success: true,
  messageId: `msg_${Date.now()}`,
  status: "sent"
};
```

### 2. Production Testing
- **Test with real numbers** (your own)
- **Verify webhook** functionality
- **Test template** rendering
- **Monitor delivery** rates

## 📞 Support & Troubleshooting

### Common Issues
1. **Messages not sending**: Check access token and phone number ID
2. **Webhook not receiving**: Verify webhook URL and token
3. **Template errors**: Ensure template is approved and parameters match
4. **Rate limiting**: Implement exponential backoff

### Debug Mode
```env
DEBUG_WHATSAPP=true
WHATSAPP_LOG_LEVEL=debug
```

## 🔮 Future Enhancements

### Planned Features
1. **Chatbot integration**: Automated responses
2. **Rich media**: Images, documents, location
3. **Payment integration**: WhatsApp Pay
4. **Multi-language**: Support for multiple languages
5. **Analytics dashboard**: Detailed metrics

### Advanced Features
1. **AI-powered responses**: Smart message suggestions
2. **Voice messages**: Audio support
3. **Video calls**: Integrated calling
4. **Group messaging**: Multi-party conversations

---

**Note**: This integration is designed to be easily toggleable between development (mock) and production (real API) modes. Simply comment/uncomment the relevant code sections and update environment variables.
