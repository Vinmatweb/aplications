import {
  DAY_META,
  PARENTS,
  STORE_KEY,
  addDays,
  calculateStats,
  dateFromKey,
  dateKey,
  emptyRecord,
  formatDay,
  formatWeek,
  mondayOf,
  normalizeState,
  weekKeys,
} from './model.js';

let state = loadState();
let currentMonday = mondayOf(new Date());
let currentView = 'week';
let statsPeriod = 'week';
let saveTimer;

const elements = {
  days: document.querySelector('#days'),
  weekTitle: document.querySelector('#week-title'),
  weekView: document.querySelector('#week-view'),
  statsView: document.querySelector('#stats-view'),
  saveState: document.querySelector('#save-state'),
  overall: document.querySelector('#overall'),
  statsList: document.querySelector('#stats-list'),
  statsPeriod: document.querySelector('#stats-period'),
  weekendHistory: document.querySelector('#weekend-history'),
};

function loadState() {
  try {
    return normalizeState(JSON.parse(localStorage.getItem(STORE_KEY)));
  } catch {
    return normalizeState(null);
  }
}

function persist() {
  localStorage.setItem(STORE_KEY, JSON.stringify(state));
  elements.saveState.textContent = 'Uloženo';
  elements.saveState.classList.add('saved');
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    elements.saveState.textContent = 'Uloženo v telefonu';
    elements.saveState.classList.remove('saved');
  }, 1300);
}

function recordFor(key) {
  if (!state.records[key]) state.records[key] = emptyRecord();
  return state.records[key];
}

function parentButtons(key, field, value, disabled = false) {
  const label = field === 'to' ? 'Cesta do školy nebo školky' : field === 'from' ? 'Vyzvednutí ze školy nebo školky' : field === 'activityDriver' ? 'Doprovod na kroužek' : field === 'morningParent' ? 'Víkendové dopoledne' : 'Víkendové odpoledne';
  return `<div class="parent-choice" role="group" aria-label="${label}">
    ${Object.entries(PARENTS).map(([id, name]) => `<button type="button" class="parent-button ${id} ${value === id ? 'selected' : ''}" data-date="${key}" data-field="${field}" data-parent="${id}" aria-pressed="${value === id}" ${disabled ? 'disabled' : ''}><span>${id === 'dad' ? 'T' : 'M'}</span>${name}</button>`).join('')}
  </div>`;
}

function weekdayCard(meta, key) {
  const record = recordFor(key);
  const isToday = key === dateKey(new Date());
  const noKindergarten = !meta.matildaKindergarten;
  return `<article class="day-card ${isToday ? 'today' : ''}">
    <header class="day-header">
      <div><span class="day-short">${meta.short}</span><div><h3>${meta.long}</h3><p>${formatDay(key)}${isToday ? ' · dnes' : ''}</p></div></div>
      ${noKindergarten ? '<span class="kindergarten-note">Maty nemá školku</span>' : ''}
    </header>
    <div class="task-row"><div><strong>Do školy / školky</strong><small>${noKindergarten ? 'Vincent do školy' : 'Maty + Vincent'}</small></div>${parentButtons(key, 'to', record.to)}</div>
    <div class="task-row"><div><strong>Ze školy / školky</strong><small>${noKindergarten ? 'Vincent ze školy' : 'Maty + Vincent'}</small></div>${parentButtons(key, 'from', record.from)}</div>
    <div class="task-row activity-row"><div><strong>Na kroužek</strong><small class="activity-name">${meta.activity}</small></div>${meta.activity === 'Volno' ? '<span class="rest-label">Bez kroužku</span>' : parentButtons(key, 'activityDriver', record.activityDriver)}</div>
  </article>`;
}

function weekendPart(key, part, activityField, parentField, record) {
  return `<div class="weekend-part">
    <label for="${key}-${activityField}">${part}</label>
    <input id="${key}-${activityField}" type="text" maxlength="80" data-date="${key}" data-field="${activityField}" value="${escapeAttribute(record[activityField])}" placeholder="Aktivita – např. výlet, hřiště…" autocomplete="off" />
    ${parentButtons(key, parentField, record[parentField])}
  </div>`;
}

function weekendCard(meta, key) {
  const record = recordFor(key);
  const isToday = key === dateKey(new Date());
  return `<article class="day-card weekend-card ${isToday ? 'today' : ''}">
    <header class="day-header"><div><span class="day-short weekend">${meta.short}</span><div><h3>${meta.long}</h3><p>${formatDay(key)}${isToday ? ' · dnes' : ''}</p></div></div></header>
    ${weekendPart(key, 'Dopoledne', 'morningActivity', 'morningParent', record)}
    ${weekendPart(key, 'Odpoledne', 'afternoonActivity', 'afternoonParent', record)}
  </article>`;
}

