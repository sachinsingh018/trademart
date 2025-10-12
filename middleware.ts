import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  // A list of all locales that are supported
  locales: ['en', 'zh', 'ru', 'pt'],
 
  // Used when no locale matches
  defaultLocale: 'en',
  
  // Don't redirect if locale is in pathname
  localePrefix: 'as-needed'
});

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(zh|ru|pt|en)/:path*', '/((?!_next|_vercel|.*\\..*).*)']
};

