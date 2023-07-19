-- AlterTable
ALTER TABLE `playlog` ADD COLUMN `play_count` int NULL DEFAULT 0;

create table riitag.game_sessions
(
    id         int auto_increment
        primary key,
    user_id    varchar(64)                          not null,
    game_pk    varchar(12)                          not null,
    start_time datetime default current_timestamp() not null,
    constraint game_sessions_id_uindex
        unique (id)
);

