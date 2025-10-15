# Internationalization (i18n) Usage Guide

## Overview
TradePanda now supports automatic language detection and translation for BRICS countries:
- 🇨🇳 **China** - Chinese (Simplified) - `zh`
- 🇮🇳 **India** - English - `en`
- 🇷🇺 **Russia** - Russian - `ru`
- 🇧🇷 **Brazil** - Portuguese - `pt`
- 🇿🇦 **South Africa** - English - `en`

The platform automatically detects the user's browser language and displays content in their preferred language.

## How It Works

### 1. Automatic Detection
The system uses the browser's `Accept-Language` header to detect the user's preferred language.

### 2. Supported Languages
- **English (en)** - Default language for India, South Africa, and other countries
- **Chinese (zh)** - For users in China
- **Russian (ru)** - For users in Russia
- **Portuguese (pt)** - For users in Brazil

### 3. Translation Files
All translations are stored in `/messages/` directory:
- `en.json` - English translations
- `zh.json` - Chinese translations
- `ru.json` - Russian translations
- `pt.json` - Portuguese translations

## Using Translations in Components

### Client Components
```tsx
'use client';
import { useTranslations } from 'next-intl';

export default function MyComponent() {
  const t = useTranslations('home');
  
  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('subtitle')}</p>
    </div>
  );
}
```

### Server Components
```tsx
import { useTranslations } from 'next-intl';

export default async function MyServerComponent() {
  const t = await useTranslations('home');
  
  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('subtitle')}</p>
    </div>
  );
}
```

## Adding New Translations

### 1. Add to Translation Files
Edit each language file in `/messages/`:

**en.json**:
```json
{
  "mySection": {
    "myKey": "My English Text"
  }
}
```

**zh.json**:
```json
{
  "mySection": {
    "myKey": "我的中文文本"
  }
}
```

**ru.json**:
```json
{
  "mySection": {
    "myKey": "Мой русский текст"
  }
}
```

**pt.json**:
```json
{
  "mySection": {
    "myKey": "Meu texto em português"
  }
}
```

### 2. Use in Component
```tsx
const t = useTranslations('mySection');
return <p>{t('myKey')}</p>;
```

## Testing Different Languages

### 1. Change Browser Language
Change your browser's language settings to test different languages:
- Chrome: Settings → Languages
- Firefox: Preferences → Language
- Safari: Preferences → General → Language

### 2. Use URL Parameters (Development)
You can force a specific language by adding it to the URL:
- `/en/` - English
- `/zh/` - Chinese
- `/ru/` - Russian
- `/pt/` - Portuguese

### 3. Use Browser DevTools
1. Open DevTools (F12)
2. Go to Network tab
3. In the Request Headers, look for `Accept-Language`
4. Some browsers allow you to override this

## Current Translations

### Navbar
- Suppliers, Products, Services, RFQs, Business Loans
- Dashboard, Sign In, Sign Out, Start Free

### Homepage
- Title, subtitle, search placeholder
- Featured products and suppliers sections
- Call-to-action buttons
- Statistics (Verified Suppliers, Products, Orders, Countries)

### Footer
- About Us, Quick Links, Support, Legal
- Copyright notice

## Best Practices

1. **Keep keys consistent** across all language files
2. **Use namespaces** to organize translations (e.g., 'nav', 'home', 'footer')
3. **Add placeholder support** for dynamic content:
   ```json
   {
     "greeting": "Hello, {name}!"
   }
   ```
   Usage:
   ```tsx
   t('greeting', { name: userName })
   ```

4. **Handle plurals** properly:
   ```json
   {
     "items": "{count, plural, =0 {no items} one {# item} other {# items}}"
   }
   ```

5. **Test all languages** before deploying

## Deployment Notes

- The middleware automatically handles locale detection
- No additional configuration needed for Vercel deployment
- All translation files are bundled with the application
- SEO-friendly with proper `lang` attributes

## Future Enhancements

- [ ] Add more languages (Arabic, Hindi, Spanish, etc.)
- [ ] User language preferences in profile
- [ ] Language switcher in UI
- [ ] RTL (Right-to-Left) support for Arabic
- [ ] Professional translation review
- [ ] Dynamic content translation (products, descriptions, etc.)

