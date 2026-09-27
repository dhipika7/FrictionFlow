import React from 'react';
import { Clock, ArrowRight, BookOpen, Layers } from 'lucide-react';
import { Problem } from '../types';
import { useNavigate } from 'react-router-dom';

interface ProblemCardProps {
  problem: Problem;
  reason?: string;
}

export const ProblemCard: React.FC<ProblemCardProps> = ({ problem, reason }) => {
  const navigate = useNavigate();

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'Easy':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'Medium':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'Hard':
        return 'bg-red-500/10 text-red-400 border-red-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="glass-panel-interactive rounded-2xl p-5 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${getDifficultyColor(problem.difficulty)}`}>
            {problem.difficulty}
          </span>
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {problem.expected_solve_time_minutes} min
          </span>
        </div>

        <h4 className="text-base font-bold text-white mb-1 hover:text-blue-400 transition-colors">
          {problem.title}
        </h4>

        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs text-blue-400 font-medium bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded">
            {problem.topic}
          </span>
          <span className="text-xs text-slate-500">• {problem.platform}</span>
        </div>

        {reason && (
          <p className="text-xs text-slate-400 italic mb-4 line-clamp-2 bg-slate-900/40 p-2 rounded-lg border border-slate-800/60">
            "{reason}"
          </p>
        )}
      </div>

      <button
        onClick={() => navigate('/mentor', { state: { problemTitle: problem.title, topic: problem.topic, difficulty: problem.difficulty } })}
        className="w-full mt-2 bg-slate-800/80 hover:bg-blue-600 text-slate-200 hover:text-white text-xs font-semibold py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 group"
      >
        <span>Start Practice & Mentor</span>
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
};
