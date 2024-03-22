import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TripService } from 'src/app/services/trip.service';
import { Trip } from 'src/app/models/trip';
import { Tripstop } from 'src/app/models/tripstop';

@Component({
  selector: 'editTrip',
  templateUrl: './editTrip.component.html'
})
export class EditTripComponent implements OnInit {
  currentTripId: number = 0;
  currentTrip: Trip;
  tripName: string = ""
  tripStops: Tripstop[] = [];

  constructor(
    private route: ActivatedRoute,
    private tripService: TripService,
  ) { 
    this.currentTrip = tripService.initializeNewTrip();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.currentTripId = +params['id']; // Retrieve the trip ID from route parameters

      this.tripService.getFilteredTrips(this.currentTripId, null).subscribe(r => {
        this.currentTrip = r[0];

        this.tripService.GetAllTripstops(this.currentTripId).subscribe(r => {
          this.tripStops = r;
        });
      });
    });

  }
}
