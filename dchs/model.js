export const STORE_KEY = 'driving-children-statistics.v1';

export const PARENTS = {
  dad: 'Táta',
  mom: 'Máma',
};

export const CHILDREN = {
  matilda: 'Maty',
  vincent: 'Vincent',
};

export const DAY_META = [
  { short: 'Po', long: 'Pondělí', type: 'weekday', activity: 'Judo', activityEnabled: false, defaultChildren: ['matilda', 'vincent'], matildaKindergarten: true },
  { short: 'Út', long: 'Úterý', type: 'weekday', activity: 'Atletika', activityEnabled: true, defaultChildren: ['matilda', 'vincent'], matildaKindergarten: true },
  { short: 'St', long: 'Středa', type: 'weekday', activity: 'Plavání', activityEnabled: true, defaultChildren: ['matilda', 'vincent'], matildaKindergarten: true },
  { short: 'Čt', long: 'Čtvrtek', type: 'weekday', activity: 'Judo', activityEnabled: true, defaultChildren: ['matilda', 'vincent'], matildaKindergarten: false },
  { short: 'Pá', long: 'Pátek', type: 'weekday', activity: 'Olaf OCR', activityEnabled: true, defaultChildren: ['vincent'], matildaKindergarten: true },
  { short: 'So', long: 'Sobota', type: 'weekend' },
  { short: 'Ne', long: 'Neděle', type: 'weekend' },
];

export function dateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function dateFromKey(key) {
  return new Date(`${key}T12:00:00`);
}

export function addDays(date, amount) {
  const result = new Date(date);
  result.setDate(result.getDate() + amount);
  return result;
}

export function mondayOf(date) {
  const result = new Date(date);
  result.setHours(12, 0, 0, 0);
  const offset = (result.getDay() + 6) % 7;
  result.setDate(result.getDate() - offset);
  return result;
}

export function weekKeys(monday) {
  return DAY_META.map((_, index) => dateKey(addDays(monday, index)));
}

export function monthKeys(year, monthIndex) {
  const days = new Date(year, monthIndex + 1, 0).getDate();
  return Array.from({ length: days }, (_, index) => dateKey(new Date(year, monthIndex, index + 1, 12)));
}

export function yearKeys(year) {
  return Array.from({ length: 12 }, (_, monthIndex) => monthKeys(year, monthIndex)).flat();
}

export function formatDay(key) {
  return new Intl.DateTimeFormat('cs-CZ', { day: 'numeric', month: 'numeric' }).format(dateFromKey(key));
}

export function formatWeek(keys) {
  const first = dateFromKey(keys[0]);
  const last = dateFromKey(keys[6]);
  const firstText = new Intl.DateTimeFormat('cs-CZ', { day: 'numeric', month: 'numeric' }).format(first);
  const lastText = new Intl.DateTimeFormat('cs-CZ', { day: 'numeric', month: 'numeric', year: 'numeric' }).format(last);
  return `${firstText} – ${lastText}`;
}

export function emptyRecord() {
  return {
    to: [],
    from: [],
    activityDriver: [],
    activityEnabled: null,
    activityName: '',
    activityChildren: null,
    matildaKindergarten: null,
    morningActivity: '',
    morningParent: [],
    afternoonActivity: '',
    afternoonParent: [],
  };
}

function normalizeChoices(raw, allowed) {
  const values = Array.isArray(raw) ? raw : typeof raw === 'string' ? [raw] : [];
  return [...new Set(values.filter(value => allowed.includes(value)))];
}

export function normalizeState(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return { version: 2, records: {} };
  const records = value.records && typeof value.records === 'object' && !Array.isArray(value.records) ? value.records : {};
  const clean = {};
  for (const [key, candidate] of Object.entries(records)) {
    if (!/^20\d{2}-\d{2}-\d{2}$/.test(key) || !candidate || typeof candidate !== 'object' || Array.isArray(candidate)) continue;
    const record = emptyRecord();
    for (const field of ['to', 'from', 'activityDriver', 'morningParent', 'afternoonParent']) {
      record[field] = normalizeChoices(candidate[field], Object.keys(PARENTS));
    }
    record.activityChildren = candidate.activityChildren === null || candidate.activityChildren === undefined
      ? null
      : normalizeChoices(candidate.activityChildren, Object.keys(CHILDREN));
    record.activityEnabled = typeof candidate.activityEnabled === 'boolean' ? candidate.activityEnabled : null;
    record.matildaKindergarten = typeof candidate.matildaKindergarten === 'boolean' ? candidate.matildaKindergarten : null;
    for (const field of ['activityName', 'morningActivity', 'afternoonActivity']) {
      record[field] = typeof candidate[field] === 'string' ? candidate[field].slice(0, 80) : '';
    }
    clean[key] = record;
  }
  return { version: 2, records: clean };
}

