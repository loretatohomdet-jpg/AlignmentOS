'use strict';

const { test } = require('node:test');
const assert = require('node:assert');
const { updateProfileSchema } = require('../src/validation/profileSchemas');

test('profile: accepts https image URL', () => {
  const r = updateProfileSchema.parse({ avatarUrl: 'https://example.com/a.jpg' });
  assert.strictEqual(r.avatarUrl, 'https://example.com/a.jpg');
});

test('profile: empty avatar becomes null', () => {
  const r = updateProfileSchema.parse({ avatarUrl: '' });
  assert.strictEqual(r.avatarUrl, null);
});

test('profile: accepts small data URL prefix', () => {
  const tiny = 'data:image/png;base64,iVBORw0KGgo=';
  const r = updateProfileSchema.parse({ avatarUrl: tiny });
  assert.strictEqual(r.avatarUrl, tiny);
});

test('profile: accepts habit nudge prefs', () => {
  const r = updateProfileSchema.parse({ habitNudgeEnabled: false, habitNudgeHour: 7 });
  assert.strictEqual(r.habitNudgeEnabled, false);
  assert.strictEqual(r.habitNudgeHour, 7);
});

test('profile: rejects invalid nudge hour', () => {
  assert.throws(() => updateProfileSchema.parse({ habitNudgeHour: 24 }));
});
