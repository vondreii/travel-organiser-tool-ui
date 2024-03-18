import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { GlobalService } from './global.service';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
    url: string;

    constructor(
      private http: HttpClient, 
      private globalService: GlobalService) { 
        this.url = this.globalService.isProduction ? 
          "https://travel-organiser-tool.azurewebsites.net/" :
          "http://localhost:5000";
    }

    getAllDestinations() {
      return this.http.get<any>(`${this.url}/api/location/getAllDestinations`);
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