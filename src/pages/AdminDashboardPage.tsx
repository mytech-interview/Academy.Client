import React, { useState } from 'react';
import {
  Users,
  GraduationCap,
  BookOpen,
  TrendingUp,
  ShieldCheck,
  Bell,
  Settings,
  BarChart2,
  UserCheck,
  UserX,
  ChevronRight,
  Search,
  MoreHorizontal,
  LogOut,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

type AdminTab = 'overview' | 'users' | 'courses' | 'settings';

export default function AdminDashboardPage() {
  const { activeUser, registeredUsers, courses, enrollments, handleLogout } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [searchQuery, setSearchQuery] = useState('');

  const totalStudents = registeredUsers.filter((u) => u.role === 'student').length;
  const totalTeachers = registeredUsers.filter((u) => u.role === 'teacher').length;
  const totalCourses = courses.length;
  const totalEnrollments = enrollments.length;

  const filteredUsers = registeredUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = [
    {
      label: 'სტუდენტები',
      value: totalStudents,
      icon: <Users className="w-5 h-5" />,
      color: 'bg-indigo-50 text-indigo-600',
      border: 'border-indigo-100',
    },
    {
      label: 'მასწავლებლები',
      value: totalTeachers,
      icon: <GraduationCap className="w-5 h-5" />,
      color: 'bg-violet-50 text-violet-600',
      border: 'border-violet-100',
    },
    {
      label: 'კურსები',
      value: totalCourses,
      icon: <BookOpen className="w-5 h-5" />,
      color: 'bg-blue-50 text-blue-600',
      border: 'border-blue-100',
    },
    {
      label: 'ჩარიცხვები',
      value: totalEnrollments,
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'bg-emerald-50 text-emerald-600',
      border: 'border-emerald-100',
    },
  ];

  const tabs: { key: AdminTab; label: string; icon: React.ReactNode }[] = [
    { key: 'overview', label: 'მიმოხილვა', icon: <BarChart2 className="w-4 h-4" /> },
    { key: 'users', label: 'მომხმარებლები', icon: <Users className="w-4 h-4" /> },
    { key: 'courses', label: 'კურსები', icon: <BookOpen className="w-4 h-4" /> },
    { key: 'settings', label: 'პარამეტრები', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* ── Sidebar ── */}
      <aside className="w-64 shrink-0 bg-white border-r border-slate-100 flex flex-col shadow-sm">
        {/* Logo */}
        <div className="h-16 flex items-center gap-2.5 px-6 border-b border-slate-100">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4 text-white" />
          </div>
          <span className="font-black text-slate-800 tracking-tight text-sm">Admin Panel</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === tab.key
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>

        {/* User info + logout */}
        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white font-bold text-xs shrink-0">
              {activeUser?.name?.charAt(0).toUpperCase() ?? 'A'}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-slate-800 truncate">{activeUser?.name}</p>
              <p className="text-[11px] text-slate-400 truncate">{activeUser?.email}</p>
            </div>
          </div>
          <button
            onClick={() => { handleLogout?.(); navigate('/login', { replace: true }); }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-red-500 hover:bg-red-50 transition"
          >
            <LogOut className="w-4 h-4" />
            გამოსვლა
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-8 shadow-sm shrink-0">
          <h1 className="text-lg font-black text-slate-800 tracking-tight">
            {tabs.find((t) => t.key === activeTab)?.label}
          </h1>
          <div className="flex items-center gap-3">
            <button className="relative w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8">
          {/* ── OVERVIEW ── */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Stats grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((s) => (
                  <div
                    key={s.label}
                    className={`bg-white rounded-2xl border ${s.border} p-5 flex items-center gap-4 shadow-sm`}
                  >
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${s.color}`}>
                      {s.icon}
                    </div>
                    <div>
                      <p className="text-2xl font-black text-slate-800">{s.value}</p>
                      <p className="text-xs text-slate-400 font-medium">{s.label}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Recent users table */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                  <h2 className="font-black text-slate-800 text-sm">ბოლო მომხმარებლები</h2>
                  <button
                    onClick={() => setActiveTab('users')}
                    className="text-xs text-indigo-600 font-semibold hover:underline flex items-center gap-1"
                  >
                    ყველა <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
                <UserTable users={registeredUsers.slice(0, 5)} />
              </div>

              {/* Courses overview */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                  <h2 className="font-black text-slate-800 text-sm">კურსები</h2>
                  <button
                    onClick={() => setActiveTab('courses')}
                    className="text-xs text-indigo-600 font-semibold hover:underline flex items-center gap-1"
                  >
                    ყველა <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
                <div className="divide-y divide-slate-50">
                  {courses.slice(0, 4).map((c) => {
                    const enrolled = enrollments.filter((e) => e.courseId === c.id).length;
                    return (
                      <div key={c.id} className="flex items-center gap-4 px-6 py-3">
                        <img
                          src={c.image}
                          alt={c.title}
                          className="w-10 h-10 rounded-xl object-cover shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-800 truncate">{c.title}</p>
                          <p className="text-xs text-slate-400">{c.teacherName}</p>
                        </div>
                        <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                          {enrolled} ჩარიცხული
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ── USERS ── */}
          {activeTab === 'users' && (
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="მოძებნე მომხმარებელი..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
                  />
                </div>
                <div className="flex gap-2 text-xs font-semibold">
                  <span className="px-3 py-2 bg-indigo-50 text-indigo-600 rounded-xl">{totalStudents} სტუდენტი</span>
                  <span className="px-3 py-2 bg-violet-50 text-violet-600 rounded-xl">{totalTeachers} მასწავლებელი</span>
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <UserTable users={filteredUsers} showRole />
              </div>
            </div>
          )}

          {/* ── COURSES ── */}
          {activeTab === 'courses' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {courses.map((c) => {
                  const enrolled = enrollments.filter((e) => e.courseId === c.id).length;
                  const completed = enrollments.filter(
                    (e) => e.courseId === c.id && e.isCompleted
                  ).length;
                  return (
                    <div
                      key={c.id}
                      className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col"
                    >
                      <img src={c.image} alt={c.title} className="w-full h-32 object-cover" />
                      <div className="p-4 flex flex-col gap-2 flex-1">
                        <p className="font-black text-slate-800 text-sm leading-snug line-clamp-2">
                          {c.title}
                        </p>
                        <p className="text-xs text-slate-400">{c.teacherName}</p>
                        <div className="mt-auto flex items-center justify-between text-xs font-semibold pt-2 border-t border-slate-50">
                          <span className="text-indigo-600">{enrolled} ჩარიცხული</span>
                          <span className="text-emerald-600">{completed} დასრულებული</span>
                          <span className="text-slate-400">{c.price}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── SETTINGS ── */}
          {activeTab === 'settings' && (
            <div className="max-w-lg space-y-4">
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
                <h2 className="font-black text-slate-800 text-sm">ადმინის ინფორმაცია</h2>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white font-black text-xl shrink-0">
                    {activeUser?.name?.charAt(0).toUpperCase() ?? 'A'}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">{activeUser?.name}</p>
                    <p className="text-sm text-slate-400">{activeUser?.email}</p>
                    <span className="inline-block mt-1 text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                      ადმინისტრატორი
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm divide-y divide-slate-50">
                {[
                  { icon: <Bell className="w-4 h-4" />, label: 'შეტყობინებები', desc: 'ელ-ფოსტის შეტყობინებები' },
                  { icon: <ShieldCheck className="w-4 h-4" />, label: 'უსაფრთხოება', desc: 'პაროლი და 2FA' },
                  { icon: <Settings className="w-4 h-4" />, label: 'სისტემის პარამეტრები', desc: 'ზოგადი კონფიგურაცია' },
                ].map((item) => (
                  <button
                    key={item.label}
                    className="w-full flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition text-left"
                  >
                    <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-800">{item.label}</p>
                      <p className="text-xs text-slate-400">{item.desc}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

// ── Reusable user table ──────────────────────────────────────────────────────
function UserTable({
  users,
  showRole = false,
}: {
  users: { id: string; name: string; email: string; role: string; avatar?: string }[];
  showRole?: boolean;
}) {
  if (users.length === 0) {
    return (
      <div className="py-12 text-center text-sm text-slate-400">მომხმარებლები არ მოიძებნა</div>
    );
  }
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="bg-slate-50 text-left text-xs text-slate-400 font-semibold uppercase tracking-wide">
          <th className="px-6 py-3">მომხმარებელი</th>
          <th className="px-6 py-3">ელ-ფოსტა</th>
          {showRole && <th className="px-6 py-3">როლი</th>}
          <th className="px-6 py-3">სტატუსი</th>
          <th className="px-6 py-3" />
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-50">
        {users.map((u) => (
          <tr key={u.id} className="hover:bg-slate-50/60 transition">
            <td className="px-6 py-3">
              <div className="flex items-center gap-3">
                {u.avatar ? (
                  <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full object-cover shrink-0" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white font-bold text-xs shrink-0">
                    {u.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="font-semibold text-slate-800">{u.name}</span>
              </div>
            </td>
            <td className="px-6 py-3 text-slate-400">{u.email}</td>
            {showRole && (
              <td className="px-6 py-3">
                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    u.role === 'teacher'
                      ? 'bg-violet-50 text-violet-600'
                      : u.role === 'admin'
                      ? 'bg-red-50 text-red-500'
                      : 'bg-indigo-50 text-indigo-600'
                  }`}
                >
                  {u.role === 'teacher' ? 'მასწავლებელი' : u.role === 'admin' ? 'ადმინი' : 'სტუდენტი'}
                </span>
              </td>
            )}
            <td className="px-6 py-3">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                <UserCheck className="w-3.5 h-3.5" /> აქტიური
              </span>
            </td>
            <td className="px-6 py-3">
              <button className="text-slate-300 hover:text-slate-500 transition">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}