import React from 'react';

export function LogoIcon({ className = 'h-8 w-8' }: { className?: string }) {
  return (
    <img 
      src="https://optim.tildacdn.net/tild6335-3931-4163-b337-663330333730/-/resize/38x/-/format/webp/Vector_2.png.webp" 
      alt="GeoAlpha Logo" 
      className={className} 
    />
  );
}

interface BrandLogoProps {
  className?: string;
  onTabChange?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export default function BrandLogo({ className = '', onTabChange, size = 'md' }: BrandLogoProps) {
  const iconSize = size === 'sm' ? 'h-7 w-7' : size === 'lg' ? 'h-16 w-16' : 'h-8.5 w-8.5 sm:h-11 sm:w-11';
  const titleSize = size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-3xl' : 'text-base sm:text-xl md:text-2xl';
  const subtitleSize = size === 'sm' ? 'text-[9px]' : size === 'lg' ? 'text-xs' : 'text-[8px] sm:text-[10px] md:text-[11px]';

  return (
    <div
      onClick={onTabChange}
      className={`flex items-center gap-2 sm:gap-3.5 cursor-pointer group select-none ${className}`}
    >
      {/* Icon with hover effect */}
      <div className="relative shrink-0">
        <LogoIcon className={`${iconSize} transition-all duration-500 ease-out group-hover:scale-110`} />
        <div className="absolute inset-0 bg-blue-500/10 rounded-full filter blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      </div>

      {/* Text Branding */}
      <div className="text-left flex flex-col justify-center leading-none">
        <div className="flex items-baseline font-sans">
          <span className={`${titleSize} font-black tracking-tight leading-none text-slate-900 select-none`}>
            <span className="text-blue-600 font-extrabold font-sans">Geo</span>
            <span className="text-slate-900 font-black font-sans tracking-tight">Alpha</span>
          </span>
        </div>
        <span className={`${subtitleSize} font-bold text-blue-600 tracking-[0.28em] block mt-1.5 leading-none font-sans lowercase`}>
          academy
        </span>
      </div>
    </div>
  );
}