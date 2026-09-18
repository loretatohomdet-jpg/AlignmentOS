'use strict';

const { test } = require('node:test');
const assert = require('node:assert');
const { wantsResetGuide } = require('../src/services/leadEmail');

test('homepage capture wants the Reset guide', () => {
  assert.strictEqual(wantsResetGuide('home-reset-guide'), true);
  assert.strictEqual(wantsResetGuide('lander'), true);
});

test('other lead sources stay quiet', () => {
  assert.strictEqual(wantsResetGuide('start_lander'), false);
  assert.strictEqual(wantsResetGuide('results-share-invite'), false);
  assert.strictEqual(wantsResetGuide('diagnostic-report'), false);
});
