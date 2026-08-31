import React, { useMemo, useState } from 'react';
import { Pencil, Trash2, User as UserIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
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

// Возвращает прямой URL картинки, либо null если её нет / это не валидная ссылка
function resolveDirectImageSrc(value?: string | null): string | null {
  if (!value) return null;

  const driveMatch = value.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  if (driveMatch) {
    return `https://drive.google.com/thumbnail?id=${driveMatch[1]}&sz=w200`;
  }

  const driveOpenMatch = value.match(/drive\.google\.com\/open\?id=([^&]+)/);
  if (driveOpenMatch) {
    return `https://drive.google.com/thumbnail?id=${driveOpenMatch[1]}&sz=w200`;
  }

  if (/^https?:\/\//.test(value) || value.startsWith('data:image')) {
    return value;
  }

  // просто имя файла без API для скачивания — картинки нет
  return null;
}

function AvatarDisplay({ value, bgClass }: { value: string; bgClass: string }) {
  const [errored, setErrored] = useState(false);
  const src = resolveDirectImageSrc(value);
  const showImage = !!src && !errored;

  return (
    <div
      className={`w-14 h-14 rounded-2xl ${bgClass} shrink-0 shadow-sm overflow-hidden flex items-center justify-center`}
    >
      {showImage ? (
        <img
          src={src as string}
          alt="avatar"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
          onError={() => setErrored(true)}
        />
      ) : (
        <UserIcon className="w-6 h-6 text-white/90" />
      )}
    </div>
  );
}

export default function UsersTab({ users, loading, error, searchQuery, onRetry, onDelete }: UsersTabProps) {
  const { t } = useTranslation();

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
        <h2 className="text-lg font-black text-slate-800">{t('usersTab.title')}</h2>
        <p className="text-xs text-slate-400 mt-1">
          {t('usersTab.subtitle')}
        </p>
      </div>

      {loading && <LoadingState label={t('usersTab.loading')} />}
      {!loading && error && <ErrorState message={error} onRetry={onRetry} />}
      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">{t('usersTab.colUser')}</th>
                <th className="py-3 px-4">{t('usersTab.colEmail')}</th>
                <th className="py-3 px-4">{t('usersTab.colPhone')}</th>
                <th className="py-3 px-4">{t('usersTab.colRole')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length > 0 ? (
                filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <AvatarDisplay value={u.avatarIcon} bgClass={u.avatarBg} />
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
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400 text-xs">
                    {searchQuery.trim() ? (
                      <EmptyState message={t('usersTab.notFound', { query: searchQuery })} />
                    ) : (
                      <EmptyState message={t('usersTab.empty')} />
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