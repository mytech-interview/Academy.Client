import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle, Upload, Bold, Italic, Underline, List, ListOrdered } from 'lucide-react';
import { User } from '../types';
import { updateTeacher } from '@/src/api/teacher';
interface TeacherProfileTabProps {
  teacher: User;
  onUpdateProfile?: (updatedFields: Partial<User>) => void;
}

// Пресеты аватаров (Dicebear SVG / Стили из дизайна)
const AVATAR_PRESETS = [
  'https://api.dicebear.com/7.x/bottts/svg?seed=CyberBotAlpha&backgroundColor=6366f1',
  'https://api.dicebear.com/7.x/bottts/svg?seed=Bot2&backgroundColor=10b981',
  'https://api.dicebear.com/7.x/bottts/svg?seed=Bot3&backgroundColor=3b82f6',
  'https://api.dicebear.com/7.x/bottts/svg?seed=Bot4&backgroundColor=f59e0b',
  'https://api.dicebear.com/7.x/bottts/svg?seed=Bot5&backgroundColor=8b5cf6',
  'https://api.dicebear.com/7.x/bottts/svg?seed=Bot6&backgroundColor=ec4899',
  'https://api.dicebear.com/7.x/shapes/svg?seed=Shape1&backgroundColor=6366f1',
  'https://api.dicebear.com/7.x/shapes/svg?seed=Shape2&backgroundColor=3b82f6',
  'https://api.dicebear.com/7.x/shapes/svg?seed=Shape3&backgroundColor=8b5cf6',
  'https://api.dicebear.com/7.x/shapes/svg?seed=Shape4&backgroundColor=f59e0b',
  'https://api.dicebear.com/7.x/shapes/svg?seed=Shape5&backgroundColor=ef4444',
  'https://api.dicebear.com/7.x/shapes/svg?seed=Shape6&backgroundColor=ec4899',
  'https://api.dicebear.com/7.x/identicon/svg?seed=Id1&backgroundColor=6366f1',
  'https://api.dicebear.com/7.x/identicon/svg?seed=Id2&backgroundColor=f59e0b',
  'https://api.dicebear.com/7.x/identicon/svg?seed=Id3&backgroundColor=06b6d4',
  'https://api.dicebear.com/7.x/identicon/svg?seed=Id4&backgroundColor=10b981',
  'https://api.dicebear.com/7.x/identicon/svg?seed=Id5&backgroundColor=3b82f6',
  'https://api.dicebear.com/7.x/identicon/svg?seed=Id6&backgroundColor=14b8a6',
];

// Бэкенд/модель User может называть телефон по-разному в зависимости
// от того, откуда пришли данные (регистрация, обновление профиля и т.д.).
// Проверяем самые вероятные варианты, чтобы поле не оставалось пустым.
function getTeacherPhone(teacher: any): string {
  return (
    teacher?.telephone ??
    teacher?.phone ??
    teacher?.phoneNumber ??
    teacher?.mobile ??
    ''
  );
}

// Поле может называться description (с бэкенда) или headline (если уже
// смаплено где-то на фронте) — проверяем оба варианта. Пока бэкенд не
// добавил description в ответ, здесь просто будет пустая строка.
function getTeacherDescription(teacher: any): string {
  return (
    teacher?.description ??
    teacher?.headline ??
    ''
  );
}

