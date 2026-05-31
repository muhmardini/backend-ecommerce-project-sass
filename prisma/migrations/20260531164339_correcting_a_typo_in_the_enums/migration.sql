/*
  Warnings:

  - The values [HomsAndLiving] on the enum `Categories` will be removed. If these variants are still used in the database, this will fail.
  - The values [hided] on the enum `ProductStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Categories_new" AS ENUM ('Electronics', 'Fashion', 'HomeAndLiving', 'BeautyAndPersonalCare', 'SportsAndOutdoors', 'Automotive', 'BooksAndMedia', 'ToysAndGames', 'GroceriesAndFood', 'HealthAndWellness', 'PetSupplies', 'OfficeAndStationary');
ALTER TABLE "productCategories" ALTER COLUMN "category" TYPE "Categories_new" USING ("category"::text::"Categories_new");
ALTER TYPE "Categories" RENAME TO "Categories_old";
ALTER TYPE "Categories_new" RENAME TO "Categories";
DROP TYPE "public"."Categories_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "ProductStatus_new" AS ENUM ('available', 'sold', 'outOfStock', 'hidden');
ALTER TABLE "public"."products" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "products" ALTER COLUMN "status" TYPE "ProductStatus_new" USING ("status"::text::"ProductStatus_new");
ALTER TYPE "ProductStatus" RENAME TO "ProductStatus_old";
ALTER TYPE "ProductStatus_new" RENAME TO "ProductStatus";
DROP TYPE "public"."ProductStatus_old";
ALTER TABLE "products" ALTER COLUMN "status" SET DEFAULT 'available';
COMMIT;
