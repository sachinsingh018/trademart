import { getRequestConfig } from 'next-intl/server';
import { headers } from 'next/headers';

// BRICS country language mappings
const countryToLocale: Record<string, string> = {
  'CN': 'zh', // China - Chinese
  'IN': 'en', // India - English
  'RU': 'ru', // Russia - Russian
  'BR': 'pt', // Brazil - Portuguese
  'ZA': 'en', // South Africa - English
};

export default getRequestConfig(async () => {
  // Get user's locale from headers or default to English
  const headersList = await headers();
  const acceptLanguage = headersList.get('accept-language') || 'en';
  
  // Extract primary language from accept-language header
  const primaryLanguage = acceptLanguage.split(',')[0].split('-')[0];
  
  // Map to supported locales: en (English), zh (Chinese), ru (Russian), pt (Portuguese)
  const supportedLocales = ['en', 'zh', 'ru', 'pt'];
  const locale = supportedLocales.includes(primaryLanguage) ? primaryLanguage : 'en';

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default
  };
});

