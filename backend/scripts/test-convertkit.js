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
  console.error('Missing CONVERTKIT_API_KEY in .env');
  process.exit(1);
}

subscribeLead(email, 'test-script')
  .then((ok) => {
    if (ok) {
      console.log(`OK — ${email} added to the Kit list (no form email).`);
      process.exit(0);
    }
    console.error('ConvertKit returned false — check CONVERTKIT_API_KEY.');
    process.exit(1);
  })
  .catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
