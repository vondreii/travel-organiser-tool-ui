import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Trip } from 'src/app/models/trip';
import { GlobalService } from './global.service';

@Injectable({
  providedIn: 'root'
})
export class TripService {
  url: string;

  constructor(
      private http: HttpClient, 
      private globalService: GlobalService) { 
        this.url = this.globalService.isProduction ? 
          "https://travel-organiser-tool.azurewebsites.net" :
          "http://localhost:5000";
    }

  initializeNewTrip() {
    return {
      id: 0,
      name: '',
      destinationID: 0,
      destinationName: '',
      countryID: 0,
      countryName: '',
      regionID: 0,
      regionName: ''
    }
  }

  getAllTrips() {
    return this.http.get<any>(`${this.url}/api/trip/GetAllTrips`);
  }

  GetAllTripstops() {
    return this.http.get<any>(`${this.url}/api/trip/GetAllTripstops`);
  }

  getFilteredTrips(name: string) {
    let params = new HttpParams();
    params = params.append("name", name);

    return this.http.get<any>(`${this.url}/api/trip/GetFilteredTrips`, { params });
  }

  saveNewTrip(newTrip: Trip): Observable<any> {
    const payload = { 
      id: newTrip.id, 
      name: newTrip.name
    };
    return this.http.post(`${this.url}/api/trip/post`, payload);
  }
}


