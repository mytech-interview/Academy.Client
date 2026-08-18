import React, { useCallback, useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import * as adminApi from '../api/adminapi';
import * as sessionsApi from '../api/Sessionsapi';
import * as coursesApi from '../api/Coursesapi';
import AdminHeader from '../components/Adminheader';
import AdminSidebar from '../components/Adminsidebar';
import CoursesCategoriesTab from '../components/Coursescategoriestab';
import SessionsTab from '../components/Sessionstab';
import LecturersTab from '../components/Lecturerstab';
import ProjectsTab from '../components/Projectstab';
import MediaTab from '../components/Mediatab';
import UsersTab from '../components/Userstab';
import StudentsTab from '../components/Studentstab';
import VideosTab from '../components/Videostab';
import SettingsTab from '../components/Settingstab';
import InProgressTab from '../components/Inprogresstab';
import SessionFormModal, { SessionFormValues } from '../components/Sessionformmodal';
import CourseFormModal, { CourseFormValues } from '../components/Coursesformmodal';
import {
  AdminTab,
  CourseItem,
  LecturerItem,
  MediaItem,
  ProjectItem,
  SessionItem,
  SiteSettings,
  StudentItem,
  SystemUserItem,
  VideoItem,
  lecturerToSystemUser,
  mapCourseDtoToCourseItem,
  mapSessionDtoToSessionItem,
  mapStudentToStudentItem,
  mapTeacherToLecturer,
  studentToSystemUser,
} from '../types';
// activeUser.id holds the user's GUID — same convention AppContext already
// uses for studentGuid in handleEnrollInCourse. If that ever changes, this
// is the only place to update.
function useAdminGuid(): string {
  const { activeUser } = useApp() as { activeUser?: { id?: string } };
  return activeUser?.id ?? '';
}
 
const EMPTY_SETTINGS: SiteSettings = {
  studentsCount: '',
  lecturersCount: '',
  branchesCount: '',
  countriesCount: '',
  graduatesCount: '',
  promoTitle: '',
  promoPrice: '',
  phone: '',
  email: '',
  address: '',
  workHours: '',
  aboutTitle: '',
  aboutDescription: '',
  videoUrl: '',
};
 
type SessionModalState = { mode: 'add' } | { mode: 'edit'; session: SessionItem } | null;
type CourseModalState = { mode: 'add' } | { mode: 'edit'; course: CourseItem } | null;
 
export default function AdminDashboardPage() {
  const { activeUser } = useApp() as { activeUser?: { name?: string; email?: string } };
  const userGuid = useAdminGuid();
 
  const [activeTab, setActiveTab] = useState<AdminTab>('users');
  const [searchQuery, setSearchQuery] = useState('');
 
  // ── Lecturers (backed by GetAllTeachers / EditTeacher / DeleteTeacher) ──
  const [lecturers, setLecturers] = useState<LecturerItem[]>([]);
  const [lecturersLoading, setLecturersLoading] = useState(true);
  const [lecturersError, setLecturersError] = useState<string | null>(null);
 
  // ── Students (backed by GetAllStudents / EditStudent / DeleteStudent) ──
  const [students, setStudents] = useState<StudentItem[]>([]);
  const [studentsLoading, setStudentsLoading] = useState(true);
  const [studentsError, setStudentsError] = useState<string | null>(null);
 
  // ── Sessions (backed by GetAllSessions + addSession/updateSession/deleteSession) ──
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);
  const [sessionsError, setSessionsError] = useState<string | null>(null);
  const [sessionModal, setSessionModal] = useState<SessionModalState>(null);
  const [sessionSubmitting, setSessionSubmitting] = useState(false);
 
  // ── Courses (backed by GetAllCourses + addCourse/updateCourse — no delete yet) ──
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [coursesError, setCoursesError] = useState<string | null>(null);
  const [courseModal, setCourseModal] = useState<CourseModalState>(null);
  const [courseSubmitting, setCourseSubmitting] = useState(false);
 
  // ── Categories — still local-only, no backend endpoint (see Coursescategoriestab) ──
  const [categories, setCategories] = useState<string[]>([]);
 
  // ── Sections with no backend endpoint yet — local-only state ──
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(EMPTY_SETTINGS);
 
  const fetchLecturers = useCallback(async () => {
    setLecturersLoading(true);
    setLecturersError(null);
    try {
      const res = await adminApi.getAllTeachers({ userGuid });
      setLecturers((res.lessons ?? []).map(mapTeacherToLecturer));
    } catch (err) {
      setLecturersError(err instanceof Error ? err.message : 'ლექტორების ჩატვირთვა ვერ მოხერხდა');
    } finally {
      setLecturersLoading(false);
    }
  }, [userGuid]);
 
  const fetchStudents = useCallback(async () => {
    setStudentsLoading(true);
    setStudentsError(null);
    try {
      const res = await adminApi.getAllStudents({ userGuid });
      setStudents((res.students ?? []).map(mapStudentToStudentItem));
    } catch (err) {
      setStudentsError(err instanceof Error ? err.message : 'სტუდენტების ჩატვირთვა ვერ მოხერხდა');
    } finally {
      setStudentsLoading(false);
    }
  }, [userGuid]);
 
  // Fetches enrolled-student counts per session and patches them into
  // `sessions` state as they arrive. Best-effort: getAllStudentsOfSpecificSession
  // requires a teacherGuid, and it's unconfirmed whether the backend lets an
  // admin call it for a teacher that isn't themselves — if it 401/403s per
  // session, that session's count is silently left at 0 instead of breaking
  // the whole list. TODO(api): confirm admin access on this endpoint.
  const fetchSessionStudentCounts = useCallback((sessionList: SessionItem[]) => {
    sessionList.forEach((session) => {
      sessionsApi
        .getAllStudentsOfSpecificSession({
          teacherGuid: session.teacherGuid,
          sessionId: Number(session.id),
        })
        .then((res) => {
          const count = res.students?.length ?? 0;
          setSessions((prev) => prev.map((s) => (s.id === session.id ? { ...s, currentStudents: count } : s)));
        })
        .catch(() => {
          // ignore per-session failure — see TODO above
        });
    });
  }, []);
 
  const fetchSessions = useCallback(async () => {
    setSessionsLoading(true);
    setSessionsError(null);
    try {
      const res = await adminApi.getAllSessions({ userGuid });
      const mapped = (res.sessions ?? []).map(mapSessionDtoToSessionItem);
      setSessions(mapped);
      fetchSessionStudentCounts(mapped);
    } catch (err) {
      setSessionsError(err instanceof Error ? err.message : 'სესიების ჩატვირთვა ვერ მოხერხდა');
    } finally {
      setSessionsLoading(false);
    }
  }, [userGuid, fetchSessionStudentCounts]);
 
  const fetchCourses = useCallback(async () => {
    setCoursesLoading(true);
    setCoursesError(null);
    try {
      const res = await coursesApi.getAllCourses({ userGuid });
      setCourses((res.courses ?? []).map(mapCourseDtoToCourseItem));
    } catch (err) {
      setCoursesError(err instanceof Error ? err.message : 'კურსების ჩატვირთვა ვერ მოხერხდა');
    } finally {
      setCoursesLoading(false);
    }
  }, [userGuid]);
 
  useEffect(() => {
    fetchLecturers();
    fetchStudents();
    fetchSessions();
    fetchCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
 
  // ── Lecturer mutations ──
  const handleDeleteLecturer = async (lecturer: LecturerItem) => {
    const prev = lecturers;
    setLecturers((list) => list.filter((l) => l.id !== lecturer.id));
    try {
      await adminApi.deleteTeacher({ teacherId: lecturer.userId, userGuid });
    } catch (err) {
      setLecturers(prev);
      alert(err instanceof Error ? err.message : 'ლექტორის წაშლა ვერ მოხერხდა');
    }
  };
 
  const handleTogglePinLecturer = (id: string) => {
    // TODO(api): "pinned" isn't persisted anywhere — UI-only for now.
    setLecturers((list) => list.map((l) => (l.id === id ? { ...l, isPinned: !l.isPinned } : l)));
  };
 
  const handleEditLecturer = (_lecturer: LecturerItem) => {
    // TODO: no edit form/modal built yet — EditTeacher API is wired in
    // api/adminapi.ts and ready to call once there's a form to collect input.
    alert('ლექტორის რედაქტირების ფორმა ჯერ არ არის აწყობილი.');
  };
 
  // ── Student mutations ──
  const handleDeleteStudent = async (student: StudentItem) => {
    const prev = students;
    setStudents((list) => list.filter((s) => s.id !== student.id));
    try {
      await adminApi.deleteStudent({ studentId: student.userId, userGuid });
    } catch (err) {
      setStudents(prev);
      alert(err instanceof Error ? err.message : 'სტუდენტის წაშლა ვერ მოხერხდა');
    }
  };
 
  const handleEditStudent = (_student: StudentItem) => {
    // TODO: no edit form/modal built yet — EditStudent API is wired in
    // api/adminapi.ts and ready to call once there's a form to collect input.
    alert('სტუდენტის რედაქტირების ფორმა ჯერ არ არის აწყობილი.');
  };
 
  const handleAddStudent = () => {
    // TODO(api): AdminController has no addStudent endpoint yet.
    alert('სტუდენტის დამატება ჯერ შეუძლებელია — backend-ს არ აქვს შესაბამისი endpoint.');
  };
 
  const handleAddLecturer = () => {
    // addTeacher IS wired in api/adminapi.ts — only the form/modal to
    // collect firstName/lastName/email/telephone/password is missing.
    alert('ლექტორის დამატების ფორმა ჯერ არ არის აწყობილი (API უკვე მზადაა).');
  };
 
  // ── Session mutations ──
  const handleOpenAddSession = () => setSessionModal({ mode: 'add' });
  const handleOpenEditSession = (session: SessionItem) => setSessionModal({ mode: 'edit', session });
  const handleCloseSessionModal = () => setSessionModal(null);
 
  const handleSubmitSessionForm = async (values: SessionFormValues) => {
    setSessionSubmitting(true);
    try {
      if (sessionModal?.mode === 'add') {
        await sessionsApi.addSession({
          courseId: values.courseId,
          teacherGuid: values.teacherGuid,
          weeks: values.weeks,
          startDate: values.startDate,
          endDate: values.endDate,
          cityId: values.cityId,
          attendanceModeId: values.attendanceModeId,
        });
      } else if (sessionModal?.mode === 'edit') {
        await sessionsApi.updateSession({
          sessionId: Number(sessionModal.session.id),
          courseId: values.courseId,
          teacherGuid: values.teacherGuid,
          weeks: values.weeks,
          startDate: values.startDate,
          endDate: values.endDate,
          cityId: values.cityId,
          isActive: values.isActive,
          userGuid,
          attendanceModeId: values.attendanceModeId,
        });
      }
      setSessionModal(null);
      await fetchSessions();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'სესიის შენახვა ვერ მოხერხდა');
    } finally {
      setSessionSubmitting(false);
    }
  };
 
  const handleDeleteSession = async (session: SessionItem) => {
    if (!confirm(`წავშალოთ სესია "${session.sessionName}"?`)) return;
    const prev = sessions;
    setSessions((list) => list.filter((s) => s.id !== session.id));
    try {
      // ASSUMPTION: DeleteSessionRequest shape — see TODO in types.ts.
      await sessionsApi.deleteSession({ sessionId: Number(session.id), userGuid });
    } catch (err) {
      setSessions(prev);
      alert(err instanceof Error ? err.message : 'სესიის წაშლა ვერ მოხერხდა');
    }
  };
 
  // ── Course mutations ──
  const handleOpenAddCourse = () => setCourseModal({ mode: 'add' });
  const handleOpenEditCourse = (course: CourseItem) => setCourseModal({ mode: 'edit', course });
  const handleCloseCourseModal = () => setCourseModal(null);
 
  const handleSubmitCourseForm = async (values: CourseFormValues) => {
    setCourseSubmitting(true);
    try {
      if (courseModal?.mode === 'add') {
        await coursesApi.addCourse({
          courseCategoryId: values.courseCategoryId,
          courseEntryLevelId: values.courseEntryLevelId,
          title: values.title,
          description: values.description,
          price: values.price,
          maxStudents: values.maxStudents,
          userGuid,
        });
      } else if (courseModal?.mode === 'edit') {
        await coursesApi.updateCourse({
          courseId: courseModal.course.courseId,
          courseCategoryId: values.courseCategoryId,
          courseEntryLevelId: values.courseEntryLevelId,
          title: values.title,
          description: values.description,
          startDate: values.startDate ?? '',
          endDate: values.endDate ?? '',
          price: values.price,
          maxStudents: values.maxStudents,
          userGuid,
          picture: values.picture ?? '',
          isActive: values.isActive ?? true,
        });
      }
      setCourseModal(null);
      await fetchCourses();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'კურსის შენახვა ვერ მოხერხდა');
    } finally {
      setCourseSubmitting(false);
    }
  };
 
  // ── Combined "users" tab (teachers + students; no admin source yet) ──
  const combinedUsers: SystemUserItem[] = [...lecturers.map(lecturerToSystemUser), ...students.map(studentToSystemUser)];
  const usersLoading = lecturersLoading || studentsLoading;
  const usersError = lecturersError || studentsError;
 
  const handleDeleteUser = async (user: SystemUserItem) => {
    if (user.id.startsWith('teacher-')) {
      const lecturer = lecturers.find((l) => `teacher-${l.id}` === user.id);
      if (lecturer) await handleDeleteLecturer(lecturer);
    } else if (user.id.startsWith('student-')) {
      const student = students.find((s) => `student-${s.id}` === user.id);
      if (student) await handleDeleteStudent(student);
    }
  };
 
  // ── Categories (local-only — see Coursescategoriestab NOTE) ──
  const handleAddCategory = (category: string) => setCategories((list) => [...list, category]);
  const handleRemoveCategory = (category: string) => setCategories((list) => list.filter((c) => c !== category));
 
  // ── Other local-only sections ──
  const handleDeleteProject = (id: string) => setProjects((list) => list.filter((p) => p.id !== id));
  const handleDeleteVideo = (id: string) => setVideos((list) => list.filter((v) => v.id !== id));
  const handleDeleteMedia = (id: string) => setMedia((list) => list.filter((m) => m.id !== id));
 
  const handleSettingsChange = (field: keyof SiteSettings, value: string) =>
    setSiteSettings((prev) => ({ ...prev, [field]: value }));
 
  const handleSaveSettings = () => {
    // TODO(api): no endpoint to persist site settings yet — this is a no-op.
    alert('პარამეტრები ლოკალურად შეინახა — backend-ს ჯერ არ აქვს შესანახი endpoint.');
  };
 
  const knownTabs: AdminTab[] = [
    'courses_categories',
    'sessions',
    'lecturers',
    'students',
    'users',
    'projects',
    'videos',
    'media',
    'settings',
  ];
 
  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800">
      <AdminHeader adminName={activeUser?.name} adminEmail={activeUser?.email} />
 
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col lg:flex-row gap-8 -mt-4">
        <AdminSidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          counts={{
            courses: courses.length,
            sessions: sessions.length,
            lecturers: lecturers.length,
            students: students.length,
            users: combinedUsers.length,
            projects: projects.length,
            videos: videos.length,
            gallery: 0,
            media: media.length,
          }}
        />
 
        <main className="flex-1 space-y-6">
          {activeTab === 'users' && (
            <UsersTab
              users={combinedUsers}
              loading={usersLoading}
              error={usersError}
              searchQuery={searchQuery}
              onRetry={() => {
                fetchLecturers();
                fetchStudents();
              }}
              onDelete={handleDeleteUser}
            />
          )}
 
          {activeTab === 'courses_categories' && (
            <CoursesCategoriesTab
              courses={courses}
              loading={coursesLoading}
              error={coursesError}
              categories={categories}
              searchQuery={searchQuery}
              onRetry={fetchCourses}
              onAddCategory={handleAddCategory}
              onRemoveCategory={handleRemoveCategory}
              onAdd={handleOpenAddCourse}
              onEdit={handleOpenEditCourse}
            />
          )}
 
          {activeTab === 'sessions' && (
            <SessionsTab
              sessions={sessions}
              loading={sessionsLoading}
              error={sessionsError}
              searchQuery={searchQuery}
              onRetry={fetchSessions}
              onAdd={handleOpenAddSession}
              onEdit={handleOpenEditSession}
              onDelete={handleDeleteSession}
            />
          )}
 
          {activeTab === 'lecturers' && (
            <LecturersTab
              lecturers={lecturers}
              loading={lecturersLoading}
              error={lecturersError}
              searchQuery={searchQuery}
              onRetry={fetchLecturers}
              onAdd={handleAddLecturer}
              onEdit={handleEditLecturer}
              onDelete={handleDeleteLecturer}
              onTogglePin={handleTogglePinLecturer}
            />
          )}
 
          {activeTab === 'students' && (
            <StudentsTab
              students={students}
              loading={studentsLoading}
              error={studentsError}
              searchQuery={searchQuery}
              onRetry={fetchStudents}
              onAdd={handleAddStudent}
              onEdit={handleEditStudent}
              onDelete={handleDeleteStudent}
            />
          )}
 
          {activeTab === 'projects' && <ProjectsTab projects={projects} onDelete={handleDeleteProject} />}
 
          {activeTab === 'videos' && <VideosTab videos={videos} searchQuery={searchQuery} onDelete={handleDeleteVideo} />}
 
          {activeTab === 'media' && <MediaTab media={media} searchQuery={searchQuery} onDelete={handleDeleteMedia} />}
 
          {activeTab === 'settings' && (
            <SettingsTab settings={siteSettings} onChange={handleSettingsChange} onSave={handleSaveSettings} />
          )}
 
          {!knownTabs.includes(activeTab) && <InProgressTab label={activeTab} />}
        </main>
      </div>
 
      {sessionModal && (
        <SessionFormModal
          mode={sessionModal.mode}
          initial={sessionModal.mode === 'edit' ? sessionModal.session : undefined}
          submitting={sessionSubmitting}
          onClose={handleCloseSessionModal}
          onSubmit={handleSubmitSessionForm}
        />
      )}
 
      {courseModal && (
        <CourseFormModal
          mode={courseModal.mode}
          initial={courseModal.mode === 'edit' ? courseModal.course : undefined}
          submitting={courseSubmitting}
          onClose={handleCloseCourseModal}
          onSubmit={handleSubmitCourseForm}
        />
      )}
    </div>
  );
}
 