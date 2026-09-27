document.addEventListener('DOMContentLoaded', () => {
  const probTitle = document.getElementById('prob-title');
  const platformName = document.getElementById('platform-name');
  const sessionTime = document.getElementById('session-time');
  const attemptsCount = document.getElementById('attempts-count');
  const frictionScoreEl = document.getElementById('friction-score');
  const frictionBadge = document.getElementById('friction-badge');

  const btnHint1 = document.getElementById('btn-hint-1');
  const btnHint2 = document.getElementById('btn-hint-2');
  const btnHint3 = document.getElementById('btn-hint-3');
  const btnChat = document.getElementById('btn-chat');

  chrome.storage.local.get(['activeSession'], (result) => {
    if (result.activeSession) {
      const s = result.activeSession;
      probTitle.textContent = s.problemTitle || 'Coding Challenge';
      platformName.textContent = s.platform || 'LeetCode';
      sessionTime.textContent = `${s.timeMinutes || 0}m`;
      attemptsCount.textContent = s.attempts || 1;

      const mins = s.timeMinutes || 0;
      const attempts = s.attempts || 1;
      const calculatedScore = Math.min(100, Math.round((mins * 1.8) + (attempts * 15)));
      if (frictionScoreEl) {
        frictionScoreEl.textContent = calculatedScore;
      }

      const friction = s.friction || 'Low';
      frictionBadge.textContent = `${friction} Friction`;
      if (friction === 'High') {
        frictionBadge.className = 'badge badge-high';
      } else if (friction === 'Moderate') {
        frictionBadge.className = 'badge badge-moderate';
      } else {
        frictionBadge.className = 'badge badge-low';
      }
    }
  });

  async function getActiveTab() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    return tab;
  }

  async function requestHint(level) {
    const tab = await getActiveTab();
    if (tab?.id) {
      try {
        chrome.tabs.sendMessage(tab.id, { action: 'request_hint', hintLevel: level }, () => {
          if (chrome.runtime.lastError) {
            console.log('[FrictionFlow Popup] Active tab does not have content script loaded:', chrome.runtime.lastError.message);
          }
        });
      } catch (e) {
        console.log('[FrictionFlow Popup] Could not send message to active tab', e);
      }
      window.close();
    }
  }

  if (btnHint1) btnHint1.addEventListener('click', () => requestHint(1));
  if (btnHint2) btnHint2.addEventListener('click', () => requestHint(2));
  if (btnHint3) btnHint3.addEventListener('click', () => requestHint(3));

  if (btnChat) {
    btnChat.addEventListener('click', async () => {
      const tab = await getActiveTab();
      if (tab?.id) {
        try {
          chrome.tabs.sendMessage(tab.id, { action: 'toggle_chat_bar' }, () => {
            if (chrome.runtime.lastError) {
              console.log('[FrictionFlow Popup] Active tab does not have content script loaded:', chrome.runtime.lastError.message);
            }
          });
        } catch (e) {
          console.log('[FrictionFlow Popup] Could not send message to active tab', e);
        }
        window.close();
      }
    });
  }
});

