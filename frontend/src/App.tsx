import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DemoModeBanner } from './components/DemoModeBanner';
import { Navbar } from './components/Navbar';

import { LandingPage } from './pages/LandingPage';
import { StudentDashboard } from './pages/StudentDashboard';
import { AIMentorPage } from './pages/AIMentorPage';
import { ErrorTranslatorPage } from './pages/ErrorTranslatorPage';
import { RoadmapPage } from './pages/RoadmapPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { TeacherDashboard } from './pages/TeacherDashboard';
import { AuthPage } from './pages/AuthPage';

const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRole?: 'student' | 'teacher' }> = ({ children, allowedRole }) => {
  const { user, role } = useAuth();
  if (!user) return <Navigate to="/auth" replace />;
  if (allowedRole && role !== allowedRole) {
    return <Navigate to={role === 'teacher' ? '/teacher' : '/dashboard'} replace />;
  }
  return <>{children}</>;
};

export const AppContent: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0b0f17] flex flex-col font-sans">
      <DemoModeBanner />
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />

          {/* Student Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRole="student">
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mentor"
            element={
              <ProtectedRoute allowedRole="student">
                <AIMentorPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/errors"
            element={
              <ProtectedRoute allowedRole="student">
                <ErrorTranslatorPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/roadmap"
            element={
              <ProtectedRoute allowedRole="student">
                <RoadmapPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute allowedRole="student">
                <AnalyticsPage />
              </ProtectedRoute>
            }
          />

          {/* Teacher Routes */}
          <Route
            path="/teacher"
            element={
              <ProtectedRoute allowedRole="teacher">
                <TeacherDashboard />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
};
