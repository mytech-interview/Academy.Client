// lib/avatars.ts
export interface AvatarOption {
  seed: string;
  label: string;
  bg: string; // hex без #
}

export const AVATAR_OPTIONS: AvatarOption[] = [
  { seed: 'CyberBotAlpha', label: 'Cyber Bot Alpha', bg: '6366f1' },
  { seed: 'GreenBotBeta',  label: 'Green Bot Beta',  bg: '10b981' },
  { seed: 'PurpleHat',     label: 'Purple Hat',      bg: '8b5cf6' },
  { seed: 'TealSmile',     label: 'Teal Smile',      bg: '14b8a6' },
  { seed: 'VioletFace',    label: 'Violet Face',     bg: 'a855f7' },
  { seed: 'RedBot',        label: 'Red Bot',         bg: 'ef4444' },
  { seed: 'PinkGeo',       label: 'Pink Geo',        bg: 'ec4899' },
  { seed: 'BlueGeo',       label: 'Blue Geo',        bg: '3b82f6' },
  { seed: 'DarkDiamond',   label: 'Dark Diamond',    bg: '1e293b' },
  { seed: 'OrangeTri',     label: 'Orange Tri',      bg: 'f97316' },
  { seed: 'OrangeFox',     label: 'Orange Fox',      bg: 'fb923c' },
  { seed: 'RedGift',       label: 'Red Gift',        bg: 'dc2626' },
  { seed: 'GrayPixel',     label: 'Gray Pixel',      bg: '64748b' },
  { seed: 'YellowBell',    label: 'Yellow Bell',     bg: 'eab308' },
  { seed: 'CyanArchive',   label: 'Cyan Archive',    bg: '06b6d4' },
  { seed: 'CoolShades',    label: 'Cool Shades',     bg: 'facc15' },
  { seed: 'NightBot',      label: 'Night Bot',       bg: '0f172a' },
  { seed: 'GreenChart',    label: 'Green Chart',     bg: '22c55e' },
];

export function avatarUrl(seed: string, bg: string) {
  return `https://api.dicebear.com/7.x/bottts/svg?seed=${seed}&backgroundColor=${bg}`;
}