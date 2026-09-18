-- CreateTable
CREATE TABLE "SitePage" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "pageGroup" TEXT NOT NULL DEFAULT 'marketing',
    "eyebrow" TEXT,
    "headline" TEXT,
    "subhead" TEXT,
    "body" TEXT,
    "ctaLabel" TEXT,
    "ctaHref" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "isSystem" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SitePage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShopOffer" (
    "id" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "kicker" TEXT,
    "tagline" TEXT,
    "body" TEXT,
    "image" TEXT,
    "digitalPrice" INTEGER,
    "printPrice" INTEGER,
    "digitalUrl" TEXT,
    "printUrl" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShopOffer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SitePage_slug_key" ON "SitePage"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "SitePage_path_key" ON "SitePage"("path");

-- CreateIndex
CREATE INDEX "SitePage_pageGroup_isPublished_idx" ON "SitePage"("pageGroup", "isPublished");

-- CreateIndex
CREATE UNIQUE INDEX "ShopOffer_sku_key" ON "ShopOffer"("sku");

-- CreateIndex
CREATE INDEX "ShopOffer_isPublished_sortOrder_idx" ON "ShopOffer"("isPublished", "sortOrder");
