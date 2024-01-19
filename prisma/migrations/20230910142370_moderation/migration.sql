-- AlterTable
ALTER TABLE `user` ADD COLUMN IF NOT EXISTS `isBanned` boolean NOT NULL DEFAULT false;
ALTER TABLE `user` ADD COLUMN IF NOT EXISTS `isPublic` boolean NOT NULL DEFAULT true;
ALTER TABLE `user` ADD COLUMN IF NOT EXISTS `publicOverride` boolean NULL;

create table if not exists riitag.moderation_log
(
    id         int auto_increment
        primary key,
    user_id    int(11)                          not null,
    reason     varchar(255)                         not null,
    action_time datetime default current_timestamp() not null
);

create table if not exists riitag.banned_user
(
    id         int auto_increment
        primary key,
    user_id    int(11)                          not null,
    ip_address varchar(64)                          not null,
    reason     varchar(255)                         not null,
    action_time datetime default current_timestamp() not null
);

