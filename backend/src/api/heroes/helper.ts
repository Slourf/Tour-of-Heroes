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
