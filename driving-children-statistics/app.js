import {
  CHILDREN,
  DAY_META,
  PARENTS,
  STORE_KEY,
  activityChildren,
  activityEnabled,
  addDays,
  calculateStats,
  dateFromKey,
  dateKey,
  emptyRecord,
  formatDay,
  formatWeek,
  matildaGoesToKindergarten,
  mondayOf,
  monthKeys,
  normalizeState,
  weekKeys,
  yearKeys,
} from './model.js?v=20261007-3';

const now = new Date();
let state = loadState();
let currentMonday = mondayOf(now);
let currentView = 'week';
let statsPeriod = 'week';
let statsMonth = now.getMonth();
let statsYear = now.getFullYear();
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
  statsFilters: document.querySelector('#stats-filters'),
  monthFilter: document.querySelector('#month-filter'),
  yearFilter: document.querySelector('#year-filter'),
  statsMonth: document.querySelector('#stats-month'),
  statsYear: document.querySelector('#stats-year'),
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

function metaForKey(key) {
  return DAY_META[(dateFromKey(key).getDay() + 6) % 7];
}

function selectedValues(value) {
  return Array.isArray(value) ? value : value ? [value] : [];
}

function toggleValue(values, value) {
  const next = new Set(selectedValues(values));
  if (next.has(value)) next.delete(value); else next.add(value);
  return [...next];
}

function parentButtons(key, field, value) {
  const selected = new Set(selectedValues(value));
  const label = field === 'to' ? 'Cesta do školy nebo školky' : field === 'from' ? 'Vyzvednutí ze školy nebo školky' : field === 'activityDriver' ? 'Doprovod na kroužek' : field === 'morningParent' ? 'Víkendové dopoledne' : 'Víkendové odpoledne';
  return `<div class="parent-choice" role="group" aria-label="${label}">
    ${Object.entries(PARENTS).map(([id, name]) => `<button type="button" class="parent-button ${id} ${selected.has(id) ? 'selected' : ''}" data-date="${key}" data-field="${field}" data-parent="${id}" aria-pressed="${selected.has(id)}"><span>${id === 'dad' ? 'T' : 'M'}</span>${name}</button>`).join('')}
  </div>`;
}

function childButtons(key, value) {
  const selected = new Set(selectedValues(value));
  return `<div class="child-choice" role="group" aria-label="Děti na kroužku">
    ${Object.entries(CHILDREN).map(([id, name]) => `<button type="button" class="child-button ${selected.has(id) ? 'selected' : ''}" data-date="${key}" data-child="${id}" aria-pressed="${selected.has(id)}">${name}</button>`).join('')}
  </div>`;
}

function clubSection(meta, key, record) {
  const enabled = activityEnabled(meta, record);
  const name = record.activityName.trim() || meta.activity;
  const children = activityChildren(meta, record);
  return `<div class="club-section ${enabled ? 'enabled' : 'disabled'}">
    <div class="club-heading">
      <div><strong>Na kroužek</strong><small class="activity-name">${enabled ? escapeHtml(name) : 'Volno'}</small></div>
      <button type="button" class="club-toggle" data-date="${key}" data-club-toggle aria-pressed="${enabled}"><span aria-hidden="true">${enabled ? '✓' : '+'}</span>${enabled ? 'Zapnutý' : 'Přidat'}</button>
    </div>
    ${enabled ? `<div class="club-details">
      <label class="club-name" for="${key}-activityName">Kroužek<input id="${key}-activityName" type="text" maxlength="80" data-date="${key}" data-field="activityName" value="${escapeAttribute(record.activityName)}" placeholder="${escapeAttribute(meta.activity)}" autocomplete="off" /></label>
      <div class="club-choices">
        <div class="choice-block"><span>Děti</span>${childButtons(key, children)}</div>
        <div class="choice-block"><span>Doprovod</span>${parentButtons(key, 'activityDriver', record.activityDriver)}</div>
      </div>
    </div>` : '<p class="club-off">Pro tento den se kroužek do statistiky nepočítá.</p>'}
  </div>`;
}

