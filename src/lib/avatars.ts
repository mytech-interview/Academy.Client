// lib/avatars.ts
export const AVATAR_OPTIONS = Array.from({ length: 18 }, (_, i) => ({
  seed: String(i + 1),
  bg: '', // больше не используется, оставлено для совместимости типов
  label: `Avatar ${i + 1}`,
}));

export const avatarUrl = (seed: string, _bg?: string) =>
  `https://academy.tech-interview.com/images/avatars/avatar${seed}.svg`;