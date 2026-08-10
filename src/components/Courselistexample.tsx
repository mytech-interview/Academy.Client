// Example: wiring CourseCard -> CourseDetailModal in whatever list/page
// component renders the cards (e.g. CoursesPage.tsx). Drop this pattern
// into your existing list component — this file is just the wiring, not
// a full page.

import React, { useState } from 'react';
import CourseCard from './CourseCard';
import CourseDetailModal from './CourseDetailModal';
import { ActiveSession } from '../types';

interface CourseListProps {
  courses: ActiveSession[];
  enrolledSessionIds: (string | number)[];
  isLoggedIn: boolean;
  userRole: string | undefined;
  studentGuid?: string;
  onEnroll: (sessionId: string | number) => void;
  onStartStudy: (sessionId: string | number) => void;
  enrollingSessionId?: string | number | null;
}

export default function CourseList({
  courses,
  enrolledSessionIds,
  isLoggedIn,
  userRole,
  studentGuid,
  onEnroll,
  onStartStudy,
  enrollingSessionId,
}: CourseListProps) {
  const [selectedCourse, setSelectedCourse] = useState<ActiveSession | null>(null);

  const isModalOpen = selectedCourse !== null;
  const isSelectedEnrolled = selectedCourse
    ? enrolledSessionIds.includes(selectedCourse.sessionId)
    : false;

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {courses.map((course) => (
          <CourseCard
            key={course.sessionId}
            course={course}
            isEnrolled={enrolledSessionIds.includes(course.sessionId)}
            isLoggedIn={isLoggedIn}
            userRole={userRole}
            isEnrolling={enrollingSessionId === course.sessionId}
            // "Details" button -> opens the modal for this course
            onSelect={() => setSelectedCourse(course)}
            onEnroll={() => onEnroll(course.sessionId)}
          />
        ))}
      </div>

      {selectedCourse && (
        <CourseDetailModal
          course={selectedCourse}
          isOpen={isModalOpen}
          onClose={() => setSelectedCourse(null)}
          isEnrolled={isSelectedEnrolled}
          isLoggedIn={isLoggedIn}
          userRole={userRole}
          studentGuid={studentGuid}
          onEnroll={() => onEnroll(selectedCourse.sessionId)}
          onStartStudy={() => onStartStudy(selectedCourse.sessionId)}
        />
      )}
    </>
  );
}