import React from 'react';

export function LogoIcon({ className = 'h-8 w-8' }: { className?: string }) {
  return (
    // <svg
    //   className={className}
    //   viewBox="0 0 120 120"
    //   fill="none"
    //   xmlns="http://www.w3.org/2000/svg"
    // >
    //   <defs>
    //     {/* CSS Embedded Animations for High-Fidelity Interactive Motion */}
    //     <style>{`
    //       @keyframes rotate-clockwise {
    //         0% { transform: rotate(0deg); }
    //         100% { transform: rotate(360deg); }
    //       }
    //       @keyframes rotate-counter-clockwise {
    //         0% { transform: rotate(0deg); }
    //         100% { transform: rotate(-360deg); }
    //       }
    //       @keyframes float-g {
    //         0%, 100% { transform: translateY(0px) scale(1); }
    //         50% { transform: translateY(-4px) scale(1.03); }
    //       }
    //       @keyframes glow-pulse {
    //         0%, 100% { opacity: 0.8; filter: drop-shadow(0 0 2px rgba(37, 99, 235, 0.4)); }
    //         50% { opacity: 1; filter: drop-shadow(0 0 8px rgba(59, 130, 246, 0.7)); }
    //       }
    //       @keyframes dash-sweep {
    //         0% { stroke-dashoffset: 240; }
    //         50% { stroke-dashoffset: 0; }
    //         100% { stroke-dashoffset: -240; }
    //       }
          
    //       .anim-rotate-slow {
    //         animation: rotate-clockwise 15s linear infinite;
    //         transform-origin: 60px 60px;
    //       }
    //       .anim-rotate-fast {
    //         animation: rotate-clockwise 3.5s linear infinite;
    //         transform-origin: 60px 60px;
    //       }
    //       .anim-rotate-counter {
    //         animation: rotate-counter-clockwise 8s linear infinite;
    //         transform-origin: 60px 60px;
    //       }
    //       .anim-float-g {
    //         animation: float-g 3s ease-in-out infinite;
    //         transform-origin: 60px 60px;
    //       }
    //       .anim-glow-g {
    //         animation: glow-pulse 3s ease-in-out infinite;
    //       }
    //       .anim-dash {
    //         stroke-dasharray: 120 120;
    //         animation: dash-sweep 6s linear infinite;
    //       }
    //     `}</style>

    //     {/* Premium Royal Blue Gradients */}
    //     <linearGradient id="g-grad-main" x1="0%" y1="0%" x2="100%" y2="100%">
    //       <stop offset="0%" stopColor="#2563eb" /> {/* Vibrant Blue 600 */}
    //       <stop offset="40%" stopColor="#3b82f6" /> {/* Bright Blue 500 */}
    //       <stop offset="100%" stopColor="#1d4ed8" /> {/* Deep Royal Blue 700 */}
    //     </linearGradient>

    //     <linearGradient id="g-grad-accent" x1="100%" y1="0%" x2="0%" y2="100%">
    //       <stop offset="0%" stopColor="#06b6d4" /> {/* Cyan 500 */}
    //       <stop offset="50%" stopColor="#3b82f6" /> {/* Blue 500 */}
    //       <stop offset="100%" stopColor="#1d4ed8" /> {/* Blue 700 */}
    //     </linearGradient>

    //     <radialGradient id="g-glow" cx="50%" cy="50%" r="50%">
    //       <stop offset="0%" stopColor="#2563eb" stopOpacity="0.4" />
    //       <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
    //     </radialGradient>

    //     {/* High-Fidelity Glow & Shadow Filter */}
    //     <filter id="logo-glow-shadow" x="-30%" y="-30%" width="160%" height="160%">
    //       <feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="#2563eb" floodOpacity="0.35" />
    //       <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#06b6d4" floodOpacity="0.2" />
    //     </filter>
    //   </defs>

    //   {/* Ambient Radial Backdrop Glow */}
    //   <circle cx="60" cy="60" r="50" fill="url(#g-glow)" className="anim-glow-g" />

    //   <g filter="url(#logo-glow-shadow)">
    //     {/* Outer Tech Orbit Track - Rotating slowly counter-clockwise */}
    //     <circle
    //       cx="60"
    //       cy="60"
    //       r="48"
    //       stroke="#2563eb"
    //       strokeWidth="1.5"
    //       strokeOpacity="0.2"
    //       strokeDasharray="6 8"
    //       className="anim-rotate-slow"
    //       style={{ animationDirection: 'reverse' }}
    //     />

    //     {/* Futuristic Inner Tech Ring with dynamic sweeping dashed animation */}
    //     <circle
    //       cx="60"
    //       cy="60"
    //       r="42"
    //       stroke="url(#g-grad-accent)"
    //       strokeWidth="2.5"
    //       strokeOpacity="0.8"
    //       strokeLinecap="round"
    //       className="anim-dash"
    //     />

    //     {/* Outer Segmented Ring rotating counter-clockwise */}
    //     <circle
    //       cx="60"
    //       cy="60"
    //       r="36"
    //       stroke="#06b6d4"
    //       strokeWidth="1.5"
    //       strokeOpacity="0.4"
    //       strokeDasharray="15 45 30 30"
    //       className="anim-rotate-counter"
    //     />

    //     {/* Master Stylized Blue "G" Lettermark with float animation */}
    //     <g className="anim-float-g">
    //       {/* Inner Glow Behind the "G" for volumetric depth */}
    //       <path
    //         d="M 86 44 C 80 33, 69 28, 58 28 C 40 28, 28 42, 28 60 C 28 78, 40 92, 58 92 C 76 92, 88 78, 88 60 L 58 60"
    //         stroke="#3b82f6"
    //         strokeWidth="15"
    //         strokeLinecap="round"
    //         strokeLinejoin="round"
    //         strokeOpacity="0.15"
    //         fill="none"
    //       />

    //       {/* Core G Lettermark */}
    //       <path
    //         d="M 86 44 C 80 33, 69 28, 58 28 C 40 28, 28 42, 28 60 C 28 78, 40 92, 58 92 C 76 92, 88 78, 88 60 L 58 60"
    //         stroke="url(#g-grad-main)"
    //         strokeWidth="11"
    //         strokeLinecap="round"
    //         strokeLinejoin="round"
    //         fill="none"
    //       />

    //       {/* Futuristic Tech Overlay / Alpha Symbol Core inside */}
    //       <path
    //         d="M 52 50 C 47 45, 42 45, 38 50 C 34 55, 34 65, 38 70 C 42 75, 47 75, 52 70 C 58 63, 62 55, 68 50"
    //         stroke="#06b6d4"
    //         strokeWidth="3.5"
    //         strokeLinecap="round"
    //         strokeOpacity="0.95"
    //         fill="none"
    //       />

    //       {/* Tech Accent Dot inside the "G" for extra depth */}
    //       <circle cx="58" cy="60" r="4.5" fill="#ffffff" opacity="0.95" />
    //       <circle cx="58" cy="60" r="7" stroke="#06b6d4" strokeWidth="1" strokeOpacity="0.6" fill="none" />
    //     </g>

    //     {/* Rotating Active Satellite Orb revolving on the outer orbit track */}
    //     <g className="anim-rotate-fast">
    //       <circle cx="60" cy="12" r="5" fill="#ffffff" />
    //       <circle cx="60" cy="12" r="8.5" stroke="#06b6d4" strokeWidth="2" strokeOpacity="0.9" fill="none" />
    //     </g>
    //   </g>
    // </svg>
    <>
    <img src="https://optim.tildacdn.net/tild6335-3931-4163-b337-663330333730/-/resize/38x/-/format/webp/Vector_2.png.webp" alt="GeoAlpha Logo" className={className} />
    </>
  );
}

