const { ZodError } = require('zod');
const { prisma } = require('../prismaClient');
const { SITE_PAGES, SHOP_OFFERS } = require('../data/sitePages');
const {
  adminCreateLeadSchema,
  adminUpdateLeadSchema,
  adminCreatePageSchema,
  adminUpdatePageSchema,
  adminCreateShopSchema,
  adminUpdateShopSchema,
  adminCreateHabitSchema,
  adminUpdateHabitSchema,
} = require('../validation/adminSchemas');

function slugify(value) {
  const slug = String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
  return slug || 'page';
}

function normalizePath(path) {
  const raw = String(path || '').trim();
  if (!raw || raw === '/') return '/';
  const parts = raw
    .replace(/^\/+/, '')
    .split('/')
    .map((seg) => slugify(seg))
    .filter(Boolean);
  return parts.length ? `/${parts.join('/')}` : '/';
}

function wasNeverEdited(row) {
  if (!row?.createdAt || !row?.updatedAt) return true;
  return Math.abs(new Date(row.updatedAt) - new Date(row.createdAt)) < 2500;
}

function presentPage(page) {
  if (!page?.isSystem || !wasNeverEdited(page)) return page;
  const seed = SITE_PAGES.find((item) => item.slug === page.slug || item.path === page.path);
  if (!seed) return page;
  return {
    ...page,
    title: seed.title || page.title,
    eyebrow: seed.eyebrow ?? page.eyebrow,
    headline: seed.headline ?? page.headline,
    subhead: seed.subhead ?? page.subhead,
    body: seed.body ?? page.body,
    ctaLabel: seed.ctaLabel ?? page.ctaLabel,
    ctaHref: seed.ctaHref ?? page.ctaHref,
  };
}

function prismaFail(err, res) {
  if (err.code === 'P2002') {
    return res.status(409).json({ message: 'A page or product already uses that URL or name' });
  }
  if (err.code === 'P2021' || err.code === 'P2022') {
    return res.status(500).json({ message: 'The pages table is missing. Run database migrations, then try again.' });
  }
  return null;
}

async function uniqueSlug(base, excludeId) {
  let slug = slugify(base);
  let n = 2;
  while (true) {
    const existing = await prisma.sitePage.findUnique({ where: { slug } });
    if (!existing || existing.id === excludeId) return slug;
    slug = `${slugify(base).slice(0, 70)}-${n}`;
    n += 1;
  }
}

async function uniqueSku(base, excludeId) {
  let sku = slugify(base);
  let n = 2;
  while (true) {
    const existing = await prisma.shopOffer.findUnique({ where: { sku } });
    if (!existing || existing.id === excludeId) return sku;
    sku = `${slugify(base).slice(0, 70)}-${n}`;
    n += 1;
  }
}

let contentReady = false;

function pageCreateData(page) {
  return {
    ...page,
    eyebrow: page.eyebrow || null,
    headline: page.headline || null,
    subhead: page.subhead || null,
    body: page.body || null,
    ctaLabel: page.ctaLabel || null,
    ctaHref: page.ctaHref || null,
    isPublished: page.isPublished !== false,
    isSystem: page.isSystem !== false,
  };
}

async function ensureContent() {
  if (contentReady) return;
  const [pages, offers] = await Promise.all([
    prisma.sitePage.findMany({ select: { slug: true, path: true } }),
    prisma.shopOffer.findMany({ select: { sku: true } }),
  ]);
  const slugs = new Set(pages.map((row) => row.slug));
  const paths = new Set(pages.map((row) => row.path));
  const missingPages = SITE_PAGES.filter((page) => !slugs.has(page.slug) && !paths.has(page.path)).map(pageCreateData);
  if (missingPages.length) {
    await prisma.sitePage.createMany({ data: missingPages });
  }
  const skus = new Set(offers.map((row) => row.sku));
  const missingOffers = SHOP_OFFERS.filter((offer) => !skus.has(offer.sku)).map((offer) => ({
    ...offer,
    kicker: offer.kicker || null,
    tagline: offer.tagline || null,
    body: offer.body || null,
    image: offer.image || null,
    digitalPrice: offer.digitalPrice ?? null,
    printPrice: offer.printPrice ?? null,
    digitalUrl: offer.digitalUrl || null,
    printUrl: offer.printUrl || null,
    isPublished: offer.isPublished !== false,
    sortOrder: offer.sortOrder ?? 100,
  }));
  if (missingOffers.length) {
    await prisma.shopOffer.createMany({ data: missingOffers });
  }
  contentReady = true;
}

