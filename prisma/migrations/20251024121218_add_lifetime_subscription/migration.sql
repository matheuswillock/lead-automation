-- AlterEnum
ALTER TYPE "SubscriptionStatus" ADD VALUE 'LIFETIME';

-- AlterTable
ALTER TABLE "subscriptions" ADD COLUMN     "isLifetime" BOOLEAN NOT NULL DEFAULT false;
