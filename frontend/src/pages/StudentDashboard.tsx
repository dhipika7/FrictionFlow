import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Brain, Flame, Target, CheckCircle2, Clock, AlertTriangle, Lightbulb,
  ArrowRight, TrendingUp, Zap, Sparkles, BookOpen, Layers
} from 'lucide-react';
import { api } from '../services/api';
import { StudentAnalytics, Recommendation } from '../types';
import { ProblemCard } from '../components/ProblemCard';
import { FrictionInterventionModal } from '../components/FrictionInterventionModal';

export const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState<StudentAnalytics | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showIntervention, setShowIntervention] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [aData, rData] = await Promise.all([
          api.getStudentAnalytics(),
          api.getRecommendations()
        ]);
        setAnalytics(aData);
        setRecommendations(rData);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0f17] flex items-center justify-center text-slate-400">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
          <span className="text-sm font-medium">Loading your personalized learning snapshot...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0f17] p-4 lg:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      
      <FrictionInterventionModal
        isOpen={showIntervention}
        onClose={() => setShowIntervention(false)}
        problemTitle="House Robber"
        topic="Dynamic Programming"
        frictionScore={78.5}
      />

      {/* Greeting Header & Friction Alert Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">Good morning 👋</span>
            <span className="text-xs font-semibold bg-blue-500/10 text-blue-400 px-2.5 py-0.5 rounded-full border border-blue-500/20">
              Student Workspace
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Your Learning Snapshot
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Focus area: <strong className="text-blue-400">Dynamic Programming</strong> • Current Friction Status:{' '}
            <span className="inline-flex items-center gap-1 font-bold text-amber-400">
              <Zap className="w-3.5 h-3.5 fill-amber-400" /> High (Intervention Ready)
            </span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowIntervention(true)}
            className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 glow-amber"
          >
            <Lightbulb className="w-4 h-4 text-amber-400" />
            <span>Simulate High Friction Intervention</span>
          </button>
          
          <button
            onClick={() => navigate('/mentor')}
            className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-lg hover:shadow-blue-500/30 flex items-center gap-2"
          >
            <Brain className="w-4 h-4" />
            <span>Open AI Mentor</span>
          </button>
        </div>
      </div>

      {/* Key Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-500 shrink-0">
            <Flame className="w-6 h-6 animate-bounce" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium block">Streak</span>
            <span className="text-2xl font-extrabold text-white">{analytics?.streak_days || 7} Days</span>
            <span className="text-[10px] text-emerald-400 font-semibold block">+1 day today</span>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium block">Weekly Goal</span>
            <span className="text-2xl font-extrabold text-white">3 / 5</span>
            <span className="text-[10px] text-blue-400 font-semibold block">60% completed</span>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium block">Accuracy</span>
            <span className="text-2xl font-extrabold text-white">{analytics?.overall_accuracy}%</span>
            <span className="text-[10px] text-emerald-400 font-semibold block">+12% this week</span>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium block">Avg Solve Time</span>
            <span className="text-2xl font-extrabold text-white">21.5m</span>
            <span className="text-[10px] text-purple-400 font-semibold block">Optimal pacing</span>
          </div>
        </div>

      </div>

      {/* Topics Summary & Focus Alert */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Weak & Strong Topics */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Brain className="w-5 h-5 text-blue-400" />
              <span>Topic Mastery Breakdown</span>
            </h3>
            <button onClick={() => navigate('/roadmap')} className="text-xs text-blue-400 hover:underline">
              View Roadmap ➔
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-300 font-semibold">Arrays & Hashing</span>
                <span className="text-emerald-400 font-bold">88% (Strong)</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '88%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-300 font-semibold">Two Pointers</span>
                <span className="text-emerald-400 font-bold">82% (Strong)</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '82%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-300 font-semibold">Trees & Graphs</span>
                <span className="text-amber-400 font-bold">58% (Moderate)</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: '58%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-300 font-semibold">Dynamic Programming</span>
                <span className="text-red-400 font-bold">38% (Focus Needed)</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-red-500 h-full rounded-full" style={{ width: '38%' }} />
              </div>
            </div>
          </div>

          <div className="bg-red-950/30 border border-red-500/30 p-3.5 rounded-2xl text-xs space-y-1">
            <span className="font-bold text-red-400 block">🧠 FrictionFlow AI Observation</span>
            <p className="text-slate-300">
              You experienced recurring TLE errors on memoization state transitions. We've customized your practice queue below with step-by-step DP challenges.
            </p>
          </div>
        </div>

        {/* Personalized Recommendations Queue */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span>Recommended Next Problems</span>
              </h3>
              <p className="text-xs text-slate-400">Tailored to your current skill level and focus topic</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {recommendations.slice(0, 4).map((rec) => (
              <ProblemCard key={rec.id} problem={rec.problem} reason={rec.reason} />
            ))}
          </div>
        </div>

      </div>

      {/* Recent Activity Log */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-400" />
          <span>Recent Activity & Telemetry</span>
        </h3>

        <div className="divide-y divide-slate-800/80">
          <div className="py-3 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
                TLE
              </div>
              <div>
                <span className="font-semibold text-slate-200 block">House Robber</span>
                <span className="text-slate-400">LeetCode • 37 min • Attempt 3</span>
              </div>
            </div>
            <div className="text-right">
              <span className="font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">Friction: 78.5 (High)</span>
              <span className="block text-slate-500 text-[10px]">15 mins ago</span>
            </div>
          </div>

          <div className="py-3 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                AC
              </div>
              <div>
                <span className="font-semibold text-slate-200 block">Two Sum</span>
                <span className="text-slate-400">FrictionFlow • 7 min • Attempt 1</span>
              </div>
            </div>
            <div className="text-right">
              <span className="font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">Friction: 15.0 (Low)</span>
              <span className="block text-slate-500 text-[10px]">3 hours ago</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
