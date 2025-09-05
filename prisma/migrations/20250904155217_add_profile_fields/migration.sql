-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "address" TEXT,
ADD COLUMN     "bio" TEXT,
ADD COLUMN     "dateOfBirth" TIMESTAMP(3),
ADD COLUMN     "major" TEXT,
ADD COLUMN     "studentId" TEXT,
ADD COLUMN     "year" TEXT;
