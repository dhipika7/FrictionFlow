import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Brain, Send, Lightbulb, Code, Terminal, Sparkles, HelpCircle,
  CheckCircle2, ArrowRight, ShieldAlert, Zap
} from 'lucide-react';
import { api } from '../services/api';
import { ProgressiveHintResponse } from '../types';

export const AIMentorPage: React.FC = () => {
  const location = useLocation();

  const [problemTitle, setProblemTitle] = useState('House Robber');
  const [topic, setTopic] = useState('Dynamic Programming');
  const [difficulty, setDifficulty] = useState('Medium');
  const [hintLevel, setHintLevel] = useState(1);
  
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string; hintData?: ProgressiveHintResponse }>>([
    {
      sender: 'ai',
      text: "Hello Alex! 👋 I'm your FrictionFlow AI Mentor. I noticed you've been working on 'House Robber'. Instead of just giving away code, I'm here to ask guiding questions so you master the underlying concept. How can I help?"
    }
  ]);
  
  const [inputMsg, setInputMsg] = useState('');
  const [codeSnippet, setCodeSnippet] = useState(
`def rob(nums: list[int]) -> int:
    # Your current attempt
    if not nums:
        return 0
    dp = [0] * len(nums)
    # Stuck on base case transition...
    return dp[-1]`
  );
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location.state?.problemTitle) {
      setProblemTitle(location.state.problemTitle);
    }
    if (location.state?.topic) {
      setTopic(location.state.topic);
    }
    if (location.state?.autoRequestHint) {
      triggerProgressiveHint(location.state.hintLevel || 1);
    }
  }, [location.state]);

  const handleSendMessage = async () => {
    if (!inputMsg.trim()) return;

    const userText = inputMsg;
    setInputMsg('');
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setLoading(true);

    try {
      const res = await api.mentorChat({
        user_message: userText,
        problem_title: problemTitle,
        topic: topic,
        difficulty: difficulty,
        code_snippet: codeSnippet,
        current_hint_level: hintLevel
      });

      setMessages(prev => [...prev, { sender: 'ai', text: res.reply }]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: "Before changing your code, let's analyze the recurrence relation. At house `i`, what are your two choices? You can either rob house `i` (adding to profit from `i-2`) or skip house `i` (keeping profit from `i-1`)."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const triggerProgressiveHint = async (level: number) => {
    setHintLevel(level);
    setLoading(true);

    try {
      const hintRes = await api.getProgressiveHint({
        problem_title: problemTitle,
        topic: topic,
        difficulty: difficulty,
        hint_level: level,
        student_attempt_code: codeSnippet
      });

      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: `💡 **${hintRes.hint_title}**\n\n${hintRes.content}`,
          hintData: hintRes
        }
      ]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f17] p-4 lg:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
      
      {/* Mentor Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white shadow-lg glow-blue">
            <Brain className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white">Socratic AI Mentor</h1>
              <span className="text-[10px] uppercase tracking-wider font-bold bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded border border-blue-500/30">
                Active
              </span>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm">
              Current Challenge: <strong className="text-white">{problemTitle}</strong> ({topic} • {difficulty})
            </p>
          </div>
        </div>

        {/* Problem Switcher */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 font-medium">Select Context:</span>
          <select
            value={problemTitle}
            onChange={(e) => setProblemTitle(e.target.value)}
            className="bg-slate-900 text-slate-200 border border-slate-700 rounded-xl px-3 py-1.5 focus:outline-none focus:border-blue-500"
          >
            <option value="House Robber">House Robber (DP)</option>
            <option value="Two Sum">Two Sum (Arrays)</option>
            <option value="Climbing Stairs">Climbing Stairs (DP)</option>
            <option value="Coin Change">Coin Change (DP)</option>
          </select>
        </div>
      </div>

      {/* Progressive Hint Toolbar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
          <Lightbulb className="w-4 h-4 text-amber-400" />
          <span>Progressive Hint Levels:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => triggerProgressiveHint(1)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
              hintLevel === 1 ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow' : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-white'
            }`}
          >
            Level 1: Conceptual Nudge
          </button>

          <button
            onClick={() => triggerProgressiveHint(2)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
              hintLevel === 2 ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow' : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-white'
            }`}
          >
            Level 2: Directional Structure
          </button>

          <button
            onClick={() => triggerProgressiveHint(3)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
              hintLevel === 3 ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow' : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-white'
            }`}
          >
            Level 3: Step-by-Step Logic
          </button>

          <button
            onClick={() => triggerProgressiveHint(4)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
              hintLevel === 4 ? 'bg-purple-500/20 text-purple-300 border-purple-500/50 shadow' : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-white'
            }`}
          >
            Level 4: Full Code Solution
          </button>
        </div>
      </div>

      {/* Main Workspace (Code Editor + Chat) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Code Editor Playground */}
        <div className="lg:col-span-5 glass-panel p-5 rounded-3xl border border-slate-800 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
                <Code className="w-4 h-4 text-blue-400" />
                <span>Code Attempt Workspace</span>
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Python 3</span>
            </div>

            <textarea
              value={codeSnippet}
              onChange={(e) => setCodeSnippet(e.target.value)}
              className="w-full h-80 bg-[#070a11] text-slate-200 font-mono text-xs p-4 rounded-2xl border border-slate-800 focus:outline-none focus:border-blue-500 leading-relaxed resize-none"
            />
          </div>

          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80 text-xs text-slate-400">
            <span className="font-semibold text-slate-200 block mb-1">💡 Mentor Philosophy:</span>
            Your code snippet is attached when asking questions. The mentor evaluates your time & space complexity automatically.
          </div>
        </div>

        {/* Right: Socratic Chat Interface */}
        <div className="lg:col-span-7 glass-panel rounded-3xl border border-slate-800 flex flex-col h-[520px]">
          
          {/* Chat Messages */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shrink-0 mt-1 shadow">
                    <Brain className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-xl p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none shadow-md'
                      : 'bg-slate-900/90 text-slate-200 border border-slate-800 rounded-bl-none shadow'
                  }`}
                >
                  {msg.text}
                </div>

                {msg.sender === 'user' && (
                  <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300 shrink-0 mt-1 border border-slate-700">
                    <span>You</span>
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-3 items-center text-xs text-slate-400">
                <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white animate-pulse">
                  <Brain className="w-4 h-4" />
                </div>
                <span>FrictionFlow AI Mentor is thinking...</span>
              </div>
            )}
          </div>

          {/* Input Box */}
          <div className="p-4 border-t border-slate-800/80 bg-slate-900/40 rounded-b-3xl">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                placeholder="Ask about TLE, logic, or edge cases..."
                className="flex-1 bg-slate-950 text-slate-100 text-xs sm:text-sm px-4 py-3 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                disabled={loading || !inputMsg.trim()}
                className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold px-4 py-3 rounded-xl transition-all shadow-md flex items-center justify-center"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>

      </div>

    </div>
  );
};
