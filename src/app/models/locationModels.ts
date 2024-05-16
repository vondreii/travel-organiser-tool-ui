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