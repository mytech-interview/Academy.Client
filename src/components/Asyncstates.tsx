import React from 'react';
import { AlertTriangle, Inbox, Loader2 } from 'lucide-react';

export function LoadingState({ label = 'იტვირთება...' }: { label?: string }) {
  return (
    <div className="bg-white rounded-[2rem] p-12 border border-slate-200/80 shadow-sm flex flex-col items-center justify-center gap-3 text-slate-400">
      <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
      <p className="text-xs font-semibold">{label}</p>
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="bg-white rounded-[2rem] p-12 border border-rose-200/80 shadow-sm flex flex-col items-center justify-center gap-3 text-center">
      <AlertTriangle className="w-6 h-6 text-rose-500" />
      <p className="text-xs font-semibold text-rose-600">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-1 bg-rose-50 hover:bg-rose-100 text-rose-600 px-4 py-2 rounded-xl text-xs font-bold transition"
        >
          თავიდან ცდა
        </button>
      )}
    </div>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="bg-white rounded-[2rem] p-12 border border-slate-200/80 shadow-sm flex flex-col items-center justify-center gap-3 text-slate-400">
      <Inbox className="w-6 h-6" />
      <p className="text-xs font-semibold text-center">{message}</p>
    </div>
  );
}