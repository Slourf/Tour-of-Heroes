#!/usr/bin/python3

import os
import psycopg2
import binascii
from PIL import Image


image_dir = 'lol-image/'

custom_champ_desc = {"malaphite": "malphite",
                     "ialiyah": "taliyah",
                     "graves-cigar": "graves",
                     "xeratth": "xerath",
                     "aurelionsol": "Aurelion Sol",
                     "xinzhao": "Xin Zhao"}


sql_insert_logo = """INSERT INTO heroes_logo
    (fieldname, originalname, encoding, mimetype, destination, filename, logo_path, size, data)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)"""

sql_insert_image = """INSERT INTO heroes_image
    (fieldname, originalname, encoding, mimetype, destination, filename, image_path, size, data)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)"""

sql_hero = """INSERT INTO heroes
    (name, description, image, logo)
    VALUES (%s, %s, %s, %s)"""


def database_connect():
    return psycopg2.connect(
        user="toh",
        password="Poussin1!",
        host="tour-of-heroes.cmyuy62axot9.eu-west-3.rds.amazonaws.com",
        database="tour-of-heroes",
        port=5432)


def fetch_image(hero, image):
    f = open("./lol-image/" + hero + "/" + hero + "-" + image + ".jpg", "rb")
    data = f.read()
    f.close()
    return data


def fetch_description(hero):
    f = open("./lol-image/" + hero + "/" + hero + "-description.txt", "rb")
    data = f.read().decode("utf-8")
    f.close()
    return data


def insert_image(cur, name, data):
    name_hex = binascii.b2a_hex(os.urandom(15)).decode('utf-8')
    print(name_hex)
    size = os.path.getsize("./lol-image/" + name + "/" + name + "-image.jpg")
    filename = "static/heroes/" + name_hex

    cur.execute(sql_insert_image,
                ("image",
                name + "-image.jpg",
                "7bit",
                "image/jpeg",
                "static/heroes/",
                name_hex,
                filename,
                size,
                psycopg2.Binary(data)))
    return filename


def insert_logo(cur, name, data):
    name_hex = binascii.b2a_hex(os.urandom(15)).decode('utf-8')
    print(name_hex)
    size = os.path.getsize("./lol-image/" + name + "/" + name + "-logo.jpg")
    filename = "static/heroes/" + name_hex
    cur.execute(sql_insert_logo,
                ("image",
                name + "-logo.jpg",
                "7bit",
                "image/jpeg",
                "static/heroes/",
                name_hex,
                filename,
                size,
                psycopg2.Binary(data)))
    return filename


def import_hero():
    conn = database_connect()
    cur = conn.cursor()

    for dirs in os.walk(image_dir):
        for champ_name in dirs[1]:
            dir_name = champ_name
            desc = fetch_description(dir_name)
            image = fetch_image(dir_name, "image")
            logo = fetch_image(dir_name, "logo")

            image_name = insert_image(cur, champ_name, image)
            logo_name = insert_logo(cur, champ_name, logo)
            conn.commit()

            if champ_name in custom_champ_desc:
                champ_name = custom_champ_desc[champ_name]

            cur.execute(sql_hero, (champ_name.capitalize(),
                        desc, image_name, logo_name))
            conn.commit()

    cur.close()
    conn.close()


def main():
    import_hero()


if __name__ == "__main__":
    main()
