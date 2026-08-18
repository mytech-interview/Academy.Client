import React, { useMemo } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { SystemUserItem } from '../types';
import { EmptyState, ErrorState, LoadingState } from './Asyncstates';

interface UsersTabProps {
  users: SystemUserItem[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  onRetry: () => void;
  onDelete: (user: SystemUserItem) => void;
}

export default function UsersTab({ users, loading, error, searchQuery, onRetry, onDelete }: UsersTabProps) {
  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return users;
    const q = searchQuery.toLowerCase();
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.subText.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.phone.toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q)
    );
  }, [users, searchQuery]);

  return (
    <div className="bg-white rounded-[2rem] p-6 border border-slate-200/80 shadow-sm space-y-6">
      <div>
        <h2 className="text-lg font-black text-slate-800">მომხმარებელთა საერთო ბაზა</h2>
        <p className="text-xs text-slate-400 mt-1">
          სისტემის ყველა რეგისტრირებული მომხმარებელი შესაბამისი როლებითა და მოქმედებებით
        </p>
        <p className="text-[11px] text-amber-600 mt-1">
          ეს ცხრილი აერთიანებს ლექტორებსა და სტუდენტებს. ADMIN როლის მომხმარებლები ჯერ არ ჩანს — backend-ს ჯერ არ
          აქვს ცალკე admin-ების endpoint (იხ. მესიჯი ჩატში).
        </p>
      </div>

      {loading && <LoadingState label="მომხმარებლები იტვირთება..." />}
      {!loading && error && <ErrorState message={error} onRetry={onRetry} />}
      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">მომხმარებელი</th>
                <th className="py-3 px-4">ელ-ფოსტა</th>
                <th className="py-3 px-4">ტელეფონის ნომერი</th>
                <th className="py-3 px-4">როლი</th>
                <th className="py-3 px-4 text-center">მოქმედება</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length > 0 ? (
                filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-11 h-11 rounded-2xl ${u.avatarBg} text-white text-xl flex items-center justify-center shrink-0 shadow-sm`}
                        >
                          {u.avatarIcon}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-black text-slate-800 truncate">{u.name}</p>
                          <p className="text-[11px] text-slate-400 font-medium truncate mt-0.5">{u.subText}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-xs font-semibold text-slate-600">{u.email}</td>
                    <td className="py-4 px-4 text-xs font-semibold text-slate-600">{u.phone}</td>

                    <td className="py-4 px-4">
                      {u.role === 'TEACHER' && (
                        <span className="bg-purple-100/70 text-purple-700 text-[10px] font-extrabold px-2.5 py-1 rounded-lg">
                          TEACHER
                        </span>
                      )}
                      {u.role === 'STUDENT' && (
                        <span className="bg-emerald-100/70 text-emerald-700 text-[10px] font-extrabold px-2.5 py-1 rounded-lg">
                          STUDENT
                        </span>
                      )}
                      {u.role === 'ADMIN' && (
                        <span className="bg-amber-100/70 text-amber-700 text-[10px] font-extrabold px-2.5 py-1 rounded-lg">
                          ADMIN
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 hover:bg-purple-100 transition flex items-center justify-center"
                          title="რედაქტირება"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDelete(u)}
                          className="w-8 h-8 rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-100 transition flex items-center justify-center"
                          title="წაშლა"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400 text-xs">
                    {searchQuery.trim() ? (
                      <EmptyState message={`მომხმარებელი ვერ მოიძებნა ძებნის კრიტერიუმით: "${searchQuery}"`} />
                    ) : (
                      <EmptyState message="მომხმარებლები ჯერ არ დამატებულა" />
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}