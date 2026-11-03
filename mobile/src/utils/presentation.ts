export function formatDate(value?: string | null): string {
  if (!value) return 'Não informado';
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  return match ? [match[3], match[2], match[1]].join('/') : 'Não informado';
}
export function getAge(value: string, today = new Date()): number | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value || '');
  if (!match) return null;
  const [, year, month, day] = match.map(Number);
  const birth = new Date(year, month - 1, day);
  if (birth.getFullYear() !== year || birth.getMonth() !== month - 1 || birth.getDate() !== day)
    return null;
  let age = today.getFullYear() - year;
  if (today.getMonth() < month - 1 || (today.getMonth() === month - 1 && today.getDate() < day))
    age--;
  return age >= 0 ? age : null;
}
export function normalizeSearch(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();
}
export function isValidScore(value: string): boolean {
  const input = value.trim();
  const score = Number(input);
  // Match the Integer type accepted by the API, without imposing a clinical scale.
  return (
    /^-?\d+$/.test(input) && Number.isInteger(score) && score >= -2147483648 && score <= 2147483647
  );
}
export function formatClock(seconds: number): string {
  const value = Math.max(0, Math.floor(seconds));
  return (
    Math.floor(value / 60)
      .toString()
      .padStart(2, '0') +
    ':' +
    (value % 60).toString().padStart(2, '0')
  );
}
