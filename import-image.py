#!/usr/bin/python3

import re
import requests
import os

from pathlib import Path

image_dir = 'lol-image/'

custom_champ_desc = {"malaphite": "malphite", "ialiyah": "taliyah",
                "graves-cigar": "graves", "xeratth": "xerath"}

custom_champ_imag = {"aurelionsol": "AurelionSol",
                     "xinzhao": "XinZhao",
                     "drmundo": "DrMundo",
                     "ialiyah": "Taliyah",
                     "jarvaniv": "JarvanIV",
                     "reksai": "RekSai",
                     "missfortune": "MissFortune",
                     "tahmkench": "TahmKench",
                     "masteryi": "MasterYi",
                     "monkeyking": "Wukong",
                     "malaphite": "Malphite",
                     "graves-cigar": "Graves",
                     "xeratth": "Xerath",
                     "twistedfate": "TwitedFate",
                     "kogmaw": "KogMaw",
                     "leesin": "LeeSin"}

def import_logo():
    f = open('logo-url.html', 'r')
    urls = f.readlines()

    for url in urls:
        champ_name = re.search(
            r'ChampionList_(.+?)(_v2)?\.jpg', url).group(1).lower()
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
            if champ_name in custom_champ_imag:
                url = 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/' + custom_champ_imag[champ_name] +'_0.jpg'
            else:
                url = 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/' + \
                    champ_name.capitalize() + '_0.jpg'
            resp = requests.get(url)
            logo = open(path + champ_name + '-image.jpg', 'wb+')
            logo.write(resp.content)
            logo.close()


def import_description():
    re.DOTALL
    for dirs in os.walk(image_dir):
        for champ_name in dirs[1]:
            dir_name = champ_name
            if champ_name in custom_champ_desc:
                champ_name = custom_champ_desc[champ_name]
            url = 'https://universe-meeps.leagueoflegends.com/v1/en_us/champions/' + \
                champ_name + '/index.json'
            print("fetch " + champ_name + " descrption...")
            resp = requests.get(url).content.decode('utf-8')
            print("cleaning data...")
            data = re.search(r'"full": "(.*)",.*"short"', resp, re.DOTALL)[1]
            data = data.replace("</p><p>", "\n").replace("<p>", "").replace(
                "</p>", "").replace("<i>", "").replace("</i>", "")

            path = image_dir + dir_name + '/'
            desc = open(path + dir_name + '-description.txt', 'w+')
            desc.write(data)
            desc.close()


def main():
    # import_logo()
    import_image()
    # import_description()


if __name__ == "__main__":
    main()
