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
import StudentFormModal, { StudentFormValues } from '../components/StudentFormModal';
import CourseFormModal, { CourseFormValues, CourseCategoryOption } from '../components/Coursesformmodal';
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
type StudentModalState = { mode: 'edit'; student: StudentItem } | null;

export default function AdminDashboardPage() {
  const { activeUser } = useApp() as { activeUser?: { name?: string; email?: string } };
  const userGuid = useAdminGuid();

  const [activeTab, setActiveTab] = useState<AdminTab>('users');
  const [searchQuery, setSearchQuery] = useState('');

  // ── Lecturers ──
  const [lecturers, setLecturers] = useState<LecturerItem[]>([]);
  const [lecturersLoading, setLecturersLoading] = useState(true);
  const [lecturersError, setLecturersError] = useState<string | null>(null);

  // ── Students ──
  const [students, setStudents] = useState<StudentItem[]>([]);
  const [studentsLoading, setStudentsLoading] = useState(true);
  const [studentsError, setStudentsError] = useState<string | null>(null);
  const [studentModal, setStudentModal] = useState<StudentModalState>(null);
  const [studentSubmitting, setStudentSubmitting] = useState(false);
  const [lecturerSubmitting, setLecturerSubmitting] = useState(false); 

  // ── Sessions ──
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);
  const [sessionsError, setSessionsError] = useState<string | null>(null);
  const [sessionModal, setSessionModal] = useState<SessionModalState>(null);
  const [sessionSubmitting, setSessionSubmitting] = useState(false);

  // ── Courses ──
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [coursesError, setCoursesError] = useState<string | null>(null);
  const [courseModal, setCourseModal] = useState<CourseModalState>(null);
  const [courseSubmitting, setCourseSubmitting] = useState(false);

  // ── Categories ──
  const [categories, setCategories] = useState<string[]>([]);

  // ── Local Sections ──
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(EMPTY_SETTINGS);
  const TEMP_COURSE_CATEGORIES: CourseCategoryOption[] = [
  { id: 1, name: 'პროგრამირება' },
  { id: 2, name: 'დიზაინი' },
  { id: 3, name: 'ბიზნესი და მარკეტინგი' },
];

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
        .catch(() => {});
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
  }, [fetchLecturers, fetchStudents, fetchSessions, fetchCourses]);

  // ── Lecturer mutations ──
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
  setLecturers((list) => list.map((l) => (l.id === id ? { ...l, isPinned: !l.isPinned } : l)));
};

// Разбивает "Имя Фамилия" на firstName/lastName — так же, как в StudentFormModal
function splitFullName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(' ');
  return {
    firstName: parts[0] || '',
    lastName: parts.slice(1).join(' ') || '',
  };
}

const handleAddLecturer = async (data: Partial<LecturerItem> & Record<string, any>) => {
  setLecturerSubmitting(true);
  try {
    const { firstName, lastName } = splitFullName(data.name ?? '');
    await adminApi.addTeacher({
      userGuid,
      firstName,
      lastName,
      email: data.email ?? '',
      telephone: data.phone ?? '',
      password: data.password ?? '',
      picture: data.avatarIcon ?? '',
      isActive: true,
    } as any); // ← см. примечание про типы ниже
    await fetchLecturers();
  } catch (err) {
    alert(err instanceof Error ? err.message : 'ლექტორის დამატება ვერ მოხერხდა');
  } finally {
    setLecturerSubmitting(false);
  }
};

const handleEditLecturer = async (lecturer: LecturerItem & Record<string, any>) => {
  setLecturerSubmitting(true);
  try {
    const { firstName, lastName } = splitFullName(lecturer.name ?? '');
    await adminApi.editTeacher({
      teacherId: lecturer.userId,
      userGuid,
      firstName,
      lastName,
      email: lecturer.email ?? '',
      telephone: lecturer.phone ?? '',
      picture: lecturer.avatarIcon ?? '',
      isActive: true,
    } as any); // ← см. примечание про типы ниже
    await fetchLecturers();
  } catch (err) {
    alert(err instanceof Error ? err.message : 'ლექტორის რედაქტირება ვერ მოხერხდა');
  } finally {
    setLecturerSubmitting(false);
  }
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

  const handleOpenEditStudent = (student: StudentItem) => {
    setStudentModal({ mode: 'edit', student });
  };

  const handleCloseStudentModal = () => setStudentModal(null);

  const handleSubmitStudentForm = async (values: StudentFormValues) => {
    setStudentSubmitting(true);
    try {
      await adminApi.editStudent({
        studentId: values.studentId,
        userGuid,
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        telephone: values.telephone,
        picture: values.picture ?? '',
        isActive: values.isActive,
      });
      setStudentModal(null);
      await fetchStudents();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'სტუდენტის მონაცემების შენახვა ვერ მოხერხდა');
    } finally {
      setStudentSubmitting(false);
    }
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

  const handleDeleteCourse = async (course: CourseItem) => {
    if (!confirm(`ნამდვილად გსურთ კურსის "${course.title}" წაშლა?`)) return;
    const prev = courses;
    setCourses((list) => list.filter((c) => c.id !== course.id));
    try {
      await coursesApi.deleteCourse({ courseId: course.courseId, userGuid });
    } catch (err) {
      setCourses(prev);
      alert(err instanceof Error ? err.message : 'კურსის წაშლა ვერ მოხერხდა');
    }
  };

  // ── Combined Users ──
  const combinedUsers: SystemUserItem[] = [
    ...lecturers.map(lecturerToSystemUser),
    ...students.map(studentToSystemUser),
  ];
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

  // ── Categories ──
  const handleAddCategory = (category: string) => setCategories((list) => [...list, category]);
  const handleRemoveCategory = (category: string) => setCategories((list) => list.filter((c) => c !== category));

  // ── Other Local Sections ──
  const handleDeleteProject = (id: string) => setProjects((list) => list.filter((p) => p.id !== id));
  const handleDeleteVideo = (id: string) => setVideos((list) => list.filter((v) => v.id !== id));
  const handleDeleteMedia = (id: string) => setMedia((list) => list.filter((m) => m.id !== id));

  const handleSettingsChange = (field: keyof SiteSettings, value: string) =>
    setSiteSettings((prev) => ({ ...prev, [field]: value }));

  const handleSaveSettings = () => {
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
              // onDelete={handleDeleteCourse}
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
              onEdit={handleOpenEditStudent}
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
  courses={courses}
  lecturers={lecturers}
  onClose={handleCloseSessionModal}
  onSubmit={handleSubmitSessionForm}
/>
      )}

{courseModal && (
  <CourseFormModal
    mode={courseModal.mode}
    initial={courseModal.mode === 'edit' ? courseModal.course : undefined}
    submitting={courseSubmitting}
    categories={TEMP_COURSE_CATEGORIES}
    onClose={handleCloseCourseModal}
    onSubmit={handleSubmitCourseForm}
  />
)}

      {studentModal && (
        <StudentFormModal
          initial={studentModal.student}
          submitting={studentSubmitting}
          onClose={handleCloseStudentModal}
          onSubmit={handleSubmitStudentForm}
        />
      )}
    </div>
  );
}