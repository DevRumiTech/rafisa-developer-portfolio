export function normalizeLanguage(value) {
  return typeof value === 'string' && /^fr(?:-|$)/i.test(value.trim()) ? 'fr' : 'en';
}
