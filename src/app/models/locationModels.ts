export interface Region {
  Id: number;
  Name: string;
}

export interface Country {
  Id: number;
  Name: string;
  RegionID: number;
  RegionName: string;
  ImageFilename: string;
}

export interface Destination {
  Id: number;
  Name: string;
  ImageFilename: string;
  CountryID: number;
  CountryName: string;
  PopulationTypeID: number;
  PopulationTypeName: string;
  ClimateTypeID: number;
  ClimateTypeName: string;
  TerrainTypeID: number;
  TerrainTypeName: string;
}

export interface PopulationType {
  Id: number;
  Name: string;
}

export interface ClimateType {
  Id: number;
  Name: string;
}

export interface TerrainType {
  Id: number;
  Name: string;
}

export enum PopulationTypes {
  City = 1,
  Town = 2,
  RuralNonUrban = 3
}

export enum TerrainTypes {
  MajorCity = 1,
  Desert = 2,
  Forest = 3,
  Cliffs = 4,
  Hills = 5,
  Marsh = 6,
  Farmland = 7,
  Beach = 8,
  Coastal = 9,
  Waterfront = 10,
  Mountains = 11
}

export enum ClimateTypes {
  Sunny = 1,
  Tropical = 2,
  Chilly = 3,
  Snowy = 4
}