export default function TeacherProfileTab({ teacher, onUpdateProfile }: TeacherProfileTabProps) {
  const { t } = useTranslation();
console.log('teacher object:', teacher);
  const descRef = useRef<HTMLDivElement>(null);

  const [profName, setProfName] = useState(teacher?.name || '');
  const [profEmail, setProfEmail] = useState(teacher?.email || '');
  const [profPhone, setProfPhone] = useState(getTeacherPhone(teacher));
  const [profHeadline, setProfHeadline] = useState(getTeacherDescription(teacher)); // хранит HTML (bold/italic/underline/списки)
  const [profAvatar, setProfAvatar] = useState(teacher?.avatar || AVATAR_PRESETS[0]);
  const [profSuccess, setProfSuccess] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);


  useEffect(() => {
    const nextDescription = getTeacherDescription(teacher);

    setProfName(teacher?.name || '');
    setProfEmail(teacher?.email || '');
    setProfPhone(getTeacherPhone(teacher));
    setProfHeadline(nextDescription);
    setProfAvatar(teacher?.avatar || AVATAR_PRESETS[0]);

    // Синхронизируем contentEditable-блок со state
    // (React не контролирует innerHTML напрямую)
    requestAnimationFrame(() => {
      if (descRef.current) {
        descRef.current.innerHTML = nextDescription;
      }
    });
  }, [teacher]);

  // Применяет команду форматирования к выделенному тексту в редакторе
  const applyFormat = (
    command: 'bold' | 'italic' | 'underline' | 'insertUnorderedList' | 'insertOrderedList'
  ) => {
    descRef.current?.focus();
    document.execCommand(command, false);
    if (descRef.current) {
      setProfHeadline(descRef.current.innerHTML);
    }
  };

  const handleDescriptionInput = () => {
    if (descRef.current) {
      setProfHeadline(descRef.current.innerHTML);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);

    const [firstName, ...rest] = profName.split(' ');
    const lastName = rest.join(' ');

    try {
      await updateTeacher({
        teacherGuid: teacher.id,
        firstName: firstName || profName,
        lastName: lastName || '',
        email: profEmail,
        telephone: profPhone,
        picture: profAvatar,
        description: profHeadline,
        isActive: true,
      });

      onUpdateProfile?.({
        name: profName,
        email: profEmail,
        headline: profHeadline,
        description: profHeadline,
        avatar: profAvatar,
      });

      setProfSuccess(true);
      setTimeout(() => setProfSuccess(false), 3000);
    } catch (err: any) {
      setSubmitError(err.message || 'Не удалось сохранить профиль');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfAvatar(imageUrl);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
      <h2 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-4">
        {t('teacherDashboard.profile.editTitle')}
      </h2>

      {profSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-emerald-600" />
          <span>{t('teacherDashboard.profile.updated')}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Full Name */}
        <div>
          <label className="text-xs font-extrabold text-slate-800 block mb-1.5">
            {t('teacherDashboard.profile.fullName')}
          </label>
          <input
            type="text"
            value={profName}
            onChange={(e) => setProfName(e.target.value)}
            className="w-full p-3 rounded-xl border border-slate-200 bg-[#f8fafc] text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:outline-none transition"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="text-xs font-extrabold text-slate-800 block mb-1.5">
            {t('teacherDashboard.profile.email')}
          </label>
          <input
            type="email"
            value={profEmail}
            onChange={(e) => setProfEmail(e.target.value)}
            className="w-full p-3 rounded-xl border border-slate-200 bg-[#f8fafc] text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:outline-none transition"
            required
          />
        </div>

        {/* Phone */}
        <div>
          <label className="text-xs font-extrabold text-slate-800 block mb-1.5">
            {t('teacherDashboard.profile.phone')}
          </label>
          <input
            type="text"
            value={profPhone}
            onChange={(e) => setProfPhone(e.target.value)}
            className="w-full p-3 rounded-xl border border-slate-200 bg-[#f8fafc] text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:outline-none transition"
          />
        </div>

        {/* Headline / Specialization — с форматированием (bold / italic / underline / списки) */}
        <div>
          <label className="text-xs font-extrabold text-slate-800 block mb-1.5">
            ბიოგრაფია
          </label>

          {/* Тулбар */}
          <div className="flex items-center gap-1 p-1.5 rounded-2xl border border-slate-200 bg-[#f8fafc] w-fit mb-2">
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()} // не терять фокус/выделение
              onClick={() => applyFormat('bold')}
              className="p-2 rounded-xl hover:bg-white text-slate-600 hover:text-[#5850ec] transition"
              title="Bold"
            >
              <Bold className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => applyFormat('italic')}
              className="p-2 rounded-xl hover:bg-white text-slate-600 hover:text-[#5850ec] transition"
              title="Italic"
            >
              <Italic className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => applyFormat('underline')}
              className="p-2 rounded-xl hover:bg-white text-slate-600 hover:text-[#5850ec] transition"
              title="Underline"
            >
              <Underline className="w-3.5 h-3.5" />
            </button>
            <div className="w-px h-4 bg-slate-200 mx-1" />
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => applyFormat('insertUnorderedList')}
              className="p-2 rounded-xl hover:bg-white text-slate-600 hover:text-[#5850ec] transition"
              title="Bullet list"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => applyFormat('insertOrderedList')}
              className="p-2 rounded-xl hover:bg-white text-slate-600 hover:text-[#5850ec] transition"
              title="Numbered list"
            >
              <ListOrdered className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Редактируемая область */}
          <div
            ref={descRef}
            contentEditable
            onInput={handleDescriptionInput}
            data-placeholder="ბიოგრაფია"
            className="rich-editor w-full min-h-[100px] p-3 rounded-xl border border-slate-200 bg-[#f8fafc] text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:outline-none transition"
            suppressContentEditableWarning
          />
        </div>

        {/* Avatar Upload & Selector Box */}
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between">
            <label className="text-xs font-extrabold text-slate-800 block">
              {t('teacherDashboard.profile.photoTitle')}
            </label>
            {/* <span className="text-[10px] font-mono font-bold text-[#5850ec]">Cyber Bot Alpha</span> */}
          </div>

          <div className="p-5 rounded-2xl bg-[#f8fafc] border border-slate-100 space-y-4">
            {/* File Upload Box */}
            <div className="p-4 bg-white rounded-xl border border-slate-200 flex items-center gap-4">
              <img
                src={profAvatar}
                alt=""
                className="h-12 w-12 rounded-xl object-cover bg-slate-100 shrink-0 border border-slate-100"
              />
              <div className="flex-1">
                <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#5850ec] hover:bg-[#4338ca] text-white text-xs font-bold transition shadow-sm cursor-pointer">
                  <Upload className="h-3.5 w-3.5" />
                  <span>{t('teacherDashboard.profile.uploadBtn')}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
                <p className="text-[10px] text-slate-400 font-medium mt-1">
                  PNG, JPG, WEBP (max 5MB)
                </p>
              </div>
            </div>

            {/* Avatar Grid Selector */}
            <div className="space-y-2">
              {/* <p className="text-[11px] font-bold text-slate-600">
                {t('teacherDashboard.profile.selectAbstract')}
              </p> */}
              {/* <div className="grid grid-cols-6 gap-2">
                {AVATAR_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setProfAvatar(preset)}
                    className={`h-11 w-11 rounded-xl overflow-hidden border-2 shrink-0 transition flex items-center justify-center p-0.5 bg-white ${
                      profAvatar === preset
                        ? 'border-[#5850ec] ring-2 ring-indigo-100 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <img src={preset} alt="" className="h-full w-full object-cover rounded-lg" />
                  </button>
                ))}
              </div> */}
            </div>

            {/* Avatar URL Input */}
            {/* <input
              type="text"
              value={profAvatar}
              onChange={(e) => setProfAvatar(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-[11px] font-mono text-slate-500 focus:outline-none"
            /> */}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-3 flex items-center justify-between gap-3">
          {submitError && (
            <div className="flex-1 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
              {submitError}
            </div>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="ml-auto px-6 py-3 rounded-xl bg-[#5850ec] hover:bg-[#4338ca] text-white text-xs font-bold transition shadow-md active:scale-95 cursor-pointer disabled:opacity-50 shrink-0"
          >
            {submitting ? '...' : t('teacherDashboard.profile.save')}
          </button>
        </div>
      </form>
    </div>
  );
}