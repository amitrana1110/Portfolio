// A missing deployment URL keeps preview builds out of search indexes.
export function siteOrigin(value = process.env.NEXT_PUBLIC_SITE_URL) {
  if (!value) return null;
  const url = new URL(value);
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.pathname !== '/' || url.search || url.hash) {
    throw new Error('NEXT_PUBLIC_SITE_URL must be an HTTP(S) origin without a path or credentials.');
  }
  return url.origin;
}
export function isPublicOrigin(origin) {
  if (!origin) return false;
  const url = new URL(origin);
  return url.protocol === 'https:' && !['localhost', '127.0.0.1', '[::1]'].includes(url.hostname);
}
