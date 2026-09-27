import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Brain, Sparkles, ArrowRight, Zap, Lightbulb, Compass, BarChart2,
  GraduationCap, CheckCircle2, ShieldCheck, Code, Layers, AlertCircle,
  HelpCircle, ChevronDown, Sliders, Play, Terminal, Flame, MessageSquare,
  TrendingUp, Award, Users, RefreshCw, XCircle, FileCode, Check, Command
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  // --- Interactive Friction Visualizer Simulator State ---
  const [timeSpent, setTimeSpent] = useState<number>(30); // minutes
  const [failedAttempts, setFailedAttempts] = useState<number>(3);
  const [errorType, setErrorType] = useState<string>('tle'); // none, tle, segfault, syntax
  const [topicMastery, setTopicMastery] = useState<number>(40); // %

  // Calculate live friction score (matching backend multi-signal algorithm)
  const calculateSimulatedFriction = () => {
    const expectedSeconds = 20 * 60;
    const timeRatio = (timeSpent * 60) / expectedSeconds;
    let timeScore = 0;
    if (timeRatio <= 0.5) timeScore = 0;
    else if (timeRatio <= 1.0) timeScore = (timeRatio - 0.5) * 20.0;
    else if (timeRatio <= 2.0) timeScore = 10.0 + (timeRatio - 1.0) * 15.0;
    else timeScore = 35.0;

    let attemptScore = 0;
    if (failedAttempts <= 1) attemptScore = 0;
    else if (failedAttempts === 2) attemptScore = 10.0;
    else if (failedAttempts === 3) attemptScore = 20.0;
    else if (failedAttempts === 4) attemptScore = 28.0;
    else attemptScore = 35.0;

    const weaknessScore = Math.max(0, (100 - topicMastery) * 0.15);

    let errorScore = 0;
    if (errorType === 'segfault') errorScore = 15;
    else if (errorType === 'tle') errorScore = 12;
    else if (errorType === 'syntax') errorScore = 8;

    const total = Math.min(100, Math.round(timeScore + attemptScore + weaknessScore + errorScore));

    let level = 'Low';
    let hintLevel = 1;
    let message = 'Student making steady progress. No intervention required.';

    if (total > 80) {
      level = 'Critical';
      hintLevel = 3;
      message = 'Critical friction! Progressive Level 3 targeted logic hint triggered.';
    } else if (total > 60) {
      level = 'High';
      hintLevel = 2;
      message = 'Struggle threshold exceeded. Level 2 directional hint suggested.';
    } else if (total > 30) {
      level = 'Moderate';
      hintLevel = 1;
      message = 'Moderate struggle detected. Conceptual nudge ready.';
    }

    return {
      total,
      level,
      hintLevel,
      message,
      breakdown: {
        time: Math.round(timeScore),
        attempts: Math.round(attemptScore),
        weakness: Math.round(weaknessScore),
        error: Math.round(errorScore)
      }
    };
  };

  const simResult = calculateSimulatedFriction();

  // --- Interactive Hero Socratic Hint Level State ---
  const [heroHintLevel, setHeroHintLevel] = useState<number>(2);

  // --- FAQ Accordion State ---
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does FrictionFlow detect when I am struggling without asking?',
      a: 'FrictionFlow monitors non-intrusive telemetry indicators including total active solving time relative to problem difficulty baseline, submission error patterns, repeated failed test runs, and your historical topic mastery. When these signals aggregate beyond a critical threshold, FrictionFlow proactively triggers a Socratic intervention.'
    },
    {
      q: 'Will FrictionFlow just give me the answer like ChatGPT?',
      a: 'No! FrictionFlow is designed to build real coding intuition. It uses a 4-Level Progressive Hint System: Level 1 provides conceptual nudges, Level 2 gives directional strategy, Level 3 offers targeted logic steps, and only Level 4 reveals full code solutions if explicitly requested.'
    },
    {
      q: 'Does it work with platforms like LeetCode and Codeforces?',
      a: 'Yes! The FrictionFlow Chrome Manifest V3 Browser Extension automatically detects problem titles, difficulty levels, and submission results directly inside LeetCode and Codeforces, bringing FrictionFlow Socratic AI assistance right into your browser without context switching.'
    },
    {
      q: 'What backend database powers FrictionFlow?',
      a: 'FrictionFlow supports dual database modes: local SQLite for instant zero-config demos, and full MongoDB Atlas integration (configured for your database "deba") for high-throughput activity logs, telemetry storage, and unstructured compiler stack traces.'
    },
    {
      q: 'What features does FrictionFlow provide for Teachers and Instructors?',
      a: 'Instructors get access to the Teacher Dashboard, which provides classroom-level weakness heatmaps, real-time alerts for struggling students before assignments are due, and automated insights into common conceptual bottlenecks across the cohort.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 overflow-hidden font-sans selection:bg-blue-600 selection:text-white bg-grid-lines relative">
      
      {/* Radiant Glowing Orbs */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-gradient-to-b from-blue-600/20 via-indigo-600/10 to-transparent blur-[140px] pointer-events-none z-0" />
      <div className="fixed top-1/3 left-[-150px] w-[600px] h-[600px] bg-indigo-600/15 blur-[160px] pointer-events-none z-0" />
      <div className="fixed bottom-1/4 right-[-150px] w-[600px] h-[600px] bg-purple-600/15 blur-[160px] pointer-events-none z-0" />

      {/* HERO SECTION */}
      <section className="relative z-10 pt-16 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        
        {/* Animated Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs sm:text-sm font-semibold mb-8 shadow-lg shadow-blue-500/10 backdrop-blur-md">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
          </span>
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span>FrictionFlow 2.0 — Proactive Socratic AI Ecosystem</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-8 leading-[1.08] font-heading max-w-5xl mx-auto">
          Don't Wait For Help.{' '}
          <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent animate-gradient-text">
            Let AI Notice.
          </span>
        </h1>

        <p className="max-w-3xl mx-auto text-lg sm:text-xl text-slate-300 mb-10 leading-relaxed font-normal">
          FrictionFlow observes your coding activity in real-time, detects learning struggle through multi-signal telemetry, and delivers <span className="text-blue-400 font-semibold">progressive Socratic hints</span> before frustration leads to copy-pasting.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
          <Link
            to="/dashboard"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-base px-9 py-4 rounded-2xl shadow-xl shadow-blue-600/40 hover:shadow-blue-500/60 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2.5 group"
          >
            <Brain className="w-5 h-5 text-blue-200" />
            <span>Launch Student Dashboard</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <a
            href="#live-simulator"
            className="glass-panel hover:bg-slate-800/80 text-slate-200 font-semibold text-base px-8 py-4 rounded-2xl border border-slate-700/80 hover:border-slate-500 transition-all flex items-center gap-2.5"
          >
            <Sliders className="w-4 h-4 text-indigo-400" />
            <span>Try Live Friction Visualizer</span>
          </a>
        </div>

        {/* Quick Stat Ribbon */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-16">
          <div className="glass-panel p-4 rounded-2xl border border-slate-800 text-center">
            <span className="text-2xl sm:text-3xl font-extrabold text-blue-400 font-heading">87%</span>
            <span className="text-xs text-slate-400 block mt-1">Independent Solves</span>
          </div>
          <div className="glass-panel p-4 rounded-2xl border border-slate-800 text-center">
            <span className="text-2xl sm:text-3xl font-extrabold text-indigo-400 font-heading">3.4x</span>
            <span className="text-xs text-slate-400 block mt-1">Faster Retention</span>
          </div>
          <div className="glass-panel p-4 rounded-2xl border border-slate-800 text-center">
            <span className="text-2xl sm:text-3xl font-extrabold text-purple-400 font-heading">4 Levels</span>
            <span className="text-xs text-slate-400 block mt-1">Socratic Guidance</span>
          </div>
          <div className="glass-panel p-4 rounded-2xl border border-slate-800 text-center">
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-heading">MongoDB</span>
            <span className="text-xs text-slate-400 block mt-1">Database Active</span>
          </div>
        </div>

      </section>

      {/* CENTERPIECE SHOWCASE: INTERACTIVE IDE MOCKUP */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto z-10 relative">
        <div className="glass-panel p-3 sm:p-4 rounded-3xl border border-blue-500/30 shadow-2xl glow-blue relative">
          
          {/* IDE Window Bar */}
          <div className="bg-slate-950 px-4 py-3 rounded-t-2xl border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
              <span className="text-xs font-mono text-slate-400 ml-2 flex items-center gap-1.5">
                <FileCode className="w-3.5 h-3.5 text-blue-400" />
                <span>two_sum.py — FrictionFlow Workspace</span>
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="bg-rose-950/80 text-rose-300 border border-rose-500/40 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping"></span>
                <span>Friction: 78 (High)</span>
              </span>
              <span className="bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                MongoDB Active
              </span>
            </div>
          </div>

          {/* IDE Body Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 bg-[#080c14] rounded-b-2xl overflow-hidden border-t border-slate-900">
            
            {/* Left Code Editor Pane */}
            <div className="lg:col-span-7 p-5 font-mono text-xs sm:text-sm text-slate-300 space-y-2 leading-relaxed border-r border-slate-800/80">
              <div className="text-slate-600">// Problem: Two Sum (Arrays & Hashing)</div>
              <div className="text-slate-600">// Student attempt #3 • 35 mins spent</div>
              <div><span className="text-purple-400">def</span> <span className="text-blue-400">twoSum</span>(nums: <span className="text-cyan-300">list</span>[<span className="text-cyan-300">int</span>], target: <span className="text-cyan-300">int</span>) -&gt; <span className="text-cyan-300">list</span>[<span className="text-cyan-300">int</span>]:</div>
              <div className="pl-4 text-slate-500"># Nested loop approach causing Time Limit Exceeded</div>
              <div className="pl-4"><span className="text-purple-400">for</span> i <span className="text-purple-400">in</span> <span className="text-blue-400">range</span>(<span className="text-blue-400">len</span>(nums)):</div>
              <div className="pl-8"><span className="text-purple-400">for</span> j <span className="text-purple-400">in</span> <span className="text-blue-400">range</span>(i + <span className="text-amber-300">1</span>, <span className="text-blue-400">len</span>(nums)):</div>
              <div className="pl-12 bg-rose-950/40 border-l-2 border-rose-500 py-1 px-2 text-rose-200">
                <span className="text-purple-400">if</span> nums[i] + nums[j] == target:  <span className="text-rose-400">// ⚠️ TLE Error on large input</span>
              </div>
              <div className="pl-16"><span className="text-purple-400">return</span> [i, j]</div>

              <div className="pt-4 border-t border-slate-800/60 flex items-center justify-between text-[11px] font-sans text-slate-400">
                <span>Platform: LeetCode</span>
                <span>Submissions: 3 Failed (TLE)</span>
              </div>
            </div>

            {/* Right Layered Socratic Mentor Card */}
            <div className="lg:col-span-5 p-5 bg-slate-900/60 flex flex-col justify-between space-y-4">
              
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-purple-400">
                    <Brain className="w-4 h-4 text-purple-400" />
                    <span>FrictionFlow AI Mentor (Socratic Guidance)</span>
                  </div>
                  <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded font-bold">Proactive</span>
                </div>

                <div className="text-xs text-slate-300 mb-4 bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-amber-400 font-bold block mb-1">⚡ Autonomous Intervention Activated:</span>
                  "We noticed you've spent 35m and hit 3 TLE errors on Two Sum. Let's build your intuition!"
                </div>

                {/* Level Picker */}
                <div className="grid grid-cols-4 gap-1.5 mb-4">
                  {[1, 2, 3, 4].map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => setHeroHintLevel(lvl)}
                      className={`py-1.5 rounded text-[11px] font-bold transition-all border ${
                        heroHintLevel === lvl
                          ? 'bg-purple-600 text-white border-purple-400 shadow'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                      }`}
                    >
                      Lvl {lvl}
                    </button>
                  ))}
                </div>

                {/* Hint Output Box */}
                <div className="bg-slate-950 p-4 rounded-xl border border-purple-500/30 text-xs space-y-2">
                  {heroHintLevel === 1 && (
                    <p className="text-slate-200 leading-relaxed">
                      💡 <strong>Level 1 Conceptual Hint:</strong> Avoid checking every pair with nested O(N²) loops. What data structure allows checking if a complement value exists in O(1) time?
                    </p>
                  )}
                  {heroHintLevel === 2 && (
                    <p className="text-slate-200 leading-relaxed">
                      🎯 <strong>Level 2 Directional Strategy:</strong> Use a HashMap (dictionary). As you loop through the array once, check if `target - current_num` already exists in the map.
                    </p>
                  )}
                  {heroHintLevel === 3 && (
                    <p className="text-slate-200 leading-relaxed">
                      🔍 <strong>Level 3 Targeted Steps:</strong><br/>
                      1. Initialize `seen = {}`<br/>
                      2. Iterate `for i, num in enumerate(nums)`<br/>
                      3. Check `if target - num in seen:`
                    </p>
                  )}
                  {heroHintLevel === 4 && (
                    <p className="text-emerald-300 font-mono text-[11px] leading-relaxed">
                      ```python<br/>
                      seen = {}<br/>
                      for i, n in enumerate(nums):<br/>
                      &nbsp;&nbsp;if target - n in seen: return [seen[target - n], i]<br/>
                      &nbsp;&nbsp;seen[n] = i
                      ```
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-2 text-[11px] text-slate-400 text-center border-t border-slate-800">
                Guides learning without ruining problem-solving intuition.
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* INTERACTIVE FRICTION VISUALIZER SIMULATOR */}
      <section id="live-simulator" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10 relative">
        <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-blue-500/30 shadow-2xl relative overflow-hidden">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-800">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-2">
                <Sliders className="w-3.5 h-3.5" />
                <span>Interactive Telemetry Playground</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white font-heading">
                Test The Friction Detection Engine Real-Time
              </h2>
              <p className="text-slate-400 text-sm mt-1">
                Drag the telemetry sliders below to watch the Friction Engine evaluate friction score and trigger Socratic hints.
              </p>
            </div>
            
            <button
              onClick={() => { setTimeSpent(45); setFailedAttempts(4); setErrorType('tle'); setTopicMastery(30); }}
              className="px-4 py-2.5 rounded-xl bg-blue-600/20 text-blue-300 border border-blue-500/40 text-xs font-bold hover:bg-blue-600/30 transition-all self-start md:self-auto flex items-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Simulate Critical Struggle Case
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Sliders Control Panel */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Slider 1: Time Spent */}
              <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span>Time Spent on Problem</span>
                  </label>
                  <span className="text-xs font-bold text-amber-400">{timeSpent} mins (Baseline: 20m)</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="60"
                  value={timeSpent}
                  onChange={(e) => setTimeSpent(Number(e.target.value))}
                  className="w-full accent-amber-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
                />
              </div>

              {/* Slider 2: Failed Attempts */}
              <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-rose-400" />
                    <span>Failed Submissions / Attempts</span>
                  </label>
                  <span className="text-xs font-bold text-rose-400">{failedAttempts} attempts</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="6"
                  value={failedAttempts}
                  onChange={(e) => setFailedAttempts(Number(e.target.value))}
                  className="w-full accent-rose-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
                />
              </div>

              {/* Selector 3: Error Type */}
              <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-2 mb-3">
                  <Terminal className="w-4 h-4 text-purple-400" />
                  <span>Encountered Runtime Error</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'none', label: 'None' },
                    { id: 'tle', label: 'Time Limit (TLE)' },
                    { id: 'segfault', label: 'SegFault Crash' },
                    { id: 'syntax', label: 'Syntax Error' }
                  ].map((err) => (
                    <button
                      key={err.id}
                      onClick={() => setErrorType(err.id)}
                      className={`py-2 px-3 rounded-xl text-xs font-medium border transition-all ${
                        errorType === err.id
                          ? 'bg-purple-600/30 border-purple-500 text-purple-200 font-bold'
                          : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {err.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Slider 4: Topic Mastery */}
              <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-blue-400" />
                    <span>Student Historical Topic Mastery</span>
                  </label>
                  <span className="text-xs font-bold text-blue-400">{topicMastery}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="95"
                  value={topicMastery}
                  onChange={(e) => setTopicMastery(Number(e.target.value))}
                  className="w-full accent-blue-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
                />
              </div>

            </div>

            {/* Live Evaluated Friction Output Card */}
            <div className="lg:col-span-5">
              <div className={`p-6 rounded-3xl border transition-all ${
                simResult.total > 80
                  ? 'bg-purple-950/40 border-purple-500/50 glow-purple'
                  : simResult.total > 60
                  ? 'bg-rose-950/40 border-rose-500/50 glow-rose'
                  : simResult.total > 30
                  ? 'bg-amber-950/40 border-amber-500/50 glow-amber'
                  : 'bg-emerald-950/40 border-emerald-500/50 glow-emerald'
              }`}>
                
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs uppercase font-bold tracking-wider text-slate-400">Live Friction Engine Output</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wide border ${
                    simResult.total > 80
                      ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                      : simResult.total > 60
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                      : simResult.total > 30
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  }`}>
                    {simResult.level} Friction
                  </span>
                </div>

                {/* Score Gauge */}
                <div className="flex items-baseline gap-3 mb-6">
                  <span className="text-5xl font-extrabold text-white font-heading">{simResult.total}</span>
                  <span className="text-sm text-slate-400">/ 100 Friction Index</span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden mb-6 border border-slate-800">
                  <div
                    className={`h-full transition-all duration-500 ${
                      simResult.total > 80
                        ? 'bg-gradient-to-r from-purple-500 to-indigo-500'
                        : simResult.total > 60
                        ? 'bg-gradient-to-r from-rose-500 to-amber-500'
                        : simResult.total > 30
                        ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                        : 'bg-gradient-to-r from-emerald-500 to-teal-400'
                    }`}
                    style={{ width: `${simResult.total}%` }}
                  />
                </div>

                {/* Signal Breakdown */}
                <div className="grid grid-cols-2 gap-2 text-xs mb-6 bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800">
                  <div>Time Signal: <span className="font-bold text-slate-200">{simResult.breakdown.time} pts</span></div>
                  <div>Attempts Signal: <span className="font-bold text-slate-200">{simResult.breakdown.attempts} pts</span></div>
                  <div>Topic Weakness: <span className="font-bold text-slate-200">{simResult.breakdown.weakness} pts</span></div>
                  <div>Error Severity: <span className="font-bold text-slate-200">{simResult.breakdown.error} pts</span></div>
                </div>

                {/* Actionable Trigger */}
                <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 text-xs space-y-2">
                  <div className="flex items-center gap-2 font-bold text-slate-200">
                    <Lightbulb className="w-4 h-4 text-amber-400" />
                    <span>System Intervention Response:</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">{simResult.message}</p>
                  <div className="pt-2 flex items-center justify-between border-t border-slate-800/80 text-[11px]">
                    <span className="text-slate-400">Auto Socratic Trigger:</span>
                    <span className={`font-bold ${simResult.total >= 60 ? 'text-emerald-400' : 'text-slate-500'}`}>
                      {simResult.total >= 60 ? '⚡ ACTIVATED (Level ' + simResult.hintLevel + ' Hint)' : 'OFF (Student exploring)'}
                    </span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6 CORE FEATURE PILLARS GRID */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-4 font-heading">
            Built For Serious Programming Growth
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
            Everything you need to move from frustrating code blocks to confident algorithmic problem-solving.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="glass-panel-interactive p-7 rounded-3xl border border-slate-800 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white font-heading">Friction Detection Engine</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Multi-signal scoring algorithm combining time spent, failed submission attempts, historical topic accuracy, and error severity.
            </p>
          </div>

          <div className="glass-panel-interactive p-7 rounded-3xl border border-slate-800 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Brain className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white font-heading">4-Level Socratic Hints</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Guides students through concepts level-by-level (Conceptual ➔ Directional ➔ Targeted Logic) instead of spoiling solutions.
            </p>
          </div>

          <div className="glass-panel-interactive p-7 rounded-3xl border border-slate-800 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Terminal className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white font-heading">Cryptic Error Translator</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Translates Segmentation Faults, TLEs, and NullPointer crashes into plain English explanations with step-by-step fix checklists.
            </p>
          </div>

          <div className="glass-panel-interactive p-7 rounded-3xl border border-slate-800 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white font-heading">Adaptive Roadmaps</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Automatically builds personalized problem sequences matching student weak topics (&lt;60% mastery) and prerequisite graphs.
            </p>
          </div>

          <div className="glass-panel-interactive p-7 rounded-3xl border border-slate-800 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <BarChart2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white font-heading">Teacher Analytics</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Gives educators classroom-level weakness heatmaps and automated high-risk student alerts before exam deadlines.
            </p>
          </div>

          <div className="glass-panel-interactive p-7 rounded-3xl border border-slate-800 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white font-heading">Chrome Browser Extension</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Integrates directly into LeetCode and Codeforces DOMs to observe activity and offer instant in-page hints.
            </p>
          </div>

        </div>
      </section>

      {/* TRADITIONAL AI VS FRICTIONFLOW COMPARISON */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-4 font-heading">
            Traditional Chatbots vs FrictionFlow
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Why copying complete solutions slows down long-term algorithmic intuition.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Traditional AI */}
          <div className="bg-rose-950/20 border border-rose-500/20 rounded-3xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                <XCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-rose-300 font-heading">Traditional AI Chatbots</h3>
                <span className="text-xs text-rose-400/80">Reactive Code Dumpers</span>
              </div>
            </div>

            <ul className="space-y-4 text-sm text-slate-300">
              <li className="flex items-start gap-3">
                <span className="text-rose-400 font-bold mt-0.5">✕</span>
                <span>Waits reactively until the student manually copies/pastes code into a prompt.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-rose-400 font-bold mt-0.5">✕</span>
                <span>Dumps finished code solutions immediately, ruining problem-solving intuition.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-rose-400 font-bold mt-0.5">✕</span>
                <span>No long-term memory of student weak topics or failure patterns.</span>
              </li>
            </ul>
          </div>

          {/* FrictionFlow */}
          <div className="bg-blue-950/30 border border-blue-500/40 rounded-3xl p-8 glow-blue">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
                <Brain className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-blue-300 font-heading">FrictionFlow AI Companion</h3>
                <span className="text-xs text-blue-400/80">Proactive Socratic Mentor</span>
              </div>
            </div>

            <ul className="space-y-4 text-sm text-slate-200">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Passively monitors telemetry and intervenes automatically when struggle is detected.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Provides progressive 4-Level Socratic hints to preserve active learning moments.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Tracks topic mastery scores in MongoDB (deba) and auto-generates practice roadmaps.</span>
              </li>
            </ul>
          </div>

        </div>
      </section>

      {/* STUDENT & PROFESSOR TESTIMONIALS */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-4 font-heading">
            Loved by Students & Instructors
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            See how FrictionFlow transforms coding struggle into measurable confidence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="glass-panel p-6 rounded-3xl border border-slate-800">
            <div className="flex items-center gap-1 text-amber-400 mb-4 text-sm">
              {'★'.repeat(5)}
            </div>
            <p className="text-slate-300 text-sm leading-relaxed mb-6 italic">
              "FrictionFlow noticed I was stuck on Dynamic Programming before I gave up. Instead of dumping code, it gave me a level 1 conceptual nudge that helped me solve it on my own!"
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600/30 border border-blue-500/40 flex items-center justify-center font-bold text-blue-300 text-sm">
                R
              </div>
              <div>
                <span className="font-bold text-white text-sm block">Rohan Sharma</span>
                <span className="text-xs text-slate-400">CS Junior, DSA Learner</span>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-slate-800">
            <div className="flex items-center gap-1 text-amber-400 mb-4 text-sm">
              {'★'.repeat(5)}
            </div>
            <p className="text-slate-300 text-sm leading-relaxed mb-6 italic">
              "As a professor teaching 150+ students, I couldn't monitor everyone's individual struggles. FrictionFlow's Teacher Dashboard flags high-friction topics instantly."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-600/30 border border-purple-500/40 flex items-center justify-center font-bold text-purple-300 text-sm">
                Dr
              </div>
              <div>
                <span className="font-bold text-white text-sm block">Dr. Elena Rostova</span>
                <span className="text-xs text-slate-400">Computer Science Professor</span>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-slate-800">
            <div className="flex items-center gap-1 text-amber-400 mb-4 text-sm">
              {'★'.repeat(5)}
            </div>
            <p className="text-slate-300 text-sm leading-relaxed mb-6 italic">
              "The Error Translator alone saved me hours. Segmentation faults used to take me all night to figure out; FrictionFlow points out the exact array bounds issue in seconds!"
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center font-bold text-emerald-300 text-sm">
                P
              </div>
              <div>
                <span className="font-bold text-white text-sm block">Priya Patel</span>
                <span className="text-xs text-slate-400">Competitive Programmer</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* FAQ ACCORDION SECTION */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto border-t border-slate-800/80">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 font-heading">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-400">
            Everything you need to know about FrictionFlow ecosystem.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="glass-panel rounded-2xl border border-slate-800 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-white hover:text-blue-400 transition-colors"
                >
                  <span className="text-base sm:text-lg font-heading">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-slate-400 shrink-0 transition-transform ${isOpen ? 'rotate-180 text-blue-400' : ''}`} />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-slate-300 text-sm leading-relaxed border-t border-slate-800/60 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* RADIANT CALL TO ACTION FOOTER */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="relative glass-panel p-10 sm:p-16 rounded-3xl border border-blue-500/40 glow-blue text-center overflow-hidden">
          
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-6 font-heading leading-tight">
              Ready for AI that notices before you ask?
            </h2>
            <p className="text-slate-300 text-base sm:text-lg mb-10 max-w-xl mx-auto leading-relaxed">
              Experience proactive Socratic guidance today. Join programming students and instructors building true algorithmic confidence.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/dashboard"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-base px-9 py-4 rounded-xl shadow-xl shadow-blue-600/40 hover:scale-[1.03] transition-all flex items-center gap-2 group"
              >
                <span>Launch Student Companion</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/teacher"
                className="glass-panel hover:bg-slate-800/80 text-slate-200 font-semibold text-base px-8 py-4 rounded-xl border border-slate-700/80 hover:border-slate-500 transition-all flex items-center gap-2"
              >
                <Users className="w-4 h-4 text-purple-400" />
                <span>Explore Teacher Dashboard</span>
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* Footer Branding */}
      <footer className="py-8 px-4 text-center border-t border-slate-800/60 text-xs text-slate-500">
        FrictionFlow — Proactive AI Mentor Platform • MongoDB Database <span className="text-emerald-400 font-bold">deba</span> Connected
      </footer>

    </div>
  );
};
