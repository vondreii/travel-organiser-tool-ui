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
      destinationID: 0,
      destinationName: '',
      countryID: 0,
      countryName: '',
      regionID: 0,
      regionName: ''
    }
  }

  getAllTrips() {
    return this.http.get<any>('http://localhost:5000/api/trip/GetAllTrips');
  }

  getFilteredTrips(name: string, destination: string) {
    let params = new HttpParams();
    params = params.append("name", name);
    params = params.append("destination", destination);

    return this.http.get<any>('http://localhost:5000/api/trip/GetFilteredTrips', { params });
  }

  saveNewTrip(newTrip: Trip): Observable<any> {
    const payload = { 
      id: newTrip.id, 
      name: newTrip.name, 
      destinationID: newTrip.destinationID 
    };
    return this.http.post('http://localhost:5000/api/trip/post', payload);
  }
}


