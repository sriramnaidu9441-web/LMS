import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navigation.css';

const Navigation = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isAuthenticated) return null;

  const getDashboardPath = () => {
    switch (user?.role) {
      case 'admin':
        return '/admin/dashboard';
      case 'instructor':
        return '/instructor/dashboard';
      case 'student':
        return '/student/dashboard';
      case 'content-creator':
        return '/content-creator/dashboard';
      default:
        return '/';
    }
  };

  const getNavLinks = () => {
    switch (user?.role) {
      case 'admin':
        return [
          { path: '/admin/dashboard', label: 'Dashboard' },
          { path: '/admin/users', label: 'User Management' },
          { path: '/admin/courses', label: 'Course Management' },
          { path: '/admin/settings', label: 'Settings' },
        ];
      case 'instructor':
        return [
          { path: '/instructor/dashboard', label: 'Dashboard' },
          { path: '/instructor/courses', label: 'My Courses' },
          { path: '/instructor/create-course', label: 'Create Course' },
          { path: '/instructor/assignments', label: 'Assignments' },
          { path: '/instructor/students', label: 'Students' },
        ];
      case 'student':
        return [
          { path: '/student/dashboard', label: 'Dashboard' },
          { path: '/student/courses', label: 'My Courses' },
          { path: '/student/explore', label: 'Explore Courses' },
          { path: '/student/assignments', label: 'Assignments' },
          { path: '/student/progress', label: 'Progress' },
        ];
      case 'content-creator':
        return [
          { path: '/content-creator/dashboard', label: 'Dashboard' },
          { path: '/content-creator/materials', label: 'Course Materials' },
          { path: '/content-creator/create', label: 'Create Content' },
          { path: '/content-creator/quality', label: 'Quality Check' },
        ];
      default:
        return [];
    }
  };

  // always include profile link for authenticated users
  const navLinks = [...getNavLinks()];
  navLinks.push({ path: '/profile', label: 'Profile' });

  return (
    <nav className="navigation">
      <div className="nav-container">
        <Link to={getDashboardPath()} className="nav-logo">
          <span className="logo-icon">🎓</span>
          <span className="logo-text">EduLearn LMS</span>
        </Link>
        <div className="nav-links">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
              onClick={(e) => {
                console.log('[Navigation] link clicked:', link.path);
                // ensure navigation happens even if some parent element intercepts clicks
                if (e.defaultPrevented) return;
                try {
                  navigate(link.path);
                } catch (err) {
                  console.error('[Navigation] navigate error:', err);
                }
              }}
            >
              {link.label}
            </NavLink>
          ))}
        </div>
        <div className="nav-user">
          <div className="user-info">
            {/* show avatar in place of name */}
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=667eea&color=fff&size=64`}
              alt={user?.name}
              className="user-avatar"
              title={user?.name}
            />
            <span className="user-role">{user?.role}</span>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
