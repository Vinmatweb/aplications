export const STORE_KEY = 'driving-children-statistics.v1';

export const PARENTS = {
  dad: 'Táta',
  mom: 'Máma',
};

export const DAY_META = [
  { short: 'Po', long: 'Pondělí', type: 'weekday', activity: 'Volno', matildaKindergarten: true },
  { short: 'Út', long: 'Úterý', type: 'weekday', activity: 'Atletika', matildaKindergarten: true },
  { short: 'St', long: 'Středa', type: 'weekday', activity: 'Plavání', matildaKindergarten: true },
  { short: 'Čt', long: 'Čtvrtek', type: 'weekday', activity: 'Judo', matildaKindergarten: false },
  { short: 'Pá', long: 'Pátek', type: 'weekday', activity: 'Olaf OCR', matildaKindergarten: true },
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
    to: '',
    from: '',
    activityDriver: '',
    morningActivity: '',
    morningParent: '',
    afternoonActivity: '',
    afternoonParent: '',
  };
}

export function normalizeState(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return { version: 1, records: {} };
  const records = value.records && typeof value.records === 'object' && !Array.isArray(value.records) ? value.records : {};
  const clean = {};
  for (const [key, candidate] of Object.entries(records)) {
    if (!/^20\d{2}-\d{2}-\d{2}$/.test(key) || !candidate || typeof candidate !== 'object' || Array.isArray(candidate)) continue;
    const record = emptyRecord();
    for (const field of Object.keys(record)) {
      const raw = candidate[field];
      if (field.endsWith('Parent') || ['to', 'from', 'activityDriver'].includes(field)) record[field] = raw === 'dad' || raw === 'mom' ? raw : '';
      else record[field] = typeof raw === 'string' ? raw.slice(0, 80) : '';
    }
    clean[key] = record;
  }
  return { version: 1, records: clean };
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
      if (record.to === 'dad' || record.to === 'mom') counts.to[record.to]++;
      if (record.from === 'dad' || record.from === 'mom') counts.from[record.from]++;
      if (meta.activity !== 'Volno' && (record.activityDriver === 'dad' || record.activityDriver === 'mom')) counts.activityDriver[record.activityDriver]++;
    } else {
      if (record.morningParent === 'dad' || record.morningParent === 'mom') counts.morningParent[record.morningParent]++;
      if (record.afternoonParent === 'dad' || record.afternoonParent === 'mom') counts.afternoonParent[record.afternoonParent]++;
      if (record.morningActivity.trim()) weekendActivities.push({ key, part: 'Dopoledne', activity: record.morningActivity.trim(), parent: record.morningParent });
      if (record.afternoonActivity.trim()) weekendActivities.push({ key, part: 'Odpoledne', activity: record.afternoonActivity.trim(), parent: record.afternoonParent });
    }
  }

  const categories = CATEGORIES.map(category => ({ ...category, ...counts[category.id], total: counts[category.id].dad + counts[category.id].mom }));
  const overall = categories.reduce((result, category) => {
    result.dad += category.dad;
    result.mom += category.mom;
    return result;
  }, { dad: 0, mom: 0 });

  weekendActivities.sort((a, b) => b.key.localeCompare(a.key) || a.part.localeCompare(b.part));
  return { categories, overall: { ...overall, total: overall.dad + overall.mom }, weekendActivities };
}
