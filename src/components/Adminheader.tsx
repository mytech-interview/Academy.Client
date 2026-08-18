import React from 'react';
import { AlertCircle, Shield } from 'lucide-react';

interface AdminHeaderProps {
  adminName?: string;
  adminEmail?: string;
}

export default function AdminHeader({ adminName, adminEmail }: AdminHeaderProps) {
  return (
    // max-w-[1360px] убавляет ширину на 20px, py-5 возвращает исходную высоту
    <div className="max-w-[1420px] mx-auto bg-[#0e0f20] text-white py-12 px-6 md:px-8 rounded-3xl relative overflow-hidden shadow-xl">
      <div className="flex flex-col md:flex-row items-center justify-between gap-5 relative z-10">
        
        {/* Левый блок: Иконка + Тексты */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#201842] border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0 relative">
            <Shield className="w-8 h-8 text-purple-400 fill-purple-900/30" />
            <AlertCircle className="w-4 h-4 text-purple-300 absolute" />
          </div>

          <div className="space-y-1">
            <div>
              <span className="text-[10px] font-extrabold bg-[#2a1d4a] text-purple-300 px-2.5 py-0.5 rounded-md border border-purple-500/30 inline-flex items-center gap-1">
                <span>👑</span> ადმინისტრაციის პანელი
              </span>
            </div>

            <h1 className="text-xl md:text-2xl font-black tracking-tight text-white">
              ადმინისტრატორის მართვის ცენტრი
            </h1>

            <p className="text-[11px] text-slate-400 font-medium">
              მართეთ კურსები, სესიები, ლექტორები, სტუდენტები, პროექტები, ვიდეოები და საიტის ტექსტები ცენტრალიზებულად
            </p>
          </div>
        </div>

        {/* Правый блок: Профиль */}
        <div className="bg-[#151733]/90 border border-slate-700/40 rounded-2xl px-4 py-2.5 flex items-center gap-3 w-full md:w-auto shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-lg shadow-md shrink-0">
            🤖
          </div>

          <div className="text-xs">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-slate-100 text-xs">
                {adminName || 'David Chikva'}
              </span>
              <span className="bg-[#2a1d4a] text-purple-300 border border-purple-500/30 text-[9px] font-extrabold px-1.5 py-0.5 rounded">
                Admin
              </span>
            </div>
            <p className="text-slate-400 text-[10px] font-medium">
              {adminEmail || 'davidc@geoalphasolutions.com'}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}