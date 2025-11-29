import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/Card';
import './CourseManagement.css';

const CourseManagement = () => {
  const initialCourses = [
    { id: 1, title: 'React Fundamentals', instructor: 'John Smith', students: 85, status: 'published', category: 'Web Development', thumbnail: '/assets/course-1.svg' },
    { id: 2, title: 'JavaScript Advanced', instructor: 'Emily Brown', students: 120, status: 'published', category: 'Programming', thumbnail: '/assets/course-2.svg' },
    { id: 3, title: 'Python for Beginners', instructor: 'Sarah Johnson', students: 75, status: 'published', category: 'Programming', thumbnail: '/assets/course-3.svg' },
    { id: 4, title: 'Node.js Backend', instructor: 'John Smith', students: 65, status: 'draft', category: 'Web Development', thumbnail: '/assets/course-4.svg' },
  ];

  const ensureThumbnails = (list) => {
    const available = 22;
    return list.map((c, idx) => {
      if (c && c.thumbnail) return c;
      const n = (idx % available) + 1;
      return { ...c, thumbnail: `/assets/course-${n}.svg` };
    });
  };

  const [courses, setCourses] = useState(() => ensureThumbnails(initialCourses));

  const [filterStatus, setFilterStatus] = useState('all');
  const navigate = useNavigate();

  // persist admin courses so settings can modify them later
  useEffect(() => {
    try {
      localStorage.setItem('lmsAdminCourses', JSON.stringify(courses));
    } catch (e) {
      // ignore
    }
  }, [courses]);

  const filteredCourses = courses.filter(course => 
    filterStatus === 'all' || course.status === filterStatus
  );

  const handleDeleteCourse = (courseId) => {
    if (confirm('Are you sure you want to delete this course?')) {
      setCourses(courses.filter(course => course.id !== courseId));
    }
  };

  return (
    <div className="course-management">
      <div className="page-header">
        <div>
          <h1>Course Management</h1>
          <p>Manage all courses on the platform</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn btn-outline" onClick={() => navigate('/admin/settings')}>⚙️ Settings</button>
          <button className="btn btn-primary">
            ➕ Create New Course
          </button>
        </div>
      </div>

      <Card>
        <div className="filters-section">
          <div className="filter-buttons">
            <button
              className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
              onClick={() => setFilterStatus('all')}
            >
              All Courses
            </button>
            <button
              className={`filter-btn ${filterStatus === 'published' ? 'active' : ''}`}
              onClick={() => setFilterStatus('published')}
            >
              Published
            </button>
            <button
              className={`filter-btn ${filterStatus === 'draft' ? 'active' : ''}`}
              onClick={() => setFilterStatus('draft')}
            >
              Draft
            </button>
          </div>
        </div>

        <div className="courses-grid">
          {filteredCourses.map(course => (
              <div key={course.id} className="course-card">
                <div className="course-image">
                  <img src={course.thumbnail} alt={course.title} className="course-thumb" />
                  <span className={`status-badge ${course.status}`}>
                    {course.status}
                  </span>
                </div>
              <div className="course-body">
                <span className="course-category">{course.category}</span>
                <h3>{course.title}</h3>
                <p className="course-instructor">By {course.instructor}</p>
                <div className="course-stats">
                  <span>👥 {course.students} students</span>
                </div>
              </div>
              <div className="course-actions">
                <button className="btn btn-sm btn-primary">Edit</button>
                <button className="btn btn-sm btn-secondary">View</button>
                <button 
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDeleteCourse(course.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default CourseManagement;
