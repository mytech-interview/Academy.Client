import React, { useMemo, useState, useEffect } from 'react';
import DOMPurify from 'dompurify';
import {
  AlertTriangle,
  BookOpen,
  Calendar,
  FolderPlus,
  Inbox,
  List,
  Loader2,
  Pencil,
  Plus,
  Search,
  Star,
  X,
  Bold, Italic, Underline, ListOrdered,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { CourseItem } from '../types';
import {
  getAllCourseLessons,
  addCourseLesson,
  updateCourseLesson,
  GetAllCourseLessonsResponseDto,
} from '../api/Coursesapi';
import { API_BASE_URL } from '../services/baseApi';

const DEFAULT_COURSE_IMAGE = 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800';

interface CoursesCategoriesTabProps {
  courses: CourseItem[];
  loading: boolean;
  error: string | null;
  categories: string[];
  searchQuery: string;
  onSearchChange: (value: string) => void;
  userGuid: string;
  onRetry: () => void;
  onAddCategory: (category: string) => void;
  onRemoveCategory: (category: string) => void;
  onAdd: () => void;
  onEdit: (course: CourseItem) => void;
  // Paused: no deleteCourse endpoint on the backend yet. Kept optional so
  // AdminDashboardPage can keep passing handleDeleteCourse without a TS
  // error, but this tab doesn't call it until the endpoint exists.
  onDelete?: (course: CourseItem) => void | Promise<void>;
}


function resolveAvatarSrc(value?: string | null): string | null {
  if (!value) return null;

  const driveMatch = value.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  if (driveMatch) {
    return `https://drive.google.com/thumbnail?id=${driveMatch[1]}&sz=w800`;
  }

  const driveOpenMatch = value.match(/drive\.google\.com\/open\?id=([^&]+)/);
  if (driveOpenMatch) {
    return `https://drive.google.com/thumbnail?id=${driveOpenMatch[1]}&sz=w800`;
  }

  if (/^https?:\/\//.test(value) || value.startsWith('data:image')) {
    return value;
  }

  return `${API_BASE_URL}/Image/downloadImage?fileName=${encodeURIComponent(value)}`;
}
function LoadingState({ label }: { label: string }) {
  return (
    <div className="bg-white rounded-2xl p-12 border border-slate-200/80 shadow-sm flex flex-col items-center justify-center gap-3 text-slate-400">
      <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
      <p className="text-xs font-semibold">{label}</p>
    </div>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  const { t } = useTranslation();
  return (
    <div className="bg-white rounded-2xl p-12 border border-rose-200/80 shadow-sm flex flex-col items-center justify-center gap-3 text-center">
      <AlertTriangle className="w-6 h-6 text-rose-500" />
      <p className="text-xs font-semibold text-rose-600">{message}</p>
      <button
        onClick={onRetry}
        className="mt-1 bg-rose-50 hover:bg-rose-100 text-rose-600 px-4 py-2 rounded-xl text-xs font-bold transition"
      >
        {t('coursesTab.retry')}
      </button>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="bg-white rounded-2xl p-12 border border-slate-200/80 shadow-sm flex flex-col items-center justify-center gap-3 text-slate-400">
      <Inbox className="w-6 h-6" />
      <p className="text-xs font-semibold text-center">{message}</p>
    </div>
  );
}

// ── Attached lessons modal ──
// Now wired to the real getAllCourseLessons endpoint. "Selected" checkbox
// state below is still local/UI-only — there's no addCourseLesson-to-course
// "attach" concept confirmed on the backend, so checking a box doesn't
// persist anywhere yet. Wire it up once that flow exists.
//
// Editing is now wired to updateCourseLesson: clicking the pencil icon on a
// lesson row swaps that row for an inline form (same styling as the "add
// lesson" form) instead of opening a separate nested modal.
//
// lessonNumber is now an editable field in both the add and edit forms
// (pre-filled with a sensible default: next number for add, current
// number for edit) so the sequence/order of lessons can be controlled
// manually instead of always being auto-appended.
function LessonsModal({
  course,
  userGuid,
  onClose,
}: {
  course: CourseItem;
  userGuid: string;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [lessons, setLessons] = useState<GetAllCourseLessonsResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // ── Add-lesson form state ──
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newLessonNumber, setNewLessonNumber] = useState<number>(1);
  const [addSubmitting, setAddSubmitting] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  // ── Edit-lesson form state ──
  const [editingLessonId, setEditingLessonId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editLessonNumber, setEditLessonNumber] = useState<number>(1);
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const fetchLessons = () => {
    setLoading(true);
    setError(null);

    return getAllCourseLessons({ userGuid, courseId: course.id })
      .then((res) => {
        // NOTE: backend currently returns an errorCode when the course
        // simply has zero lessons (empty-result-as-error), instead of
        // ErrorCode = None + an empty list. Until that's fixed server-side,
        // treat "no lessons" as an empty list rather than a real error —
        // only surface it as an error if we also got no data back at all.
        setLessons(res.courseLessons ?? []);
        if (res.errorCode && (res.courseLessons?.length ?? 0) === 0) {
          // swallow: this is "no lessons found", not a real failure
        } else if (res.errorCode) {
          setError(res.errMsg || t('coursesTab.lessonsModal.failedToLoad'));
        }
      })
      .catch((e) => {
        setError(e?.message ?? t('coursesTab.lessonsModal.failedToLoad'));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    let cancelled = false;
    fetchLessons().then(() => {
      if (cancelled) return;
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [course.id, userGuid]);

  const filteredLessons = useMemo(() => {
    if (!search.trim()) return lessons;
    const q = search.toLowerCase();
    return lessons.filter(
      (l) => l.lessonTitle.toLowerCase().includes(q) || l.description.toLowerCase().includes(q)
    );
  }, [lessons, search]);

  const handleAddLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDescription.trim()) {
      setAddError(t('coursesTab.lessonsModal.fillTitleAndDesc'));
      return;
    }
    if (!newLessonNumber || newLessonNumber < 1) {
      setAddError(t('coursesTab.lessonsModal.specifyLessonNumber'));
      return;
    }

    setAddSubmitting(true);
    setAddError(null);

    try {
      const res = await addCourseLesson({
        courseId: course.id,
        userGuid,
        lessonTitle: newTitle.trim(),
        description: newDescription.trim(),
        lessonNumber: newLessonNumber,
      });

      if (res.errorCode) {
        setAddError(res.errMsg || t('coursesTab.lessonsModal.failedToAdd'));
        return;
      }

      setNewTitle('');
      setNewDescription('');
      setShowAddForm(false);
      await fetchLessons();
    } catch (err: any) {
      setAddError(err?.message ?? t('coursesTab.lessonsModal.failedToAdd'));
    } finally {
      setAddSubmitting(false);
    }
  };

  const startEdit = (lesson: GetAllCourseLessonsResponseDto) => {
    setEditingLessonId(lesson.courseLessonId);
    setEditTitle(lesson.lessonTitle);
    setEditDescription(lesson.description);
    setEditLessonNumber(lesson.lessonNumber);
    setEditError(null);
    // Close the add form so only one editor is open at a time.
    setShowAddForm(false);
  };

  const cancelEdit = () => {
    setEditingLessonId(null);
    setEditError(null);
  };

  const handleUpdateLesson = async (e: React.FormEvent, lesson: GetAllCourseLessonsResponseDto) => {
    e.preventDefault();
    if (!editTitle.trim() || !editDescription.trim()) {
      setEditError(t('coursesTab.lessonsModal.fillTitleAndDesc'));
      return;
    }
    if (!editLessonNumber || editLessonNumber < 1) {
      setEditError(t('coursesTab.lessonsModal.specifyLessonNumber'));
      return;
    }

    setEditSubmitting(true);
    setEditError(null);

    try {
      const res = await updateCourseLesson({
        courseLessonId: lesson.courseLessonId,
        userGuid,
        title: editTitle.trim(),
        description: editDescription.trim(),
        lessonNumber: editLessonNumber,
      });

      if (res.errorCode) {
        setEditError(res.errMsg || t('coursesTab.lessonsModal.failedToUpdate'));
        return;
      }

      setEditingLessonId(null);
      await fetchLessons();
    } catch (err: any) {
      setEditError(err?.message ?? t('coursesTab.lessonsModal.failedToUpdate'));
    } finally {
      setEditSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl p-6 max-w-xl w-full shadow-xl border border-slate-100 space-y-4 max-h-[90vh] flex flex-col">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[10px] font-semibold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-md border border-purple-100">
              {t('coursesTab.lessonsModal.badge')}
            </span>
            <h3 className="font-bold text-slate-800 text-sm mt-2">{course.title}</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {t('coursesTab.lessonsModal.subtitle')}
            </p>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={t('coursesTab.lessonsModal.searchPlaceholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 font-medium pt-1">
          <span>{t('coursesTab.lessonsModal.totalLessons', { count: lessons.length })}</span>
          <button
            onClick={() => {
              setShowAddForm((v) => {
                const next = !v;
                if (next) setNewLessonNumber(lessons.length + 1);
                return next;
              });
              setAddError(null);
              setEditingLessonId(null);
            }}
            title={t('coursesTab.lessonsModal.createLesson')}
            aria-label={t('coursesTab.lessonsModal.createLesson')}
            className="text-purple-600 hover:bg-purple-50 p-1.5 rounded-lg transition"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {showAddForm && (
          <form
            onSubmit={handleAddLesson}
            className="bg-purple-50/40 border border-purple-100 rounded-2xl p-4 space-y-3"
          >
            <div className="flex gap-3">
              <div className="space-y-1 w-28 shrink-0">
                <label className="block text-xs font-bold text-slate-800">{t('coursesTab.lessonsModal.numberLabel')}</label>
                <input
                  type="number"
                  min={1}
                  value={newLessonNumber}
                  onChange={(e) => setNewLessonNumber(Number(e.target.value))}
                  className="lesson-input bg-white"
                />
              </div>

              <div className="space-y-1 flex-1">
                <label className="block text-xs font-bold text-slate-800">{t('coursesTab.lessonsModal.titleLabel')}</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder={t('coursesTab.lessonsModal.titlePlaceholder')}
                  className="lesson-input bg-white"
                  autoFocus
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-800">{t('coursesTab.lessonsModal.descriptionLabel')}</label>
              <textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder={t('coursesTab.lessonsModal.descriptionPlaceholder')}
                rows={2}
                className="lesson-input bg-white resize-y min-h-[60px]"
              />
            </div>

            {addError && <p className="text-xs font-semibold text-rose-600">{addError}</p>}

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setAddError(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 border border-slate-200 hover:bg-white transition"
              >
                {t('coursesTab.lessonsModal.cancel')}
              </button>
              <button
                type="submit"
                disabled={addSubmitting}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white transition shadow-sm disabled:opacity-50"
              >
                {addSubmitting ? t('coursesTab.lessonsModal.saving') : t('coursesTab.lessonsModal.add')}
              </button>
            </div>
          </form>
        )}

        <div className="space-y-2 overflow-y-auto flex-1 pr-1">
          {loading && (
            <div className="flex flex-col items-center justify-center gap-2 py-8 text-slate-400">
              <Loader2 className="w-5 h-5 animate-spin text-purple-600" />
              <p className="text-xs font-semibold">{t('coursesTab.lessonsModal.loadingLessons')}</p>
            </div>
          )}

          {!loading && error && (
            <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
              <AlertTriangle className="w-5 h-5 text-rose-500" />
              <p className="text-xs font-semibold text-rose-600">{error}</p>
            </div>
          )}

          {!loading && !error && filteredLessons.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-2 py-8 text-slate-400">
              <Inbox className="w-5 h-5" />
              <p className="text-xs font-semibold text-center">
                {search.trim()
                  ? t('coursesTab.lessonsModal.noLessonsFoundQuery', { query: search })
                  : t('coursesTab.lessonsModal.noLessonsYet')}
              </p>
            </div>
          )}

          {!loading &&
            !error &&
            filteredLessons.map((item) =>
              editingLessonId === item.courseLessonId ? (
                // ── Inline edit form (same styling as the add-lesson form) ──
                <form
                  key={item.courseLessonId}
                  onSubmit={(e) => handleUpdateLesson(e, item)}
                  className="bg-purple-50/40 border border-purple-100 rounded-2xl p-4 space-y-3"
                >
                  <div className="flex gap-3">
                    <div className="space-y-1 w-28 shrink-0">
                      <label className="block text-xs font-bold text-slate-800">{t('coursesTab.lessonsModal.numberLabel')}</label>
                      <input
                        type="number"
                        min={1}
                        value={editLessonNumber}
                        onChange={(e) => setEditLessonNumber(Number(e.target.value))}
                        className="lesson-input bg-white"
                      />
                    </div>

                    <div className="space-y-1 flex-1">
                      <label className="block text-xs font-bold text-slate-800">{t('coursesTab.lessonsModal.titleLabel')}</label>
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        placeholder={t('coursesTab.lessonsModal.titlePlaceholder')}
                        className="lesson-input bg-white"
                        autoFocus
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-800">{t('coursesTab.lessonsModal.descriptionLabel')}</label>
                    <textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      placeholder={t('coursesTab.lessonsModal.descriptionPlaceholder')}
                      rows={2}
                      className="lesson-input bg-white resize-y min-h-[60px]"
                    />
                  </div>

                  {editError && <p className="text-xs font-semibold text-rose-600">{editError}</p>}

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 border border-slate-200 hover:bg-white transition"
                    >
                      {t('coursesTab.lessonsModal.cancel')}
                    </button>
                    <button
                      type="submit"
                      disabled={editSubmitting}
                      className="px-5 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white transition shadow-sm disabled:opacity-50"
                    >
                      {editSubmitting ? t('coursesTab.lessonsModal.saving') : t('coursesTab.lessonsModal.save')}
                    </button>
                  </div>
                </form>
              ) : (
                // ── Normal lesson row ──
                <div
                  key={item.courseLessonId}
                  className="p-3 rounded-xl border border-slate-200/80 bg-white flex items-center justify-between gap-3 hover:border-purple-200 transition"
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="mt-0.5 w-4 h-4 accent-purple-600 rounded border-slate-300"
                    />
                    <div>
                      <h4 className="text-xs font-semibold text-slate-800">
                        {t('coursesTab.lessonsModal.lessonRowTitle', {
                          number: item.lessonNumber,
                          title: item.lessonTitle,
                        })}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">{item.description}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => startEdit(item)}
                    title={t('coursesTab.lessonsModal.editLesson')}
                    aria-label={t('coursesTab.lessonsModal.editLesson')}
                    className="shrink-0 p-1.5 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-purple-50 transition"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                </div>
              )
            )}
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-xl text-xs font-semibold shadow-sm transition"
          >
            {t('coursesTab.lessonsModal.finishSave')}
          </button>
        </div>
      </div>

      <style>{`
        .lesson-input {
          width: 100%;
          padding: 0.5rem 0.75rem;
          border-radius: 0.75rem;
          border: 1px solid #e2e8f0;
          font-size: 0.75rem;
          font-weight: 500;
          color: #0f172a;
          outline: none;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }
        .lesson-input:focus {
          border-color: #a855f7;
          box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.15);
        }
      `}</style>
    </div>
  );
}

export default function CoursesCategoriesTab({
  courses,
  loading,
  error,
  categories,
  searchQuery,
  onSearchChange,
  userGuid,
  onRetry,
  onAddCategory,
  onRemoveCategory,
  onAdd,
  onEdit,
  onDelete,
}: CoursesCategoriesTabProps) {
  const { t } = useTranslation();
  const [newCategory, setNewCategory] = useState('');
  const [selectedCourseForLessons, setSelectedCourseForLessons] = useState<CourseItem | null>(null);

  const filteredCourses = useMemo(() => {
    if (!searchQuery.trim()) return courses;
    const q = searchQuery.toLowerCase();
    return courses.filter((c) => c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q));
  }, [courses, searchQuery]);

  const handleAdd = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      onAddCategory(newCategory.trim());
      setNewCategory('');
    }
  };

  return (
    <>
      {/* ── Category management section ── */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
              <FolderPlus className="w-5 h-5 text-purple-600" />
              {t('coursesTab.categoriesTitle')}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {t('coursesTab.categoriesSubtitle')}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder={t('coursesTab.newCategoryPlaceholder')}
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-purple-500 w-48 placeholder:text-slate-400"
            />
            <button
              onClick={handleAdd}
              className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-purple-200 transition shrink-0"
            >
              <Plus className="w-4 h-4" />
              {t('coursesTab.addCategory')}
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          <button className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-purple-600 text-white shadow-sm">
            {t('coursesTab.allCategories')}
          </button>
          {categories.map((cat) => (
            <div
              key={cat}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold border bg-slate-50 text-slate-600 border-slate-200 hover:border-purple-200 transition"
            >
              <span>{cat}</span>
              <button onClick={() => onRemoveCategory(cat)} className="text-slate-400 hover:text-rose-500 transition">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ── List header section ── */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-purple-600" />
              {t('coursesTab.fullCourseList')}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">{t('coursesTab.fullCourseListSubtitle')}</p>
          </div>

          <button
            onClick={onAdd}
            className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-purple-200 transition shrink-0"
          >
            <Plus className="w-4 h-4" /> {t('coursesTab.addNewCourse')}
          </button>
        </div>

        {/* Search input — wired to searchQuery/onSearchChange so it actually filters filteredCourses below */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={"🔍 ძიება კურსებში (ჩაწერეთ სათაური, კატეგორია, აღწერა)..."}
            className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* ── Loading and error states ── */}
      {loading && <LoadingState label={t('coursesTab.loadingCourses')} />}
      {!loading && error && <ErrorState message={error} onRetry={onRetry} />}
      {!loading && !error && filteredCourses.length === 0 && (
        <EmptyState
          message={
            searchQuery.trim()
              ? t('coursesTab.noCoursesFoundQuery', { query: searchQuery })
              : t('coursesTab.noCoursesYet')
          }
        />
      )}

      {/* ── Course cards grid ── */}
      {!loading && !error && filteredCourses.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredCourses.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col group hover:shadow-lg transition duration-200"
            >
              {/* Course preview / banner */}
               <div className="relative h-44 bg-slate-100 overflow-hidden">
  <img
    src={
      resolveAvatarSrc(
        c.picture ||
        (c as any).pictureUrl ||
        (c as any).imageUrl
      ) || DEFAULT_COURSE_IMAGE
    }
    alt={c.title}
    onError={(e) => {
      (e.target as HTMLImageElement).src = DEFAULT_COURSE_IMAGE;
    }}
    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
  />
  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-slate-800 text-[11px] font-extrabold px-3 py-1 rounded-xl shadow-sm">
    {c.price ? `${c.price} ₾` : t('coursesTab.free')}
  </div>
</div>

              {/* Card content */}
              <div className="p-5 flex flex-col flex-1 justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="font-bold text-slate-800 text-sm leading-snug line-clamp-2">{c.title}</h3>
                  {c.description && (
      <div
        className="mt-2 text-xs text-slate-500 line-clamp-2 leading-relaxed font-light [&>p]:inline [&>p]:m-0"
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(c.description) }}
      />
    )}
                </div>

                {/* Meta information */}
                <div className="space-y-2.5 pt-2 border-t border-slate-100">
                  {/* <div className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-1.5 text-purple-700 font-bold bg-purple-50 px-2.5 py-1 rounded-xl">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{c.startDate ? c.startDate.slice(0, 10) : '—'}</span>
                    </div>
                    <span
                      className={
                        c.isActive
                          ? 'text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-100'
                          : 'text-[10px] font-extrabold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-xl border border-slate-200'
                      }
                    >
                      {c.isActive ? t('coursesTab.statusActive') : t('coursesTab.statusCompleted')}
                    </span>
                  </div> */}

                  {/* Instructor row removed: courses have no assigned
                      teacher in the API (teachers are assigned per session,
                      not per course) — "მარიამ ბერიძე" was hardcoded UI text
                      with no real data source at all. */}

                  {/* <div className="flex items-center justify-end text-xs text-slate-600 pt-1">
                    <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{c.averageReviewMark != null ? c.averageReviewMark.toFixed(1) : '—'}</span>
                    </div>
                  </div> */}
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-2 gap-2 text-center text-xs">
                  <div className="bg-purple-50/60 border border-purple-100/80 p-2 rounded-xl">
                    <span className="block text-[10px] text-purple-600 font-semibold">{t('coursesTab.statLessons')}</span>
                    <span className="font-extrabold text-purple-700">{c.lessonsAmount ?? 0}</span>
                  </div>
                  <div className="bg-emerald-50/60 border border-emerald-100/80 p-2 rounded-xl">
                    <span className="block text-[10px] text-emerald-600 font-semibold">{t('coursesTab.statStudents')}</span>
                    <span className="font-extrabold text-emerald-700">{c.enrolledStudentsAmount ?? 0}</span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={() => setSelectedCourseForLessons(c)}
                    title={t('coursesTab.manageLessons')}
                    className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
                  >
                    <List className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onEdit(c)}
                    className="p-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 transition flex items-center justify-center"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Dialogs / Modals */}
      {selectedCourseForLessons && (
        <LessonsModal
          course={selectedCourseForLessons}
          userGuid={userGuid}
          onClose={() => setSelectedCourseForLessons(null)}
        />
      )}

      {/* Delete flow paused: no deleteCourse endpoint on the backend yet.
          Re-enable selectedCourseForDelete + DeleteConfirmModal once
          coursesApi.deleteCourse exists. */}
    </>
  );
}