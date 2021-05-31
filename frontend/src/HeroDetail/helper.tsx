import { HeroStats } from "../Heroes/helper";

import health_icon from "./stats-icones/Health_icon.png";
import health_regen_icon from "./stats-icones/Health_regeneration_icon.png";
import ressource_icon from "./stats-icones/Mana_icon.png";
import ressource_regen_icon from "./stats-icones/Mana_regeneration_icon.png";
import ability_power_icon from "./stats-icones/Ability_power_icon.png";
import armor_icon from "./stats-icones/Armor_icon.png";
import margic_resist_icon from "./stats-icones/Magic_resistance_icon.png";
import attack_damage_icon from "./stats-icones/Attack_damage_icon.png";
import attack_speed_icon from "./stats-icones/Attack_speed_icon.png";
import movement_speed_icon from "./stats-icones/Movement_speed_icon.png";
import range_icon from "./stats-icones/Range_icon.png";

export interface Characteristic {
  name: string;
  value: number;
  value_upgrade: number | null;
  percentage: boolean;
  icon: string;
}

export const characteristics = (stats: HeroStats): Characteristic[] => {
  return [
    {
      name: "Health",
      value: stats.health,
      value_upgrade: stats.health_by_level,
      percentage: false,
      icon: health_icon,
    },
    {
      name: "Health regeneration",
      value: stats.health_regen,
      value_upgrade: stats.health_regen_by_level,
      percentage: false,
      icon: health_regen_icon,
    },
    {
      name: "Ressource",
      value: stats.ressource,
      value_upgrade: stats.ressource_by_level,
      percentage: false,
      icon: ressource_icon,
    },
    {
      name: "Ressource regeneration",
      value: stats.ressource_regen,
      value_upgrade: stats.ressource_regen_by_level,
      percentage: false,
      icon: ressource_regen_icon,
    },
    {
      name: "Attack damage",
      value: stats.attack_damage,
      value_upgrade: stats.attack_damage_by_level,
      percentage: false,
      icon: attack_damage_icon,
    },
    {
      name: "Attack speed",
      value: stats.attack_speed,
      value_upgrade: stats.attack_speed_percentage_by_level,
      percentage: true,
      icon: attack_speed_icon,
    },
    {
      name: "Ability power",
      value: stats.ability_power,
      value_upgrade: stats.ability_power_by_level,
      percentage: false,
      icon: ability_power_icon,
    },
    {
      name: "Armor",
      value: stats.armor,
      value_upgrade: stats.armor_by_level,
      percentage: false,
      icon: armor_icon,
    },
    {
      name: "Magic resistance",
      value: stats.magic_resist,
      value_upgrade: stats.magic_resist_by_level,
      percentage: false,
      icon: margic_resist_icon,
    },
    {
      name: "Movement speed",
      value: stats.movement_speed,
      value_upgrade: null,
      percentage: false,
      icon: movement_speed_icon,
    },
    {
      name: "Range",
      value: stats.range,
      value_upgrade: null,
      percentage: false,
      icon: range_icon,
    },
  ];
};
