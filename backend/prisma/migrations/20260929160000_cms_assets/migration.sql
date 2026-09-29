-- Admin-uploaded CMS images
CREATE TABLE IF NOT EXISTS "CmsAsset" (
    "id" TEXT NOT NULL,
    "mime" TEXT NOT NULL,
    "bytes" BYTEA NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CmsAsset_pkey" PRIMARY KEY ("id")
);
