export function getBase(): string {
  const b = import.meta.env.BASE_URL;
  return b.endsWith('/') ? b : b + '/';
}
