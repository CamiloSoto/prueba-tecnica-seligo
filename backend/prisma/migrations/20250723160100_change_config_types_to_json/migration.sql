/*
  Warnings:

  - Changed the type of `alertThresholds` on the `Configuration` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `notificationSettings` on the `Configuration` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Configuration" DROP COLUMN "alertThresholds",
ADD COLUMN     "alertThresholds" JSONB NOT NULL,
DROP COLUMN "notificationSettings",
ADD COLUMN     "notificationSettings" JSONB NOT NULL;
