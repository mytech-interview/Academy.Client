export interface AvatarOption {
  id: string;
  name: string;
  category: 'robot' | 'abstract' | 'tech' | 'geometry';
  url: string;
}

export const ABSTRACT_AVATARS: AvatarOption[] = [
  {
    id: 'av-1',
    name: 'Cyber Bot Alpha',
    category: 'robot',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=CyberBotAlpha&backgroundColor=6366f1'
  },
  {
    id: 'av-2',
    name: 'Emerald Code Bot',
    category: 'robot',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=EmeraldCode&backgroundColor=10b981'
  },
  {
    id: 'av-3',
    name: 'Purple AI Core',
    category: 'robot',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=PurpleAICore&backgroundColor=8b5cf6'
  },
  {
    id: 'av-4',
    name: 'Teal Cyber Pulse',
    category: 'robot',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=TealPulse&backgroundColor=14b8a6'
  },
  {
    id: 'av-5',
    name: 'Spark Violet Robot',
    category: 'robot',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=SparkViolet&backgroundColor=a855f7'
  },
  {
    id: 'av-6',
    name: 'Rose Zen Bot',
    category: 'robot',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=RoseZen&backgroundColor=e11d48'
  },
  {
    id: 'av-7',
    name: 'Neon Pink Sphere',
    category: 'geometry',
    url: 'https://api.dicebear.com/7.x/shapes/svg?seed=NeonSphere&backgroundColor=ec4899'
  },
  {
    id: 'av-8',
    name: 'Cosmic Blue Waves',
    category: 'geometry',
    url: 'https://api.dicebear.com/7.x/shapes/svg?seed=CosmicWaves&backgroundColor=3b82f6'
  },
  {
    id: 'av-9',
    name: 'Magenta Prism Wave',
    category: 'geometry',
    url: 'https://api.dicebear.com/7.x/shapes/svg?seed=PrismWave&backgroundColor=d946ef'
  },
  {
    id: 'av-10',
    name: 'Solar Orange Emblem',
    category: 'geometry',
    url: 'https://api.dicebear.com/7.x/shapes/svg?seed=SolarFlare&backgroundColor=ea580c'
  },
  {
    id: 'av-11',
    name: 'Quantum Matrix',
    category: 'abstract',
    url: 'https://api.dicebear.com/7.x/identicon/svg?seed=MatrixCube&backgroundColor=0284c7'
  },
  {
    id: 'av-12',
    name: 'Ruby Shield Nova',
    category: 'abstract',
    url: 'https://api.dicebear.com/7.x/identicon/svg?seed=ShieldNova&backgroundColor=f43f5e'
  },
  {
    id: 'av-13',
    name: 'Indigo Orion Emblem',
    category: 'abstract',
    url: 'https://api.dicebear.com/7.x/identicon/svg?seed=EchoOrion&backgroundColor=4f46e5'
  },
  {
    id: 'av-14',
    name: 'Creative Gear Icon',
    category: 'tech',
    url: 'https://api.dicebear.com/7.x/icons/svg?seed=DesignLogic&backgroundColor=f59e0b'
  },
  {
    id: 'av-15',
    name: 'Cyan Node Avatar',
    category: 'tech',
    url: 'https://api.dicebear.com/7.x/icons/svg?seed=VortexNode&backgroundColor=06b6d4'
  },
  {
    id: 'av-16',
    name: 'Gold Star Mind',
    category: 'tech',
    url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=StarMind&backgroundColor=fbbf24'
  },
  {
    id: 'av-17',
    name: 'Slate Core Robot',
    category: 'robot',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=SlateCore&backgroundColor=475569'
  },
  {
    id: 'av-18',
    name: 'Forest Tech Gear',
    category: 'tech',
    url: 'https://api.dicebear.com/7.x/icons/svg?seed=HyperDrive&backgroundColor=16a34a'
  }
];

export const AVATAR_PRESETS = ABSTRACT_AVATARS.map(a => a.url);
