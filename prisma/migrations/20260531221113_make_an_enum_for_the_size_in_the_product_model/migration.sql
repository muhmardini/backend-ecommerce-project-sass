/*
  Warnings:

  - The `size` column on the `products` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Size" AS ENUM ('Small', 'Medium', 'Large', 'XL', 'XXL');

-- AlterTable
ALTER TABLE "products" DROP COLUMN "size",
ADD COLUMN     "size" "Size";
