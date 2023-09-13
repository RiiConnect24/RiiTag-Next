-- AlterTable
alter table banned_user
    add constraint banned_user_user_id_fk
        foreign key (user_id) references user (id)
            on delete cascade;

alter table game_sessions
    modify user_id int not null;

alter table game_sessions
    add constraint game_sessions_user_id_fk
        foreign key (user_id) references user (id)
            on delete cascade;

alter table riitag.game_sessions
    modify game_id int unsigned not null;

alter table game_sessions
    add constraint game_sessions_game_game_pk_fk
        foreign key (game_id) references game (game_pk);

