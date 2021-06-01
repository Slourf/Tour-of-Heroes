import os
import psycopg2
import binascii


image_dir = 'lol-image/'

sql_fetch_heroes = """
SELECT
  heroes.id, heroes.name, heroes.description, heroes_image.data AS image, heroes_logo.data AS logo
FROM heroes
JOIN heroes_image
  ON heroes.image = heroes_image.image_path
JOIN heroes_logo
  ON heroes.logo = heroes_logo.logo_path;
"""


def database_connect():
    return psycopg2.connect(
        user="toh",
        password="Poussin1!",
        host="tour-of-heroes.cmyuy62axot9.eu-west-3.rds.amazonaws.com",
        database="tour-of-heroes",
        port=5432)


def write_description(cur, dir, name, data):
    f = open(dir + "/" + name.lower() + "-description.txt", "w")
    f.write(data)
    f.close()


def write_file(cur, dir, name, data, field):
    f = open(dir + "/" + name.lower() + "-" + field + ".jpg", "bw")
    f.write(data)
    f.close()
    pass


def fetch_heroes():
    conn = database_connect()
    cur = conn.cursor()

    cur.execute(sql_fetch_heroes)
    conn.commit()
    heroes = cur.fetchall()

    try:
        os.makedirs(image_dir)
    except FileExistsError:
        pass

    for hero in heroes:
        hero_dir = image_dir + hero[1]
        try:
            os.makedirs(hero_dir)
        except FileExistsError:
            pass
        write_description(cur, hero_dir, hero[1], hero[2])
        write_file(cur, hero_dir, hero[1], hero[3], "image")
        write_file(cur, hero_dir, hero[1], hero[4], "logo")

    cur.close()
    conn.close()


def main():
    fetch_heroes()


if __name__ == "__main__":
    main()
