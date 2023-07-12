import glob
import json
import os
import sqlite3

keys = {}

conn = sqlite3.connect("users.db")

cur = conn.cursor()
cur.execute("SELECT * FROM users")

rows = cur.fetchall()

for row in rows:
    keys[row[1]] = row[2]

i = 1

for f in sorted(glob.glob("./var/www/rc24/tag.rc24.xyz/public_html/data/users/*.json")):
    if os.path.getsize(f) != 0:
        data = json.loads(open(f, "r").read())

        id = f.replace(
            "./var/www/rc24/tag.rc24.xyz/public_html/data/users/", ""
        ).replace(".json", "")

        try:
            if '"' in data["name"]:
                name = "'" + data["name"][:50] + "'"
            else:
                name = '"' + data["name"][:50] + '"'
        except:
            name = ""

        try:
            avatar = (
                "https://cdn.discordapp.com/avatars/"
                + id
                + "/"
                + data["avatar"]
                + ".png?size=4096"
            )
        except:
            avatar = ""

        try:
            randkey = keys[id]
        except:
            randkey = str(i)

        coins = str(data["coins"])

        try:
            cover_region = data["coverregion"]
        except:
            cover_region = "EN"

        try:
            cover_type = data["covertype"]
        except:
            cover_type = "cover3D"

        try:
            if '"' in data["friend_code"]:
                comment = "'" + data["friend_code"][:50] + "'"
            else:
                comment = '"' + data["friend_code"][:50] + '"'
        except:
            comment = ""

        try:
            overlay = data["overlay"].replace(".json", "")
        except:
            overlay = ""

        try:
            background = data["bg"].split("/")[2]
        except:
            background = ""

        try:
            flag = data["region"]
        except:
            flag = ""

        try:
            coin = data["coin"]
        except:
            coin = "mario"

        try:
            font = data["font"]
        except:
            font = "default"

        try:
            if data["useavatar"] == "true":
                show_avatar = "1"
            elif data["useavatar"] == "false":
                show_avatar = "0"
        except:
            show_avatar = "0"

        try:
            if data["usemii"] == "true":
                show_mii = "1"
            elif data["usemii"] == "false":
                show_mii = "0"
        except:
            show_mii = "0"

        try:
            if (
                data["mii_data"] == "a"
                or data["mii_data"] == "b"
                or data["mii_data"] == "c"
                or data["mii_data"] == "d"
                or data["mii_data"] == "e"
                or data["mii_data"] == "f"
            ):
                mii_type = "guest"
            elif data["mii_number"] != "":
                mii_type = "cmoc"
            elif data["mii_data"] != "" and data["mii_number"] == "":
                mii_type = "upload"
        except:
            mii_type = "guest"

        try:
            if data["mii_data"] != "undefined":
                mii_data = data["mii_data"].split(",")[0]
            else:
                mii_data = ""
        except:
            mii_data = ""

        try:
            cmoc_entry_no = (
                data["mii_number"]
                .replace(" ", "")
                .replace("-", "")
                .replace("\\", "")[:12]
            )
        except:
            cmoc_entry_no = ""

        created_at = "2022-08-05 00:00:00.000"
        updated_at = "2022-08-05 00:00:00.000"

        with open("user.csv", "a") as f:
            f.write(
                str(i)
                + ","
                + id
                + ","
                + "user"
                + ","
                + name
                + ","
                + avatar
                + ","
                + randkey
                + ","
                + coins
                + ","
                + cover_region
                + ","
                + cover_type
                + ","
                + comment
                + ","
                + overlay
                + ","
                + background
                + ","
                + flag
                + ","
                + coin
                + ","
                + font
                + ","
                + show_avatar
                + ","
                + show_mii
                + ","
                + mii_type
                + ","
                + mii_data
                + ","
                + cmoc_entry_no
                + ","
                + created_at
                + ","
                + updated_at
                + "\n"
            )

        i += 1

keys = {}

conn = sqlite3.connect("games.db")

cur = conn.cursor()
cur.execute("SELECT * FROM games")

rows = cur.fetchall()

for row in rows:
    if row[2] != "":
        keys[row[2]] = [row[1], row[3]]

i = 1

games_db = {}

for k in keys:
    game_id = k.replace("\\", "")

    if keys[k][0] == 0:
        console = "wii"
    elif keys[k][0] == 1:
        console = "wiiu"
    elif keys[k][0] == 2:
        console = "3ds"

    playcount = keys[k][1]

    first_played = "2022-08-05 00:00:00.000"
    last_played = "2022-08-05 00:00:00.000"

    if (
        game_id + "-" + console not in games_db.keys()
        or int(games_db[game_id + "-" + console].split(",")[4]) < playcount
    ):
        games_db[game_id + "-" + console] = (
            str(i)
            + ","
            + game_id
            + ","
            + console
            + ","
            + ","
            + str(playcount)
            + ","
            + first_played
            + ","
            + last_played
            + "\n"
        )

    i += 1

for v in games_db.values():
    with open("game.csv", "a") as f:
        f.write(v)

i = 1
j = 1

for f in sorted(glob.glob("./var/www/rc24/tag.rc24.xyz/public_html/data/users/*.json")):
    k = 0
    if os.path.getsize(f) != 0:
        data = json.loads(open(f, "r").read())

        user_id = i

        for game in reversed(data["games"]):
            if game != "":
                playlog_id = j

                try:
                    game_pk = (
                        list(keys).index(
                            game.replace("wii-", "")
                            .replace("wiiu-", "")
                            .replace("3ds-", "")
                        )
                        + 1
                    )
                except:
                    continue

                played_on = "2022-08-05 00:00:00." + str(k).zfill(3)

                with open("playlog.csv", "a") as f:
                    f.write(
                        str(playlog_id)
                        + ","
                        + str(user_id)
                        + ","
                        + str(game_pk)
                        + ","
                        + played_on
                        + "\n"
                    )

                j += 1
                k += 1

        i += 1

i = 1

for f in sorted(glob.glob("./var/www/rc24/tag.rc24.xyz/public_html/data/users/*.json")):
    if os.path.getsize(f) != 0:
        id_ = str(i)

        user_id = str(i)

        provider_id = "discord"

        provider_account_id = f.replace(
            "./var/www/rc24/tag.rc24.xyz/public_html/data/users/", ""
        ).replace(".json", "")

        created_at = "2022-08-05 00:00:00.000"

        updated_at = "2022-08-05 00:00:00.000"

        with open("account.csv", "a") as f:
            f.write(
                id_
                + ","
                + user_id
                + ","
                + provider_id
                + ","
                + provider_account_id
                + ","
                + created_at
                + ","
                + updated_at
                + "\n"
            )

        i += 1
