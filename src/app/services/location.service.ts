import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
    constructor(private http: HttpClient) { }

    getAllLocations() {
      return this.http.get<any>('http://localhost:5000/api/location/GetAllLocations');
    }

    getAllCountries() {
      return this.http.get<any>('http://localhost:5000/api/location/GetAllCountries');
    }

    getAllRegions() {
      return this.http.get<any>('http://localhost:5000/api/location/GetAllRegions');
    }

    getAllCountriesByRegion(regionID: number) {
      let params = new HttpParams();
      params = params.append("regionID", regionID);

      return this.http.get<any>('http://localhost:5000/api/location/GetAllCountriesByRegion', { params });
    }

    getAllLocationsByCountry(countryID: number) {
      let params = new HttpParams();
      params = params.append("countryID", countryID);

      return this.http.get<any>('http://localhost:5000/api/location/GetAllLocationsByCountry', { params });
    }
}