interface BrandLogoProps {
  className?: string;
  onTabChange?: () => void;
  size?: 'sm' | 'md' | 'lg';
  lang?: string;
}

export default function BrandLogo({ className = '', onTabChange, size = 'md', lang = 'ka' }: BrandLogoProps) {
  const iconSize = size === 'sm' ? 'h-7 w-7' : size === 'lg' ? 'h-16 w-16' : 'h-8.5 w-8.5 sm:h-11 sm:w-11';
  const titleSize = size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-3xl' : 'text-base sm:text-xl md:text-2xl';
  const subtitleSize = size === 'sm' ? 'text-[9px]' : size === 'lg' ? 'text-xs' : 'text-[8px] sm:text-[10px] md:text-[11px]';

  return (
    <div
      onClick={onTabChange}
      className={`flex items-center gap-2 sm:gap-3.5 cursor-pointer group select-none ${className}`}
    >
      {/* Icon with beautiful interactive rotation & scaling */}
      <div className="relative shrink-0">
        <LogoIcon className={`${iconSize} transition-all duration-500 ease-out group-hover:scale-110`} />
        {/* Soft back-shadow on hover */}
        <div className="absolute inset-0 bg-blue-500/10 rounded-full filter blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      </div>

      {/* Text Branding - Absolute high-contrast & high-readability */}
      <div className="text-left flex flex-col justify-center leading-none">
        <div className="flex items-baseline font-sans">
          <span className={`${titleSize} font-black tracking-tight leading-none text-slate-900 select-none`}>
            <span className="text-blue-600 font-extrabold font-sans">Geo</span>
            <span className="text-slate-900 font-black font-sans tracking-tight">Alpha</span>
          </span>
        </div>
        {/* Brand Subtitle ALWAYS displays academy with generous futuristic tracking */}
        <span className={`${subtitleSize} font-bold text-blue-600 tracking-[0.28em] block mt-1.5 leading-none font-sans lowercase`}>
          academy
        </span>
      </div>
    </div>
  );
}
