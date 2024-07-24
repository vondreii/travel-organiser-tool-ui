import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { GlobalHelperService } from './globalHelper.service';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
    url: string;

    constructor(
      private http: HttpClient, 
      private globalService: GlobalHelperService
    ) { 
        this.url = this.globalService.getServerURL();
    }

    // getAllDestinations() {
    //   return this.http.get<any>(`${this.url}/api/location/getAllDestinations`);
    // }

    getFilteredDestinations(skip: number = 0, take: number = 5, populationTypeId: number = 0, climateTypeId: number = 0, terrainTypeId: number = 0,) {
      return this.http.get<any>(`${this.url}/api/location/GetFilteredDestinations?skip=${skip}&take=${take}&populationTypeId=${populationTypeId}&climateTypeId=${climateTypeId}&terrainTypeId=${terrainTypeId}`);
    }

    getAllCountries(skip: number = 0, take: number = 5) {
      return this.http.get<any>(`${this.url}/api/location/GetAllCountries?skip=${skip}&take=${take}`);
    }

    getAllRegions() {
      return this.http.get<any>(`${this.url}/api/location/GetAllRegions`);
    }

    getAllCountriesByRegion(regionID: number) {
      let params = new HttpParams();
      params = params.append("regionID", regionID);

      return this.http.get<any>(`${this.url}/api/location/GetAllCountriesByRegion`, { params });
    }

    getAllDestinationsByCountry(countryID: number) {
      let params = new HttpParams();
      params = params.append("countryID", countryID);

      return this.http.get<any>(`${this.url}/api/location/GetAllDestinationsByCountry`, { params });
    }
}