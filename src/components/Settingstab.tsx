import React from 'react';
import { Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SiteSettings } from '../types';
import InputField from './Inputfield';

interface SettingsTabProps {
  settings: SiteSettings;
  onChange: (field: keyof SiteSettings, value: string) => void;
  onSave: () => void;
}

// NOTE: no backend endpoint to load/save these site texts yet —
// onSave currently just shows a confirmation, nothing is persisted.

export default function SettingsTab({ settings, onChange, onSave }: SettingsTabProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-[2rem] p-6 border border-slate-200/80 shadow-sm">
      <div className="flex items-center justify-between pb-5 border-b border-slate-100">
        <div>
          <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
            <Settings className="w-5 h-5 text-purple-600" />
            {t('settingsTab.mainTitle')}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {t('settingsTab.mainSubtitle')}
          </p>
        </div>
        <button
          onClick={onSave}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-purple-200 transition"
        >
          {t('settingsTab.saveBtn')}
        </button>
      </div>

      <div className="py-5 border-b border-slate-100 space-y-3">
        <h3 className="text-xs font-black text-slate-800">{t('settingsTab.sec1Title')}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
          <InputField label={t('settingsTab.studentsCount')} value={settings.studentsCount} onChange={(v) => onChange('studentsCount', v)} />
          <InputField label={t('settingsTab.lecturersCount')} value={settings.lecturersCount} onChange={(v) => onChange('lecturersCount', v)} />
          <InputField label={t('settingsTab.branchesCount')} value={settings.branchesCount} onChange={(v) => onChange('branchesCount', v)} />
          <InputField label={t('settingsTab.countriesCount')} value={settings.countriesCount} onChange={(v) => onChange('countriesCount', v)} />
          <InputField label={t('settingsTab.graduatesCount')} value={settings.graduatesCount} onChange={(v) => onChange('graduatesCount', v)} />
        </div>
      </div>

      <div className="py-5 border-b border-slate-100 space-y-3">
        <h3 className="text-xs font-black text-slate-800">{t('settingsTab.sec2Title')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <InputField label={t('settingsTab.promoTitle')} value={settings.promoTitle} onChange={(v) => onChange('promoTitle', v)} />
          <InputField label={t('settingsTab.promoPrice')} value={settings.promoPrice} onChange={(v) => onChange('promoPrice', v)} />
        </div>
      </div>

      <div className="py-5 border-b border-slate-100 space-y-3">
        <h3 className="text-xs font-black text-slate-800">{t('settingsTab.sec3Title')}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <InputField label={t('settingsTab.phone')} value={settings.phone} onChange={(v) => onChange('phone', v)} />
          <InputField label={t('settingsTab.email')} value={settings.email} onChange={(v) => onChange('email', v)} />
          <InputField label={t('settingsTab.address')} value={settings.address} onChange={(v) => onChange('address', v)} />
          <InputField label={t('settingsTab.workHours')} value={settings.workHours} onChange={(v) => onChange('workHours', v)} />
        </div>
      </div>

      <div className="pt-5 space-y-3">
        <h3 className="text-xs font-black text-slate-800">{t('settingsTab.sec4Title')}</h3>
        <div className="space-y-3">
          <InputField label={t('settingsTab.aboutTitle')} value={settings.aboutTitle} onChange={(v) => onChange('aboutTitle', v)} />

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">{t('settingsTab.aboutDescLabel')}</label>
            <textarea
              value={settings.aboutDescription}
              onChange={(e) => onChange('aboutDescription', e.target.value)}
              rows={3}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-slate-800 resize-y"
            />
          </div>

          <InputField label={t('settingsTab.videoUrl')} value={settings.videoUrl} onChange={(v) => onChange('videoUrl', v)} />
        </div>

        <div className="flex justify-end pt-4">
          <button
            onClick={onSave}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-purple-200 transition"
          >
            {t('settingsTab.saveBtn')}
          </button>
        </div>
      </div>
    </div>
  );
}