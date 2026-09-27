import React, { useState, useEffect } from 'react';
import {
  GraduationCap, Users, AlertTriangle, CheckCircle2, TrendingUp,
  Brain, ShieldCheck, Search, Filter, HelpCircle
} from 'lucide-react';
import { api } from '../services/api';
import { TeacherAnalytics } from '../types';

export const TeacherDashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<TeacherAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        const data = await api.getTeacherAnalytics();
        setAnalytics(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchTeacherData();
  }, []);

  return (
    <div className="min-h-screen bg-[#0b0f17] p-4 lg:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      
      {/* Teacher Workspace Header */}
      <div className="glass-panel p-6 rounded-3xl border border-purple-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glow-purple">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 shrink-0">
            <GraduationCap className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-white">Class Overview & Insights</h1>
              <span className="text-xs bg-purple-500/20 text-purple-300 font-bold px-2.5 py-0.5 rounded-full border border-purple-500/30">
                CS201 — Data Structures
              </span>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
              Prof. Sarah Jenkins • Stanford University CS Department
            </p>
          </div>
        </div>
      </div>

      {/* Class Aggregate Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <span className="text-xs text-slate-400 font-medium block">Total Enrolled Students</span>
          <span className="text-2xl font-extrabold text-white mt-1 block">
            {analytics?.total_students || 60} Students
          </span>
          <span className="text-[10px] text-purple-400 font-semibold">Active class roster</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <span className="text-xs text-slate-400 font-medium block">Class Avg Accuracy</span>
          <span className="text-2xl font-extrabold text-white mt-1 block">
            {analytics?.avg_accuracy || 71.4}%
          </span>
          <span className="text-[10px] text-emerald-400 font-semibold">+4% vs mid-term</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <span className="text-xs text-slate-400 font-medium block">Strongest Topic</span>
          <span className="text-2xl font-extrabold text-emerald-400 mt-1 block">
            Arrays & Hashing
          </span>
          <span className="text-[10px] text-slate-400 font-semibold">88% average mastery</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-amber-500/30 bg-amber-950/20">
          <span className="text-xs text-amber-300 font-medium block">Students Needing Support</span>
          <span className="text-2xl font-extrabold text-amber-400 mt-1 block">
            {analytics?.students_needing_support || 8} Students
          </span>
          <span className="text-[10px] text-amber-400/80 font-semibold">High friction detected</span>
        </div>

      </div>

      {/* Common Failed Concepts & Friction Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Failed Concepts */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <span>Most Failed Class Concepts</span>
          </h3>

          <div className="space-y-3">
            <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-200 text-xs sm:text-sm block">State Transition Recurrence in DP</span>
                <span className="text-[10px] text-slate-400">Dynamic Programming • 28 Failed Attempts</span>
              </div>
              <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/20">
                19 Students Affected
              </span>
            </div>

            <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-200 text-xs sm:text-sm block">Recursion Stack Overflow</span>
                <span className="text-[10px] text-slate-400">Trees & Recursion • 22 Failed Attempts</span>
              </div>
              <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/20">
                14 Students Affected
              </span>
            </div>

            <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-200 text-xs sm:text-sm block">Off-by-One Array Indexing</span>
                <span className="text-[10px] text-slate-400">Arrays & Hashing • 18 Failed Attempts</span>
              </div>
              <span className="text-xs font-bold text-slate-400 bg-slate-800 px-2.5 py-1 rounded">
                12 Students Affected
              </span>
            </div>
          </div>
        </div>

        {/* Support Queue Guidance */}
        <div className="glass-panel p-6 rounded-3xl border border-purple-500/30 bg-purple-950/20 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-400" />
            <span>Educator Recommended Interventions</span>
          </h3>

          <p className="text-slate-300 text-xs leading-relaxed">
            FrictionFlow aggregates student telemetry to recommend classroom topic revisions before upcoming exams.
          </p>

          <div className="space-y-2 text-xs">
            <div className="bg-purple-900/40 p-3 rounded-xl border border-purple-500/30 text-purple-200">
              📌 <strong>Action Recommended:</strong> Schedule a 20-minute review session on <em>Dynamic Programming Tabulation vs Memoization</em>.
            </div>
            <div className="bg-purple-900/40 p-3 rounded-xl border border-purple-500/30 text-purple-200">
              📌 <strong>Support Queue:</strong> 8 students are encountering high friction on recursive base case setup.
            </div>
          </div>
        </div>

      </div>

      {/* At-Risk Students Queue Table */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-400" />
            <span>Students Needing Support Queue</span>
          </h3>
          <span className="text-xs text-slate-400">Privacy Preserved • Educational Telemetry Only</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-3">Student Name</th>
                <th className="p-3">Streak</th>
                <th className="p-3">Solved</th>
                <th className="p-3">Accuracy</th>
                <th className="p-3">Friction Status</th>
                <th className="p-3">Weakest Topic</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-200">
              <tr className="bg-red-950/10 hover:bg-red-950/20">
                <td className="p-3 font-semibold text-white">Maria Garcia</td>
                <td className="p-3">4 Days</td>
                <td className="p-3">20</td>
                <td className="p-3 font-bold text-red-400">48.0%</td>
                <td className="p-3">
                  <span className="bg-red-500/20 text-red-400 font-bold px-2 py-0.5 rounded border border-red-500/30">
                    High Friction
                  </span>
                </td>
                <td className="p-3 text-amber-300">Dynamic Programming</td>
              </tr>

              <tr className="bg-red-950/10 hover:bg-red-950/20">
                <td className="p-3 font-semibold text-white">Priya Patel</td>
                <td className="p-3">2 Days</td>
                <td className="p-3">15</td>
                <td className="p-3 font-bold text-red-400">52.5%</td>
                <td className="p-3">
                  <span className="bg-red-500/20 text-red-400 font-bold px-2 py-0.5 rounded border border-red-500/30">
                    High Friction
                  </span>
                </td>
                <td className="p-3 text-amber-300">Trees & Graphs</td>
              </tr>

              <tr>
                <td className="p-3 font-semibold text-white">Alex Chen</td>
                <td className="p-3">7 Days</td>
                <td className="p-3">42</td>
                <td className="p-3 font-bold text-emerald-400">74.5%</td>
                <td className="p-3">
                  <span className="bg-amber-500/10 text-amber-400 font-bold px-2 py-0.5 rounded border border-amber-500/20">
                    Moderate
                  </span>
                </td>
                <td className="p-3 text-slate-400">Dynamic Programming</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