function escapeAttribute(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

function renderWeek() {
  const keys = weekKeys(currentMonday);
  elements.weekTitle.textContent = formatWeek(keys);
  elements.days.innerHTML = DAY_META.map((meta, index) => meta.type === 'weekday' ? weekdayCard(meta, keys[index]) : weekendCard(meta, keys[index])).join('');
}

function bar(category) {
  const dadPercent = category.total ? Math.round(category.dad / category.total * 100) : 50;
  return `<article class="stat-card">
    <div class="stat-title"><h3>${category.label}</h3><span>${category.total}×</span></div>
    <div class="split-bar ${category.total ? '' : 'empty'}" aria-label="Táta ${category.dad}, Máma ${category.mom}"><i style="width:${dadPercent}%"></i></div>
    <div class="stat-values"><span class="dad"><b>${category.dad}</b> Táta</span><span class="mom"><b>${category.mom}</b> Máma</span></div>
  </article>`;
}

function renderStats() {
  const keys = weekKeys(currentMonday);
  const data = calculateStats(state.records, statsPeriod === 'week' ? keys : null);
  elements.statsPeriod.textContent = statsPeriod === 'week' ? formatWeek(keys) : 'Všechny uložené týdny';
  const total = data.overall.total;
  const dadPercent = total ? Math.round(data.overall.dad / total * 100) : 0;
  const momPercent = total ? 100 - dadPercent : 0;
  elements.overall.innerHTML = `<p>CELKEM ZAPSANÝCH ÚKOLŮ</p><strong>${total}</strong><div><span class="dad"><b>${dadPercent} %</b> Táta</span><span class="mom"><b>${momPercent} %</b> Máma</span></div>`;
  elements.statsList.innerHTML = data.categories.map(bar).join('');
  elements.weekendHistory.innerHTML = data.weekendActivities.length ? `<h3>Víkendové aktivity</h3><div>${data.weekendActivities.map(item => `<p><span>${new Intl.DateTimeFormat('cs-CZ', { weekday: 'short', day: 'numeric', month: 'numeric' }).format(dateFromKey(item.key))} · ${item.part}</span><strong>${escapeAttribute(item.activity)}</strong><small class="${item.parent || ''}">${item.parent ? PARENTS[item.parent] : 'Rodič nevybrán'}</small></p>`).join('')}</div>` : '<div class="empty-history"><strong>Zatím žádná víkendová aktivita</strong><span>Doplň ji v týdenním přehledu.</span></div>';
}

function updateView() {
  const week = currentView === 'week';
  elements.weekView.classList.toggle('hidden', !week);
  elements.statsView.classList.toggle('hidden', week);
  document.querySelectorAll('[data-view]').forEach(button => {
    const active = button.dataset.view === currentView;
    button.classList.toggle('active', active);
    if (active) button.setAttribute('aria-current', 'page'); else button.removeAttribute('aria-current');
  });
  if (week) renderWeek(); else renderStats();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.addEventListener('click', event => {
  const parentButton = event.target.closest('[data-parent]');
  if (parentButton) {
    const record = recordFor(parentButton.dataset.date);
    const field = parentButton.dataset.field;
    record[field] = record[field] === parentButton.dataset.parent ? '' : parentButton.dataset.parent;
    persist();
    if (currentView === 'week') renderWeek(); else renderStats();
    return;
  }

  const viewButton = event.target.closest('[data-view]');
  if (viewButton) {
    currentView = viewButton.dataset.view;
    updateView();
    return;
  }

  const periodButton = event.target.closest('[data-period]');
  if (periodButton) {
    statsPeriod = periodButton.dataset.period;
    document.querySelectorAll('[data-period]').forEach(button => button.setAttribute('aria-pressed', String(button === periodButton)));
    renderStats();
  }
});

document.addEventListener('input', event => {
  const input = event.target.closest('input[data-date][data-field]');
  if (!input) return;
  recordFor(input.dataset.date)[input.dataset.field] = input.value;
  persist();
});

document.querySelector('#previous-week').addEventListener('click', () => { currentMonday = addDays(currentMonday, -7); renderWeek(); });
document.querySelector('#next-week').addEventListener('click', () => { currentMonday = addDays(currentMonday, 7); renderWeek(); });
document.querySelector('#today').addEventListener('click', () => { currentMonday = mondayOf(new Date()); renderWeek(); });

renderWeek();
