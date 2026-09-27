import React, { useState, useEffect } from 'react';
import { Compass, CheckCircle2, Lock, ArrowDown, Sparkles, BookOpen, Layers, Award } from 'lucide-react';
import { api } from '../services/api';
import { RoadmapNode } from '../types';
import { useNavigate } from 'react-router-dom';

export const RoadmapPage: React.FC = () => {
  const navigate = useNavigate();
  const [nodes, setNodes] = useState<RoadmapNode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        const res = await api.getRoadmap();
        setNodes(res);
      } catch (e) {
        // Fallback default node list if backend endpoint is initializing
        setNodes([
          { id: 1, topic: 'Arrays & Hashing', category: 'Core Foundations', description: 'Frequency counting, lookup tables, array manipulation', mastery_percent: 88.0, status: 'completed', recommended_problem: 'Two Sum' },
          { id: 2, topic: 'Two Pointers', category: 'Core Foundations', description: 'Symmetric scanning, sorted array searching', mastery_percent: 82.0, status: 'completed', prerequisite: 'Arrays & Hashing', recommended_problem: 'Container With Most Water' },
          { id: 3, topic: 'Sliding Window', category: 'Advanced Arrays', description: 'Subsegment analysis, dynamic window expansion/contraction', mastery_percent: 75.0, status: 'in_progress', prerequisite: 'Two Pointers', recommended_problem: 'Longest Substring Without Repeating Characters' },
          { id: 4, topic: 'Trees & Graphs', category: 'Data Structures', description: 'DFS, BFS traversal, binary search trees, graph cycles', mastery_percent: 58.0, status: 'in_progress', prerequisite: 'Arrays & Hashing', recommended_problem: 'Invert Binary Tree' },
          { id: 5, topic: 'Dynamic Programming', category: 'Advanced Optimization', description: 'Memoization, bottom-up tabulating, subproblem recurrence', mastery_percent: 38.0, status: 'in_progress', prerequisite: 'Trees & Graphs', recommended_problem: 'Climbing Stairs' }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchRoadmap();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Completed
          </span>
        );
      case 'in_progress':
        return (
          <span className="flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            In Progress
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 text-xs font-bold text-slate-500 bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700">
            <Lock className="w-3.5 h-3.5" />
            Locked
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f17] p-4 lg:p-8 max-w-5xl mx-auto space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0 glow-blue">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white">Personalized Learning Roadmap</h1>
            <p className="text-slate-400 text-xs sm:text-sm">
              Adaptive skill progression node tree dynamically updated based on your problem mastery
            </p>
          </div>
        </div>
      </div>

      {/* Roadmap Nodes List */}
      <div className="space-y-6 relative">
        {nodes.map((node, index) => (
          <React.Fragment key={node.id}>
            
            <div
              className={`glass-panel p-6 rounded-3xl border transition-all ${
                node.status === 'completed'
                  ? 'border-emerald-500/30 hover:border-emerald-500/50'
                  : node.status === 'in_progress'
                  ? 'border-amber-500/40 hover:border-amber-500/60 glow-amber'
                  : 'border-slate-800/60 opacity-60'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Step {index + 1} • {node.category}
                    </span>
                    {node.prerequisite && (
                      <span className="text-[10px] text-slate-500">
                        (Prerequisite: {node.prerequisite})
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    {node.topic}
                  </h3>
                </div>

                <div>{getStatusBadge(node.status)}</div>
              </div>

              <p className="text-slate-300 text-xs sm:text-sm mb-4 leading-relaxed">
                {node.description}
              </p>

              {/* Progress Bar & CTA */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-800/80">
                <div className="flex-1 max-w-xs">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">Mastery Level:</span>
                    <span className="font-bold text-white">{node.mastery_percent}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        node.mastery_percent >= 80 ? 'bg-emerald-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${node.mastery_percent}%` }}
                    />
                  </div>
                </div>

                <button
                  disabled={node.status === 'locked'}
                  onClick={() => navigate('/mentor', { state: { topic: node.topic, problemTitle: node.recommended_problem } })}
                  className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Practice {node.topic}</span>
                </button>
              </div>

            </div>

            {/* Connecting Connector Arrow */}
            {index < nodes.length - 1 && (
              <div className="flex justify-center py-1">
                <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500">
                  <ArrowDown className="w-4 h-4" />
                </div>
              </div>
            )}

          </React.Fragment>
        ))}
      </div>

    </div>
  );
};
