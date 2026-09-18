'use strict';

const { test } = require('node:test');
const assert = require('node:assert');
const { buildPaidWelcomeHtml } = require('../src/services/paidWelcomeEmail');

test('paid welcome is Alignment OS, not Kit’s Reset-guide confirmation', () => {
  const html = buildPaidWelcomeHtml({ firstName: 'Loreta' });
  assert.match(html, /You're in/);
  assert.match(html, /Hello Loreta/);
  assert.match(html, /Open Practice/);
  assert.match(html, /\/practice/);
  assert.match(html, /\/dashboard/);
  assert.match(html, /Alignment OS/);
  assert.doesNotMatch(html, /confirm your subscription/i);
  assert.doesNotMatch(html, /Alignment Reset/i);
  assert.doesNotMatch(html, /Bloom &amp; Vine/i);
  assert.doesNotMatch(html, /ConvertKit/i);
  assert.doesNotMatch(html, /\$12/);
  assert.doesNotMatch(html, /<script/i);
});
