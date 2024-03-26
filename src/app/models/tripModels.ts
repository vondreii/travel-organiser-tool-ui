export interface Tripstop {
  Id: number;
  TripID: number;
  Startdate: string;
  Enddate: string;
  DestinationID: number;
  DestinationName: string;
  DestinationImageFileName: string;
  CountryID: number;
  CountryName: string;
  RegionID: number;
  RegionName: string;
}

export interface Trip {
  Id: number;
  Name: string;
  NoOfDestinations: number;
  TripStops: Tripstop[]
}
