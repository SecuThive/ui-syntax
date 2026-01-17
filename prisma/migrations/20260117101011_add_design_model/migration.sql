-- CreateTable
CREATE TABLE "Component" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "variant" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Component_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Design" (
    "id" TEXT NOT NULL,
    "componentId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "code" TEXT NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'gemini',
    "status" TEXT NOT NULL DEFAULT 'draft',
    "version" INTEGER NOT NULL DEFAULT 1,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Design_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Component_category_idx" ON "Component"("category");

-- CreateIndex
CREATE INDEX "Component_status_idx" ON "Component"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Component_category_variant_key" ON "Component"("category", "variant");

-- CreateIndex
CREATE INDEX "Design_componentId_idx" ON "Design"("componentId");

-- CreateIndex
CREATE INDEX "Design_status_idx" ON "Design"("status");

-- AddForeignKey
ALTER TABLE "Design" ADD CONSTRAINT "Design_componentId_fkey" FOREIGN KEY ("componentId") REFERENCES "Component"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
