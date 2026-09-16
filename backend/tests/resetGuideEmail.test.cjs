'use strict';

const { test } = require('node:test');
const assert = require('node:assert');
const { buildResetGuideHtml } = require('../src/services/resetGuideEmail');

test('reset guide html is the guide, not a Kit confirmation', () => {
  const html = buildResetGuideHtml();
  assert.match(html, /The Alignment Reset/);
  assert.match(html, /Six domains/);
  assert.match(html, /Hold the day/);
  assert.match(html, /\/assessment/);
  assert.match(html, /\/reset-guide/);
  assert.match(html, /Begin the free diagnostic/);
  assert.doesNotMatch(html, /confirm your subscription/i);
  assert.doesNotMatch(html, /\$12/);
  assert.doesNotMatch(html, /<script/i);
});
