import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Brain, UserCheck, GraduationCap, ArrowRight, Lock, Mail, User,
  Sparkles, ShieldCheck, Zap, Database, CheckCircle2, Eye, EyeOff
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, signup, switchDemoRole } = useAuth();
  
  const [isSignup, setIsSignup] = useState(false);
  const [role, setRole] = useState<'student' | 'teacher'>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    try {
      if (isSignup) {
        await signup(email, fullName, password, role);
      } else {
        await login(email, password);
      }
      navigate(role === 'teacher' ? '/teacher' : '/dashboard');
    } catch (err: any) {
      setErrorMsg(err?.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = (demoRole: 'student' | 'teacher') => {
    switchDemoRole(demoRole);
    navigate(demoRole === 'teacher' ? '/teacher' : '/dashboard');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#0b0f17] text-slate-100 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden font-sans">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-blue-600/15 via-purple-600/10 to-transparent blur-[140px] pointer-events-none z-0" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-indigo-600/10 blur-[120px] pointer-events-none z-0" />

      {/* Main Container Container Grid */}
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-10 relative">
        
        {/* Left Side: Brand Value & Live Visual Card */}
        <div className="lg:col-span-6 space-y-6 text-left hidden lg:block">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>FrictionFlow Socratic AI Mentor</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight font-heading">
            Unlock AI That Notices{' '}
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              Before You Ask.
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Join programming students and instructors using autonomous telemetry detection, Socratic hinting, and targeted weak-topic mastery tracking.
          </p>

          {/* Feature Highlights Grid */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="glass-panel p-3.5 rounded-2xl border border-slate-800/80 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center shrink-0">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Real-time Telemetry</span>
                <span className="text-[11px] text-slate-400">Passively observes friction</span>
              </div>
            </div>

            <div className="glass-panel p-3.5 rounded-2xl border border-slate-800/80 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center shrink-0">
                <Brain className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">4-Level Hints</span>
                <span className="text-[11px] text-slate-400">Socratic guidance</span>
              </div>
            </div>
          </div>

          {/* Database Live Status Badge */}
          <div className="glass-panel p-3.5 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <Database className="w-4 h-4 text-emerald-400" />
              <span className="text-slate-300 font-medium">Backend Storage Status:</span>
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              <span>MongoDB (deba) Active</span>
            </span>
          </div>

        </div>

        {/* Right Side: Sleek Authentication Form Card */}
        <div className="lg:col-span-6 w-full max-w-md mx-auto">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6 relative overflow-hidden backdrop-blur-xl glow-blue">
            
            {/* Header / Brand */}
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white mx-auto shadow-xl shadow-blue-600/30">
                <Brain className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-extrabold text-white font-heading">
                {isSignup ? 'Create Your Account' : 'Welcome Back'}
              </h2>
              <p className="text-xs text-slate-400">
                {isSignup ? 'Join FrictionFlow AI learning ecosystem' : 'Sign in to access your learning dashboard'}
              </p>
            </div>

            {/* Role Selector Tabs (Student vs Teacher) */}
            <div className="grid grid-cols-2 gap-2 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800">
              <button
                type="button"
                onClick={() => setRole('student')}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  role === 'student'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 scale-[1.02]'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                <span>Student</span>
              </button>
              <button
                type="button"
                onClick={() => setRole('teacher')}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  role === 'teacher'
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30 scale-[1.02]'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                <span>Instructor / Teacher</span>
              </button>
            </div>

            {/* Error Banner */}
            {errorMsg && (
              <div className="bg-rose-950/60 border border-rose-500/40 p-3 rounded-xl text-xs text-rose-300 font-medium">
                ⚠️ {errorMsg}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {isSignup && (
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      placeholder="Alex Chen"
                      className="w-full bg-slate-950 text-slate-100 text-xs pl-10 pr-4 py-3 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder={role === 'teacher' ? 'teacher@frictionflow.ai' : 'student@frictionflow.ai'}
                    className="w-full bg-slate-950 text-slate-100 text-xs pl-10 pr-4 py-3 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full bg-slate-950 text-slate-100 text-xs pl-10 pr-10 py-3 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-gradient-to-r ${
                  role === 'teacher'
                    ? 'from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-purple-600/30'
                    : 'from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-blue-600/30'
                } text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-xl hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 text-xs uppercase tracking-wider`}
              >
                <span>{loading ? 'Authenticating...' : isSignup ? 'Create Account' : 'Sign In'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Instant Presentation Quick Access Buttons */}
            <div className="pt-4 border-t border-slate-800/80 space-y-2.5 text-center">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold block">
                Instant Demo Access (No Credentials Required)
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemo('student')}
                  className="bg-blue-950/60 hover:bg-blue-900 text-blue-300 border border-blue-500/30 text-xs font-bold py-2.5 px-3 rounded-xl transition-all hover:scale-[1.02] flex items-center justify-center gap-1.5"
                >
                  <UserCheck className="w-3.5 h-3.5 text-blue-400" />
                  <span>Demo Student ➔</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemo('teacher')}
                  className="bg-purple-950/60 hover:bg-purple-900 text-purple-300 border border-purple-500/30 text-xs font-bold py-2.5 px-3 rounded-xl transition-all hover:scale-[1.02] flex items-center justify-center gap-1.5"
                >
                  <GraduationCap className="w-3.5 h-3.5 text-purple-400" />
                  <span>Demo Teacher ➔</span>
                </button>
              </div>
            </div>

            {/* Toggle Sign In / Sign Up */}
            <div className="text-center text-xs text-slate-400 pt-1">
              {isSignup ? 'Already have an account?' : "Don't have an account yet?"}{' '}
              <button
                type="button"
                onClick={() => { setIsSignup(!isSignup); setErrorMsg(''); }}
                className="text-blue-400 font-bold hover:underline ml-1"
              >
                {isSignup ? 'Sign In' : 'Create Account'}
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
