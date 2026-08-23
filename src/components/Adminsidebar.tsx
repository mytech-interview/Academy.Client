import React from 'react';
import {
  BookOpen,
  Briefcase,
  Calendar,
  FileText,
  GraduationCap,
  Image as ImageIcon,
  Search,
  Settings,
  Sparkles,
  Users,
  Video,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import SidebarItem from './SidebarItem';
import { AdminTab } from '../types';

interface AdminSidebarProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  counts: {
    courses: number;
    sessions: number;
    lecturers: number;
    students: number;
    users: number;
    projects: number;
    videos: number;
    gallery: number;
    media: number;
  };
}

export default function AdminSidebar({
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange,
  counts,
}: AdminSidebarProps) {
  const { t } = useTranslation();

  return (
    <aside className="w-full lg:w-72 shrink-0">
      <div className="bg-white rounded-[2rem] p-5 border border-slate-200/80 shadow-sm space-y-6">
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold text-purple-600 tracking-wide">
              {t('adminSidebar.menuLabel')}
            </span>
            <span className="text-[10px] font-bold bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full border border-purple-100">
              {t('adminSidebar.sectionsCount')}
            </span>
          </div>
          <h3 className="text-base font-extrabold text-slate-800 mb-4">
            {t('adminSidebar.mainTitle')}
          </h3>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={t('adminSidebar.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500 transition placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase px-1 mb-2">
            {t('adminSidebar.catAcademy')}
          </p>
          <SidebarItem
            label={t('adminSidebar.itemCourses')}
            count={counts.courses}
            active={activeTab === 'courses_categories'}
            onClick={() => onTabChange('courses_categories')}
            icon={<BookOpen className="w-4 h-4" />}
          />
          <SidebarItem
            label={t('adminSidebar.itemSessions')}
            count={counts.sessions}
            active={activeTab === 'sessions'}
            onClick={() => onTabChange('sessions')}
            icon={<Calendar className="w-4 h-4" />}
          />
        </div>

        <div className="space-y-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase px-1 mb-2">
            {t('adminSidebar.catUsers')}
          </p>
          <SidebarItem
            label={t('adminSidebar.itemLecturers')}
            count={counts.lecturers}
            active={activeTab === 'lecturers'}
            onClick={() => onTabChange('lecturers')}
            icon={<Briefcase className="w-4 h-4" />}
          />
          <SidebarItem
            label={t('adminSidebar.itemStudents')}
            count={counts.students}
            active={activeTab === 'students'}
            onClick={() => onTabChange('students')}
            icon={<GraduationCap className="w-4 h-4" />}
          />
          <SidebarItem
            label={t('adminSidebar.itemUserBase')}
            count={counts.users}
            active={activeTab === 'users'}
            onClick={() => onTabChange('users')}
            icon={<Users className="w-4 h-4" />}
          />
        </div>

        <div className="space-y-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase px-1 mb-2">
            {t('adminSidebar.catMedia')}
          </p>
          <SidebarItem
            label={t('adminSidebar.itemProjects')}
            count={counts.projects}
            active={activeTab === 'projects'}
            onClick={() => onTabChange('projects')}
            icon={<Sparkles className="w-4 h-4" />}
          />
          <SidebarItem
            label={t('adminSidebar.itemVideos')}
            count={counts.videos}
            active={activeTab === 'videos'}
            onClick={() => onTabChange('videos')}
            icon={<Video className="w-4 h-4" />}
          />
          <SidebarItem
            label={t('adminSidebar.itemGallery')}
            count={counts.gallery}
            active={activeTab === 'gallery'}
            onClick={() => onTabChange('gallery')}
            icon={<ImageIcon className="w-4 h-4" />}
          />
          <SidebarItem
            label={t('adminSidebar.itemMediaLibrary')}
            count={counts.media}
            active={activeTab === 'media'}
            onClick={() => onTabChange('media')}
            icon={<FileText className="w-4 h-4" />}
          />
        </div>

        <div className="space-y-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase px-1 mb-2">
            {t('adminSidebar.catSettings')}
          </p>
          <SidebarItem
            label={t('adminSidebar.itemSettings')}
            active={activeTab === 'settings'}
            onClick={() => onTabChange('settings')}
            icon={<Settings className="w-4 h-4" />}
          />
        </div>

        <div className="bg-purple-50/50 border border-purple-100 rounded-2xl p-3.5 mt-4">
          <p className="text-[11px] font-bold text-slate-500">
            {t('adminSidebar.systemStatus')}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-purple-900">
              {t('adminSidebar.statusOnline')}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}