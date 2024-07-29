/*
  Warnings:

  - You are about to drop the column `isbanned` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `ispublic` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `publicoverride` on the `user` table. All the data in the column will be lost.
  - You are about to drop the `account` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "account" DROP CONSTRAINT "account_user_id_fkey";

-- AlterTable
ALTER TABLE "user" DROP COLUMN "isbanned",
DROP COLUMN "ispublic",
DROP COLUMN "publicoverride",
ADD COLUMN     "isBanned" SMALLINT NOT NULL DEFAULT 0,
ADD COLUMN     "isPublic" SMALLINT NOT NULL DEFAULT 1,
ADD COLUMN     "publicOverride" SMALLINT,
ALTER COLUMN "comment" DROP NOT NULL;

-- DropTable
DROP TABLE "account";

-- CreateTable
CREATE TABLE "accounts" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "provider_id" VARCHAR(255) NOT NULL,
    "provider_account_id" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "fk_accounts_users" ON "accounts"("user_id");

-- CreateIndex
CREATE INDEX "provider_account_id" ON "accounts"("provider_account_id");

-- CreateIndex
CREATE INDEX "provider_id" ON "accounts"("provider_id");

-- CreateIndex
CREATE UNIQUE INDEX "account_provider_id_provider_account_id_key" ON "accounts"("provider_id", "provider_account_id");

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "account_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
