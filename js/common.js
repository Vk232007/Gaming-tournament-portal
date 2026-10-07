// ---------- Shared helpers (Local Storage "database") ----------
const read  = (k, d) => JSON.parse(localStorage.getItem(k)) ?? d;
const write = (k, v) => localStorage.setItem(k, JSON.stringify(v));

const getUsers       = () => read('users', []);
const getTournaments = () => read('tournaments', []);
const getRegs        = () => read('registrations', []);   // {username, tournamentId}
const getSession     = () => read('session', null);

// Seed the fixed demo accounts (re-created on every load, so they always work)
(function seedAccounts() {
  const demo = [
    { name: 'Administrator', username: 'ADMIN', password: 'ADMIN1234', role: 'admin' },
    { name: 'Demo User',     username: 'USER',  password: 'USER1234',  role: 'user'  }
  ];
  const keep = getUsers().filter(u => u.username && !demo.some(d => d.username === u.username.toUpperCase()));
  write('users', [...demo, ...keep]);
})();

// Route guard: call at top of each protected page
function requireRole(role) {
  const s = getSession();
  if (!s) { location.replace('index.html'); return null; }
  if (s.role !== role) { location.replace(s.role === 'admin' ? 'admin.html' : 'user.html'); return null; }
  return s;
}

function logout() {
  localStorage.removeItem('session');
  location.href = 'index.html';
}
