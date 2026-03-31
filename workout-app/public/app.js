/* ── STATE ───────────────────────────────────────────────────── */
let token = localStorage.getItem('token') || null;
let user  = JSON.parse(localStorage.getItem('user') || 'null');
let currentWorkout = null;

// Timer state
let timerInterval = null;
let timerSeconds  = 0;
let timerRunning  = false;

/* ── INIT ────────────────────────────────────────────────────── */
window.addEventListener('DOMContentLoaded', () => {
  if (token && user) {
    showNav();
    showPage('home');
  } else {
    showPage('auth');
  }
});

/* ── AUTH TABS ───────────────────────────────────────────────── */
function switchTab(tab) {
  document.getElementById('login-form').classList.toggle('hidden', tab !== 'login');
  document.getElementById('register-form').classList.toggle('hidden', tab !== 'register');
  document.querySelectorAll('.auth-tab').forEach((btn, i) => {
    btn.classList.toggle('active', (i === 0 && tab === 'login') || (i === 1 && tab === 'register'));
  });
  hideMsg('auth-msg');
}

/* ── REGISTER ────────────────────────────────────────────────── */
async function register() {
  const name        = document.getElementById('reg-name').value.trim();
  const email       = document.getElementById('reg-email').value.trim();
  const password    = document.getElementById('reg-password').value;
  const fitnessGoal = document.getElementById('reg-goal').value;

  if (!name || !email || !password) return showMsg('auth-msg', 'Please fill all fields', 'error');

  try {
    const res  = await api('/api/auth/register', 'POST', { name, email, password, fitnessGoal });
    const data = await res.json();
    if (!res.ok) return showMsg('auth-msg', data.message, 'error');
    saveSession(data);
    showNav();
    showPage('home');
  } catch {
    showMsg('auth-msg', 'Connection error', 'error');
  }
}

/* ── LOGIN ───────────────────────────────────────────────────── */
async function login() {
  const email    = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;

  if (!email || !password) return showMsg('auth-msg', 'Please fill all fields', 'error');

  try {
    const res  = await api('/api/auth/login', 'POST', { email, password });
    const data = await res.json();
    if (!res.ok) return showMsg('auth-msg', data.message, 'error');
    saveSession(data);
    showNav();
    showPage('home');
  } catch {
    showMsg('auth-msg', 'Connection error', 'error');
  }
}

/* ── LOGOUT ──────────────────────────────────────────────────── */
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  token = null; user = null;
  document.getElementById('navbar').classList.add('hidden');
  showPage('auth');
}

/* ── GENERATE WORKOUT ────────────────────────────────────────── */
async function generateWorkout() {
  const goal            = document.querySelector('input[name="goal"]:checked')?.value;
  const experienceLevel = document.querySelector('input[name="level"]:checked')?.value;
  const duration        = document.querySelector('input[name="duration"]:checked')?.value;
  const equipment       = document.querySelector('input[name="equipment"]:checked')?.value;

  try {
    const res  = await api('/api/workout/generate', 'POST', { goal, experienceLevel, duration, equipment });
    const data = await res.json();
    if (!res.ok) return alert(data.message);

    currentWorkout = data;
    renderWorkout(data);
    resetTimer();
  } catch {
    alert('Error generating workout');
  }
}

