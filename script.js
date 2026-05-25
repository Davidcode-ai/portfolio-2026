/* ================================================================
   Portfolio — David Muñoz  |  Main Script
   ================================================================ */

'use strict';

/* ── API Console — endpoint data ───────────────────────────────── */
const ENDPOINTS = {
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
      features: ['Scheduled jobs via NSSM Windows Service', 'Incremental backup support', 'Email alerts on failure', 'REST API for manual triggers'],
      uptime: '99.8%',
      repo: 'github.com/Davidcode-ai/solbabackups',
      deployed_at: '2026-05-01T09:00:00Z',
    },
  },

  skills: {
    method: 'GET',
    path: '/api/skills',
    status: 200,
    statusText: 'OK',
    latency: 15,
    data: {
      languages: { Python: 'Advanced', JavaScript: 'Intermediate', SQL: 'Advanced', Bash: 'Intermediate' },
      frameworks: { FastAPI: 'Advanced', SQLAlchemy: 'Intermediate', Pydantic: 'Advanced' },
      databases: ['PostgreSQL', 'SQLite'],
      tools: ['Git', 'Make.com', 'NSSM', 'Postman', 'Linux'],
      ai_integration: ['OpenAI API', 'Prompt Engineering', 'LangChain (learning)', 'RAG Pipelines'],
      currently_learning: ['Docker & containers', 'TypeScript basics', 'CI/CD with GitHub Actions'],
      soft_skills: ['Problem decomposition', 'Documentation', 'Async communication'],
    },
  },

  contact: {
    method: 'POST',
    path: '/api/contact',
    status: 201,
    statusText: 'Created',
    latency: 63,
    data: {
      message: 'Message received — I will reply within 24h.',
      channels: {
        email: 'davidmv030306@gmail.com',
        github: 'github.com/Davidcode-ai',
        linkedin: 'linkedin.com/in/david-muñoz-valdés-8b26932b8/',
      },
      availability: 'Open to junior backend / internship roles',
      response_time: '< 24 hours',
      created_at: new Date().toISOString(),
    },
  },
};

/* ── JSON syntax highlighter ────────────────────────────────────── */
function syntaxHighlight(obj) {
  const json = JSON.stringify(obj, null, 2);
  return json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?|[{}\[\],])/g,
    (match) => {
      let cls = 'j-num';
      if (/^"/.test(match)) {
        cls = /:$/.test(match) ? 'j-key' : 'j-str';
      } else if (/true|false/.test(match)) {
        cls = 'j-bool';
      } else if (/null/.test(match)) {
        cls = 'j-null';
      } else if (/[{}\[\]]/.test(match)) {
        cls = 'j-bracket';
      } else if (/,/.test(match)) {
        cls = 'j-bracket';
      }
      return `<span class="${cls}">${match}</span>`;
    }
  );
}

/* ── API Console logic ──────────────────────────────────────────── */
const apiResponseEl  = document.getElementById('api-response');
const apiLoadingEl   = document.getElementById('api-loading');
const statusBadgeEl  = document.getElementById('status-badge');
const statusTextEl   = document.getElementById('status-text');
const latencyDisplay = document.getElementById('latency-display');
const latencyBar     = document.getElementById('latency-bar');

let currentEndpoint  = 'solbabackups';

function activateEndpoint(key) {
  currentEndpoint = key;

  // Update button states
  document.querySelectorAll('.endpoint-btn').forEach((btn) => {
    btn.classList.toggle('active-endpoint', btn.dataset.endpoint === key);
  });

  loadEndpointResponse(key);
}

