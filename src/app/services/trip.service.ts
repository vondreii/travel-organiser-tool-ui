import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Trip } from 'src/app/models/trip';

@Injectable({
  providedIn: 'root'
})
export class TripService {

  constructor(private http: HttpClient) { }

  initializeNewTrip() {
    return {
      id: 0,
      name: '',
      locationID: 0,
      locationName: '',
      countryID: 0,
      countryName: '',
      regionID: 0,
      regionName: ''
    }
  }

  getAllTrips() {
    return this.http.get<any>('http://localhost:5000/api/trip/GetAllTrips');
  }

  getFilteredTrips(name: string, location: string) {
    let params = new HttpParams();
    params = params.append("name", name);
    params = params.append("location", location);

    return this.http.get<any>('http://localhost:5000/api/trip/GetFilteredTrips', { params });
  }

  saveNewTrip(newTrip: Trip): Observable<any> {
    const payload = { 
      id: newTrip.id, 
      name: newTrip.name, 
      locationID: newTrip.locationID 
    };
    return this.http.post('http://localhost:5000/api/trip/post', payload);
  }
}


