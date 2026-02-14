-- DropIndex
DROP INDEX "bookings_tutorId_idx";

-- CreateIndex
CREATE INDEX "bookings_tutorId_date_idx" ON "bookings"("tutorId", "date");
