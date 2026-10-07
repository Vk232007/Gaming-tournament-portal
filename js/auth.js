// ---------- Admin login, User login and Signup (index.html) ----------
const msg = document.getElementById('msg');
let loginRole = 'admin';

// Already logged in? send to the right module
const existing = getSession();
if (existing) location.replace(existing.role === 'admin' ? 'admin.html' : 'user.html');

function showTab(which) {
  const isLogin = which !== 'signup';
  if (isLogin) {
    loginRole = which;
    document.getElementById('loginTitle').textContent = which === 'admin' ? 'Admin login' : 'User login';
  }
  document.getElementById('loginForm').classList.toggle('hidden', !isLogin);
  document.getElementById('signupForm').classList.toggle('hidden', isLogin);
  document.querySelectorAll('.tabs button').forEach(b => b.classList.toggle('active', b.dataset.tab === which));
  msg.textContent = '';
}

document.getElementById('signupForm').addEventListener('submit', e => {
  e.preventDefault();
  const name = su_name.value.trim(), username = su_user.value.trim(), password = su_pass.value;
  const users = getUsers();
  if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
    msg.textContent = 'Username already taken.'; return;
  }
  users.push({ name, username, password, role: 'user' });   // public signup = User role only
  write('users', users);
  e.target.reset();
  showTab('user');
  msg.textContent = 'Account created. Please log in.';
});

document.getElementById('loginForm').addEventListener('submit', e => {
  e.preventDefault();
  const username = li_user.value.trim().toLowerCase(), password = li_pass.value;
  const user = getUsers().find(u => u.username.toLowerCase() === username && u.password === password);
  if (!user) { msg.textContent = 'Wrong username or password.'; return; }
  if (user.role !== loginRole) {
    msg.textContent = loginRole === 'admin' ? 'This is not an admin account.' : 'Admins must use the Admin login tab.';
    return;
  }
  write('session', { name: user.name, username: user.username, role: user.role });
  location.href = user.role === 'admin' ? 'admin.html' : 'user.html';   // module-wise redirection
});

showTab('admin');