function zodFail(err, res) {
  return res.status(400).json({ message: err.errors[0]?.message || 'Invalid data', errors: err.errors });
}

async function createLead(req, res, next) {
  try {
    const data = adminCreateLeadSchema.parse(req.body);
    const lead = await prisma.lead.create({
      data: { email: data.email.toLowerCase().trim(), source: data.source || 'admin' },
    });
    res.status(201).json(lead);
  } catch (err) {
    if (err instanceof ZodError) return zodFail(err, res);
    next(err);
  }
}

async function updateLead(req, res, next) {
  try {
    const data = adminUpdateLeadSchema.parse(req.body);
    const lead = await prisma.lead.update({
      where: { id: req.params.leadId },
      data: {
        ...(data.email ? { email: data.email.toLowerCase().trim() } : {}),
        ...(data.source !== undefined ? { source: data.source } : {}),
      },
    });
    res.json(lead);
  } catch (err) {
    if (err instanceof ZodError) return zodFail(err, res);
    if (err.code === 'P2025') return res.status(404).json({ message: 'Lead not found' });
    next(err);
  }
}

async function listPages(req, res, next) {
  try {
    await ensureContent();
    const pages = await prisma.sitePage.findMany({ orderBy: [{ pageGroup: 'asc' }, { title: 'asc' }] });
    res.json(pages);
  } catch (err) {
    if (prismaFail(err, res)) return;
    next(err);
  }
}

async function getPage(req, res, next) {
  try {
    const page = await prisma.sitePage.findUnique({ where: { id: req.params.pageId } });
    if (!page) return res.status(404).json({ message: 'Page not found' });
    res.json(presentPage(page));
  } catch (err) {
    next(err);
  }
}

async function createPage(req, res, next) {
  try {
    await ensureContent();
    const data = adminCreatePageSchema.parse(req.body);
    const path = normalizePath(data.path || data.title);
    if (path === '/') return res.status(409).json({ message: 'The home page already exists. Edit it instead.' });
    const existingPath = await prisma.sitePage.findUnique({ where: { path } });
    if (existingPath) return res.status(409).json({ message: 'A page already uses that URL' });
    const slug = await uniqueSlug(data.slug || data.title || path);
    const page = await prisma.sitePage.create({
      data: {
        slug,
        path,
        title: data.title,
        pageGroup: data.pageGroup || 'custom',
        eyebrow: data.eyebrow || null,
        headline: data.headline || data.title,
        subhead: data.subhead || null,
        body: data.body || null,
        ctaLabel: data.ctaLabel || null,
        ctaHref: data.ctaHref || null,
        isPublished: data.isPublished !== false,
        isSystem: false,
      },
    });
    res.status(201).json(page);
  } catch (err) {
    if (err instanceof ZodError) return zodFail(err, res);
    if (prismaFail(err, res)) return;
    next(err);
  }
}

