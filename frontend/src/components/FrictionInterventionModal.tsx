import React from 'react';
import { Lightbulb, Compass, Code, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface FrictionInterventionModalProps {
  isOpen: boolean;
  onClose: () => void;
  problemTitle?: string;
  topic?: string;
  frictionScore?: number;
  message?: string;
}

export const FrictionInterventionModal: React.FC<FrictionInterventionModalProps> = ({
  isOpen,
  onClose,
  problemTitle = 'House Robber',
  topic = 'Dynamic Programming',
  frictionScore = 78.5,
  message = "Looks like this problem is taking longer than usual. Want a progressive hint to guide your intuition?"
}) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleGetHint = (hintLevel: number) => {
    onClose();
    navigate('/mentor', { state: { problemTitle, topic, autoRequestHint: true, hintLevel } });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="bg-[#131b2e] border border-amber-500/40 rounded-2xl p-6 max-w-md w-full shadow-2xl relative glow-amber">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500/30 to-orange-600/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/10">
            <Lightbulb className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/15 px-2 py-0.5 rounded border border-amber-500/30">
              FrictionFlow Intervention
            </span>
            <h3 className="text-lg font-bold text-white mt-0.5">Learning Friction Detected</h3>
          </div>
        </div>

        <p className="text-slate-300 text-sm mb-4 leading-relaxed">
          {message}
        </p>

        <div className="bg-slate-900/70 p-3.5 rounded-xl border border-slate-800/80 mb-5 text-xs space-y-1.5 backdrop-blur-sm">
          <div className="flex justify-between items-center">
            <span className="text-slate-400 font-medium">Problem:</span>
            <span className="font-semibold text-slate-100">{problemTitle}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400 font-medium">Topic:</span>
            <span className="font-semibold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">{topic}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400 font-medium">Struggle Score:</span>
            <span className="font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">{frictionScore} / 100 (High)</span>
          </div>
        </div>

        <div className="space-y-2 mb-3">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">CHOOSE HINT LEVEL</span>
          <div className="grid grid-cols-1 gap-2">
            <button
              onClick={() => handleGetHint(1)}
              className="w-full bg-slate-800/90 hover:bg-slate-700/90 text-left p-3 rounded-xl border border-slate-700/60 hover:border-amber-500/50 transition-all flex items-center gap-3 group"
            >
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs group-hover:scale-105 transition-transform">
                L1
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-slate-100 group-hover:text-amber-300 transition-colors">Concept Hint</div>
                <div className="text-[11px] text-slate-400 truncate">General direction & intuitive explanation</div>
              </div>
            </button>

            <button
              onClick={() => handleGetHint(2)}
              className="w-full bg-slate-800/90 hover:bg-slate-700/90 text-left p-3 rounded-xl border border-slate-700/60 hover:border-purple-500/50 transition-all flex items-center gap-3 group"
            >
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs group-hover:scale-105 transition-transform">
                L2
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-slate-100 group-hover:text-purple-300 transition-colors">Strategy Hint</div>
                <div className="text-[11px] text-slate-400 truncate">Algorithm choice & data structures</div>
              </div>
            </button>

            <button
              onClick={() => handleGetHint(3)}
              className="w-full bg-slate-800/90 hover:bg-slate-700/90 text-left p-3 rounded-xl border border-slate-700/60 hover:border-blue-500/50 transition-all flex items-center gap-3 group"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs group-hover:scale-105 transition-transform">
                L3
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-slate-100 group-hover:text-blue-300 transition-colors">Logic Guidance</div>
                <div className="text-[11px] text-slate-400 truncate">Step-by-step implementation guide</div>
              </div>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <button
            onClick={onClose}
            className="w-full bg-slate-800/60 hover:bg-slate-700/60 text-slate-300 font-medium py-2 px-3 rounded-xl transition-colors text-xs border border-slate-700/50 text-center"
          >
            I'll keep trying independently
          </button>
        </div>
      </div>
    </div>
  );
};