export function activityEnabled(meta, record) {
  return typeof record.activityEnabled === 'boolean' ? record.activityEnabled : Boolean(meta.activityEnabled);
}

export function activityChildren(meta, record) {
  return record.activityChildren === null ? [...(meta.defaultChildren || [])] : [...record.activityChildren];
}

export function matildaGoesToKindergarten(meta, record) {
  return typeof record.matildaKindergarten === 'boolean' ? record.matildaKindergarten : Boolean(meta.matildaKindergarten);
}

const CATEGORIES = [
  { id: 'to', label: 'Do školy / školky' },
  { id: 'from', label: 'Ze školy / školky' },
  { id: 'activityDriver', label: 'Na kroužek' },
  { id: 'morningParent', label: 'Víkend – dopoledne' },
  { id: 'afternoonParent', label: 'Víkend – odpoledne' },
];

export function calculateStats(records, selectedKeys = null) {
  const allowed = selectedKeys ? new Set(selectedKeys) : null;
  const counts = Object.fromEntries(CATEGORIES.map(category => [category.id, { dad: 0, mom: 0 }]));
  const weekendActivities = [];

  for (const [key, record] of Object.entries(records)) {
    if (allowed && !allowed.has(key)) continue;
    const dayIndex = (dateFromKey(key).getDay() + 6) % 7;
    const meta = DAY_META[dayIndex];
    if (!meta) continue;

    if (meta.type === 'weekday') {
      for (const parent of normalizeChoices(record.to, Object.keys(PARENTS))) counts.to[parent]++;
      for (const parent of normalizeChoices(record.from, Object.keys(PARENTS))) counts.from[parent]++;
      if (activityEnabled(meta, record)) {
        for (const parent of normalizeChoices(record.activityDriver, Object.keys(PARENTS))) counts.activityDriver[parent]++;
      }
    } else {
      const morningParents = normalizeChoices(record.morningParent, Object.keys(PARENTS));
      const afternoonParents = normalizeChoices(record.afternoonParent, Object.keys(PARENTS));
      for (const parent of morningParents) counts.morningParent[parent]++;
      for (const parent of afternoonParents) counts.afternoonParent[parent]++;
      if (record.morningActivity.trim()) weekendActivities.push({ key, part: 'Dopoledne', activity: record.morningActivity.trim(), parents: morningParents });
      if (record.afternoonActivity.trim()) weekendActivities.push({ key, part: 'Odpoledne', activity: record.afternoonActivity.trim(), parents: afternoonParents });
    }
  }

  const baseCategories = CATEGORIES.map(category => ({ ...category, ...counts[category.id], total: counts[category.id].dad + counts[category.id].mom }));
  const byId = Object.fromEntries(baseCategories.map(category => [category.id, category]));
  const schoolTotal = {
    id: 'schoolTotal',
    label: 'Do / ze školy / školky',
    dad: byId.to.dad + byId.from.dad,
    mom: byId.to.mom + byId.from.mom,
    derived: true,
  };
  schoolTotal.total = schoolTotal.dad + schoolTotal.mom;
  const weekdayTotal = {
    id: 'weekdayTotal',
    label: 'Škola / školka + kroužek',
    dad: schoolTotal.dad + byId.activityDriver.dad,
    mom: schoolTotal.mom + byId.activityDriver.mom,
    derived: true,
  };
  weekdayTotal.total = weekdayTotal.dad + weekdayTotal.mom;

  const categories = [
    byId.to,
    byId.from,
    schoolTotal,
    byId.activityDriver,
    weekdayTotal,
    byId.morningParent,
    byId.afternoonParent,
  ];
  const overall = baseCategories.reduce((result, category) => {
    result.dad += category.dad;
    result.mom += category.mom;
    return result;
  }, { dad: 0, mom: 0 });

  weekendActivities.sort((a, b) => b.key.localeCompare(a.key) || a.part.localeCompare(b.part));
  return { categories, overall: { ...overall, total: overall.dad + overall.mom }, weekendActivities };
}
