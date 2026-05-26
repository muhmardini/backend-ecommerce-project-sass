/*
  Warnings:

  - You are about to drop the column `verified` on the `business` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "business" DROP COLUMN "verified";

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false;
