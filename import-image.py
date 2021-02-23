#!/usr/bin/python3

import re
import requests
import os

from pathlib import Path

image_dir = 'lol-image/'

def import_logo():
    f = open('logo-url.html', 'r')
    urls = f.readlines()

    for url in urls:
        champ_name = re.search(r'ChampionList_(.+?)(_v2)?\.jpg', url).group(1).lower()
        path = image_dir + champ_name + '/'

        Path(path).mkdir(parents=True, exist_ok=True)

        resp = requests.get(url)
        logo = open(path + champ_name + '-logo.jpg', 'wb+')
        logo.write(resp.content)
        logo.close()



def import_image():
    for dirs in os.walk(image_dir):
        for champ_name in dirs[1]:
            path = image_dir + champ_name + '/'

            url = 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/' + champ_name.capitalize() + '_0.jpg'
            resp = requests.get(url)
            logo = open(path + champ_name + '-image.jpg', 'wb+')
            logo.write(resp.content)
            logo.close()

def import_description():
    for dirs in os.walk(image_dir):
        for champ_name in dirs[1]:
            url = 'https://euw.leagueoflegends.com/fr-fr/champions/' + champ_name
            print("fetch " + champ_name + " descrption...")
            resp = requests.get(url).content.decode('utf-8')
            print("cleaning data...")
            data = re.search(r'<p>(.*)<button>Voir plus</button></p>', resp).group(1)
            print(data)

            path = image_dir + champ_name + '/'
            desc = open(path + champ_name + '-description.txt', 'w+')
            desc.write(data)
            desc.close()
            


def main():
    import_logo()
    import_image()
    # import_description()

if __name__ == "__main__":
    main()