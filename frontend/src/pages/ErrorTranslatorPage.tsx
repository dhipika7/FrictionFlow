import React, { useState } from 'react';
import { Terminal, CheckCircle2, AlertTriangle, Code, ArrowRight, Sparkles, HelpCircle } from 'lucide-react';
import { api } from '../services/api';
import { ErrorExplainResponse } from '../types';

export const ErrorTranslatorPage: React.FC = () => {
  const [rawError, setRawError] = useState(
    'Segmentation fault (core dumped) at 0x00007fff8820\nProcess finished with exit code 139'
  );
  const [language, setLanguage] = useState('cpp');
  const [explanation, setExplanation] = useState<ErrorExplainResponse | null>({
    error_type: "Segmentation Fault (Memory Access Violation)",
    simple_explanation: "Your program tried to access or modify a memory address that doesn't belong to it.",
    root_cause: "Accessing an array index outside valid boundaries (e.g., arr[10] when length is 5) or dereferencing a null/uninitialized pointer.",
    actionable_checklist: [
      "Verify loop conditions: ensure index < array.size()",
      "Check for off-by-one errors in `for` loops",
      "Ensure pointers are properly initialized before dereferencing"
    ],
    suggested_fix_direction: "Add bounds check assertions `if (i >= 0 && i < len) { ... }` before array indexing."
  });
  const [loading, setLoading] = useState(false);

  const handleTranslate = async () => {
    if (!rawError.trim()) return;
    setLoading(true);
    try {
      const res = await api.explainError({
        raw_error: rawError,
        programming_language: language
      });
      setExplanation(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f17] p-4 lg:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 glow-emerald">
            <Terminal className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white">Error Translator</h1>
            <p className="text-slate-400 text-xs sm:text-sm">
              Convert intimidating compiler stack traces into simple English & actionable fix checklists
            </p>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 font-medium">Try Presets:</span>
          <button
            onClick={() => setRawError('Segmentation fault (core dumped)')}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded-lg border border-slate-700"
          >
            SegFault
          </button>
          <button
            onClick={() => setRawError('Time Limit Exceeded (TLE) on test case 42')}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded-lg border border-slate-700"
          >
            TLE
          </button>
          <button
            onClick={() => setRawError('java.lang.NullPointerException: Cannot invoke method on null object')}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded-lg border border-slate-700"
          >
            NullPointer
          </button>
        </div>
      </div>

      {/* Main Grid (Input left, Result right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Input Error Stack Trace */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Code className="w-4 h-4 text-emerald-400" />
              <span>Paste Compiler / Runtime Error</span>
            </label>
            
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-slate-900 text-slate-300 border border-slate-700 text-xs rounded-lg px-2.5 py-1 focus:outline-none"
            >
              <option value="cpp">C++</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="javascript">JavaScript</option>
            </select>
          </div>

          <textarea
            value={rawError}
            onChange={(e) => setRawError(e.target.value)}
            placeholder="Paste your raw error log or stack trace here..."
            className="w-full h-64 bg-[#070a11] text-red-300 font-mono text-xs p-4 rounded-2xl border border-slate-800 focus:outline-none focus:border-emerald-500 leading-relaxed resize-none"
          />

          <button
            onClick={handleTranslate}
            disabled={loading || !rawError.trim()}
            className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 text-sm"
          >
            <Sparkles className="w-4 h-4" />
            <span>{loading ? 'Translating...' : 'Translate to Plain English'}</span>
          </button>
        </div>

        {/* Right: Explained Output */}
        <div className="lg:col-span-7 space-y-6">
          {explanation ? (
            <div className="glass-panel p-6 rounded-3xl border border-emerald-500/30 space-y-6 animate-fade-in glow-emerald">
              
              {/* Error Header */}
              <div className="border-b border-slate-800 pb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
                  Explained by FrictionFlow
                </span>
                <h3 className="text-xl font-bold text-white mt-2">
                  {explanation.error_type}
                </h3>
              </div>

              {/* What It Means */}
              <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block">
                  What it means:
                </span>
                <p className="text-slate-200 text-sm leading-relaxed">
                  {explanation.simple_explanation}
                </p>
              </div>

              {/* Likely Root Cause */}
              <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                  Likely Root Cause:
                </span>
                <p className="text-slate-300 text-sm leading-relaxed">
                  {explanation.root_cause}
                </p>
              </div>

              {/* Actionable Debugging Checklist */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Try This (Debugging Checklist):</span>
                </span>
                <ul className="space-y-2">
                  {explanation.actionable_checklist.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-slate-200 bg-slate-900/50 p-3 rounded-xl border border-slate-800">
                      <span className="font-bold text-emerald-400">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Fix Direction */}
              <div className="bg-emerald-950/30 border border-emerald-500/30 p-4 rounded-2xl text-xs space-y-1">
                <span className="font-bold text-emerald-400 block">Suggested Fix Direction:</span>
                <p className="text-slate-200 font-mono">
                  {explanation.suggested_fix_direction}
                </p>
              </div>

            </div>
          ) : (
            <div className="glass-panel p-12 rounded-3xl border border-slate-800 text-center text-slate-400 space-y-3">
              <HelpCircle className="w-12 h-12 mx-auto text-slate-600" />
              <h3 className="text-base font-bold text-slate-300">No error translated yet</h3>
              <p className="text-xs max-w-sm mx-auto">
                Paste any compiler or runtime error on the left and click Translate to receive plain English guidance.
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
