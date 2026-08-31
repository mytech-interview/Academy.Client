import React, { useState, useRef, useEffect } from 'react';
import { X, Bold, Italic, Underline, List, ListOrdered } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { CourseItem } from '../types';

export interface CourseCategoryOption {
  id: number;
  name: string;
}

export interface CourseFormValues {
  courseId?: number; // нужен для update — без него бэкенд не знает, какой курс редактировать
  title: string;
  description: string;
  courseCategoryId: number;
  courseEntryLevelId: number;
  price: number;
  maxStudents: number;
  picture?: string;
  isActive?: boolean;
}

interface CourseFormModalProps {
  mode: 'add' | 'edit';
  initial?: CourseItem;
  submitting?: boolean;
  categories: CourseCategoryOption[];
  onClose: () => void;
  onSubmit: (values: CourseFormValues) => void;
}

// NOTE: `format`, `city`, `guide` fields were removed — they were never part
// of CourseFormValues and were never actually submitted anywhere (dead UI).
// The `lecturer` select was also removed: courses aren't assigned a teacher
// in AddCourseRequestDto/UpdateCourseRequestDto — teachers get assigned per
// *session*, not per course (see SessionFormModal / teacherGuid there).
// If it turns out courses DO need a teacher field, confirm the DTO first —
// don't re-add a hardcoded list.
export default function CourseFormModal({
  mode,
  initial,
  submitting,
  categories,
  onClose,
  onSubmit,
}: CourseFormModalProps) {
  const { t } = useTranslation();
  const descRef = useRef<HTMLDivElement>(null);

  const [title, setTitle] = useState(initial?.title ?? '');
  const [description, setDescription] = useState(initial?.description ?? ''); // теперь хранит HTML
  const [category, setCategory] = useState(
    initial?.categoryId ? String(initial.categoryId) : String(categories[0]?.id ?? '')
  );
  // TODO(api): no confirmed CourseEntryLevels lookup table/endpoint seen yet
  // (unlike Categories, which we verified against the DB). Keeping this as
  // a manual field until that's confirmed — don't treat these labels as real.
  const [level, setLevel] = useState('1');
  const [price, setPrice] = useState(
    initial ? (initial.price === 0 ? t('courseFormModal.freeValue') : String(initial.price)) : t('courseFormModal.freeValue')
  );
  const [maxStudents, setMaxStudents] = useState(
    initial?.maxStudents != null ? String(initial.maxStudents) : '20'
  );
  const [status, setStatus] = useState(initial?.isActive === false ? 'completed' : 'ongoing');
  const [picture, setPicture] = useState(
    initial?.picture ?? 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80'
  );

  // Подставляем сохранённый HTML в редактор при открытии/смене initial
  useEffect(() => {
    if (descRef.current) {
      descRef.current.innerHTML = initial?.description ?? '';
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initial?.id]);

  const applyFormat = (command: 'bold' | 'italic' | 'underline' | 'insertUnorderedList' | 'insertOrderedList') => {
    descRef.current?.focus();
    document.execCommand(command, false);
    if (descRef.current) {
      setDescription(descRef.current.innerHTML);
    }
  };

  const handleDescriptionInput = () => {
    if (descRef.current) {
      setDescription(descRef.current.innerHTML);
    }
  };

  // Есть ли реальный текст в HTML (а не просто пустые теги)
  const isDescriptionEmpty = (html: string) => {
    const text = html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, '').trim();
    return text.length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || isDescriptionEmpty(description)) {
      alert(t('courseFormModal.validationTitleDesc'));
      return;
    }

    if (!category) {
      alert(t('courseFormModal.validationCategory'));
      return;
    }

    const freeValue = t('courseFormModal.freeValue');
    const parsedPrice = price === freeValue || price.trim().toLowerCase() === 'უფასო' || price === '' ? 0 : Number(price) || 0;
    const parsedMaxStudents = Number(maxStudents) || 0;

    onSubmit({
      ...(mode === 'edit' && initial ? { courseId: initial.id } : {}),
      title: title.trim(),
      description, // HTML как есть, без .trim() — trim текстовой строки тут не нужен
      courseCategoryId: Number(category),
      courseEntryLevelId: Number(level) || 1,
      price: parsedPrice,
      maxStudents: parsedMaxStudents,
      ...(mode === 'edit'
        ? {
            picture: picture.trim(),
            isActive: status === 'ongoing',
          }
        : {
            picture: picture.trim(),
          }),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-start justify-between px-8 pt-6 pb-4 border-b border-slate-100 bg-white">
          <div>
            <h3 className="font-bold text-slate-900 text-lg">
              {mode === 'add' ? t('courseFormModal.addTitle') : t('courseFormModal.editTitle')}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5 font-medium">
              {mode === 'add'
                ? t('courseFormModal.addSubtitle')
                : t('courseFormModal.editSubtitle')}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form body */}
        <form onSubmit={handleSubmit} className="px-8 py-6 space-y-5 overflow-y-auto flex-1 text-slate-800">
          <Field label={t('courseFormModal.titleLabel')}>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t('courseFormModal.titlePlaceholder')}
              className="styled-input"
              required
            />
          </Field>

          <Field label={t('courseFormModal.descriptionLabel')}>
            <div className="space-y-1.5">
              {/* Тулбар форматирования */}
              <div className="flex items-center gap-1 p-1.5 rounded-2xl border border-slate-200 bg-slate-50/50 w-fit">
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => applyFormat('bold')}
                  className="p-2 rounded-xl hover:bg-white text-slate-600 hover:text-purple-600 transition"
                  title="Bold"
                >
                  <Bold className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => applyFormat('italic')}
                  className="p-2 rounded-xl hover:bg-white text-slate-600 hover:text-purple-600 transition"
                  title="Italic"
                >
                  <Italic className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => applyFormat('underline')}
                  className="p-2 rounded-xl hover:bg-white text-slate-600 hover:text-purple-600 transition"
                  title="Underline"
                >
                  <Underline className="w-3.5 h-3.5" />
                </button>
                <div className="w-px h-4 bg-slate-200 mx-1" />
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => applyFormat('insertUnorderedList')}
                  className="p-2 rounded-xl hover:bg-white text-slate-600 hover:text-purple-600 transition"
                  title="Bullet list"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => applyFormat('insertOrderedList')}
                  className="p-2 rounded-xl hover:bg-white text-slate-600 hover:text-purple-600 transition"
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
                data-placeholder={t('courseFormModal.descriptionPlaceholder')}
                className="rich-editor styled-input resize-y min-h-[80px] block"
                suppressContentEditableWarning
              />
            </div>
          </Field>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label={t('courseFormModal.categoryLabel')}>
              {categories.length === 0 ? (
                <p className="text-xs text-slate-400 font-medium py-2">{t('courseFormModal.noCategories')}</p>
              ) : (
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="styled-input">
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              )}
            </Field>

            <Field label={t('courseFormModal.levelLabel')}>
              <select value={level} onChange={(e) => setLevel(e.target.value)} className="styled-input">
                <option value="1">{t('courseFormModal.levels.beginner')}</option>
                <option value="2">{t('courseFormModal.levels.intermediate')}</option>
                <option value="3">{t('courseFormModal.levels.advanced')}</option>
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label={t('courseFormModal.priceLabel')}>
              <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder={t('courseFormModal.freeValue')}
                className="styled-input"
              />
            </Field>

            <Field label={t('courseFormModal.maxStudentsLabel')}>
              <input
                type="number"
                min={0}
                value={maxStudents}
                onChange={(e) => setMaxStudents(e.target.value)}
                placeholder="20"
                className="styled-input"
              />
            </Field>
          </div>

          <Field label={t('courseFormModal.statusLabel')}>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="styled-input">
              <option value="ongoing">🟢 {t('courseFormModal.statusOngoing')}</option>
              <option value="completed">🔴 {t('courseFormModal.statusCompleted')}</option>
            </select>
          </Field>

          <Field label={t('courseFormModal.pictureLabel')}>
            <input
              type="text"
              value={picture}
              onChange={(e) => setPicture(e.target.value)}
              className="styled-input"
            />
          </Field>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-2xl text-xs font-bold text-slate-600 border border-slate-200 hover:bg-slate-50 transition"
            >
              {t('courseFormModal.cancel')}
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-2.5 rounded-2xl text-xs font-bold bg-[#8b5cf6] hover:bg-[#7c3aed] text-white transition shadow-md disabled:opacity-50"
            >
              {submitting ? t('courseFormModal.saving') : t('courseFormModal.save')}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .styled-input {
          width: 100%;
          padding: 0.625rem 0.875rem;
          border-radius: 0.85rem;
          border: 1px solid #e2e8f0;
          background-color: #ffffff;
          font-size: 0.8125rem;
          font-weight: 500;
          color: #0f172a;
          outline: none;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }
        .styled-input:focus {
          border-color: #a855f7;
          box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.15);
        }
        .rich-editor:empty::before {
          content: attr(data-placeholder);
          color: #94a3b8;
        }
        .rich-editor ul,
        .rich-editor ol {
          list-style-type: revert;
          padding-left: 1.25rem;
          margin: 0.25rem 0;
        }
        .rich-editor ul {
          list-style-type: disc;
        }
        .rich-editor ol {
          list-style-type: decimal;
        }
        .rich-editor li {
          display: list-item;
        }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="block text-xs font-bold text-slate-800">{label}</label>
      {children}
    </div>
  );
}