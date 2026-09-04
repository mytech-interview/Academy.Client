import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  getLessonsForSession,
  getCourseSessionDetailsForStudent,
  getCourseLibrarySessionId,
  getHomeWorksForStudent,
  SessionLesson,
  CourseLibraryItem,
  StudentHomeWork,
  getStudentAttendanceForSession,
  StudentLessonAttendance,
  downloadHomeworkFile
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
  const { t } = useTranslation();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [course, setCourse] = useState<Course>({ id: sessionId, title: t('courseDetail.loading') });
  const [session, setSession] = useState<Session>({});
  const [homeworks, setHomeworks] = useState<Homework[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);

  // Raw data from backend stored separately to extract full object for SubmitHomeworkModal
  const [rawHomeworks, setRawHomeworks] = useState<StudentHomeWork[]>([]);

  const [enrollment] = useState<Enrollment>({ completedLessonIds: [] });
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [homeworkSubmissions] = useState<HomeworkSubmission[]>([]);

  const [submittingHomework, setSubmittingHomework] = useState<StudentHomeWork | null>(null);

const loadHomeworks = useCallback(async () => {
  const studentHomeworks = await getHomeWorksForStudent(studentGuid, sessionId);
  setRawHomeworks(studentHomeworks);
  setHomeworks(
    studentHomeworks.map((hw) => ({
      id: hw.homeWorkId,
      title: hw.title,
      description: hw.description,
      dueDate: hw.dueDate,
      homeworkFileName: hw.homeworkFileName,
      homeworkOriginalFileName: hw.homeworkOriginalFileName,
    }))
  );
}, [studentGuid, sessionId]);

  useEffect(() => {
    let cancelled = false;

    async function loadAll() {
      setLoading(true);
      setError(null);
      try {
        const [lessons, sessionDetails, libraryItems, attendance] = await Promise.all([
  getLessonsForSession(sessionId),
  getCourseSessionDetailsForStudent(sessionId, studentGuid),
  getCourseLibrarySessionId(sessionId, studentGuid),
  getStudentAttendanceForSession(studentGuid, sessionId),
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
            duration: t('courseDetail.defaultDuration'),
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


setAttendanceRecords(
  attendance.map((a) => ({
    id: a.lessonNumber,
    lessonTitle: a.lessonTitle,
    isPresent: a.wasAttended,
    message: a.message,
  }))
);

        setMaterials(
          (libraryItems as CourseLibraryItem[]).map((m) => ({
            id: m.courseLibraryId,
            title: m.title,
            url: m.filePath,
            type: inferMaterialType(m.filePath),
          }))
        );

        await loadHomeworks();
      } catch (e: any) {
        if (!cancelled) {
          setError(e?.message || t('courseDetail.loadErrorDefault'));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadAll();
    return () => {
      cancelled = true;
    };
  }, [sessionId, studentGuid, courseCategoryName, loadHomeworks, t]);

  const handleOpenSubmitHomework = (hw: Homework) => {
    const full = rawHomeworks.find((r) => r.homeWorkId === hw.id);
    if (!full) {
      console.error('Failed to find raw homework data for id:', hw.id);
      return;
    }
    setSubmittingHomework(full);
  };
  const handleDownloadHomeworkFile = async (fileName?: string, originalFileName?: string) => {
  if (!fileName) return;
  try {
    const blob = await downloadHomeworkFile(fileName);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = originalFileName || fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (e: any) {
    console.error('Ошибка скачивания файла:', e?.message);
  }
};

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm">
        <div className="bg-white rounded-2xl px-6 py-4 text-sm font-bold text-slate-700">
          {t('courseDetail.loading')}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
        <div className="bg-white rounded-2xl px-6 py-4 text-sm font-bold text-rose-700 space-y-3">
          <p>{t('courseDetail.loadError', { error })}</p>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold"
          >
            {t('courseDetail.close')}
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
        onDownloadHomeworkFile={handleDownloadHomeworkFile}
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