import React, { useCallback, useEffect, useState } from 'react';
import {
  getLessonsForSession,
  getCourseSessionDetailsForStudent,
  getCourseLibrarySessionId,
  getHomeWorksForStudent,
  SessionLesson,
  CourseLibraryItem,
  StudentHomeWork,
} from '../api/sessions';
import {
  StudentCourseDetailModal,
  Course,
  Session,
  Enrollment,
  Homework,
  HomeworkSubmission,
  AttendanceRecord,
  Material,
} from './StudentCoursedetailmodal';
import { SubmitHomeworkModal } from './SubmitHomeworkModal';

interface StudentCourseDetailContainerProps {
  sessionId: number;
  studentGuid: string;
  courseCategoryName?: string;
  onClose: () => void;
}

function inferMaterialType(filePath: string | null | undefined): Material['type'] {
  if (!filePath) return 'DOCUMENT';
  const lower = filePath.toLowerCase();
  if (lower.includes('youtube') || lower.includes('vimeo') || lower.match(/\.(mp4|mov|webm)$/)) {
    return 'VIDEO';
  }
  if (lower.startsWith('http') && !lower.match(/\.(pdf|doc|docx|ppt|pptx|xls|xlsx|zip)$/)) {
    return 'LINK';
  }
  return 'DOCUMENT';
}

export const StudentCourseDetailContainer: React.FC<StudentCourseDetailContainerProps> = ({
  sessionId,
  studentGuid,
  courseCategoryName,
  onClose,
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [course, setCourse] = useState<Course>({ id: sessionId, title: 'Загрузка курса...' });
  const [session, setSession] = useState<Session>({});
  const [homeworks, setHomeworks] = useState<Homework[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);

  // Сырые данные с бэка — храним отдельно, чтобы доставать полный объект
  // (homeWorkId, teacherGuid, teacherName) для SubmitHomeworkModal без
  // рискованных кастов типов.
  const [rawHomeworks, setRawHomeworks] = useState<StudentHomeWork[]>([]);

  const [enrollment] = useState<Enrollment>({ completedLessonIds: [] });
  const [attendanceRecords] = useState<AttendanceRecord[]>([]);
  const [homeworkSubmissions] = useState<HomeworkSubmission[]>([]);

  const [submittingHomework, setSubmittingHomework] = useState<StudentHomeWork | null>(null);

  // Отдельно вынесен рефетч домашек — используется и при первой загрузке,
  // и после успешной отправки задания.
  const loadHomeworks = useCallback(async () => {
    const studentHomeworks = await getHomeWorksForStudent(studentGuid, sessionId);
    setRawHomeworks(studentHomeworks);
    // ВНИМАНИЕ: бэкенд пока не отдаёт SessionId/CourseId в
    // GetHomeWorksForStudentResponse — если getHomeWorksForStudent сама
    // не фильтрует по sessionId на сервере, здесь будут ВСЕ домашки студента.
    setHomeworks(
      studentHomeworks.map((hw) => ({
        id: hw.homeWorkId,
        title: hw.title,
        description: hw.description,
        dueDate: hw.dueDate,
      }))
    );
  }, [studentGuid, sessionId]);

  useEffect(() => {
    let cancelled = false;

    async function loadAll() {
      setLoading(true);
      setError(null);
      try {
        const [lessons, sessionDetails, libraryItems, studentHomeworks] = await Promise.all([
          getLessonsForSession(sessionId),
          getCourseSessionDetailsForStudent(sessionId, studentGuid),
          getCourseLibrarySessionId(sessionId, studentGuid),
          getHomeWorksForStudent(studentGuid, sessionId),
        ]);

        if (cancelled) return;

        setCourse({
          id: sessionDetails.courseId,
          title: sessionDetails.title,
          categoryName: courseCategoryName || '',
          teacherName: sessionDetails.teacherName,
          lessons: (lessons as SessionLesson[]).map((l) => ({
            id: l.lessonId,
            title: l.title,
            content: l.content,
            duration: '~2 часа', // фиксировано, в бэке поля нет
          })),
        });

        setSession({
          id: sessionDetails.sessionId,
          title: sessionDetails.title,
          schedule: sessionDetails.lessonDaysDescription,
          room: sessionDetails.cityName,
          startDate: sessionDetails.startDate,
          endDate: sessionDetails.endDate,
        });

        setMaterials(
          (libraryItems as CourseLibraryItem[]).map((m) => ({
            id: m.courseLibraryId,
            title: m.title,
            url: m.filePath,
            type: inferMaterialType(m.filePath),
          }))
        );

        setRawHomeworks(studentHomeworks as StudentHomeWork[]);
        setHomeworks(
          (studentHomeworks as StudentHomeWork[]).map((hw) => ({
            id: hw.homeWorkId,
            title: hw.title,
            description: hw.description,
            dueDate: hw.dueDate,
          }))
        );
      } catch (e: any) {
        if (!cancelled) {
          setError(e?.message || 'Не удалось загрузить данные курса');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadAll();
    return () => {
      cancelled = true;
    };
  }, [sessionId, studentGuid, courseCategoryName]);

  // hw здесь — Homework (только id/title/description/dueDate), поэтому
  // достаём полноценный StudentHomeWork из rawHomeworks по id вместо
  // небезопасного каста.
  const handleOpenSubmitHomework = (hw: Homework) => {
    const full = rawHomeworks.find((r) => r.homeWorkId === hw.id);
    if (!full) {
      console.error('Не удалось найти исходные данные домашки для id', hw.id);
      return;
    }
    setSubmittingHomework(full);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm">
        <div className="bg-white rounded-2xl px-6 py-4 text-sm font-bold text-slate-700">
          Загрузка курса...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
        <div className="bg-white rounded-2xl px-6 py-4 text-sm font-bold text-rose-700 space-y-3">
          <p>Ошибка загрузки: {error}</p>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold"
          >
            Закрыть
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <StudentCourseDetailModal
        course={course}
        enrollment={enrollment}
        session={session}
        homeworks={homeworks}
        homeworkSubmissions={homeworkSubmissions}
        attendanceRecords={attendanceRecords}
        materials={materials}
        onClose={onClose}
        onOpenSubmitHomework={handleOpenSubmitHomework}
      />

      {submittingHomework && (
        <SubmitHomeworkModal
          homework={submittingHomework}
          studentGuid={studentGuid}
          onClose={() => setSubmittingHomework(null)}
          onSubmitted={() => {
            loadHomeworks();
          }}
        />
      )}
    </>
  );
};