async function updatePage(req, res, next) {
  try {
    const data = adminUpdatePageSchema.parse(req.body);
    const existing = await prisma.sitePage.findUnique({ where: { id: req.params.pageId } });
    if (!existing) return res.status(404).json({ message: 'Page not found' });
    const nextPath = data.path && !existing.isSystem ? normalizePath(data.path) : undefined;
    if (existing.isSystem && data.path && normalizePath(data.path) !== existing.path) {
      return res.status(400).json({ message: 'This core page URL cannot be changed. Edit the copy instead.' });
    }
    if (nextPath && nextPath !== existing.path) {
      const clash = await prisma.sitePage.findUnique({ where: { path: nextPath } });
      if (clash) return res.status(409).json({ message: 'A page already uses that URL' });
    }
    const page = await prisma.sitePage.update({
      where: { id: existing.id },
      data: {
        ...(data.title ? { title: data.title } : {}),
        ...(nextPath ? { path: nextPath } : {}),
        ...(data.slug ? { slug: await uniqueSlug(data.slug, existing.id) } : {}),
        ...(data.pageGroup ? { pageGroup: data.pageGroup } : {}),
        ...(data.eyebrow !== undefined ? { eyebrow: data.eyebrow } : {}),
        ...(data.headline !== undefined ? { headline: data.headline } : {}),
        ...(data.subhead !== undefined ? { subhead: data.subhead } : {}),
        ...(data.body !== undefined ? { body: data.body } : {}),
        ...(data.ctaLabel !== undefined ? { ctaLabel: data.ctaLabel } : {}),
        ...(data.ctaHref !== undefined ? { ctaHref: data.ctaHref } : {}),
        ...(data.isPublished !== undefined ? { isPublished: data.isPublished } : {}),
      },
    });
    res.json(page);
  } catch (err) {
    if (err instanceof ZodError) return zodFail(err, res);
    if (prismaFail(err, res)) return;
    next(err);
  }
}

async function deletePage(req, res, next) {
  try {
    const existing = await prisma.sitePage.findUnique({ where: { id: req.params.pageId } });
    if (!existing) return res.status(404).json({ message: 'Page not found' });
    if (existing.path === '/' || existing.isSystem) {
      return res.status(400).json({
        message: 'This is a core page. Unpublish or edit it instead of deleting.',
      });
    }
    await prisma.sitePage.delete({ where: { id: existing.id } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

async function listShop(req, res, next) {
  try {
    await ensureContent();
    const offers = await prisma.shopOffer.findMany({ orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }] });
    res.json(offers);
  } catch (err) {
    next(err);
  }
}

async function getShopOffer(req, res, next) {
  try {
    const offer = await prisma.shopOffer.findUnique({ where: { id: req.params.offerId } });
    if (!offer) return res.status(404).json({ message: 'Offer not found' });
    res.json(offer);
  } catch (err) {
    next(err);
  }
}

async function createShopOffer(req, res, next) {
  try {
    const data = adminCreateShopSchema.parse(req.body);
    const sku = await uniqueSku(data.sku || data.name);
    const offer = await prisma.shopOffer.create({
      data: {
        sku,
        name: data.name,
        path: normalizePath(data.path),
        kicker: data.kicker || null,
        tagline: data.tagline || null,
        body: data.body || null,
        image: data.image || null,
        digitalPrice: data.digitalPrice ?? null,
        printPrice: data.printPrice ?? null,
        digitalUrl: data.digitalUrl || null,
        printUrl: data.printUrl || null,
        isPublished: data.isPublished !== false,
        sortOrder: data.sortOrder ?? 100,
      },
    });
    res.status(201).json(offer);
  } catch (err) {
    if (err instanceof ZodError) return zodFail(err, res);
    next(err);
  }
}

async function updateShopOffer(req, res, next) {
  try {
    const data = adminUpdateShopSchema.parse(req.body);
    const offer = await prisma.shopOffer.update({
      where: { id: req.params.offerId },
      data: {
        ...(data.sku ? { sku: await uniqueSku(data.sku, req.params.offerId) } : {}),
        ...(data.name ? { name: data.name } : {}),
        ...(data.path ? { path: normalizePath(data.path) } : {}),
        ...(data.kicker !== undefined ? { kicker: data.kicker } : {}),
        ...(data.tagline !== undefined ? { tagline: data.tagline } : {}),
        ...(data.body !== undefined ? { body: data.body } : {}),
        ...(data.image !== undefined ? { image: data.image } : {}),
        ...(data.digitalPrice !== undefined ? { digitalPrice: data.digitalPrice } : {}),
        ...(data.printPrice !== undefined ? { printPrice: data.printPrice } : {}),
        ...(data.digitalUrl !== undefined ? { digitalUrl: data.digitalUrl } : {}),
        ...(data.printUrl !== undefined ? { printUrl: data.printUrl } : {}),
        ...(data.isPublished !== undefined ? { isPublished: data.isPublished } : {}),
        ...(data.sortOrder !== undefined ? { sortOrder: data.sortOrder } : {}),
      },
    });
    res.json(offer);
  } catch (err) {
    if (err instanceof ZodError) return zodFail(err, res);
    if (err.code === 'P2025') return res.status(404).json({ message: 'Offer not found' });
    next(err);
  }
}

async function deleteShopOffer(req, res, next) {
  try {
    await prisma.shopOffer.delete({ where: { id: req.params.offerId } });
    res.status(204).send();
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ message: 'Offer not found' });
    next(err);
  }
}

