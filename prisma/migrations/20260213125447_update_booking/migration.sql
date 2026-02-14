/*
  Warnings:

  - You are about to drop the column `endDateTime` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `startDateTime` on the `bookings` table. All the data in the column will be lost.
  - Added the required column `endTime` to the `bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTime` to the `bookings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "bookings" DROP COLUMN "endDateTime",
DROP COLUMN "startDateTime",
ADD COLUMN     "endTime" TEXT NOT NULL,
ADD COLUMN     "startTime" TEXT NOT NULL;
