/*
  Warnings:

  - A unique constraint covering the columns `[order,parentId,lastModified,deletedAt]` on the table `Achievement` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Achievement_order_parentId_lastModified_key";

-- CreateIndex
CREATE UNIQUE INDEX "Achievement_order_parentId_lastModified_deletedAt_key" ON "Achievement"("order", "parentId", "lastModified", "deletedAt");
