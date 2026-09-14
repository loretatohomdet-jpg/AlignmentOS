'use strict';

const { test } = require('node:test');
const assert = require('node:assert');
const { buildPrompt } = require('../src/services/habitEngine');

test('prompt is empty when no habits', () => {
  const p = buildPrompt([]);
  assert.strictEqual(p.kind, 'empty');
});

test('prompt is begin when nothing held yet', () => {
  const p = buildPrompt([
    { id: 'a', title: 'Morning Structure Anchor', completedLast7: 0, streak: 0, completedToday: false },
  ]);
  assert.strictEqual(p.kind, 'begin');
  assert.match(p.title, /Morning Structure Anchor/);
});

test('prompt is adjust when a habit drifted', () => {
  const p = buildPrompt([
    { id: 'a', title: 'Weak hold', completedLast7: 1, streak: 1, completedToday: false },
    { id: 'b', title: 'Strong hold', completedLast7: 6, streak: 6, completedToday: true },
  ]);
  assert.strictEqual(p.kind, 'adjust');
  assert.strictEqual(p.habitId, 'a');
});

test('prompt is hold when all complete today', () => {
  const p = buildPrompt([
    { id: 'a', title: 'A', completedLast7: 5, streak: 3, completedToday: true },
    { id: 'b', title: 'B', completedLast7: 5, streak: 3, completedToday: true },
  ]);
  assert.strictEqual(p.kind, 'hold');
});
