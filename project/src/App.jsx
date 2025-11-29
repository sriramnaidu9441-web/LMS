import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import Navigation from './components/Navigation';

// Pages
import Login from './pages/Login';
import Unauthorized from './pages/Unauthorized';
import Signup from './pages/Signup';

// Admin Pages
import AdminDashboard from './pages/Admin/AdminDashboard';
import UserManagement from './pages/Admin/UserManagement';
import CourseManagement from './pages/Admin/CourseManagement';
import AdminReports from './pages/Admin/Reports';


import InstructorDashboard from './pages/Instructor/InstructorDashboard';
import InstructorCourses from './pages/Instructor/InstructorCourses';
import CreateCourse from './pages/Instructor/CreateCourse';
import InstructorAssignments from './pages/Instructor/InstructorAssignments';
import InstructorStudents from './pages/Instructor/InstructorStudents';

// Student Pages
import StudentDashboard from './pages/Student/StudentDashboard';
import StudentCourses from './pages/Student/Courses';
import StudentExplore from './pages/Student/Explore';
import StudentAssignments from './pages/Student/Assignments';
import AssignmentDetail from './pages/Student/AssignmentDetail';
import StudentProgress from './pages/Student/Progress';
import StudentCertificates from './pages/Student/Certificates';

// Content Creator Pages
import ContentCreatorDashboard from './pages/ContentCreator/ContentCreatorDashboard';
import Materials from './pages/ContentCreator/Materials';
import CreateContent from './pages/ContentCreator/CreateContent';
import QualityCheck from './pages/ContentCreator/QualityCheck';
// Admin extras
import AdminSettings from './pages/Admin/Settings';
import Profile from './pages/Profile';

import './App.css';

const AppRoutes = () => {
  const { isAuthenticated, userRole } = useAuth();

  const getDefaultRoute = () => {
    if (!isAuthenticated) return '/login';
    switch (userRole) {
      case 'admin':
        return '/admin/dashboard';
      case 'instructor':
        return '/instructor/dashboard';
      case 'student':
        return '/student/dashboard';
      case 'content-creator':
        return '/content-creator/dashboard';
      default:
        return '/login';
    }
  };

  return (
    <>
      <Navigation />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        
        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <UserManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/courses"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <CourseManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminSettings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminReports />
            </ProtectedRoute>
          }
        />

        {/* Instructor Routes */}
        <Route
          path="/instructor/dashboard"
          element={
            <ProtectedRoute allowedRoles={['instructor']}>
              <InstructorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/instructor/courses"
          element={
            <ProtectedRoute allowedRoles={['instructor']}>
              <InstructorCourses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/instructor/create-course"
          element={
            <ProtectedRoute allowedRoles={['instructor']}>
              <CreateCourse />
            </ProtectedRoute>
          }
        />
        <Route
          path="/instructor/assignments"
          element={
            <ProtectedRoute allowedRoles={['instructor']}>
              <InstructorAssignments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/instructor/students"
          element={
            <ProtectedRoute allowedRoles={['instructor']}>
              <InstructorStudents />
            </ProtectedRoute>
          }
        />

        {/* Student Routes */}
        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/certificates"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentCertificates />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/courses"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentCourses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/explore"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentExplore />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/assignments"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentAssignments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/assignments/:id"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <AssignmentDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/progress"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentProgress />
            </ProtectedRoute>
          }
        />

        {/* Content Creator Routes */}
        <Route
          path="/content-creator/dashboard"
          element={
            <ProtectedRoute allowedRoles={['content-creator']}>
              <ContentCreatorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/content-creator/materials"
          element={
            <ProtectedRoute allowedRoles={["content-creator"]}>
              <Materials />
            </ProtectedRoute>
          }
        />
        <Route
          path="/content-creator/create"
          element={
            <ProtectedRoute allowedRoles={["content-creator"]}>
              <CreateContent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/content-creator/quality"
          element={
            <ProtectedRoute allowedRoles={["content-creator"]}>
              <QualityCheck />
            </ProtectedRoute>
          }
        />

        {/* Profile - available to all authenticated roles */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={["admin","instructor","student","content-creator"]}>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Default Route */}
        <Route path="/" element={<Navigate to={getDefaultRoute()} replace />} />
        <Route path="*" element={<Navigate to={getDefaultRoute()} replace />} />
      </Routes>
    </>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