function loadEndpointResponse(key) {
  const ep = ENDPOINTS[key];
  if (!ep) return;

  // Show loading state
  apiLoadingEl.classList.remove('hidden');
  apiLoadingEl.classList.add('flex');
  apiResponseEl.innerHTML = '';
  statusBadgeEl.classList.remove('flex');
  statusBadgeEl.classList.add('hidden');

  const startTime = performance.now();

  // Simulate network latency
  setTimeout(() => {
    const elapsed = Math.round(performance.now() - startTime);

    // Hide loader
    apiLoadingEl.classList.add('hidden');
    apiLoadingEl.classList.remove('flex');

    // Update status badge
    const isSuccess = ep.status < 400;
    statusTextEl.textContent = `${ep.status} ${ep.statusText}`;
    statusBadgeEl.className = `badge-base ${isSuccess ? 'badge-success' : 'badge-error'}`;

    // Latency meter
    latencyDisplay.textContent = `${ep.latency} ms`;
    const pct = Math.min((ep.latency / 200) * 100, 100);
    latencyBar.style.width = `${pct}%`;
    latencyBar.style.backgroundColor = ep.latency < 80 ? '#00ff88' : ep.latency < 150 ? '#febc2e' : '#ff5f57';

    // Render highlighted JSON
    const highlighted = syntaxHighlight(ep.data);
    apiResponseEl.innerHTML = highlighted;
    apiResponseEl.style.animation = 'none';
    requestAnimationFrame(() => {
      apiResponseEl.style.animation = 'jsonReveal 0.35s ease forwards';
    });
  }, 320 + Math.random() * 80);
}

/* ── Endpoint button event listeners ────────────────────────────── */
document.querySelectorAll('.endpoint-btn').forEach((btn) => {
  btn.addEventListener('click', () => activateEndpoint(btn.dataset.endpoint));
});

/* ── Terminal typing animation ──────────────────────────────────── */
const PROFILE_DATA = {
  name: 'David Muñoz Valdés',
  role: 'Backend & Automation Developer',
  stack: ['Python', 'FastAPI', 'Make.com', 'PostgreSQL'],
  education: 'GM SMR (completado) · GS DAW (2º año pendiente)',
  location: 'Spain',
  open_to_work: true,
  contact: 'davidmv030306@gmail.com',
  github: 'github.com/Davidcode-ai',
};

const CMD_TEXT = 'curl -X GET https://davidcode-ai.github.io/portfolio-2026/api/profile';

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

function revealTerminalResponse() {
  const responseEl = document.getElementById('terminal-response');
  const jsonOutputEl = document.getElementById('json-output');
  const cursorCmd = document.getElementById('cursor-cmd');
  const secondPrompt = document.getElementById('second-prompt');

  // Hide typing cursor
  cursorCmd.style.display = 'none';

  // Show response block
  responseEl.classList.remove('hidden');
  jsonOutputEl.innerHTML = syntaxHighlight(PROFILE_DATA)
    .replace(/class="j-/g, 'class="json-');

  // Fade in
  responseEl.style.animation = 'none';
  requestAnimationFrame(() => {
    responseEl.style.animation = 'fadeInUp 0.5s ease forwards';
  });

  // Show second prompt after a short delay
  setTimeout(() => {
    secondPrompt.classList.remove('hidden');
    secondPrompt.style.animation = 'fadeIn 0.4s ease forwards';
  }, 600);
}

function initTerminal() {
  const cmdEl = document.getElementById('typing-command');
  // Wait a moment before starting
  setTimeout(() => {
    typeText(cmdEl, CMD_TEXT, 45, () => {
      // Brief pause after command finishes, then reveal JSON
      setTimeout(revealTerminalResponse, 400);
    });
  }, 800);
}

/* ── Scroll-reveal (IntersectionObserver) ───────────────────────── */
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

/* ── Navbar scroll effect ───────────────────────────────────────── */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

/* ── Mobile menu ────────────────────────────────────────────────── */
function initMobileMenu() {
  const btn  = document.getElementById('menu-btn');
  const menu = document.getElementById('mobile-menu');

  btn.addEventListener('click', () => {
    menu.classList.toggle('hidden');
  });

  // Close on link click
  menu.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => menu.classList.add('hidden'));
  });
}

/* ── Active nav link highlight ──────────────────────────────────── */
function initActiveNav() {
  const sections = document.querySelectorAll('section[id], footer[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((link) => {
            const href = link.getAttribute('href').slice(1);
            link.classList.toggle('text-accent', href === entry.target.id);
          });
        }
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach((s) => observer.observe(s));
}

/* ── Boot ────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initTerminal();
  initScrollReveal();
  initNavbar();
  initMobileMenu();
  initActiveNav();

  // Load default endpoint immediately
  setTimeout(() => loadEndpointResponse('solbabackups'), 100);
});
