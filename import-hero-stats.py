#!/usr/bin/python3
import csv
import psycopg2

# health;health_by_level;health_regenH;health_regen_by_level;ressource;ressource_by_level;ressource_regen;ressource_regen_by_level;attack_damage;attack_damage_by_level;attack_speed;attack_speed_by_level;armor;armor_by_level;magic_resist;magic_resist_by_level;movement_speed;range

sql_insert_stats = """INSERT INTO heroes_stats
  (health,
   health_by_level,
   health_regen,
   health_regen_by_level,
   ressource,
   ressource_by_level,
   ressource_regen,
   ressource_regen_by_level,
   attack_damage,
   attack_damage_by_level,
   attack_speed,
   attack_speed_percentage_by_level,
   ability_power,
   ability_power_by_level,
   armor,
   armor_by_level,
   magic_resist,
   magic_resist_by_level,
   movement_speed,
   range)
   VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s,%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
   RETURNING id"""

sql_link_stats = """UPDATE heroes SET stats_id = %s WHERE name = (%s)"""


def database_connect():
    return psycopg2.connect(
        user="toh",
        password="Poussin1!",
        host="tour-of-heroes.cmyuy62axot9.eu-west-3.rds.amazonaws.com",
        database="tour-of-heroes",
        port=5432)


def import_stats():
    conn = database_connect()
    cur = conn.cursor()

    with open('champ-stats.csv', newline='') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            cur.execute(sql_insert_stats,
                        (row["hp"], row["hp_lvl"],
                         row["hp5"], row["hp5_lvl"],
                         row["mp"], row["mp_lvl"],
                         row["mp5"], row["mp5_lvl"],
                         row["ad"], row["ad_lvl"],
                         row["asp"], row["as_lvl"],
                         0, 0,
                         row["ar"], row["ar_lvl"],
                         row["mr"], row["mr_lvl"],
                         row["ms"], row["range"]))
            stats_id = cur.fetchone()[0]
            conn.commit()
            print(stats_id)
            cur.execute(sql_link_stats, (stats_id, row["champions"]))
            conn.commit()

    cur.close()
    conn.close()


def main():
    import_stats()


if __name__ == "__main__":
    main()
