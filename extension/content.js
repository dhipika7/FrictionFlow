// FrictionFlow Manifest V3 Content Script — In-Page AI Chat Assistant
(function () {
  console.log('[FrictionFlow Extension] Active on coding platform page.');

  let startTime = Date.now();
  let attemptCount = 1;
  let problemTitle = 'Coding Challenge';
  let platform = 'CodingPlatform';
  let difficulty = 'Medium';
  let topic = 'General';
  let problemId = 'challenge-1';
  let activeSessionId = `sess_${Math.random().toString(36).substring(2, 10)}`;
  let isChatOpen = false;
  let currentHintLevel = 0;
  let currentFrictionLevel = 'Low';
  let currentFrictionScore = 0;

  function getAdapter() {
    return window.FrictionFlowAdapters ? window.FrictionFlowAdapters.getAdapter() : null;
  }

  function detectProblemInfo() {
    const adapter = getAdapter();
    if (adapter) {
      return adapter.getProblemInfo();
    }
    return {
      platform: 'CodingPlatform',
      problemTitle: 'Coding Challenge',
      difficulty: 'Medium',
      topic: 'General',
      problemId: 'challenge-1'
    };
  }

  const initialInfo = detectProblemInfo();
  platform = initialInfo.platform;
  problemTitle = initialInfo.problemTitle;
  difficulty = initialInfo.difficulty;
  topic = initialInfo.topic;
  problemId = initialInfo.problemId;

  async function registerBackendSession() {
    try {
      const res = await fetch('http://localhost:8000/api/v1/activity/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: activeSessionId,
          platform: platform,
          problem_id: problemId,
          problem_title: problemTitle,
          difficulty: difficulty,
          topic: topic
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.session_id) activeSessionId = data.session_id;
        console.log(`[FrictionFlow] Backend session registered: ${activeSessionId}`);
      }
    } catch (err) {
      console.warn('[FrictionFlow] Failed to register session with backend:', err);
    }
  }

  registerBackendSession();

  // Set up DOM event observation via adapter
  const adapter = getAdapter();
  if (adapter && adapter.observeEvents) {
    adapter.observeEvents({
      onSubmit: async ({ status, error_message }) => {
        attemptCount++;
        const timeSpent = Math.floor((Date.now() - startTime) / 1000);
        console.log(`[FrictionFlow] Recording failed submission attempt ${attemptCount}...`);
        try {
          const res = await fetch('http://localhost:8000/api/v1/activity/submission', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              session_id: activeSessionId,
              platform: platform,
              problem_id: problemId,
              problem_title: problemTitle,
              status: status || 'SUBMISSION_FAILED',
              error_message: error_message,
              time_spent_seconds: timeSpent
            })
          });
          if (res.ok) {
            const data = await res.json();
            currentFrictionScore = data.friction_score || 0;
            currentFrictionLevel = data.friction_level || 'Low';
            updateWidgetFrictionBadge(currentFrictionLevel);
          }
        } catch (err) {
          console.warn('[FrictionFlow] Error recording submission:', err);
        }
      },
      onComplete: async ({ successful }) => {
        const timeSpent = Math.floor((Date.now() - startTime) / 1000);
        console.log('[FrictionFlow] Problem solved! Recording completion...');
        try {
          await fetch('http://localhost:8000/api/v1/activity/submission', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              session_id: activeSessionId,
              platform: platform,
              problem_id: problemId,
              problem_title: problemTitle,
              status: 'SUBMISSION_ACCEPTED',
              time_spent_seconds: timeSpent
            })
          });
        } catch (err) {
          console.warn('[FrictionFlow] Error recording completion:', err);
        }
      }
    });
  }

  function checkAndUpdateProblem() {
    const info = detectProblemInfo();
    if (info.problemTitle && (info.problemTitle !== problemTitle || info.platform !== platform)) {
      console.log(`[FrictionFlow] SPA route changed: "${problemTitle}" -> "${info.problemTitle}"`);
      const isInitial = problemTitle === 'Coding Challenge';
      problemTitle = info.problemTitle;
      platform = info.platform;
      difficulty = info.difficulty;
      topic = info.topic;
      problemId = info.problemId;

      if (!isInitial) {
        startTime = Date.now();
        attemptCount = 1;
        activeSessionId = `sess_${Math.random().toString(36).substring(2, 10)}`;
        hasShownHighFrictionToast = false;
        registerBackendSession();
      }

      if (shadowRoot) {
        const subTitleEl = shadowRoot.querySelector('.ff-header-sub');
        if (subTitleEl) {
          subTitleEl.textContent = `${platform} (${topic}): ${problemTitle}`;
        }
        const toastTextEl = shadowRoot.getElementById('ff-toast-body-text');
        if (toastTextEl) {
          toastTextEl.innerHTML = `You've spent significant time on <strong>${escapeHtml(problemTitle)}</strong> (${topic}). Would you like a progressive hint to unblock your logic?`;
        }
      }
    }
  }

  function getFrictionLevel(elapsedMinutes, attempts) {
    if (currentFrictionLevel && currentFrictionLevel !== 'Low') return currentFrictionLevel;
    if (elapsedMinutes >= 35 || attempts >= 4) return 'High';
    if (elapsedMinutes >= 15 || attempts >= 2) return 'Moderate';
    return 'Low';
  }

  function updateSessionState() {
    checkAndUpdateProblem();

    const elapsedMinutes = Math.floor((Date.now() - startTime) / (1000 * 60));
    const friction = getFrictionLevel(elapsedMinutes, attemptCount);

    const sessionData = {
      platform,
      problemTitle,
      timeMinutes: elapsedMinutes,
      attempts: attemptCount,
      friction,
      lastUpdated: Date.now()
    };

    chrome.storage.local.set({ activeSession: sessionData });
    updateWidgetFrictionBadge(friction);
  }

  let shadowRoot = null;
  let chatDrawerEl = null;
  let pillWidgetEl = null;
  let messagesContainerEl = null;

  function createShadowHost() {
    if (!document.body) return null;

    let hostEl = document.getElementById('frictionflow-shadow-host');
    if (hostEl && shadowRoot) return shadowRoot;

    if (!hostEl) {
      hostEl = document.createElement('div');
      hostEl.id = 'frictionflow-shadow-host';
      hostEl.style.cssText = `
        position: fixed;
        z-index: 2147483647;
        bottom: 0;
        right: 0;
        pointer-events: none;
      `;
      document.body.appendChild(hostEl);
    }

    shadowRoot = hostEl.attachShadow({ mode: 'open' });

    // Inject styles into shadow root
    const style = document.createElement('style');
    style.textContent = `
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      }
      .ff-widget-container {
        pointer-events: auto;
        position: fixed;
        bottom: 24px;
        right: 24px;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 12px;
      }
      .ff-pill-btn {
        background: #0f172a;
        background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
        border: 1px solid rgba(59, 130, 246, 0.4);
        color: #ffffff;
        padding: 10px 18px;
        border-radius: 999px;
        font-size: 13px;
        font-weight: 600;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), 0 0 15px rgba(59, 130, 246, 0.2);
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 10px;
        transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        user-select: none;
      }
      .ff-pill-btn:hover {
        transform: translateY(-2px);
        border-color: rgba(59, 130, 246, 0.8);
        box-shadow: 0 14px 35px rgba(0, 0, 0, 0.6), 0 0 20px rgba(59, 130, 246, 0.4);
      }
      .ff-status-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #10b981;
        box-shadow: 0 0 8px #10b981;
      }
      .ff-status-dot.high {
        background: #f59e0b;
        box-shadow: 0 0 8px #f59e0b;
      }
      .ff-toast {
        background: #131b2e;
        border: 1px solid rgba(245, 158, 11, 0.4);
        border-radius: 14px;
        padding: 12px 14px;
        width: 330px;
        box-shadow: 0 14px 35px rgba(0, 0, 0, 0.6), 0 0 25px rgba(245, 158, 11, 0.2);
        color: #f8fafc;
        font-size: 12px;
        display: flex;
        flex-direction: column;
        gap: 8px;
        animation: ffSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        pointer-events: auto;
      }
      .ff-toast.hidden {
        display: none;
      }
      .ff-toast-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-weight: 700;
        color: #fbbf24;
        font-size: 12px;
      }
      .ff-toast-body {
        font-size: 11.5px;
        color: #cbd5e1;
        line-height: 1.4;
      }
      .ff-toast-actions {
        display: flex;
        gap: 8px;
        margin-top: 2px;
      }
      .ff-toast-btn {
        flex: 1;
        padding: 7px 10px;
        border-radius: 8px;
        font-size: 11px;
        font-weight: 700;
        cursor: pointer;
        border: none;
        transition: all 0.2s;
        text-align: center;
      }
      .ff-toast-btn-primary {
        background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
        color: #0f172a;
      }
      .ff-toast-btn-primary:hover {
        background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
        box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
      }
      .ff-toast-btn-secondary {
        background: rgba(255, 255, 255, 0.08);
        color: #cbd5e1;
        border: 1px solid rgba(255, 255, 255, 0.1);
      }
      .ff-toast-btn-secondary:hover {
        background: rgba(255, 255, 255, 0.15);
        color: #ffffff;
      }
      @keyframes ffSlideUp {
        from { opacity: 0; transform: translateY(12px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .ff-chat-drawer {
        width: 390px;
        max-width: calc(100vw - 32px);
        height: 580px;
        max-height: calc(100vh - 80px);
        background: #0b0f19;
        border: 1px solid rgba(59, 130, 246, 0.3);
        border-radius: 20px;
        box-shadow: 0 25px 60px rgba(0, 0, 0, 0.7), 0 0 40px rgba(37, 99, 235, 0.15);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        backdrop-filter: blur(16px);
      }
      .ff-chat-drawer.hidden {
        display: none;
      }
      .ff-header {
        background: linear-gradient(180deg, #131c31 0%, #0f172a 100%);
        padding: 14px 18px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .ff-header-info {
        display: flex;
        align-items: center;
        gap: 10px;
      }
      .ff-avatar {
        width: 32px;
        height: 32px;
        background: linear-gradient(135deg, #2563eb, #7c3aed);
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
      }
      .ff-header-title {
        font-size: 14px;
        font-weight: 700;
        color: #f8fafc;
        line-height: 1.2;
      }
      .ff-header-sub {
        font-size: 11px;
        color: #94a3b8;
        max-width: 220px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .ff-header-actions {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .ff-icon-btn {
        background: transparent;
        border: none;
        color: #94a3b8;
        width: 28px;
        height: 28px;
        border-radius: 8px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        transition: all 0.2s;
      }
      .ff-icon-btn:hover {
        background: rgba(255, 255, 255, 0.1);
        color: #f8fafc;
      }
      .ff-hint-toolbar {
        padding: 10px 14px;
        background: rgba(15, 23, 42, 0.6);
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        display: flex;
        gap: 6px;
        overflow-x: auto;
        scrollbar-width: none;
      }
      .ff-hint-toolbar::-webkit-scrollbar {
        display: none;
      }
      .ff-hint-chip {
        background: rgba(30, 41, 59, 0.8);
        border: 1px solid rgba(255, 255, 255, 0.1);
        color: #cbd5e1;
        padding: 5px 10px;
        border-radius: 999px;
        font-size: 11px;
        font-weight: 600;
        cursor: pointer;
        white-space: nowrap;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        gap: 4px;
      }
      .ff-hint-chip:hover {
        background: rgba(37, 99, 235, 0.25);
        border-color: rgba(59, 130, 246, 0.5);
        color: #60a5fa;
      }
      .ff-messages {
        flex: 1;
        padding: 14px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .ff-message {
        max-width: 88%;
        display: flex;
        flex-direction: column;
        gap: 4px;
        font-size: 12.5px;
        line-height: 1.5;
        animation: ffFadeIn 0.2s ease-out;
      }
      @keyframes ffFadeIn {
        from { opacity: 0; transform: translateY(6px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .ff-message.assistant {
        align-self: flex-start;
      }
      .ff-message.user {
        align-self: flex-end;
      }
      .ff-bubble {
        padding: 10px 14px;
        border-radius: 14px;
        word-break: break-word;
      }
      .ff-message.assistant .ff-bubble {
        background: #1e293b;
        color: #e2e8f0;
        border: 1px solid rgba(255, 255, 255, 0.06);
        border-bottom-left-radius: 4px;
      }
      .ff-message.user .ff-bubble {
        background: #2563eb;
        color: #ffffff;
        border-bottom-right-radius: 4px;
      }
      .ff-bubble pre {
        background: #090d16;
        padding: 8px 12px;
        border-radius: 8px;
        overflow-x: auto;
        font-family: monospace;
        font-size: 11.5px;
        margin: 6px 0;
        border: 1px solid rgba(255,255,255,0.08);
      }
      .ff-bubble code {
        font-family: monospace;
        background: rgba(0,0,0,0.3);
        padding: 2px 4px;
        border-radius: 4px;
        font-size: 11.5px;
      }
      .ff-suggested {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        margin-top: 6px;
      }
      .ff-suggested-chip {
        background: rgba(37, 99, 235, 0.15);
        border: 1px solid rgba(59, 130, 246, 0.3);
        color: #93c5fd;
        font-size: 11px;
        padding: 4px 9px;
        border-radius: 99px;
        cursor: pointer;
        transition: all 0.2s;
      }
      .ff-suggested-chip:hover {
        background: rgba(37, 99, 235, 0.35);
        color: #ffffff;
      }
      .ff-input-area {
        padding: 12px 14px;
        background: #0f172a;
        border-top: 1px solid rgba(255, 255, 255, 0.08);
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .ff-input {
        flex: 1;
        background: #1e293b;
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        color: #f8fafc;
        padding: 10px 14px;
        font-size: 12.5px;
        outline: none;
        transition: border 0.2s;
      }
      .ff-input:focus {
        border-color: #3b82f6;
      }
      .ff-send-btn {
        background: #2563eb;
        border: none;
        color: white;
        width: 36px;
        height: 36px;
        border-radius: 10px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        transition: background 0.2s;
        flex-shrink: 0;
      }
      .ff-send-btn:hover {
        background: #1d4ed8;
      }
      .ff-typing {
        display: flex;
        gap: 4px;
        padding: 8px 12px;
        align-items: center;
      }
      .ff-dot {
        width: 6px;
        height: 6px;
        background: #60a5fa;
        border-radius: 50%;
        animation: ffBlink 1.4s infinite ease-in-out both;
      }
      .ff-dot:nth-child(1) { animation-delay: -0.32s; }
      .ff-dot:nth-child(2) { animation-delay: -0.16s; }
      @keyframes ffBlink {
        0%, 80%, 100% { transform: scale(0); }
        40% { transform: scale(1); }
      }
    `;
    shadowRoot.appendChild(style);

    // Root UI container
    const container = document.createElement('div');
    container.className = 'ff-widget-container';

    // Collapsed Pill Button
    pillWidgetEl = document.createElement('button');
    pillWidgetEl.className = 'ff-pill-btn';
    pillWidgetEl.innerHTML = `
      <span class="ff-status-dot"></span>
      <span>FrictionFlow AI Assistant</span>
    `;
    pillWidgetEl.addEventListener('click', () => toggleChatDrawer());

    // Expanded Chat Drawer
    chatDrawerEl = document.createElement('div');
    chatDrawerEl.className = 'ff-chat-drawer hidden';

    chatDrawerEl.innerHTML = `
      <div class="ff-header">
        <div class="ff-header-info">
          <div class="ff-avatar">🧠</div>
          <div>
            <div class="ff-header-title">FrictionFlow Assistant</div>
            <div class="ff-header-sub">${platform}: ${problemTitle}</div>
          </div>
        </div>
        <div class="ff-header-actions">
          <button class="ff-icon-btn" id="ff-close-btn" title="Close">✕</button>
        </div>
      </div>

      <div class="ff-hint-toolbar">
        <button class="ff-hint-chip" data-level="1">💡 Level 1: Concept</button>
        <button class="ff-hint-chip" data-level="2">🔍 Level 2: Approach</button>
        <button class="ff-hint-chip" data-level="3">💻 Level 3: Logic</button>
        <button class="ff-hint-chip" data-level="error">⚠️ Explain Error</button>
      </div>

      <div class="ff-messages" id="ff-messages-box">
      </div>

      <div class="ff-input-area">
        <input type="text" class="ff-input" id="ff-input-field" placeholder="Ask a question or request a hint..." />
        <button class="ff-send-btn" id="ff-send-btn">➤</button>
      </div>
    `;

    // Toast Notification Card (for struggle detection alerts)
    const toastEl = document.createElement('div');
    toastEl.className = 'ff-toast hidden';
    toastEl.id = 'ff-intervention-toast';
    toastEl.innerHTML = `
      <div class="ff-toast-header">
        <span>⚡ Friction Detection Alert</span>
        <button class="ff-icon-btn" id="ff-toast-close" style="width:20px;height:20px;font-size:12px;">✕</button>
      </div>
      <div class="ff-toast-body" id="ff-toast-body-text">
        You've spent significant time on <strong>${problemTitle}</strong>. Would you like a progressive hint to unblock your logic?
      </div>
      <div class="ff-toast-actions">
        <button class="ff-toast-btn ff-toast-btn-primary" id="ff-toast-accept">💡 Get Level 1 Hint</button>
        <button class="ff-toast-btn ff-toast-btn-secondary" id="ff-toast-dismiss">Keep Trying</button>
      </div>
    `;

    container.appendChild(chatDrawerEl);
    container.appendChild(toastEl);
    container.appendChild(pillWidgetEl);
    shadowRoot.appendChild(container);

    const toastClose = shadowRoot.getElementById('ff-toast-close');
    const toastDismiss = shadowRoot.getElementById('ff-toast-dismiss');
    const toastAccept = shadowRoot.getElementById('ff-toast-accept');

    const hideToast = () => toastEl.classList.add('hidden');
    if (toastClose) toastClose.addEventListener('click', hideToast);
    if (toastDismiss) toastDismiss.addEventListener('click', hideToast);
    if (toastAccept) {
      toastAccept.addEventListener('click', () => {
        hideToast();
        fetchProgressiveHint(1);
      });
    }

    // Setup event listeners inside Shadow Root
    const closeBtn = shadowRoot.getElementById('ff-close-btn');
    closeBtn.addEventListener('click', () => toggleChatDrawer(false));

    messagesContainerEl = shadowRoot.getElementById('ff-messages-box');

    const hintChips = shadowRoot.querySelectorAll('.ff-hint-chip');
    hintChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const lvl = chip.getAttribute('data-level');
        if (lvl === 'error') {
          handleUserMessage('Can you explain common errors or edge cases for this problem?');
        } else {
          fetchProgressiveHint(parseInt(lvl, 10));
        }
      });
    });

    const sendBtn = shadowRoot.getElementById('ff-send-btn');
    const inputField = shadowRoot.getElementById('ff-input-field');

    sendBtn.addEventListener('click', () => {
      const txt = inputField.value.trim();
      if (txt) {
        inputField.value = '';
        handleUserMessage(txt);
      }
    });

    inputField.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        const txt = inputField.value.trim();
        if (txt) {
          inputField.value = '';
          handleUserMessage(txt);
        }
      }
    });

    // Add welcome initial message
    appendAssistantMessage(
      `👋 Hi! I'm your **FrictionFlow AI Tutor**. I'm actively observing your progress on **${problemTitle}** on **${platform}**.\n\n` +
      `Instead of giving away full solutions, I provide progressive guidance to build your intuition. Select a hint level above or ask any question!`
    );

    return shadowRoot;
  }

  let hasShownHighFrictionToast = false;

  function updateWidgetFrictionBadge(friction) {
    if (!shadowRoot) return;
    const dot = shadowRoot.querySelector('.ff-status-dot');
    const toast = shadowRoot.getElementById('ff-intervention-toast');

    if (dot) {
      if (friction === 'High') {
        dot.className = 'ff-status-dot high';
        if (toast && !hasShownHighFrictionToast && !isChatOpen) {
          toast.classList.remove('hidden');
          hasShownHighFrictionToast = true;
        }
      } else {
        dot.className = 'ff-status-dot';
      }
    }
  }

  function toggleChatDrawer(forceState) {
    createShadowHost();
    isChatOpen = forceState !== undefined ? forceState : !isChatOpen;
    if (isChatOpen) {
      chatDrawerEl.classList.remove('hidden');
      pillWidgetEl.style.display = 'none';
      const input = shadowRoot.getElementById('ff-input-field');
      if (input) input.focus();
    } else {
      chatDrawerEl.classList.add('hidden');
      pillWidgetEl.style.display = 'flex';
    }
  }

  function appendUserMessage(text) {
    if (!messagesContainerEl) return;
    const msgDiv = document.createElement('div');
    msgDiv.className = 'ff-message user';
    msgDiv.innerHTML = `<div class="ff-bubble">${escapeHtml(text)}</div>`;
    messagesContainerEl.appendChild(msgDiv);
    messagesContainerEl.scrollTop = messagesContainerEl.scrollHeight;
  }

  function appendAssistantMessage(markdownText, suggested = []) {
    if (!messagesContainerEl) return;
    const msgDiv = document.createElement('div');
    msgDiv.className = 'ff-message assistant';

    const formattedContent = formatSimpleMarkdown(markdownText);
    let html = `<div class="ff-bubble">${formattedContent}</div>`;

    if (suggested && suggested.length > 0) {
      html += `<div class="ff-suggested">`;
      suggested.forEach(sug => {
        html += `<span class="ff-suggested-chip">${escapeHtml(sug)}</span>`;
      });
      html += `</div>`;
    }

    msgDiv.innerHTML = html;
    messagesContainerEl.appendChild(msgDiv);

    // Event listener for suggested chips
    const chips = msgDiv.querySelectorAll('.ff-suggested-chip');
    chips.forEach(c => {
      c.addEventListener('click', () => {
        handleUserMessage(c.textContent);
      });
    });

    messagesContainerEl.scrollTop = messagesContainerEl.scrollHeight;
  }

  function showTypingIndicator() {
    if (!messagesContainerEl) return null;
    const typingDiv = document.createElement('div');
    typingDiv.className = 'ff-message assistant';
    typingDiv.id = 'ff-typing-indicator';
    typingDiv.innerHTML = `
      <div class="ff-bubble">
        <div class="ff-typing">
          <div class="ff-dot"></div>
          <div class="ff-dot"></div>
          <div class="ff-dot"></div>
        </div>
      </div>
    `;
    messagesContainerEl.appendChild(typingDiv);
    messagesContainerEl.scrollTop = messagesContainerEl.scrollHeight;
    return typingDiv;
  }

  function removeTypingIndicator() {
    if (!shadowRoot) return;
    const typing = shadowRoot.getElementById('ff-typing-indicator');
    if (typing) typing.remove();
  }

  async function handleUserMessage(userMsg) {
    appendUserMessage(userMsg);
    showTypingIndicator();

    try {
      const response = await fetch('http://localhost:8000/api/v1/mentor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: activeSessionId,
          user_message: userMsg,
          problem_title: problemTitle,
          topic: topic,
          difficulty: difficulty,
          current_hint_level: currentHintLevel
        })
      });

      removeTypingIndicator();

      if (!response.ok) {
        throw new Error('API server returned error');
      }

      const data = await response.json();
      appendAssistantMessage(data.reply, data.suggested_followups || []);
    } catch (err) {
      removeTypingIndicator();
      console.warn('[FrictionFlow] Backend chat call failed:', err);
      appendAssistantMessage(
        `💡 **Guidance for ${problemTitle}** (${topic}):\n\n` +
        `Break the problem down step by step:\n` +
        `1. Identify your input constraints.\n` +
        `2. Choose an appropriate data structure (e.g. Hash Map or Two Pointers).\n` +
        `3. Trace edge cases such as empty input, duplicate elements, or negative bounds.`,
        ['Can you explain the time complexity?', 'What edge cases should I consider?']
      );
    }
  }

  async function fetchProgressiveHint(level) {
    currentHintLevel = level;
    toggleChatDrawer(true);
    appendUserMessage(`Requesting Level ${level} Hint...`);
    showTypingIndicator();

    try {
      const response = await fetch('http://localhost:8000/api/v1/mentor/hint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: activeSessionId,
          problem_title: problemTitle,
          topic: topic,
          difficulty: difficulty,
          hint_level: level
        })
      });

      removeTypingIndicator();

      if (!response.ok) {
        throw new Error('Hint API failed');
      }

      const data = await response.json();
      const title = data.hint_title || `Level ${level} Hint`;
      const content = data.content || '';
      appendAssistantMessage(`### ${title}\n\n${content}`, [
        `Can you elaborate on Level ${level}?`,
        level < 3 ? `Request Level ${level + 1} Hint` : 'Explain edge cases'
      ]);
    } catch (err) {
      removeTypingIndicator();
      let defaultHint = '';
      if (level === 1) {
        defaultHint = `**Level 1 (Concept Hint)**:\nConsider using a Hash Table (Map) to store values you have seen so far as you iterate through the elements. This allows O(1) average lookup time!`;
      } else if (level === 2) {
        defaultHint = `**Level 2 (Approach Strategy)**:\nFor each element \`x\`, calculate the required complement \`target - x\`. Check if that complement already exists in your map.`;
      } else {
        defaultHint = `**Level 3 (Logic Guidance)**:\nIf the complement is present in your map, return \`[map.get(complement), currentIndex]\`. Otherwise, insert \`map.set(x, currentIndex)\`.`;
      }
      appendAssistantMessage(defaultHint, [
        level < 3 ? `Request Level ${level + 1} Hint` : 'Explain time complexity'
      ]);
    }
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/\$/g, '&#36;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function formatSimpleMarkdown(text) {
    if (!text) return '';
    let formatted = escapeHtml(text);

    // Code blocks
    formatted = formatted.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
    // Inline code
    formatted = formatted.replace(/`([^`]+)`/g, '<code>$1</code>');
    // Bold
    formatted = formatted.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    // Headers
    formatted = formatted.replace(/^### (.*$)/gim, '<strong>$1</strong>');
    // Newlines
    formatted = formatted.replace(/\n/g, '<br/>');

    return formatted;
  }

  // Listen for messages from extension popup
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'toggle_chat_bar') {
      toggleChatDrawer(true);
      sendResponse({ status: 'ok' });
    } else if (request.action === 'request_hint') {
      const lvl = request.hintLevel || 1;
      fetchProgressiveHint(lvl);
      sendResponse({ status: 'ok' });
    } else {
      sendResponse({ status: 'ignored' });
    }
    return false;
  });

  setInterval(updateSessionState, 1500);
  setTimeout(() => {
    createShadowHost();
    updateSessionState();
  }, 500);
})();
