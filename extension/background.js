// FrictionFlow Background Service Worker (Manifest V3)
const API_URL = 'http://localhost:8000/api/v1/activity/';

chrome.runtime.onInstalled.addListener(() => {
  console.log('[FrictionFlow Service Worker] Installed.');
  chrome.storage.local.set({ offlineQueue: [] });
  chrome.alarms.create('syncOfflineQueue', { periodInMinutes: 1 });
});

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === 'syncOfflineQueue') {
    await syncQueueWithBackend();
  }
});

async function syncQueueWithBackend() {
  chrome.storage.local.get(['offlineQueue'], async (result) => {
    const queue = result.offlineQueue || [];
    if (queue.length === 0) return;

    const remainingQueue = [];
    for (const item of queue) {
      try {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item)
        });
        if (!response.ok) {
          remainingQueue.push(item);
        }
      } catch (err) {
        remainingQueue.push(item);
      }
    }
    chrome.storage.local.set({ offlineQueue: remainingQueue });
  });
}
