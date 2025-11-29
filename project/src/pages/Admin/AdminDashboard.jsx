import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/Card';
import './AdminDashboard.css';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
  const [stats] = useState({
    totalUsers: 1250,
    totalCourses: 85,
    activeCourses: 72,
    totalRevenue: '$125,430',
  });

  const [recentActivities] = useState([
    { id: 1, type: 'user', message: 'New user registered: John Doe', time: '5 min ago' },
    { id: 2, type: 'course', message: 'Course "React Fundamentals" published', time: '15 min ago' },
    { id: 3, type: 'system', message: 'System backup completed', time: '1 hour ago' },
    { id: 4, type: 'user', message: 'User role updated: Jane Smith to Instructor', time: '2 hours ago' },
    { id: 5, type: 'course', message: 'Course "Python Advanced" updated', time: '3 hours ago' },
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

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Welcome back! Here's what's happening with your platform.</p>
        </div>

        <div className="profile-card">
          <img
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'Admin')}&background=667eea&color=fff&size=128`}
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
            👥
          </div>
          <div className="stat-info">
            <h3>{stats.totalUsers}</h3>
            <p>Total Users</p>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="stat-icon" style={{ background: '#f59e0b' }}>
            📚
          </div>
          <div className="stat-info">
            <h3>{stats.totalCourses}</h3>
            <p>Total Courses</p>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="stat-icon" style={{ background: '#10b981' }}>
            ✅
          </div>
          <div className="stat-info">
            <h3>{stats.activeCourses}</h3>
            <p>Active Courses</p>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="stat-icon" style={{ background: '#8b5cf6' }}>
            💰
          </div>
          <div className="stat-info">
            <h3>{stats.totalRevenue}</h3>
            <p>Total Revenue</p>
          </div>
        </Card>
      </div>

      <div className="dashboard-content">
        <Card title="Recent Activities" className="activities-card">
          <div className="activities-list">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="activity-item">
                <div className={`activity-icon ${activity.type}`}>
                  {activity.type === 'user' && '👤'}
                  {activity.type === 'course' && '📖'}
                  {activity.type === 'system' && '⚙️'}
                </div>
                <div className="activity-content">
                  <p className="activity-message">{activity.message}</p>
                  <span className="activity-time">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Quick Actions" className="quick-actions-card">
          <div className="quick-actions">
            <button className="action-btn primary" onClick={() => navigate('/admin/users')}>
              <span>➕</span>
              Add New User
            </button>
            <button className="action-btn secondary" onClick={() => navigate('/admin/courses')}>
              <span>📚</span>
              Create Course
            </button>
            <button className="action-btn success" onClick={() => navigate('/admin/reports')}>
              <span>📊</span>
              View Reports
            </button>
            <button className="action-btn warning" onClick={() => navigate('/admin/settings')}>
              <span>⚙️</span>
              Platform Settings
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
