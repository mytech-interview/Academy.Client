import React from 'react';

interface SidebarItemProps {
  label: string;
  count?: number;
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
}

export default function SidebarItem({ label, count, active, onClick, icon }: SidebarItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition ${
        active
          ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-200'
          : 'text-slate-700 hover:bg-slate-50'
      }`}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <span className={active ? 'text-white' : 'text-slate-500'}>{icon}</span>
        <span className="truncate">{label}</span>
      </div>
      {count !== undefined && (
        <span
          className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-black shrink-0 ${
            active ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
}