create table riitag.events
(
    id          int auto_increment
        primary key,
    name        varchar(128)  not null,
    start_time  date          not null,
    end_time    date          not null,
    bonus_coins int default 0 not null,
    constraint events_id_uindex
        unique (id)
);