function weekdayCard(meta, key) {
  const record = recordFor(key);
  const isToday = key === dateKey(new Date());
  const matildaAttends = matildaGoesToKindergarten(meta, record);
  const isThursday = meta.short === 'Čt';
  const schoolChildren = matildaAttends ? 'Maty + Vincent' : 'Vincent';
  return `<article class="day-card ${isToday ? 'today' : ''}">
    <header class="day-header">
      <div><span class="day-short">${meta.short}</span><div><h3>${meta.long}</h3><p>${formatDay(key)}${isToday ? ' · dnes' : ''}</p></div></div>
      ${isThursday ? `<button type="button" class="kindergarten-toggle ${matildaAttends ? 'selected' : ''}" data-date="${key}" data-kindergarten-toggle aria-pressed="${matildaAttends}">${matildaAttends ? 'Maty jde do školky' : 'Maty bez školky'}</button>` : ''}
    </header>
    <div class="task-row"><div><strong>Do školy / školky</strong><small>${schoolChildren}</small></div>${parentButtons(key, 'to', record.to)}</div>
    <div class="task-row"><div><strong>Ze školy / školky</strong><small>${schoolChildren}</small></div>${parentButtons(key, 'from', record.from)}</div>
    ${clubSection(meta, key, record)}
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

function escapeHtml(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

function renderWeek() {
  const keys = weekKeys(currentMonday);
  elements.weekTitle.textContent = formatWeek(keys);
  elements.days.innerHTML = DAY_META.map((meta, index) => meta.type === 'weekday' ? weekdayCard(meta, keys[index]) : weekendCard(meta, keys[index])).join('');
}

function bar(category) {
  const dadPercent = category.total ? Math.round(category.dad / category.total * 100) : 50;
  return `<article class="stat-card ${category.derived ? 'summary' : ''}">
    <div class="stat-title"><h3>${category.label}</h3><span>${category.derived ? 'Součet · ' : ''}${category.total}×</span></div>
    <div class="split-bar ${category.total ? '' : 'empty'}" aria-label="Táta ${category.dad}, Máma ${category.mom}"><i style="width:${dadPercent}%"></i></div>
    <div class="stat-values"><span class="dad"><b>${category.dad}</b> Táta</span><span class="mom"><b>${category.mom}</b> Máma</span></div>
  </article>`;
}

function availableYears() {
  const years = new Set([statsYear]);
  for (let year = now.getFullYear() - 2; year <= now.getFullYear() + 3; year++) years.add(year);
  for (const key of Object.keys(state.records)) years.add(Number(key.slice(0, 4)));
  return [...years].filter(Number.isInteger).sort((a, b) => a - b);
}

function populateStatsFilters() {
  const monthFormatter = new Intl.DateTimeFormat('cs-CZ', { month: 'long' });
  elements.statsMonth.innerHTML = Array.from({ length: 12 }, (_, month) => `<option value="${month}" ${month === statsMonth ? 'selected' : ''}>${monthFormatter.format(new Date(2026, month, 1))}</option>`).join('');
  elements.statsYear.innerHTML = availableYears().map(year => `<option value="${year}" ${year === statsYear ? 'selected' : ''}>${year}</option>`).join('');
}

function statsSelection() {
  if (statsPeriod === 'week') {
    const keys = weekKeys(currentMonday);
    return { keys, label: formatWeek(keys) };
  }
  if (statsPeriod === 'month') {
    const label = new Intl.DateTimeFormat('cs-CZ', { month: 'long', year: 'numeric' }).format(new Date(statsYear, statsMonth, 1));
    return { keys: monthKeys(statsYear, statsMonth), label: label.charAt(0).toUpperCase() + label.slice(1) };
  }
  if (statsPeriod === 'year') return { keys: yearKeys(statsYear), label: `Rok ${statsYear}` };
  return { keys: null, label: 'Všechny uložené záznamy' };
}

function updateStatsFilters() {
  const showMonth = statsPeriod === 'month';
  const showYear = statsPeriod === 'month' || statsPeriod === 'year';
  elements.statsFilters.classList.toggle('hidden', !showYear);
  elements.monthFilter.classList.toggle('hidden', !showMonth);
  elements.yearFilter.classList.toggle('hidden', !showYear);
}

function parentsLabel(parents) {
  const values = selectedValues(parents);
  return values.length ? values.map(parent => PARENTS[parent]).filter(Boolean).join(' + ') : 'Rodič nevybrán';
}

function parentLabelClass(parents) {
  const values = selectedValues(parents);
  return values.length === 2 ? 'both' : values[0] || '';
}

function renderStats() {
  populateStatsFilters();
  updateStatsFilters();
  const selection = statsSelection();
  const data = calculateStats(state.records, selection.keys);
  elements.statsPeriod.textContent = selection.label;
  const total = data.overall.total;
  const dadPercent = total ? Math.round(data.overall.dad / total * 100) : 0;
  const momPercent = total ? 100 - dadPercent : 0;
  elements.overall.innerHTML = `<p>CELKEM ZAPSANÝCH ÚČASTÍ</p><strong>${total}</strong><div><span class="dad"><b>${dadPercent} %</b> Táta</span><span class="mom"><b>${momPercent} %</b> Máma</span></div>`;
  elements.statsList.innerHTML = data.categories.map(bar).join('');
  elements.weekendHistory.innerHTML = data.weekendActivities.length ? `<h3>Víkendové aktivity</h3><div>${data.weekendActivities.map(item => `<p><span>${new Intl.DateTimeFormat('cs-CZ', { weekday: 'short', day: 'numeric', month: 'numeric' }).format(dateFromKey(item.key))} · ${item.part}</span><strong>${escapeHtml(item.activity)}</strong><small class="${parentLabelClass(item.parents)}">${parentsLabel(item.parents)}</small></p>`).join('')}</div>` : '<div class="empty-history"><strong>Zatím žádná víkendová aktivita</strong><span>Doplň ji v týdenním přehledu.</span></div>';
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
    record[field] = toggleValue(record[field], parentButton.dataset.parent);
    persist();
    if (currentView === 'week') renderWeek(); else renderStats();
    return;
  }

  const childButton = event.target.closest('[data-child]');
  if (childButton) {
    const record = recordFor(childButton.dataset.date);
    const meta = metaForKey(childButton.dataset.date);
    record.activityChildren = toggleValue(activityChildren(meta, record), childButton.dataset.child);
    persist();
    renderWeek();
    return;
  }

  const clubToggle = event.target.closest('[data-club-toggle]');
  if (clubToggle) {
    const record = recordFor(clubToggle.dataset.date);
    record.activityEnabled = !activityEnabled(metaForKey(clubToggle.dataset.date), record);
    persist();
    renderWeek();
    return;
  }

  const kindergartenToggle = event.target.closest('[data-kindergarten-toggle]');
  if (kindergartenToggle) {
    const record = recordFor(kindergartenToggle.dataset.date);
    record.matildaKindergarten = !matildaGoesToKindergarten(metaForKey(kindergartenToggle.dataset.date), record);
    persist();
    renderWeek();
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

document.addEventListener('change', event => {
  if (event.target === elements.statsMonth) {
    statsMonth = Number(event.target.value);
    renderStats();
  }
  if (event.target === elements.statsYear) {
    statsYear = Number(event.target.value);
    renderStats();
  }
});

document.querySelector('#previous-week').addEventListener('click', () => { currentMonday = addDays(currentMonday, -7); renderWeek(); });
document.querySelector('#next-week').addEventListener('click', () => { currentMonday = addDays(currentMonday, 7); renderWeek(); });
document.querySelector('#today').addEventListener('click', () => { currentMonday = mondayOf(new Date()); renderWeek(); });

renderWeek();
