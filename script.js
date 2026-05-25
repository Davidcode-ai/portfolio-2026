/**
 * @file script.js
 * @description Main JavaScript module for the portfolio SPA.
 *
 * Architecture overview:
 *  - Data layer     : ENDPOINTS + PROFILE_DATA (plain objects, no fetch calls)
 *  - Utility layer  : syntaxHighlight() — pure function, no side effects
 *  - UI layer       : loadEndpointResponse(), activateEndpoint(), terminal fns
 *  - Init layer     : init* functions bootstrapped on DOMContentLoaded
 *
 * Design decision: zero external dependencies. Everything is Vanilla ES2022
 * so the portfolio loads instantly with no build step required.
 *
 * @author David Muñoz Valdés <davidmv030306@gmail.com>
 * @version 1.0.0
 */

'use strict';

/* ================================================================
   DATA LAYER
   Simulated API responses. Each entry mirrors what a real FastAPI
   endpoint would return: HTTP method, path, status code and body.
   ================================================================ */

/**
 * @typedef {Object} Endpoint
 * @property {'GET'|'POST'|'PUT'|'DELETE'} method  - HTTP verb
 * @property {string}  path        - Route path (e.g. "/api/projects/solbabackups")
 * @property {number}  status      - HTTP status code (200, 201, 4xx…)
 * @property {string}  statusText  - HTTP status text ("OK", "Created"…)
 * @property {number}  latency     - Simulated response time in ms
 * @property {Object}  data        - JSON body returned to the client
 */

/** @type {Object.<string, Endpoint>} */
const ENDPOINTS = {

  /**
   * GET /api/projects/solbabackups
   * Returns metadata for SolbaBackups, an automated backup system
   * built with FastAPI + PostgreSQL + Google Drive API, deployed
   * as a Windows Service via NSSM. In production since May 2026.
   */
  solbabackups: {
    method: 'GET',
    path: '/api/projects/solbabackups',
    status: 200,
    statusText: 'OK',
    latency: 42,
    data: {
      id: 'solbabackups',
      name: 'SolbaBackups',
      status: 'In Production',
      stack: ['FastAPI', 'PostgreSQL', 'Google Drive API', 'NSSM', 'Python 3.11', 'SQLAlchemy'],
      description: 'Automated backup system that snapshots client databases and uploads encrypted archives to Google Drive on a configurable schedule.',
      features: [
        'Scheduled jobs via NSSM Windows Service',
        'Incremental backup support',
        'Email alerts on failure',
        'REST API for manual triggers',
      ],
      uptime: '99.8%',
      repo: 'github.com/Davidcode-ai/solbabackups',
      deployed_at: '2026-05-01T09:00:00Z',
    },
  },

  /**
   * GET /api/skills
   * Returns the full technical skill set, categorised by domain.
   * Levels are self-assessed based on production usage.
   */
  skills: {
    method: 'GET',
    path: '/api/skills',
    status: 200,
    statusText: 'OK',
    latency: 15,
    data: {
      languages:        { Python: 'Advanced', JavaScript: 'Intermediate', SQL: 'Advanced', Bash: 'Intermediate' },
      frameworks:       { FastAPI: 'Advanced', SQLAlchemy: 'Intermediate', Pydantic: 'Advanced' },
      databases:        ['PostgreSQL', 'SQLite'],
      tools:            ['Git', 'Make.com', 'NSSM', 'Postman', 'Linux'],
      ai_integration:   ['OpenAI API', 'Prompt Engineering', 'LangChain (learning)', 'RAG Pipelines'],
      currently_learning: ['Docker & containers', 'TypeScript basics', 'CI/CD with GitHub Actions'],
      soft_skills:      ['Problem decomposition', 'Documentation', 'Async communication'],
    },
  },

  /**
   * POST /api/contact
   * Simulates a contact form submission returning 201 Created.
   * `created_at` is computed at runtime so it always reflects the
   * current timestamp when the user clicks the endpoint.
   */
  contact: {
    method: 'POST',
    path: '/api/contact',
    status: 201,
    statusText: 'Created',
    latency: 63,
    data: {
      message: 'Message received — I will reply within 24h.',
      channels: {
        email:    'davidmv030306@gmail.com',
        github:   'github.com/Davidcode-ai',
        linkedin: 'linkedin.com/in/david-muñoz-valdés-8b26932b8/',
      },
      availability:  'Open to junior backend / internship roles',
      response_time: '< 24 hours',
      created_at:    new Date().toISOString(),
    },
  },
};

/**
 * Profile data object displayed in the hero terminal as a JSON response.
 * Mirrors a real /api/profile endpoint payload.
 * @type {Object}
 */
const PROFILE_DATA = {
  name:      'David Muñoz Valdés',
  role:      'Backend & Automation Developer',
  stack:     ['Python', 'FastAPI', 'Make.com', 'PostgreSQL'],
  education: 'GM SMR (completado) · GS DAW (2º año pendiente)',
  location:  'Spain',
  open_to_work: true,
  contact:   'davidmv030306@gmail.com',
  github:    'github.com/Davidcode-ai',
};

