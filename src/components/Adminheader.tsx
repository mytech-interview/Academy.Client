import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface AdminHeaderProps {
  adminName?: string;
  adminEmail?: string;
}

export default function AdminHeader({ adminName, adminEmail }: AdminHeaderProps) {
  return (
    <div className="bg-[#111328] text-white py-8 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-purple-900/60 border border-purple-500/30 flex items-center justify-center text-purple-300 shrink-0">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <span className="text-[11px] font-bold tracking-wider uppercase bg-purple-900/80 text-purple-300 px-2.5 py-0.5 rounded-md border border-purple-700/50 inline-block mb-1">
              👑 ადმინისტრაციის პანელი
            </span>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight">
              ადმინისტრატორის მართვის ცენტრი
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              მართეთ კურსები, სესიები, ლექტორები, სტუდენტები, მომხმარებელთა ბაზა და საიტის ტექსტები
            </p>
          </div>
        </div>

        <div className="bg-[#1a1d36] border border-slate-700/50 rounded-2xl p-3 flex items-center gap-3 w-full md:w-auto shrink-0">
          <div className="w-10 h-10 rounded-xl bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-xl">
            🤖
          </div>
          <div className="text-xs">
            <p className="font-bold text-slate-200">
              {adminName || 'ადმინისტრატორი'}{' '}
              <span className="bg-purple-600 text-white text-[10px] px-1.5 py-0.5 rounded ml-1 font-normal">
                Admin
              </span>
            </p>
            <p className="text-slate-400 text-[11px]">{adminEmail || ''}</p>
          </div>
        </div>
      </div>
    </div>
  );
}