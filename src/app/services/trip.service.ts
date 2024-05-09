import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Trip, Tripstop } from 'src/app/models/tripModels';
import { GlobalHelperService } from './globalHelper.service';

@Injectable({
  providedIn: 'root'
})
export class TripService {
  url: string;

  constructor(
      private http: HttpClient, 
      private globalService: GlobalHelperService
    ) { 
        this.url = this.globalService.getServerURL();
    }

  initializeNewTrip() {
    return {
      Id: 0,
      Name: '',
      CreatedDate: '',
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

  saveNewTripstop(newTripstop: Tripstop): Observable<any> {
    const payload = { 
      Id: newTripstop.Id, 
      TripID: newTripstop.TripID,
      DestinationID: newTripstop.DestinationID,
      Startdate: newTripstop.Startdate,
      Enddate: newTripstop.Enddate,
    };
    return this.http.post(`${this.url}/api/trip/AddTripStop`, payload);
  }

  editTrip(trip: Trip): Observable<any> {
    const payload = { 
      Id: trip.Id, 
      Name: trip.Name
    };
    return this.http.post(`${this.url}/api/trip/EditTrip`, payload);
  }

  deleteTrip(trip: Trip): Observable<any> {
    const payload = { 
      Id: trip.Id, 
      Name: trip.Name
    };
    return this.http.post(`${this.url}/api/trip/DeleteTrip`, payload);
  }

  editTripstop(tripstop: Tripstop): Observable<any> {
    const payload = { 
      Id: tripstop.Id, 
      DestinationID: tripstop.DestinationID,
      Startdate: tripstop.Startdate,
      Enddate: tripstop.Enddate
    };
    return this.http.post(`${this.url}/api/trip/EditTripstop`, payload);
  }

  deleteTripstop(tripstop: Tripstop): Observable<any> {
    const payload = { 
      Id: tripstop.Id, 
      DestinationID: tripstop.DestinationID,
      Startdate: tripstop.Startdate,
      Enddate: tripstop.Enddate
    };
    return this.http.post(`${this.url}/api/trip/DeleteTripstop`, payload);
  }
}


