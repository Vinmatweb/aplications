import assert from 'node:assert/strict';
import test from 'node:test';
import { calculateStats, emptyRecord, mondayOf, normalizeState, weekKeys } from '../model.js';

test('week starts on Monday and always contains seven dates', () => {
  assert.deepEqual(weekKeys(mondayOf(new Date('2026-10-07T12:00:00'))), [
    '2026-10-05', '2026-10-06', '2026-10-07', '2026-10-08', '2026-10-09', '2026-10-10', '2026-10-11',
  ]);
});

test('weekday statistics distinguish trips, pickups and real clubs', () => {
  const records = {
    '2026-10-05': { ...emptyRecord(), to: 'dad', from: 'mom', activityDriver: 'dad' },
    '2026-10-06': { ...emptyRecord(), to: 'mom', from: 'mom', activityDriver: 'dad' },
    '2026-10-08': { ...emptyRecord(), to: 'dad', from: 'dad', activityDriver: 'mom' },
  };
  const result = calculateStats(records);
  assert.deepEqual(result.categories.find(item => item.id === 'to'), { id: 'to', label: 'Do školy / školky', dad: 2, mom: 1, total: 3 });
  assert.deepEqual(result.categories.find(item => item.id === 'from'), { id: 'from', label: 'Ze školy / školky', dad: 1, mom: 2, total: 3 });
  assert.deepEqual(result.categories.find(item => item.id === 'activityDriver'), { id: 'activityDriver', label: 'Na kroužek', dad: 1, mom: 1, total: 2 });
});

test('Monday is free, so an obsolete club assignment never inflates statistics', () => {
  const result = calculateStats({ '2026-10-05': { ...emptyRecord(), activityDriver: 'dad' } });
  assert.equal(result.categories.find(item => item.id === 'activityDriver').total, 0);
});

test('weekend activities and parents are counted by half-day', () => {
  const records = {
    '2026-10-10': { ...emptyRecord(), morningActivity: 'Výlet', morningParent: 'dad', afternoonActivity: 'Hřiště', afternoonParent: 'mom' },
  };
  const result = calculateStats(records);
  assert.equal(result.categories.find(item => item.id === 'morningParent').dad, 1);
  assert.equal(result.categories.find(item => item.id === 'afternoonParent').mom, 1);
  assert.deepEqual(result.weekendActivities.map(item => item.activity), ['Výlet', 'Hřiště']);
});

test('selected week excludes records from other dates', () => {
  const records = {
    '2026-10-06': { ...emptyRecord(), to: 'dad' },
    '2026-10-13': { ...emptyRecord(), to: 'mom' },
  };
  const result = calculateStats(records, ['2026-10-06']);
  assert.deepEqual(result.overall, { dad: 1, mom: 0, total: 1 });
});

test('stored data is sanitized before use', () => {
  const state = normalizeState({ records: { '2026-10-06': { to: 'other', from: 'mom', morningActivity: 'x'.repeat(200) }, invalid: { to: 'dad' } } });
  assert.equal(state.records['2026-10-06'].to, '');
  assert.equal(state.records['2026-10-06'].from, 'mom');
  assert.equal(state.records['2026-10-06'].morningActivity.length, 80);
  assert.equal(state.records.invalid, undefined);
});
