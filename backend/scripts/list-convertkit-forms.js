#!/usr/bin/env node
/**
 * List all Kit/ConvertKit forms and their IDs.
 *
 * Usage (from backend/):
 *   CONVERTKIT_API_KEY=your_key node scripts/list-convertkit-forms.js
 *
 * Or add CONVERTKIT_API_KEY to .env and run:
 *   node scripts/list-convertkit-forms.js
 */
require('dotenv').config();

const apiKey = process.env.CONVERTKIT_API_KEY;
if (!apiKey) {
  console.error('Set CONVERTKIT_API_KEY in .env or pass it in the environment.');
  process.exit(1);
}

async function main() {
  const url = `https://api.convertkit.com/v3/forms?api_key=${encodeURIComponent(apiKey)}`;
  const res = await fetch(url);
  const text = await res.text();
  if (!res.ok) {
    console.error(`Kit API error ${res.status}:`, text.slice(0, 300));
    process.exit(1);
  }
  const data = JSON.parse(text);
  const forms = data.forms || [];
  if (forms.length === 0) {
    console.log('No forms found. Create one in Kit → Grow → Forms (not landing page only).');
    process.exit(0);
  }
  console.log('\nUse one of these as CONVERTKIT_FORM_ID in Railway:\n');
  for (const f of forms) {
    console.log(`  ID: ${f.id}`);
    console.log(`  Name: ${f.name || '(unnamed)'}`);
    console.log(`  URL: ${f.url || '—'}`);
    console.log('');
  }
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
