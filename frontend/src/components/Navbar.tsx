import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Flame, Brain, Compass, Terminal, BarChart2, GraduationCap, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const { user, role, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-40 bg-[#0b0f17]/90 backdrop-blur-lg border-b border-slate-800/80 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              Friction<span className="text-blue-500">Flow</span>
            </span>
            <span className="block text-[10px] text-slate-400 font-medium tracking-wider uppercase -mt-1">
              AI Learning Companion
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800">
          {role === 'student' ? (
            <>
              <Link
                to="/dashboard"
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isActive('/dashboard') ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Brain className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>

              <Link
                to="/mentor"
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isActive('/mentor') ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Terminal className="w-4 h-4" />
                <span>AI Mentor</span>
              </Link>

              <Link
                to="/errors"
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isActive('/errors') ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Terminal className="w-4 h-4" />
                <span>Error Translator</span>
              </Link>

              <Link
                to="/roadmap"
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isActive('/roadmap') ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Compass className="w-4 h-4" />
                <span>Roadmap</span>
              </Link>

              <Link
                to="/analytics"
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isActive('/analytics') ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <BarChart2 className="w-4 h-4" />
                <span>Analytics</span>
              </Link>
            </>
          ) : (
            <Link
              to="/teacher"
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                isActive('/teacher') ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Class Analytics</span>
            </Link>
          )}
        </div>

        {/* User Profile & Streak */}
        <div className="flex items-center gap-3">
          {role === 'student' && (
            <div className="flex items-center gap-1.5 bg-orange-500/10 border border-orange-500/30 px-2.5 py-1 rounded-lg text-orange-400 text-xs font-semibold">
              <Flame className="w-4 h-4 text-orange-500 animate-bounce" />
              <span>7 Day Streak</span>
            </div>
          )}

          {user ? (
            <div className="flex items-center gap-2">
              <div className="text-right hidden sm:block">
                <span className="block text-xs font-semibold text-slate-200">{user.full_name}</span>
                <span className="block text-[10px] text-slate-400 capitalize">{user.role}</span>
              </div>
              <button
                onClick={logout}
                title="Logout"
                className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/auth"
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-all shadow-md hover:shadow-blue-500/25"
            >
              Sign In
            </Link>
          )}
        </div>

      </div>
    </nav>
  );
};
