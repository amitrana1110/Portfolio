import { siteOrigin, isPublicOrigin } from '@/lib/site-url';
export default function robots() {
  const origin = siteOrigin();
  if (!isPublicOrigin(origin)) return { rules: { userAgent: '*', disallow: '/' } };
  return { rules: { userAgent: '*', allow: '/', disallow: '/api/' }, sitemap: new URL('/sitemap.xml', origin).href };
}
