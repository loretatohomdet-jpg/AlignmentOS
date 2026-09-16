'use strict';

const { test } = require('node:test');
const assert = require('node:assert');
const {
  domainScoresToDisplayPct,
  buildAssessmentReportHtml,
} = require('../src/services/assessmentReportEmail');

test('raw domain sums 4–20 map to display percent', () => {
  const raw = {
    IDENTITY: 12,
    PURPOSE: 8,
    MINDSET: 16,
    HABITS: 4,
    ENVIRONMENT: 20,
    EXECUTION: 10,
  };
  assert.strictEqual(domainScoresToDisplayPct(raw, 'HABITS'), 0);
  assert.strictEqual(domainScoresToDisplayPct(raw, 'ENVIRONMENT'), 100);
  assert.strictEqual(domainScoresToDisplayPct(raw, 'IDENTITY'), 50);
});

test('report html includes score, strain, and domains', () => {
  const html = buildAssessmentReportHtml({
    score: 62,
    label: 'Moderate alignment',
    alignmentTypeTitle: 'The Developing Person',
    alignmentTypeSubtitle: 'Multiple domains in active formation.',
    primaryStrainLabel: 'Habits',
    primaryStrainDescription: 'Your primary structural gap — where habit installation begins.',
    pillarScores: {
      IDENTITY: 70,
      PURPOSE: 68,
      MINDSET: 65,
      HABITS: 48,
      ENVIRONMENT: 72,
      EXECUTION: 66,
    },
  });
  assert.match(html, /62/);
  assert.match(html, /The Developing Person/);
  assert.match(html, /Habits/);
  assert.match(html, /48%/);
  assert.match(html, /See pricing/);
  assert.match(html, /\/pricing/);
  assert.match(html, /Habit Engine/);
  assert.match(html, /Journey to Purpose/);
  assert.doesNotMatch(html, /\$12/);
  assert.doesNotMatch(html, /\$297/);
  assert.doesNotMatch(html, /Alignment Reset/i);
  assert.doesNotMatch(html, /<script/i);
});
