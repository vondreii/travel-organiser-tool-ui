import { Tripstop } from "./tripstop";

export interface Trip {
  Id: number;
  Name: string;
  NoOfDestinations: number;
  TripStops: Tripstop[]
}