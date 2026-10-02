export const MAX_BODY_BYTES = 16000;
export const CONTACT_TYPES = ['Project enquiry', 'Career opportunity', 'General conversation'];
export async function readContactBody(request) {
  if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json')) {
    throw Object.assign(new Error('Please send JSON.'), { status: 415 });
  }
  if (Number(request.headers.get('content-length')) > MAX_BODY_BYTES) {
    throw Object.assign(new Error('Message is too large.'), { status: 413 });
  }
  const reader = request.body?.getReader();
  if (!reader) throw Object.assign(new Error('Invalid request.'), { status: 400 });
  const chunks = [];
  let size = 0;
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BODY_BYTES) {
        await reader.cancel();
        throw Object.assign(new Error('Message is too large.'), { status: 413 });
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
  try { return JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes)); }
  catch { throw Object.assign(new Error('Invalid request.'), { status: 400 }); }
}
export function validateContact(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data) || data.website) return null;
  const { name, email, message, type } = data;
  if (typeof name !== 'string' || !name.trim() || name.length > 100 || /[\r\n\x00]/.test(name) ||
      typeof email !== 'string' || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      typeof message !== 'string' || message.trim().length < 10 || message.length > 5000 ||
      !CONTACT_TYPES.includes(type)) return null;
  return { name: name.trim(), email, message: message.trim(), type };
}
// Bounded process-local backstop. Hosting must apply a shared limit across replicas.
const buckets = new Map();
const WINDOW_MS = 10 * 60 * 1000;
export function contactRateLimit(key, now = Date.now()) {
  for (const [id, bucket] of buckets) if (bucket.expires <= now) buckets.delete(id);
  let bucket = buckets.get(key);
  if (!bucket) {
    if (buckets.size >= 10000) return 60;
    bucket = { count: 0, expires: now + WINDOW_MS };
    buckets.set(key, bucket);
  }
  bucket.count++;
  return bucket.count > 5 ? Math.ceil((bucket.expires - now) / 1000) : 0;
}
