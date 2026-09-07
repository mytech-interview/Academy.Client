// lib/avatars.ts
export const AVATAR_OPTIONS = Array.from({ length: 30 }, (_, i) => ({
  seed: String(i + 1),
  bg: '', 
  label: `Avatar ${i + 1}`,
}));

export const avatarUrl = (seed: string, _bg?: string) => {
  const n = Number(seed);
  const ext = n <= 12 ? 'png' : 'svg';
  return `https://academy.tech-interview.com/images/avatars/avatar${seed}.${ext}`;
};