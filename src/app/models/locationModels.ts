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
  CountryID: number;
  CountryName: string;
  ImageFilename: string;
}