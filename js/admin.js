// ---------- Admin Module ----------
const admin = requireRole('admin');

function renderList() {
  const list = document.getElementById('list');
  const ts = getTournaments(), regs = getRegs();
  if (!ts.length) { list.innerHTML = '<p class="empty">No tournaments yet. Create the first one.</p>'; return; }
  list.innerHTML = ts.map(t => {
    const joined = regs.filter(r => r.tournamentId === t.id).length;
    return `<article class="t-card">
      <span class="badge">${t.game}</span>
      <h3>${t.name}</h3>
      <p class="meta">${t.date} • Prize ₹${t.prize}</p>
      <p class="meta">Slots filled: ${joined} / ${t.slots}</p>
      <div class="actions"><button class="danger" onclick="removeTournament(${t.id})">Delete</button></div>
    </article>`;
  }).join('');
}

document.getElementById('tForm').addEventListener('submit', e => {
  e.preventDefault();
  const ts = getTournaments();
  ts.push({
    id: Date.now(), name: t_name.value.trim(), game: t_game.value,
    date: t_date.value, slots: +t_slots.value, prize: +t_prize.value
  });
  write('tournaments', ts);
  e.target.reset();
  renderList();
});

function removeTournament(id) {
  if (!confirm('Delete this tournament?')) return;
  write('tournaments', getTournaments().filter(t => t.id !== id));
  write('registrations', getRegs().filter(r => r.tournamentId !== id));
  renderList();
}

renderList();
