import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/Card';
import './InstructorDashboard.css';
import { useAuth } from '../../context/AuthContext';

const InstructorDashboard = () => {
  const [stats] = useState({
    myCourses: 12,
    totalStudents: 345,
    pendingAssignments: 28,
    averageRating: 4.7,
  });

  const [courses] = useState([
    { id: 1, title: 'React Fundamentals', students: 85, status: 'active', progress: 75 },
    { id: 2, title: 'JavaScript Advanced', students: 120, status: 'active', progress: 90 },
    { id: 3, title: 'Node.js Backend', students: 65, status: 'active', progress: 60 },
    { id: 4, title: 'Python for Beginners', students: 75, status: 'draft', progress: 30 },
  ]);

  const navigate = useNavigate();
  const { user } = useAuth();
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

  const [recentSubmissions] = useState([
    { id: 1, student: 'John Doe', assignment: 'React Project', course: 'React Fundamentals', time: '10 min ago' },
    { id: 2, student: 'Jane Smith', assignment: 'JS Quiz', course: 'JavaScript Advanced', time: '1 hour ago' },
    { id: 3, student: 'Mike Wilson', assignment: 'Node API', course: 'Node.js Backend', time: '2 hours ago' },
  ]);

  return (
    <div className="instructor-dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Instructor Dashboard</h1>
          <p>Manage your courses and engage with students</p>
        </div>

        <div className="profile-card">
          <img
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'Instructor')}&background=667eea&color=fff&size=128`}
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
            <h3>{stats.myCourses}</h3>
            <p>My Courses</p>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="stat-icon" style={{ background: '#10b981' }}>
            👨‍🎓
          </div>
          <div className="stat-info">
            <h3>{stats.totalStudents}</h3>
            <p>Total Students</p>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="stat-icon" style={{ background: '#f59e0b' }}>
            📝
          </div>
          <div className="stat-info">
            <h3>{stats.pendingAssignments}</h3>
            <p>Pending Reviews</p>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="stat-icon" style={{ background: '#8b5cf6' }}>
            ⭐
          </div>
          <div className="stat-info">
            <h3>{stats.averageRating}</h3>
            <p>Average Rating</p>
          </div>
        </Card>
      </div>

      <div className="dashboard-content">
        <div className="main-section">
          <Card title="My Courses">
            <div className="courses-list">
              {courses.map(course => (
                <div key={course.id} className="course-item">
                  <div className="course-info">
                    <h4>{course.title}</h4>
                    <p>{course.students} students enrolled</p>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${course.progress}%` }}></div>
                    </div>
                    <span className="progress-text">{course.progress}% complete</span>
                  </div>
                  <div className="course-actions">
                    <span className={`status-badge ${course.status}`}>
                      {course.status}
                    </span>
                    <button className="btn btn-sm btn-primary" onClick={() => navigate('/instructor/courses')}>Manage</button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="side-section">
          <Card title="Recent Submissions">
            <div className="submissions-list">
              {recentSubmissions.map(submission => (
                <div key={submission.id} className="submission-item">
                      <div className="submission-info">
                        <img
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(submission.student)}&background=10b981&color=fff&size=48`}
                          alt={submission.student}
                          className="avatar"
                          title={submission.student}
                        />
                        <p>{submission.assignment}</p>
                        <span className="submission-course">{submission.course}</span>
                        <span className="submission-time">{submission.time}</span>
                      </div>
                  <button className="btn btn-sm btn-secondary" onClick={() => navigate('/instructor/assignments')}>Review</button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;
