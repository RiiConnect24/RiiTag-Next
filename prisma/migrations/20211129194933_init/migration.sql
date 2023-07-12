-- CreateTable
CREATE TABLE `account` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `provider_id` VARCHAR(255) NOT NULL,
    `provider_account_id` VARCHAR(255) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `FK_accounts_users`(`user_id`),
    INDEX `provider_account_id`(`provider_account_id`),
    INDEX `provider_id`(`provider_id`),
    UNIQUE INDEX `account_provider_id_provider_account_id_key`(`provider_id`, `provider_account_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `game` (
    `game_pk` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `game_id` VARCHAR(50) NOT NULL,
    `console` VARCHAR(9) NOT NULL,
    `name` VARCHAR(255) NULL,
    `playcount` INTEGER UNSIGNED NOT NULL DEFAULT 1,
    `first_played` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `last_played` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `console`(`console`),
    INDEX `game_id`(`game_id`),
    INDEX `playcount`(`playcount`),
    UNIQUE INDEX `game_id_console`(`game_id`, `console`),
    PRIMARY KEY (`game_pk`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `playlog` (
    `playlog_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `game_pk` INTEGER UNSIGNED NOT NULL,
    `played_on` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `game_pk`(`game_pk`),
    INDEX `played_on`(`played_on`),
    INDEX `user_id`(`user_id`),
    PRIMARY KEY (`playlog_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sys` (
    `key` VARCHAR(50) NOT NULL,
    `value` TEXT NOT NULL,

    PRIMARY KEY (`key`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(50) NOT NULL,
    `role` VARCHAR(25) NOT NULL DEFAULT 'user',
    `name_on_riitag` VARCHAR(255) NULL,
    `image` VARCHAR(255) NULL,
    `randkey` VARCHAR(200) NULL,
    `coins` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `cover_region` VARCHAR(6) NOT NULL DEFAULT 'EN',
    `cover_type` VARCHAR(10) NOT NULL DEFAULT 'cover3D',
    `comment` VARCHAR(50) NULL,
    `overlay` VARCHAR(20) NOT NULL DEFAULT 'overlay1',
    `background` VARCHAR(120) NOT NULL DEFAULT 'riiconnect241.png',
    `flag` VARCHAR(20) NOT NULL DEFAULT 'rc24',
    `coin` VARCHAR(20) NOT NULL DEFAULT 'mario',
    `font` VARCHAR(50) NOT NULL DEFAULT 'default',
    `show_avatar` BOOLEAN NOT NULL DEFAULT false,
    `show_mii` BOOLEAN NOT NULL DEFAULT false,
    `mii_type` VARCHAR(10) NOT NULL DEFAULT 'guest',
    `mii_data` VARCHAR(512) NULL,
    `cmoc_entry_no` VARCHAR(12) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `user_username_key`(`username`),
    UNIQUE INDEX `user_randkey_key`(`randkey`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `account` ADD CONSTRAINT `account_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `playlog` ADD CONSTRAINT `FK_playlog_game` FOREIGN KEY (`game_pk`) REFERENCES `game`(`game_pk`) ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `playlog` ADD CONSTRAINT `FK_playlog_user` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
