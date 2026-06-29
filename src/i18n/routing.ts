import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'sv', 'fa'],
  defaultLocale: 'en',
  localePrefix: 'always'
});
