import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/Card';
import './Courses.css';

const STORAGE_KEY = 'lmsEnrolledCourses';

const defaultCourses = [
  { id: 1, title: 'React Fundamentals', instructor: 'John Smith', progress: 75, nextLesson: 'Hooks Deep Dive', status: 'in-progress', thumbnail: '/assets/course-1.svg' },
  { id: 2, title: 'JavaScript Advanced', instructor: 'Emily Brown', progress: 90, nextLesson: 'Async Programming', status: 'completed', thumbnail: '/assets/course-2.svg' },
  { id: 3, title: 'Python for Beginners', instructor: 'Sarah Johnson', progress: 45, nextLesson: 'Data Structures', status: 'in-progress', thumbnail: '/assets/course-3.svg' },
];

const StudentCourses = () => {
  const buildInitial = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const available = 22;
      const list = stored ? JSON.parse(stored) : defaultCourses;
      return list.map((c, idx) => {
        if (c && c.thumbnail) return c;
        const n = (idx % available) + 1;
        return { ...c, thumbnail: `/assets/course-${n}.svg` };
      });
    } catch (e) {
      return defaultCourses;
    }
  };

  const [courses, setCourses] = useState(buildInitial);

  const navigate = useNavigate();

  // persist whenever courses change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
    } catch (e) {
      // ignore storage errors
    }
  }, [courses]);

  const handleContinue = (id) => {
    navigate(`/student/courses/${id}`);
  };

  const handleView = (id) => {
    navigate(`/student/courses/${id}`);
  };

  const handleUnenroll = (id) => {
    setCourses(prev => prev.filter(c => c.id !== id));
  };

  const avatarUrl = (name) =>
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=667eea&color=fff&size=64`;

  const ensureThumbnails = (list) => {
    const available = 22; // we have course-1..course-22.svg in public/assets
    return list.map((c, idx) => {
      if (c.thumbnail) return c;
      const n = (idx % available) + 1;
      return { ...c, thumbnail: `/assets/course-${n}.svg` };
    });
  };

  return (
    <div className="page student-courses">
      <div className="page-header">
        <h1>My Courses</h1>
        <p>Courses you are currently enrolled in.</p>
      </div>

      <div className="courses-grid">
        {courses.length === 0 && (
          <Card>
            <p>You are not enrolled in any courses yet. Explore available courses to get started.</p>
          </Card>
        )}

        {ensureThumbnails(courses).map(course => (
          <Card key={course.id} className="course-card" title={course.title} actions={
            <div className="course-actions">
              <button className="btn btn-sm btn-primary" onClick={() => handleContinue(course.id)}>Continue</button>
              <button className="btn btn-sm" onClick={() => handleView(course.id)}>View</button>
              <button className="btn btn-sm btn-danger" onClick={() => handleUnenroll(course.id)}>Unenroll</button>
            </div>
          }>
            <div className="course-body">
              <div className="course-image-wrap">
                <img src={course.thumbnail || avatarUrl(course.instructor)} alt={course.instructor} className="course-image" title={course.instructor} />
                <div className="image-overlay"></div>
              </div>
              <div className="progress-line">
                <div className="progress-fill" style={{ width: `${course.progress}%` }}></div>
              </div>
              <div className="meta-row">
                <span className="progress-text">{course.progress}%</span>
                <span className="next-lesson">Next: {course.nextLesson}</span>
                <span className={`status-badge ${course.status}`}>{course.status}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StudentCourses;