/**
 * The curl command typed character-by-character in the hero terminal.
 * Chosen over a plain URL to reinforce the backend/API developer identity.
 * @type {string}
 */
const CMD_TEXT = 'curl -X GET https://davidcode-ai.github.io/portfolio-2026/api/profile';

/* ================================================================
   UTILITY LAYER
   ================================================================ */

/**
 * Converts a JavaScript object to a syntax-highlighted HTML string.
 *
 * Uses a single-pass regex that matches all JSON token types in order
 * of specificity. No external libraries — the entire highlighter is
 * ~20 lines, making it easy to audit and extend.
 *
 * Token → CSS class mapping:
 *   "key":   → j-key    (blue)
 *   "value"  → j-str    (light blue)
 *   number   → j-num    (red/orange)
 *   true/false → j-bool (orange)
 *   null     → j-null   (grey)
 *   {}[]     → j-bracket (muted)
 *
 * For the hero terminal the caller replaces `j-` with `json-` so the
 * terminal-scoped CSS classes apply instead of the API console ones.
 *
 * @param {Object} obj - Any JSON-serialisable JavaScript object
 * @returns {string} HTML string with <span> elements for each token
 */
function syntaxHighlight(obj) {
  const json = JSON.stringify(obj, null, 2);
  return json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?|[{}\[\],])/g,
    (match) => {
      let cls = 'j-num';
      if      (/^"/.test(match))        cls = /:$/.test(match) ? 'j-key' : 'j-str';
      else if (/true|false/.test(match)) cls = 'j-bool';
      else if (/null/.test(match))       cls = 'j-null';
      else if (/[{}\[\],]/.test(match))  cls = 'j-bracket';
      return `<span class="${cls}">${match}</span>`;
    }
  );
}

/* ================================================================
   UI LAYER — API Console
   ================================================================ */

// DOM references cached once at module load — avoids repeated querySelector calls.
const apiResponseEl  = document.getElementById('api-response');
const apiLoadingEl   = document.getElementById('api-loading');
const statusBadgeEl  = document.getElementById('status-badge');
const statusTextEl   = document.getElementById('status-text');
const latencyDisplay = document.getElementById('latency-display');
const latencyBar     = document.getElementById('latency-bar');

/** Tracks which endpoint key is currently selected in the sidebar. */
let currentEndpoint = 'solbabackups';

/**
 * Marks a sidebar button as active and triggers a response load.
 * Separated from loadEndpointResponse() so the two concerns
 * (visual state vs. data fetching) remain independently testable.
 *
 * @param {string} key - Key from the ENDPOINTS object (e.g. "solbabackups")
 */
function activateEndpoint(key) {
  currentEndpoint = key;
  document.querySelectorAll('.endpoint-btn').forEach((btn) => {
    btn.classList.toggle('active-endpoint', btn.dataset.endpoint === key);
  });
  loadEndpointResponse(key);
}

/**
 * Simulates an HTTP request lifecycle for the given endpoint:
 *  1. Show loading spinner + clear previous response
 *  2. Wait for simulated network latency (320–400 ms jitter)
 *  3. Render: status badge, latency meter, syntax-highlighted JSON
 *  4. Trigger fade-in animation via requestAnimationFrame
 *
 * The latency jitter (Math.random() * 80) makes the simulation feel
 * more realistic — real network responses are never perfectly constant.
 *
 * Latency bar colour coding follows standard UX conventions:
 *  green  < 80 ms  → fast (acceptable for an API)
 *  yellow < 150 ms → moderate
 *  red    > 150 ms → slow
 *
 * @param {string} key - Key from the ENDPOINTS object
 */
function loadEndpointResponse(key) {
  const ep = ENDPOINTS[key];
  if (!ep) return;

  // Loading state
  apiLoadingEl.classList.remove('hidden');
  apiLoadingEl.classList.add('flex');
  apiResponseEl.innerHTML = '';
  statusBadgeEl.classList.remove('flex');
  statusBadgeEl.classList.add('hidden');

  setTimeout(() => {
    // Hide spinner
    apiLoadingEl.classList.add('hidden');
    apiLoadingEl.classList.remove('flex');

    // Status badge
    const isSuccess = ep.status < 400;
    statusTextEl.textContent = `${ep.status} ${ep.statusText}`;
    statusBadgeEl.className  = `badge-base ${isSuccess ? 'badge-success' : 'badge-error'}`;

    // Latency meter
    latencyDisplay.textContent    = `${ep.latency} ms`;
    latencyBar.style.width        = `${Math.min((ep.latency / 200) * 100, 100)}%`;
    latencyBar.style.backgroundColor =
      ep.latency < 80  ? '#00ff88' :
      ep.latency < 150 ? '#febc2e' : '#ff5f57';

    // JSON render — reset animation so it re-triggers on every click
    apiResponseEl.innerHTML      = syntaxHighlight(ep.data);
    apiResponseEl.style.animation = 'none';
    requestAnimationFrame(() => {
      apiResponseEl.style.animation = 'jsonReveal 0.35s ease forwards';
    });

  }, 320 + Math.random() * 80);
}

