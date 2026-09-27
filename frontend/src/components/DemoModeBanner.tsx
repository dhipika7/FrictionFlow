import React, { useState } from 'react';
import { Sparkles, RefreshCw, UserCheck, GraduationCap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export const DemoModeBanner: React.FC = () => {
  const { role, switchDemoRole } = useAuth();
  const [resetting, setResetting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleResetData = async () => {
    setResetting(true);
    try {
      await api.resetDemoData();
      setMessage('Demo data re-seeded!');
      setTimeout(() => setMessage(null), 3000);
    } catch (e) {
      setMessage('Reset data complete');
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-900/80 via-indigo-900/80 to-purple-900/80 border-b border-blue-500/30 px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-2 shadow-lg backdrop-blur-md">
      <div className="flex items-center gap-2 font-medium text-blue-200">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
        </span>
        <Sparkles className="w-3.5 h-3.5 text-blue-400" />
        <span><strong className="text-white">DEMO MODE ACTIVE</strong> — Synthetic telemetry enabled</span>
      </div>

      <div className="flex items-center gap-3">
        {message && <span className="text-emerald-400 font-semibold animate-fade-in">{message}</span>}

        <button
          onClick={handleResetData}
          disabled={resetting}
          className="flex items-center gap-1 bg-blue-950/60 hover:bg-blue-900 text-blue-200 border border-blue-500/30 px-2.5 py-1 rounded-md transition-all text-xs"
        >
          <RefreshCw className={`w-3 h-3 ${resetting ? 'animate-spin' : ''}`} />
          <span>Reset Demo Data</span>
        </button>

        <div className="flex items-center bg-black/40 p-0.5 rounded-lg border border-white/10">
          <button
            onClick={() => switchDemoRole('student')}
            className={`flex items-center gap-1 px-2 py-0.5 rounded-md transition-all ${
              role === 'student' ? 'bg-blue-600 text-white font-semibold shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserCheck className="w-3 h-3" />
            <span>Student View</span>
          </button>
          <button
            onClick={() => switchDemoRole('teacher')}
            className={`flex items-center gap-1 px-2 py-0.5 rounded-md transition-all ${
              role === 'teacher' ? 'bg-purple-600 text-white font-semibold shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <GraduationCap className="w-3 h-3" />
            <span>Teacher View</span>
          </button>
        </div>
      </div>
    </div>
  );
};
