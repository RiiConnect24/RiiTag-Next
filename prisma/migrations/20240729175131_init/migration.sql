-- CreateTable
CREATE TABLE "account" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "provider_id" VARCHAR(255) NOT NULL,
    "provider_account_id" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "banned_user" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "ip_address" VARCHAR(64) NOT NULL,
    "reason" VARCHAR(255) NOT NULL,
    "action_time" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "banned_user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(128) NOT NULL,
    "start_time" DATE NOT NULL,
    "end_time" DATE NOT NULL,
    "bonus_coins" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "events_id_uindex" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "game" (
    "game_pk" SERIAL NOT NULL,
    "game_id" TEXT NOT NULL,
    "console" VARCHAR(9) NOT NULL,
    "name" VARCHAR(255),
    "play_count" INTEGER NOT NULL DEFAULT 1,
    "play_time" INTEGER NOT NULL DEFAULT 0,
    "first_played" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    "last_played" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    CONSTRAINT "game_pkey" PRIMARY KEY ("game_pk")
);

-- CreateTable
CREATE TABLE "game_sessions" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "game_id" INTEGER NOT NULL,
    "start_time" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "game_sessions_id_uindex" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "moderation_log" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "reason" VARCHAR(255) NOT NULL,
    "action_time" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "moderation_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "playlog" (
    "playlog_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "game_pk" INTEGER NOT NULL,
    "played_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    "play_time" INTEGER,
    "play_count" INTEGER DEFAULT 0,

    CONSTRAINT "playlog_pkey" PRIMARY KEY ("playlog_id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" SERIAL NOT NULL,
    "user_id" VARCHAR(32) NOT NULL,
    "token" VARCHAR(120) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "device" TEXT,
    "ip_address" VARCHAR(15) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sys" (
    "key" VARCHAR(50) NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "sys_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "role" VARCHAR(25) NOT NULL DEFAULT 'user',
    "display_name" VARCHAR(255),
    "image" VARCHAR(255),
    "randkey" VARCHAR(200),
    "coins" INTEGER NOT NULL DEFAULT 0,
    "cover_region" VARCHAR(6) NOT NULL DEFAULT 'EN',
    "cover_type" VARCHAR(10) NOT NULL DEFAULT 'cover3D',
    "comment" VARCHAR(50) NOT NULL,
    "overlay" VARCHAR(20) NOT NULL DEFAULT 'overlay1',
    "background" VARCHAR(120) NOT NULL DEFAULT 'wii6.png',
    "flag" VARCHAR(20) NOT NULL DEFAULT 'rc24',
    "coin" VARCHAR(20) NOT NULL DEFAULT 'mario',
    "font" VARCHAR(50) NOT NULL DEFAULT 'default',
    "show_avatar" SMALLINT NOT NULL DEFAULT 0,
    "show_mii" SMALLINT NOT NULL DEFAULT 0,
    "mii_type" VARCHAR(10) NOT NULL DEFAULT 'guest',
    "mii_data" VARCHAR(8192),
    "cmoc_entry_no" VARCHAR(12),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    "badge" VARCHAR(50),
    "isbanned" SMALLINT NOT NULL DEFAULT 0,
    "ispublic" SMALLINT NOT NULL DEFAULT 1,
    "publicoverride" SMALLINT,
    "language" VARCHAR(11) NOT NULL DEFAULT 'en',

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "fk_accounts_users" ON "account"("user_id");

-- CreateIndex
CREATE INDEX "provider_account_id" ON "account"("provider_account_id");

-- CreateIndex
CREATE INDEX "provider_id" ON "account"("provider_id");

-- CreateIndex
CREATE UNIQUE INDEX "account_provider_id_provider_account_id_key" ON "account"("provider_id", "provider_account_id");

-- CreateIndex
CREATE INDEX "console" ON "game"("console");

-- CreateIndex
CREATE INDEX "game_id" ON "game"("game_id");

-- CreateIndex
CREATE INDEX "playcount" ON "game"("play_count");

-- CreateIndex
CREATE UNIQUE INDEX "game_id_console" ON "game"("game_id", "console");

-- CreateIndex
CREATE INDEX "game_pk" ON "playlog"("game_pk");

-- CreateIndex
CREATE INDEX "played_on" ON "playlog"("played_on");

-- CreateIndex
CREATE INDEX "user_id" ON "playlog"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");

-- CreateIndex
CREATE UNIQUE INDEX "user_randkey_key" ON "user"("randkey");

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "banned_user" ADD CONSTRAINT "banned_user_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "game_sessions" ADD CONSTRAINT "game_sessions_game_game_pk_fk" FOREIGN KEY ("game_id") REFERENCES "game"("game_pk") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "game_sessions" ADD CONSTRAINT "game_sessions_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "playlog" ADD CONSTRAINT "fk_playlog_game" FOREIGN KEY ("game_pk") REFERENCES "game"("game_pk") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "playlog" ADD CONSTRAINT "fk_playlog_user" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