// Attach click handlers to all endpoint buttons declared in HTML.
document.querySelectorAll('.endpoint-btn').forEach((btn) => {
  btn.addEventListener('click', () => activateEndpoint(btn.dataset.endpoint));
});

/* ================================================================
   UI LAYER — Hero Terminal
   ================================================================ */

/**
 * Types text into a DOM element one character at a time.
 *
 * Uses setInterval rather than recursive setTimeout to keep the
 * call stack flat. The interval is cleared before the callback
 * fires to prevent any potential double-invocation edge case.
 *
 * @param {HTMLElement} element  - Target element (textContent is mutated)
 * @param {string}      text     - Full string to type out
 * @param {number}      speed    - Milliseconds between each character
 * @param {Function}    [callback] - Optional callback fired after typing completes
 */
function typeText(element, text, speed, callback) {
  let i = 0;
  element.textContent = '';
  const interval = setInterval(() => {
    element.textContent += text[i];
    i++;
    if (i >= text.length) {
      clearInterval(interval);
      if (callback) setTimeout(callback, 300);
    }
  }, speed);
}

/**
 * Orchestrates the three-step terminal response animation:
 *  1. Hide the blinking cursor next to the typed command
 *  2. Reveal the JSON response block with a fadeInUp animation
 *  3. Show a new idle prompt after 600 ms
 *
 * The `json-` prefix is used instead of `j-` so the terminal
 * CSS scope (`.json-key`, `.json-str`…) applies independently
 * from the API console scope (`#api-response .j-key`…).
 */
function revealTerminalResponse() {
  const responseEl   = document.getElementById('terminal-response');
  const jsonOutputEl = document.getElementById('json-output');
  const cursorCmd    = document.getElementById('cursor-cmd');
  const secondPrompt = document.getElementById('second-prompt');

  cursorCmd.style.display = 'none';

  responseEl.classList.remove('hidden');
  jsonOutputEl.innerHTML = syntaxHighlight(PROFILE_DATA)
    .replace(/class="j-/g, 'class="json-');

  responseEl.style.animation = 'none';
  requestAnimationFrame(() => {
    responseEl.style.animation = 'fadeInUp 0.5s ease forwards';
  });

  setTimeout(() => {
    secondPrompt.classList.remove('hidden');
    secondPrompt.style.animation = 'fadeIn 0.4s ease forwards';
  }, 600);
}

/**
 * Starts the hero terminal sequence.
 * The 800 ms initial delay gives the page time to fully paint before
 * the typing animation begins, avoiding a jarring visual on fast connections.
 */
function initTerminal() {
  const cmdEl = document.getElementById('typing-command');
  setTimeout(() => {
    typeText(cmdEl, CMD_TEXT, 45, () => {
      setTimeout(revealTerminalResponse, 400);
    });
  }, 800);
}

/* ================================================================
   INIT LAYER — Observers & global interactions
   ================================================================ */

/**
 * Sets up scroll-triggered fade-in for all `.reveal` elements.
 *
 * Uses IntersectionObserver (no scroll event listener) for better
 * performance. Each element is unobserved once visible to free
 * memory — animations are one-shot, not repeating.
 *
 * rootMargin: '0px 0px -50px 0px' means the element must be at
 * least 50px above the bottom edge before triggering.
 */
function initScrollReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );
  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
}

/**
 * Adds a frosted-glass backdrop to the navbar once the user scrolls
 * past 20 px. The `.scrolled` class is defined in style.css and applies
 * `backdrop-filter: blur(12px)` plus a subtle border.
 *
 * The event listener is passive to avoid blocking the main thread
 * during scroll — this is critical for 60 fps on mobile.
 */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  window.addEventListener(
    'scroll',
    () => navbar.classList.toggle('scrolled', window.scrollY > 20),
    { passive: true }
  );
}

/**
 * Wires up the mobile hamburger menu toggle.
 * Also closes the menu automatically when any nav link is tapped,
 * which is essential UX for single-page anchored navigation.
 */
function initMobileMenu() {
  const btn  = document.getElementById('menu-btn');
  const menu = document.getElementById('mobile-menu');
  btn.addEventListener('click', () => menu.classList.toggle('hidden'));
  menu.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => menu.classList.add('hidden'));
  });
}

/**
 * Highlights the correct nav link as the user scrolls through sections.
 * Uses a second IntersectionObserver at 40% threshold — lower values
 * would cause flickering between adjacent sections.
 *
 * The `href.slice(1)` strips the leading `#` to compare against
 * the section's `id` attribute directly.
 */
function initActiveNav() {
  const sections = document.querySelectorAll('section[id], footer[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((link) => {
            const id = link.getAttribute('href').slice(1);
            link.classList.toggle('text-accent', id === entry.target.id);
          });
        }
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach((s) => observer.observe(s));
}

/* ================================================================
   BOOTSTRAP
   All init functions are called after the DOM is fully parsed.
   The default endpoint response is loaded with a 100 ms offset
   so it doesn't compete with the terminal animation for repaints.
   ================================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initTerminal();
  initScrollReveal();
  initNavbar();
  initMobileMenu();
  initActiveNav();
  setTimeout(() => loadEndpointResponse('solbabackups'), 100);
});
