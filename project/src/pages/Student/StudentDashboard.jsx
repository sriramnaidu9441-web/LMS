import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/Card';
import './StudentDashboard.css';
import { useAuth } from '../../context/AuthContext';

const StudentDashboard = () => {
  const [stats] = useState({
    enrolledCourses: 6,
    completedCourses: 3,
    inProgress: 3,
    certificates: 3,
  });

  const [enrolledCourses] = useState([
    { id: 1, title: 'React Fundamentals', instructor: 'John Smith', progress: 75, nextLesson: 'Hooks Deep Dive' },
    { id: 2, title: 'JavaScript Advanced', instructor: 'Emily Brown', progress: 90, nextLesson: 'Async Programming' },
    { id: 3, title: 'Python for Beginners', instructor: 'Sarah Johnson', progress: 45, nextLesson: 'Data Structures' },
  ]);

  const [upcomingAssignments] = useState([
    { id: 1, title: 'React Project', course: 'React Fundamentals', dueDate: '2025-11-10', status: 'pending' },
    { id: 2, title: 'JS Quiz', course: 'JavaScript Advanced', dueDate: '2025-11-08', status: 'pending' },
    { id: 3, title: 'Python Assignment', course: 'Python for Beginners', dueDate: '2025-11-12', status: 'submitted' },
  ]);

  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [fullUser, setFullUser] = useState(null);

  useEffect(() => {
    if (!user) return;
    const raw = localStorage.getItem('lmsUsers');
    if (!raw) return;
    try {
      const users = JSON.parse(raw);
      const found = users.find((u) => u.email && user.email && u.email.toLowerCase() === user.email.toLowerCase());
      setFullUser(found || null);
    } catch (e) {
      setFullUser(null);
    }
  }, [user]);

  return (
    <div className="student-dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Student Dashboard</h1>
          <p>Continue your learning journey</p>
        </div>

        <div className="profile-card">
          <img
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'Student')}&background=667eea&color=fff&size=128`}
            alt={user?.name}
            className="profile-avatar"
          />
          <div className="profile-info">
            <div className="profile-name">{user?.name}</div>
            <div className="profile-email">{user?.email}</div>
            <div className="profile-role">Role: {user?.role}</div>
            {fullUser?.createdAt && (
              <div className="profile-joined">Joined: {new Date(fullUser.createdAt).toLocaleDateString()}</div>
            )}
            {fullUser?.phone && <div className="profile-phone">📞 {fullUser.phone}</div>}
            {fullUser?.location && <div className="profile-location">📍 {fullUser.location}</div>}
          </div>
        </div>
      </div>

      <div className="stats-grid">
        <Card className="stat-card">
          <div className="stat-icon" style={{ background: '#667eea' }}>
            📚
          </div>
          <div className="stat-info">
            <h3>{stats.enrolledCourses}</h3>
            <p>Enrolled Courses</p>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="stat-icon" style={{ background: '#10b981' }}>
            ✅
          </div>
          <div className="stat-info">
            <h3>{stats.completedCourses}</h3>
            <p>Completed</p>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="stat-icon" style={{ background: '#f59e0b' }}>
            📖
          </div>
          <div className="stat-info">
            <h3>{stats.inProgress}</h3>
            <p>In Progress</p>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="stat-icon" style={{ background: '#8b5cf6' }}>
            🏆
          </div>
          <div className="stat-info">
            <h3>{stats.certificates}</h3>
            <p>Certificates</p>
          </div>
        </Card>
      </div>

      <div className="dashboard-content">
        <div className="main-section">
          <Card title="Continue Learning">
            <div className="courses-list">
              {enrolledCourses.map(course => (
                <div key={course.id} className="course-card">
                  <div className="course-header">
                      <div>
                        <h4>{course.title}</h4>
                        <p className="instructor">
                          <img
                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(course.instructor)}&background=667eea&color=fff&size=48`}
                            alt={course.instructor}
                            className="avatar"
                            title={course.instructor}
                          />
                        </p>
                      </div>
                    <span className="progress-badge">{course.progress}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${course.progress}%` }}></div>
                  </div>
                  <div className="course-footer">
                    <span className="next-lesson">Next: {course.nextLesson}</span>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => navigate(`/student/courses`)}
                    >
                      Continue
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="side-section">
          <Card title="Upcoming Assignments">
            <div className="assignments-list">
              {upcomingAssignments.map(assignment => (
                <div key={assignment.id} className="assignment-item">
                  <div className="assignment-info">
                    <h5>{assignment.title}</h5>
                    <p className="assignment-course">{assignment.course}</p>
                    <p className="assignment-due">Due: {new Date(assignment.dueDate).toLocaleDateString()}</p>
                  </div>
                  <span className={`status-badge ${assignment.status}`}>
                    {assignment.status}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Quick Actions" className="quick-actions-card">
            <div className="quick-actions">
                <button className="action-btn" onClick={() => { console.log('[StudentDashboard] Explore clicked'); navigate('/student/explore'); }}>
                  <span>🔍</span>
                  Explore Courses
                </button>
                <button className="action-btn" onClick={() => { console.log('[StudentDashboard] Progress clicked'); navigate('/student/progress'); }}>
                  <span>📊</span>
                  View Progress
                </button>
                <button className="action-btn" onClick={() => { console.log('[StudentDashboard] Certificates clicked'); navigate('/student/certificates'); }}>
                  <span>🏆</span>
                  My Certificates
                </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
