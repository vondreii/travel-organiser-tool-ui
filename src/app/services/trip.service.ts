import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Trip, Tripstop } from 'src/app/models/tripModels';
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
      Startdate: '',
      Enddate: '',
      DestinationID: 0,
      DestinationName: '',
      DestinationImageFileName: '',
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
      Id: newTrip.Id, 
      Name: newTrip.Name
    };
    return this.http.post(`${this.url}/api/trip/Post`, payload);
  }

  editTrip(newTrip: Trip): Observable<any> {
    const payload = { 
      Id: newTrip.Id, 
      Name: newTrip.Name
    };
    return this.http.post(`${this.url}/api/trip/EditTrip`, payload);
  }

  editTripstop(newTripstop: Tripstop): Observable<any> {
    const payload = { 
      Id: newTripstop.Id, 
      DestinationID: newTripstop.DestinationID,
      Startdate: newTripstop.Startdate,
      Enddate: newTripstop.Enddate
    };
    return this.http.post(`${this.url}/api/trip/EditTripstop`, payload);
  }
}


