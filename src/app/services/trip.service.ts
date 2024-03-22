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
      Id: 0,
      Name: '',
      NoOfDestinations: 0,
      TripStops: []
    }
  }

  initializeNewTripstop() {
    return {
      Id: 0,
      TripID: 0,
      TripName: '',
      DestinationID: 0,
      DestinationName: '',
      CountryID: 0,
      CountryName: '',
      RegionID: 0,
      RegionName: ''
    }
  }

  getAllTrips() {
    return this.http.get<any>(`${this.url}/api/trip/GetAllTrips`);
  }

  GetAllTripstops(tripId: number) {
    let params = new HttpParams();
    params = params.append("tripId", tripId);

    return this.http.get<any>(`${this.url}/api/trip/GetAllTripstops`, { params });
  }

  getFilteredTrips(id: number | null, name: string | null) {
    let params = new HttpParams();
    if (id !== null) {
      params = params.append('id', id.toString());
    }
    if (name !== null) {
      params = params.append('name', name);
    }

    return this.http.get<any>(`${this.url}/api/trip/GetFilteredTrips`, { params });
  }

  saveNewTrip(newTrip: Trip): Observable<any> {
    const payload = { 
      id: newTrip.Id, 
      name: newTrip.Name
    };
    return this.http.post(`${this.url}/api/trip/post`, payload);
  }
}