async function listHabits(req, res, next) {
  try {
    const habits = await prisma.habit.findMany({
      orderBy: [{ pillar: 'asc' }, { level: 'asc' }, { title: 'asc' }],
      include: { _count: { select: { activeHabits: true } } },
    });
    res.json(habits);
  } catch (err) {
    next(err);
  }
}

async function createHabit(req, res, next) {
  try {
    const data = adminCreateHabitSchema.parse(req.body);
    const habit = await prisma.habit.create({
      data: {
        title: data.title,
        description: data.description || null,
        level: data.level || 1,
        pillar: data.pillar,
        tags: data.tags || [],
      },
    });
    res.status(201).json(habit);
  } catch (err) {
    if (err instanceof ZodError) return zodFail(err, res);
    next(err);
  }
}

async function updateHabit(req, res, next) {
  try {
    const data = adminUpdateHabitSchema.parse(req.body);
    const habit = await prisma.habit.update({
      where: { id: req.params.habitId },
      data,
    });
    res.json(habit);
  } catch (err) {
    if (err instanceof ZodError) return zodFail(err, res);
    if (err.code === 'P2025') return res.status(404).json({ message: 'Habit not found' });
    next(err);
  }
}

async function deleteHabit(req, res, next) {
  try {
    const assigned = await prisma.activeHabit.count({ where: { habitId: req.params.habitId } });
    if (assigned > 0) {
      return res.status(400).json({ message: 'This habit is assigned to people. Remove those assignments first, or edit it instead.' });
    }
    await prisma.habit.delete({ where: { id: req.params.habitId } });
    res.status(204).send();
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ message: 'Habit not found' });
    next(err);
  }
}

async function getPublicPageByPath(req, res, next) {
  try {
    await ensureContent();
    const path = normalizePath(req.query.path);
    const page = await prisma.sitePage.findUnique({ where: { path } });
    if (!page || !page.isPublished) return res.status(404).json({ message: 'Page not found' });
    res.json(page);
  } catch (err) {
    next(err);
  }
}

async function listPublicShop(req, res, next) {
  try {
    await ensureContent();
    const offers = await prisma.shopOffer.findMany({
      where: { isPublished: true },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    });
    res.json(offers);
  } catch (err) {
    next(err);
  }
}

async function getPublicShopByPath(req, res, next) {
  try {
    await ensureContent();
    const path = normalizePath(req.query.path);
    const offer = await prisma.shopOffer.findFirst({
      where: { path, isPublished: true },
      orderBy: { sortOrder: 'asc' },
    });
    if (!offer) return res.status(404).json({ message: 'Offer not found' });
    res.json(offer);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  ensureContent,
  createLead,
  updateLead,
  listPages,
  getPage,
  createPage,
  updatePage,
  deletePage,
  listShop,
  getShopOffer,
  createShopOffer,
  updateShopOffer,
  deleteShopOffer,
  listHabits,
  createHabit,
  updateHabit,
  deleteHabit,
  getPublicPageByPath,
  listPublicShop,
  getPublicShopByPath,
};
