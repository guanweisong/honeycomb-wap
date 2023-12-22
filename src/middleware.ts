import createMiddleware from 'next-intl/middleware';
import { defaultLocale, localePrefix, locales, pathnames } from '@/src/navigation';

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix,
  pathnames,
});

export const config = {
  matcher: ['/', `/(en|zh)/:path*`, '/((?!_next|_vercel|.*\\..*).*)'],
};
