// ---------- User Module ----------
const me = requireRole('user');
if (me) document.getElementById('who').textContent = me.name;

const card = (t, body) => `<article class="t-card">
  <span class="badge">${t.game}</span><h3>${t.name}</h3>
  <p class="meta">${t.date} • Prize ₹${t.prize}</p>${body}</article>`;

function render() {
  const ts = getTournaments(), regs = getRegs();
  const myIds = regs.filter(r => r.username === me.username).map(r => r.tournamentId);

  document.getElementById('open').innerHTML = ts.length ? ts.map(t => {
    const filled = regs.filter(r => r.tournamentId === t.id).length;
    const joined = myIds.includes(t.id), full = filled >= t.slots;
    const btn = joined ? '<button disabled>Registered</button>'
              : full   ? '<button disabled>Slots full</button>'
              : `<button onclick="join(${t.id})">Register</button>`;
    return card(t, `<p class="meta">Slots: ${filled} / ${t.slots}</p><div class="actions">${btn}</div>`);
  }).join('') : '<p class="empty">No tournaments are open yet. Check back soon.</p>';

  const mine = ts.filter(t => myIds.includes(t.id));
  document.getElementById('mine').innerHTML = mine.length ? mine.map(t =>
    card(t, `<div class="actions"><button class="ghost" onclick="leave(${t.id})">Withdraw</button></div>`)
  ).join('') : '<p class="empty">You have not registered for any tournament.</p>';
}

function join(id) {
  const regs = getRegs();
  regs.push({ username: me.username, tournamentId: id });
  write('registrations', regs);
  render();
}

function leave(id) {
  write('registrations', getRegs().filter(r => !(r.username === me.username && r.tournamentId === id)));
  render();
}

if (me) render();
