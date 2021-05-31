export interface HeroFileless {
  id: number;
  name: string;
  description: string;
}

export interface Hero {
  id: number;
  name: string;
  description: string;
  image: string;
  logo: string;
}

export interface HeroFileHeader {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
  size: number;
}

export interface HeroFiles {
  image: HeroFileHeader[];
  logo: HeroFileHeader[];
}

export interface HeroWithStatsRaw extends Hero {
  health: number;
  health_by_level: number;
  health_regen: number;
  health_regen_by_level: number;
  ressource: number;
  ressource_by_level: number;
  ressource_regen: number;
  ressource_regen_by_level: number;
  attack_damage: number;
  attack_damage_by_level: number;
  attack_speed: number;
  attack_speed_percentage_by_level: number;
  ability_power: number;
  ability_power_by_level: number;
  armor: number;
  armor_by_level: number;
  magic_resist: number;
  magic_resist_by_level: number;
  movement_speed: number;
  range: number;
}

export interface HeroWithStats extends Hero {
  stats: HeroStats;
}

export interface HeroStats {
  health: number;
  health_by_level: number;
  health_regen: number;
  health_regen_by_level: number;
  ressource: number;
  ressource_by_level: number;
  ressource_regen: number;
  ressource_regen_by_level: number;
  attack_damage: number;
  attack_damage_by_level: number;
  attack_speed: number;
  attack_speed_percentage_by_level: number;
  ability_power: number;
  ability_power_by_level: number;
  armor: number;
  armor_by_level: number;
  magic_resist: number;
  magic_resist_by_level: number;
  movement_speed: number;
  range: number;
}
