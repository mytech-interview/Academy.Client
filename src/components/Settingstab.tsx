import React from 'react';
import { Settings } from 'lucide-react';
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
  return (
    <div className="bg-white rounded-[2rem] p-6 border border-slate-200/80 shadow-sm">
      <div className="flex items-center justify-between pb-5 border-b border-slate-100">
        <div>
          <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
            <Settings className="w-5 h-5 text-purple-600" />
            საიტის ტექსტების, სტატისტიკის & კონტაქტების მართვა
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            განაახლეთ სტუდენტების რაოდენობა, ფილიალები, აქციის ფასები, საკონტაქტო ინფო და ტექსტები
          </p>
        </div>
        <button
          onClick={onSave}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-purple-200 transition"
        >
          შენახვა
        </button>
      </div>

      <div className="py-5 border-b border-slate-100 space-y-3">
        <h3 className="text-xs font-black text-slate-800">1. მთავარი გვერდის სტატისტიკა (STATS COUNTER)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
          <InputField label="სტუდენტების რაოდენობა" value={settings.studentsCount} onChange={(v) => onChange('studentsCount', v)} />
          <InputField label="ლექტორების რაოდენობა" value={settings.lecturersCount} onChange={(v) => onChange('lecturersCount', v)} />
          <InputField label="ფილიალების რაოდენობა" value={settings.branchesCount} onChange={(v) => onChange('branchesCount', v)} />
          <InputField label="ქვეყნების რაოდენობა" value={settings.countriesCount} onChange={(v) => onChange('countriesCount', v)} />
          <InputField label="კურსდამთავრებულები" value={settings.graduatesCount} onChange={(v) => onChange('graduatesCount', v)} />
        </div>
      </div>

      <div className="py-5 border-b border-slate-100 space-y-3">
        <h3 className="text-xs font-black text-slate-800">2. აქციის ფასები და შეთავაზების სათაური</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <InputField label="აქციის დასახელება" value={settings.promoTitle} onChange={(v) => onChange('promoTitle', v)} />
          <InputField label="აქციის ფასი" value={settings.promoPrice} onChange={(v) => onChange('promoPrice', v)} />
        </div>
      </div>

      <div className="py-5 border-b border-slate-100 space-y-3">
        <h3 className="text-xs font-black text-slate-800">3. საკონტაქტო ინფორმაცია (CONTACT INFO)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <InputField label="ტელეფონის ნომერი" value={settings.phone} onChange={(v) => onChange('phone', v)} />
          <InputField label="ელ-ფოსტის მისამართი" value={settings.email} onChange={(v) => onChange('email', v)} />
          <InputField label="სათაო ოფისის მისამართი" value={settings.address} onChange={(v) => onChange('address', v)} />
          <InputField label="სამუშაო საათები" value={settings.workHours} onChange={(v) => onChange('workHours', v)} />
        </div>
      </div>

      <div className="pt-5 space-y-3">
        <h3 className="text-xs font-black text-slate-800">4. "ჩვენ შესახებ" გვერდის ტექსტი & ვიდეო ტურის ბმული</h3>
        <div className="space-y-3">
          <InputField label="სათაური" value={settings.aboutTitle} onChange={(v) => onChange('aboutTitle', v)} />

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">აღწერა / ისტორიის ტექსტი</label>
            <textarea
              value={settings.aboutDescription}
              onChange={(e) => onChange('aboutDescription', e.target.value)}
              rows={3}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-slate-800 resize-y"
            />
          </div>

          <InputField label="ვიდეო ტურის YouTube URL" value={settings.videoUrl} onChange={(v) => onChange('videoUrl', v)} />
        </div>

        <div className="flex justify-end pt-4">
          <button
            onClick={onSave}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-purple-200 transition"
          >
            შენახვა
          </button>
        </div>
      </div>
    </div>
  );
}