function renderWorkout(data) {
  const result = document.getElementById('workout-result');
  result.classList.remove('hidden');

  // Title and meta
  document.getElementById('workout-title').textContent =
    capitalize(data.goal) + ' Workout';
  document.getElementById('workout-meta').textContent =
    `${capitalize(data.experienceLevel)} · ${data.duration} min · ${capitalize(data.equipment || 'no equipment')}`;

  // Exercises
  const list = document.getElementById('exercise-list');
  list.innerHTML = data.exercises.map((ex, i) => `
    <div class="exercise-card">
      <div class="exercise-info">
        <span class="exercise-num">${String(i + 1).padStart(2, '0')}</span>
        <div>
          <div class="exercise-name">${ex.name}</div>
          <div class="exercise-tags">
            <span class="ex-tag">📦 ${ex.sets} sets</span>
            <span class="ex-tag">🔁 ${ex.reps}</span>
          </div>
        </div>
      </div>
      <span class="rest-badge">⏱ ${ex.rest} rest</span>
    </div>
  `).join('');

  result.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ── SAVE WORKOUT ────────────────────────────────────────────── */
async function saveWorkout() {
  if (!currentWorkout) return;
  try {
    const res  = await api('/api/workout/save', 'POST', currentWorkout);
    const data = await res.json();
    if (!res.ok) return showMsg('save-msg', data.message, 'error');
    showMsg('save-msg', '✅ Workout saved to your dashboard!', 'success');
  } catch {
    showMsg('save-msg', 'Error saving workout', 'error');
  }
}

/* ── DASHBOARD ───────────────────────────────────────────────── */
async function loadDashboard() {
  if (!user) return;

  // Profile
  document.getElementById('dash-name').textContent = user.name;
  document.getElementById('dash-goal').textContent = 'Goal: ' + capitalize(user.fitnessGoal || 'General Fitness');
  document.getElementById('dash-avatar').textContent = user.name.charAt(0).toUpperCase();

  // History
  try {
    const res      = await api('/api/workout/my', 'GET');
    const workouts = await res.json();
    renderHistory(workouts);
  } catch {
    document.getElementById('workout-history').innerHTML = '<p style="color:var(--muted)">Error loading workouts.</p>';
  }
}

function renderHistory(workouts) {
  const el = document.getElementById('workout-history');
  if (!workouts.length) {
    el.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">🏋️</div>
        <p>No workouts saved yet.<br>Generate one and hit Save!</p>
      </div>`;
    return;
  }

  el.innerHTML = workouts.map(w => `
    <div class="history-card">
      <div class="history-header">
        <div class="history-meta">
          <span class="badge badge-goal">${capitalize(w.goal)}</span>
          <span class="badge badge-level">${capitalize(w.experienceLevel)}</span>
          <span class="badge badge-dur">${w.duration} min</span>
          <span class="badge badge-equip">${capitalize(w.equipment || 'none')}</span>
        </div>
        <span class="history-date">${formatDate(w.createdAt)}</span>
      </div>
      <div class="history-exercises">
        ${w.exercises.map(ex => `<span class="history-ex-pill">${ex.name}</span>`).join('')}
      </div>
    </div>
  `).join('');
}

/* ── TIMER ───────────────────────────────────────────────────── */
function startTimer() {
  if (timerRunning) return;
  timerRunning = true;
  timerInterval = setInterval(() => {
    timerSeconds++;
    document.getElementById('timer-display').textContent = formatTime(timerSeconds);
  }, 1000);
}
function pauseTimer() {
  clearInterval(timerInterval);
  timerRunning = false;
}
function resetTimer() {
  clearInterval(timerInterval);
  timerRunning  = false;
  timerSeconds  = 0;
  const el = document.getElementById('timer-display');
  if (el) el.textContent = '00:00';
}
function formatTime(s) {
  const m = Math.floor(s / 60).toString().padStart(2, '0');
  const sec = (s % 60).toString().padStart(2, '0');
  return `${m}:${sec}`;
}

/* ── NAV / PAGE ROUTING ──────────────────────────────────────── */
function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));
  document.getElementById('page-' + name).classList.remove('hidden');
  if (name === 'dashboard') loadDashboard();
  if (name === 'home' && user) {
    document.getElementById('home-username').textContent = user.name.split(' ')[0];
  }
}
function showNav() {
  document.getElementById('navbar').classList.remove('hidden');
}

/* ── HELPERS ─────────────────────────────────────────────────── */
function api(url, method = 'GET', body = null) {
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: 'Bearer ' + token } : {}) }
  };
  if (body) opts.body = JSON.stringify(body);
  return fetch(url, opts);
}

function saveSession(data) {
  token = data.token;
  user  = data.user;
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
}

function showMsg(id, text, type) {
  const el = document.getElementById(id);
  el.textContent = text;
  el.className   = `msg ${type}`;
  el.classList.remove('hidden');
  setTimeout(() => el.classList.add('hidden'), 4000);
}
function hideMsg(id) {
  document.getElementById(id).classList.add('hidden');
}

function capitalize(str = '') {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
