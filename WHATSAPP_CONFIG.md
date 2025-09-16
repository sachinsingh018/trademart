# 📱 WhatsApp Integration Configuration

## Environment Variables

Add these variables to your `.env.local` file to enable WhatsApp notifications:

```env
# WhatsApp Business API Configuration (optional)
WHATSAPP_ACCESS_TOKEN="your_access_token_here"
WHATSAPP_PHONE_NUMBER_ID="your_phone_number_id"
WHATSAPP_BUSINESS_ACCOUNT_ID="your_business_account_id"
WHATSAPP_VERIFY_TOKEN="your_webhook_verify_token"
WHATSAPP_WEBHOOK_URL="http://localhost:3000/api/whatsapp/webhook"
```

## Development Mode

If no WhatsApp credentials are provided, the system will run in **development mode** and log mock notifications to the console instead of sending real WhatsApp messages.

## Production Setup

1. **Get WhatsApp Business API Access**
   - Go to [business.whatsapp.com](https://business.whatsapp.com)
   - Create a business account
   - Apply for WhatsApp Business API access

2. **Configure Webhook**
   - Set webhook URL: `https://yourdomain.com/api/whatsapp/webhook`
   - Use the verify token from your environment variables

3. **Message Templates**
   - Create approved templates in WhatsApp Business Manager:
     - `rfq_notification` - For RFQ notifications
     - `quote_received` - For quote notifications
     - `welcome_message` - For welcome messages
     - `order_update` - For order updates

## Features

✅ **Automatic RFQ Notifications** - Suppliers get notified when relevant RFQs are created
✅ **Quote Notifications** - Buyers get notified when quotes are submitted
✅ **Welcome Messages** - New users receive welcome messages
✅ **Custom Messages** - Send custom WhatsApp messages
✅ **Webhook Support** - Handle message status updates and incoming messages
✅ **Development Mode** - Mock notifications for testing
✅ **Error Handling** - Graceful fallback if WhatsApp fails

## API Endpoints

- `POST /api/whatsapp/send-notification` - Send RFQ notifications
- `POST /api/whatsapp/send-quote-notification` - Send quote notifications
- `POST /api/whatsapp/send-welcome` - Send welcome messages
- `POST /api/whatsapp/send-message` - Send custom messages
- `POST /api/whatsapp/webhook` - Handle webhook events
- `GET /api/whatsapp/webhook` - Webhook verification

## Usage

The WhatsApp integration is automatically triggered when:
- RFQs are created (notifies relevant suppliers)
- Quotes are submitted (notifies buyers)
- Users register (sends welcome message)

You can also manually send notifications using the WhatsApp notification component or API endpoints.
