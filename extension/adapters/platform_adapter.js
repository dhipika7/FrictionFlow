// FrictionFlow Platform Adapters — Modular DOM Observation Layer

class PlatformAdapter {
  isMatch() { return false; }
  getProblemInfo() {
    return {
      platform: 'CodingPlatform',
      problemTitle: 'Coding Challenge',
      difficulty: 'Medium',
      topic: 'General',
      problemId: 'challenge-1'
    };
  }
  observeEvents(callbacks) {
    // callbacks: { onStart, onSubmit, onError, onComplete }
  }
}

class LeetCodeAdapter extends PlatformAdapter {
  isMatch() {
    return window.location.hostname.includes('leetcode.com');
  }

  getProblemInfo() {
    const pathParts = window.location.pathname.split('/').filter(Boolean);
    const probIndex = pathParts.indexOf('problems');
    let slug = 'coding-challenge';
    if (probIndex !== -1 && pathParts[probIndex + 1]) {
      slug = pathParts[probIndex + 1];
    }

    let problemTitle = slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    let difficulty = 'Medium';
    let topic = 'General';

    // DOM Extraction for Title
    const domTitle = document.querySelector(
      'div[data-cy="question-title"], .text-title-large, [data-track-load="description_content"] h4, .no-select.text-title-large, div[class*="title"]'
    );
    if (domTitle && domTitle.textContent.trim()) {
      const text = domTitle.textContent.trim();
      if (text && !text.includes('Loading')) {
        problemTitle = text.replace(/^\d+\.\s*/, '');
      }
    }

    // DOM Extraction for Difficulty
    const diffEl = document.querySelector(
      '[class*="text-difficulty-"], div[class*="text-sd-easy"], div[class*="text-sd-medium"], div[class*="text-sd-hard"]'
    );
    if (diffEl && diffEl.textContent) {
      const dText = diffEl.textContent.trim();
      if (['Easy', 'Medium', 'Hard'].includes(dText)) {
        difficulty = dText;
      }
    }

    // DOM Extraction for Topic Tags
    const tagEls = document.querySelectorAll('a[href*="/tag/"], .topic-tag, div[class*="topic-tag"]');
    if (tagEls && tagEls.length > 0) {
      const firstTag = tagEls[0].textContent.trim();
      if (firstTag) topic = firstTag;
    } else {
      // Topic heuristic based on title slug
      const s = slug.toLowerCase();
      if (s.includes('dp') || s.includes('robber') || s.includes('knapsack') || s.includes('stair')) topic = 'Dynamic Programming';
      else if (s.includes('sum') || s.includes('array') || s.includes('matrix')) topic = 'Arrays & Hashing';
      else if (s.includes('tree') || s.includes('binary') || s.includes('graph')) topic = 'Trees & Graphs';
      else if (s.includes('pointer') || s.includes('container') || s.includes('water')) topic = 'Two Pointers';
      else if (s.includes('window') || s.includes('substring')) topic = 'Sliding Window';
    }

    return {
      platform: 'LeetCode',
      problemTitle,
      difficulty,
      topic,
      problemId: slug
    };
  }

  observeEvents({ onSubmit, onError, onComplete }) {
    console.log('[FrictionFlow LeetCodeAdapter] Setting up DOM event observers...');

    // Observe submit button click
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;
      const btnText = (btn.textContent || '').trim().toLowerCase();
      const isSubmit = btnText.includes('submit') || btn.getAttribute('data-e2e-locator') === 'console-submit-button' || btn.getAttribute('data-cy') === 'submit-code-btn';

      if (isSubmit) {
        console.log('[FrictionFlow LeetCodeAdapter] Submit button click captured!');
        this._monitorResultPanel({ onSubmit, onError, onComplete });
      }
    }, true);
  }

  _monitorResultPanel({ onSubmit, onError, onComplete }) {
    let checkCount = 0;
    const maxChecks = 30; // check for up to 30s
    const interval = setInterval(() => {
      checkCount++;
      const resultEl = document.querySelector(
        '[data-e2e-locator="submission-result"], div[class*="result-state"], .text-lg.font-medium, div[class*="status"]'
      );

      if (resultEl && resultEl.textContent) {
        const text = resultEl.textContent.trim();
        if (text.includes('Accepted')) {
          clearInterval(interval);
          console.log('[FrictionFlow LeetCodeAdapter] Captured result: Accepted');
          onComplete({ successful: true });
          return;
        } else if (text.includes('Wrong Answer') || text.includes('Time Limit Exceeded') || text.includes('Runtime Error') || text.includes('Compile Error')) {
          clearInterval(interval);
          console.log(`[FrictionFlow LeetCodeAdapter] Captured result failure: ${text}`);
          
          let errorMsg = text;
          const detailEl = document.querySelector('pre, div[class*="error"], div[class*="explanation"]');
          if (detailEl && detailEl.textContent) {
            errorMsg = `${text}: ${detailEl.textContent.trim().slice(0, 150)}`;
          }

          onSubmit({
            status: 'SUBMISSION_FAILED',
            error_message: errorMsg
          });
          return;
        }
      }

      if (checkCount >= maxChecks) {
        clearInterval(interval);
      }
    }, 1000);
  }
}

class CodeforcesAdapter extends PlatformAdapter {
  isMatch() {
    return window.location.hostname.includes('codeforces.com');
  }

  getProblemInfo() {
    const pathParts = window.location.pathname.split('/').filter(Boolean);
    let title = 'Codeforces Problem';
    let topic = 'General';
    let probId = 'cf-prob';

    if (pathParts.includes('problem')) {
      const idx = pathParts.indexOf('problem');
      probId = pathParts.slice(idx + 1).join('');
      title = `Codeforces ${probId.toUpperCase()}`;
    }

    const domTitle = document.querySelector('.title, .problem-statement .title');
    if (domTitle) {
      title = domTitle.textContent.trim();
    }

    return {
      platform: 'Codeforces',
      problemTitle: title,
      difficulty: 'Medium',
      topic: topic,
      problemId: probId
    };
  }
}

class FrictionFlowAdapter extends PlatformAdapter {
  isMatch() {
    return window.location.hostname.includes('localhost') || window.location.hostname.includes('frictionflow');
  }

  getProblemInfo() {
    const domTitle = document.querySelector('h1, [data-problem-title]');
    const title = domTitle ? domTitle.textContent.trim() : 'In-App Challenge';
    return {
      platform: 'FrictionFlow',
      problemTitle: title,
      difficulty: 'Easy',
      topic: 'Dynamic Programming',
      problemId: title.toLowerCase().replace(/\s+/g, '-')
    };
  }
}

// Global Export for Content Script
window.FrictionFlowAdapters = {
  getAdapter() {
    if (new LeetCodeAdapter().isMatch()) return new LeetCodeAdapter();
    if (new CodeforcesAdapter().isMatch()) return new CodeforcesAdapter();
    if (new FrictionFlowAdapter().isMatch()) return new FrictionFlowAdapter();
    return new PlatformAdapter();
  }
};
