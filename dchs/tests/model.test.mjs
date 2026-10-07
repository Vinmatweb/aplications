import assert from 'node:assert/strict';
import test from 'node:test';
import {
  DAY_META,
  activityChildren,
  activityEnabled,
  calculateStats,
  emptyRecord,
  matildaGoesToKindergarten,
  mondayOf,
  monthKeys,
  normalizeState,
  weekKeys,
  yearKeys,
} from '../model.js';

test('week starts on Monday and always contains seven dates', () => {
  assert.deepEqual(weekKeys(mondayOf(new Date('2026-10-07T12:00:00'))), [
    '2026-10-05', '2026-10-06', '2026-10-07', '2026-10-08', '2026-10-09', '2026-10-10', '2026-10-11',
  ]);
});

test('month and year selectors create exact calendar date ranges', () => {
  assert.equal(monthKeys(2026, 9).length, 31);
  assert.deepEqual(monthKeys(2026, 9).slice(0, 2), ['2026-10-01', '2026-10-02']);
  assert.equal(monthKeys(2028, 1).length, 29);
  assert.equal(yearKeys(2026).length, 365);
});

test('weekday statistics distinguish trips, pickups and enabled clubs', () => {
  const records = {
    '2026-10-05': { ...emptyRecord(), to: ['dad'], from: ['mom'], activityDriver: ['dad'] },
    '2026-10-06': { ...emptyRecord(), to: ['mom'], from: ['mom'], activityDriver: ['dad'] },
    '2026-10-08': { ...emptyRecord(), to: ['dad'], from: ['dad'], activityDriver: ['mom'] },
  };
  const result = calculateStats(records);
  assert.deepEqual(result.categories.find(item => item.id === 'to'), { id: 'to', label: 'Do školy / školky', dad: 2, mom: 1, total: 3 });
  assert.deepEqual(result.categories.find(item => item.id === 'from'), { id: 'from', label: 'Ze školy / školky', dad: 1, mom: 2, total: 3 });
  assert.deepEqual(result.categories.find(item => item.id === 'activityDriver'), { id: 'activityDriver', label: 'Na kroužek', dad: 1, mom: 1, total: 2 });
});

test('both parents can receive credit for the same task', () => {
  const result = calculateStats({
    '2026-10-06': { ...emptyRecord(), to: ['dad', 'mom'], activityDriver: ['dad', 'mom'] },
  });
  assert.deepEqual(result.categories.find(item => item.id === 'to'), { id: 'to', label: 'Do školy / školky', dad: 1, mom: 1, total: 2 });
  assert.deepEqual(result.categories.find(item => item.id === 'activityDriver'), { id: 'activityDriver', label: 'Na kroužek', dad: 1, mom: 1, total: 2 });
});

test('Monday club can be enabled and another weekday club can be cancelled', () => {
  const result = calculateStats({
    '2026-10-05': { ...emptyRecord(), activityEnabled: true, activityDriver: ['dad'] },
    '2026-10-06': { ...emptyRecord(), activityEnabled: false, activityDriver: ['mom'] },
  });
  assert.deepEqual(result.categories.find(item => item.id === 'activityDriver'), { id: 'activityDriver', label: 'Na kroužek', dad: 1, mom: 0, total: 1 });
});

test('weekday defaults and per-day overrides are resolved correctly', () => {
  const record = emptyRecord();
  assert.equal(activityEnabled(DAY_META[0], record), false);
  assert.equal(activityEnabled(DAY_META[1], record), true);
  assert.deepEqual(activityChildren(DAY_META[4], record), ['vincent']);
  assert.equal(matildaGoesToKindergarten(DAY_META[3], record), false);
  record.matildaKindergarten = true;
  assert.equal(matildaGoesToKindergarten(DAY_META[3], record), true);
});

test('weekend activities and both parents are counted by half-day', () => {
  const records = {
    '2026-10-10': { ...emptyRecord(), morningActivity: 'Výlet', morningParent: ['dad', 'mom'], afternoonActivity: 'Hřiště', afternoonParent: ['mom'] },
  };
  const result = calculateStats(records);
  assert.equal(result.categories.find(item => item.id === 'morningParent').dad, 1);
  assert.equal(result.categories.find(item => item.id === 'morningParent').mom, 1);
  assert.equal(result.categories.find(item => item.id === 'afternoonParent').mom, 1);
  assert.deepEqual(result.weekendActivities.map(item => item.activity), ['Výlet', 'Hřiště']);
  assert.deepEqual(result.weekendActivities[0].parents, ['dad', 'mom']);
});

test('selected period excludes records from other dates', () => {
  const records = {
    '2026-10-06': { ...emptyRecord(), to: ['dad'] },
    '2026-10-13': { ...emptyRecord(), to: ['mom'] },
  };
  const result = calculateStats(records, ['2026-10-06']);
  assert.deepEqual(result.overall, { dad: 1, mom: 0, total: 1 });
});

test('legacy and malformed stored data are safely migrated', () => {
  const state = normalizeState({ records: {
    '2026-10-06': { to: 'dad', from: ['mom', 'mom', 'other'], morningActivity: 'x'.repeat(200), activityEnabled: true, activityChildren: ['vincent', 'other'] },
    invalid: { to: 'dad' },
  } });
  assert.deepEqual(state.records['2026-10-06'].to, ['dad']);
  assert.deepEqual(state.records['2026-10-06'].from, ['mom']);
  assert.deepEqual(state.records['2026-10-06'].activityChildren, ['vincent']);
  assert.equal(state.records['2026-10-06'].activityEnabled, true);
  assert.equal(state.records['2026-10-06'].morningActivity.length, 80);
  assert.equal(state.records.invalid, undefined);
  assert.equal(state.version, 2);
});
