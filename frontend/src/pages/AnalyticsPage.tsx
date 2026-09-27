import React, { useState, useEffect } from 'react';
import {
  BarChart2, Flame, Target, Award, TrendingUp, Clock, CheckCircle2,
  Sparkles, Layers
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid
} from 'recharts';
import { api } from '../services/api';
import { StudentAnalytics } from '../types';

export const AnalyticsPage: React.FC = () => {
  const [analytics, setAnalytics] = useState<StudentAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await api.getStudentAnalytics();
        setAnalytics(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const defaultChart = [
    { day: 'Mon', problems: 4, accuracy: 80, friction: 25 },
    { day: 'Tue', problems: 6, accuracy: 75, friction: 30 },
    { day: 'Wed', problems: 3, accuracy: 66, friction: 45 },
    { day: 'Thu', problems: 7, accuracy: 85, friction: 20 },
    { day: 'Fri', problems: 5, accuracy: 70, friction: 68 },
    { day: 'Sat', problems: 8, accuracy: 90, friction: 15 },
    { day: 'Sun', problems: 6, accuracy: 82, friction: 28 }
  ];

  return (
    <div className="min-h-screen bg-[#0b0f17] p-4 lg:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0 glow-blue">
            <BarChart2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white">Learning Analytics</h1>
            <p className="text-slate-400 text-xs sm:text-sm">
              Empirical evidence of your algorithmic accuracy, solving speed, and topic growth
            </p>
          </div>
        </div>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <span className="text-xs text-slate-400 font-medium block">Total Solved</span>
          <span className="text-2xl font-extrabold text-white mt-1 block">42 Problems</span>
          <span className="text-[10px] text-emerald-400 font-semibold">+8 this week</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <span className="text-xs text-slate-400 font-medium block">Overall Accuracy</span>
          <span className="text-2xl font-extrabold text-white mt-1 block">74.5%</span>
          <span className="text-[10px] text-emerald-400 font-semibold">+12% vs last month</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <span className="text-xs text-slate-400 font-medium block">Total Time Invested</span>
          <span className="text-2xl font-extrabold text-white mt-1 block">14.2 Hours</span>
          <span className="text-[10px] text-blue-400 font-semibold">Continuous learning</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <span className="text-xs text-slate-400 font-medium block">Coding Streak</span>
          <span className="text-2xl font-extrabold text-white mt-1 block">🔥 7 Days</span>
          <span className="text-[10px] text-orange-400 font-semibold">Active streak</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Problems Solved Per Day */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-blue-400" />
              <span>Weekly Solved Activity</span>
            </h3>
          </div>
          
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics?.recent_activity_chart || defaultChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="day" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip contentStyle={{ backgroundColor: '#131b2e', borderColor: '#1e293b', borderRadius: '12px', fontSize: '12px' }} />
                <Bar dataKey="problems" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Accuracy Trend */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <span>Accuracy Trend (%)</span>
            </h3>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics?.recent_activity_chart || defaultChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="day" stroke="#64748b" />
                <YAxis stroke="#64748b" domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: '#131b2e', borderColor: '#1e293b', borderRadius: '12px', fontSize: '12px' }} />
                <Line type="monotone" dataKey="accuracy" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Gamification Achievements Gallery */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span>Badges & Achievements Gallery</span>
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-slate-900/80 p-4 rounded-2xl border border-amber-500/30 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-lg">
              🏆
            </div>
            <div>
              <span className="font-bold text-white text-xs block">First Step</span>
              <span className="text-[10px] text-slate-400">Solved 1st problem</span>
              <span className="text-[10px] text-emerald-400 font-semibold block">Unlocked</span>
            </div>
          </div>

          <div className="bg-slate-900/80 p-4 rounded-2xl border border-orange-500/30 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center text-lg">
              🔥
            </div>
            <div>
              <span className="font-bold text-white text-xs block">7-Day Streak</span>
              <span className="text-[10px] text-slate-400">7 days continuous</span>
              <span className="text-[10px] text-emerald-400 font-semibold block">Unlocked</span>
            </div>
          </div>

          <div className="bg-slate-900/80 p-4 rounded-2xl border border-blue-500/30 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center text-lg">
              ⭐
            </div>
            <div>
              <span className="font-bold text-white text-xs block">Array Master</span>
              <span className="text-[10px] text-slate-400">85%+ Array topic</span>
              <span className="text-[10px] text-emerald-400 font-semibold block">Unlocked</span>
            </div>
          </div>

          <div className="bg-slate-900/40 p-4 rounded-2xl border border-slate-800 opacity-60 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 text-slate-500 flex items-center justify-center text-lg">
              🔒
            </div>
            <div>
              <span className="font-bold text-slate-300 text-xs block">DP Explorer</span>
              <span className="text-[10px] text-slate-500">5 DP challenges</span>
              <span className="text-[10px] text-amber-400 font-semibold block">2/5 In Progress</span>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
