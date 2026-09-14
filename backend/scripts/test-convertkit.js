#!/usr/bin/env node
/**
 * Quick ConvertKit check. Usage (from backend/):
 *   node scripts/test-convertkit.js you@example.com
 */
require('dotenv').config();
const { subscribeLead, isConfigured } = require('../src/services/convertkit');

const email = process.argv[2];
if (!email) {
  console.error('Usage: node scripts/test-convertkit.js you@example.com');
  process.exit(1);
}

if (!isConfigured()) {
  console.error('Missing CONVERTKIT_API_KEY or CONVERTKIT_FORM_ID in .env');
  process.exit(1);
}

subscribeLead(email, 'test-script')
  .then((ok) => {
    if (ok) {
      console.log(`OK — ${email} sent to ConvertKit form ${process.env.CONVERTKIT_FORM_ID}`);
      process.exit(0);
    }
    console.error('ConvertKit returned false — check API key, form ID, and that the form is published.');
    process.exit(1);
  })
  .catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
