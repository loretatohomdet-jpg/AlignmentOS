'use strict';

const { test } = require('node:test');
const assert = require('node:assert');
const { DOMAIN_INSIGHTS, applyDomainInsight } = require('../src/services/domainInsight');

test('each domain names a thin place, a reason, and one practice', () => {
  for (const [domain, copy] of Object.entries(DOMAIN_INSIGHTS)) {
    assert.ok(copy.thin.includes(copy.label), domain);
    assert.ok(copy.why.length > 40, domain);
    assert.ok(copy.practiceTitle.length > 3, domain);
    assert.ok(copy.practiceDescription.length > 10, domain);
  }
});

test('applyDomainInsight replaces the shared strain sentence with the domain practice', () => {
  const report = applyDomainInsight(
    {
      score: 62,
      primaryDomain: 'HABITS',
      primaryStrainDescription: 'shared',
    },
    null
  );
  assert.match(report.primaryStrainDescription, /Habits are the thin place/);
  assert.strictEqual(report.insight.practice.title, 'Morning Structure Anchor');
  assert.match(report.insight.why, /morning/);
});

test('an assigned practice title wins over the catalog default', () => {
  const report = applyDomainInsight(
    { primaryDomain: 'IDENTITY' },
    { id: 'ah_1', title: 'Morning Identity Anchor', description: 'Name who you are becoming.' }
  );
  assert.strictEqual(report.insight.practice.id, 'ah_1');
  assert.strictEqual(report.insight.practice.description, 'Name who you are becoming.');
});
