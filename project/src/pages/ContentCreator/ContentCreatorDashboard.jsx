import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/Card';
import './ContentCreatorDashboard.css';
import { useAuth } from '../../context/AuthContext';

const ContentCreatorDashboard = () => {
  const [stats] = useState({
    materialsCreated: 45,
    coursesContributed: 18,
    pendingReview: 7,
    qualityScore: 95,
  });

  const [recentMaterials] = useState([
    { id: 1, title: 'React Hooks Guide', type: 'Document', course: 'React Fundamentals', status: 'published', date: '2025-11-03' },
    { id: 2, title: 'JavaScript ES6 Tutorial', type: 'Video', course: 'JavaScript Advanced', status: 'review', date: '2025-11-04' },
    { id: 3, title: 'Python Basics Quiz', type: 'Assessment', course: 'Python for Beginners', status: 'draft', date: '2025-11-05' },
  ]);

  const [qualityChecks] = useState([
    { id: 1, material: 'React Hooks Guide', issue: 'None', score: 98, status: 'passed' },
    { id: 2, material: 'CSS Flexbox Tutorial', issue: 'Minor formatting', score: 92, status: 'needs-update' },
    { id: 3, material: 'Node.js API Guide', issue: 'None', score: 97, status: 'passed' },
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
    <div className="content-creator-dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Content Creator Dashboard</h1>
          <p>Create and maintain high-quality educational content</p>
        </div>

        <div className="profile-card">
          <img
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'Creator')}&background=667eea&color=fff&size=128`}
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
            📄
          </div>
          <div className="stat-info">
            <h3>{stats.materialsCreated}</h3>
            <p>Materials Created</p>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="stat-icon" style={{ background: '#10b981' }}>
            📚
          </div>
          <div className="stat-info">
            <h3>{stats.coursesContributed}</h3>
            <p>Courses Contributed</p>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="stat-icon" style={{ background: '#f59e0b' }}>
            ⏳
          </div>
          <div className="stat-info">
            <h3>{stats.pendingReview}</h3>
            <p>Pending Review</p>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="stat-icon" style={{ background: '#8b5cf6' }}>
            ⭐
          </div>
          <div className="stat-info">
            <h3>{stats.qualityScore}%</h3>
            <p>Quality Score</p>
          </div>
        </Card>
      </div>

      <div className="dashboard-content">
        <div className="main-section">
          <Card title="Recent Materials">
            <div className="materials-list">
              {recentMaterials.map(material => (
                <div key={material.id} className="material-item">
                  <div className="material-icon">
                    {material.type === 'Document' && '📄'}
                    {material.type === 'Video' && '🎥'}
                    {material.type === 'Assessment' && '📝'}
                  </div>
                  <div className="material-info">
                    <h4>{material.title}</h4>
                    <p>{material.course}</p>
                    <span className="material-date">{new Date(material.date).toLocaleDateString()}</span>
                  </div>
                  <div className="material-meta">
                    <span className={`status-badge ${material.status}`}>
                      {material.status}
                    </span>
                    <span className="material-type">{material.type}</span>
                  </div>
                  <button className="btn btn-sm btn-primary">Edit</button>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Quality Checks" className="quality-card">
            <div className="quality-list">
              {qualityChecks.map(check => (
                <div key={check.id} className="quality-item">
                  <div className="quality-info">
                    <h5>{check.material}</h5>
                    <p className="quality-issue">
                      {check.issue === 'None' ? '✅ No issues found' : `⚠️ ${check.issue}`}
                    </p>
                  </div>
                  <div className="quality-score">
                    <div className="score-circle" style={{
                      background: check.score >= 95 ? '#10b981' : check.score >= 85 ? '#f59e0b' : '#ef4444'
                    }}>
                      {check.score}
                    </div>
                    <span className={`check-status ${check.status}`}>
                      {check.status.replace('-', ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="side-section">
          <Card title="Quick Actions" className="quick-actions-card">
            <div className="quick-actions">
              <button className="action-btn primary" onClick={() => navigate('/content-creator/create')}>
                <span>➕</span>
                Create New Material
              </button>
              <button className="action-btn secondary" onClick={() => navigate('/content-creator/materials')}>
                <span>📚</span>
                Browse Courses
              </button>
              <button className="action-btn success" onClick={() => navigate('/content-creator/quality')}>
                <span>📊</span>
                Quality Reports
              </button>
              <button className="action-btn warning" onClick={() => navigate('/content-creator/quality')}>
                <span>🔍</span>
                Review Queue
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ContentCreatorDashboard;
