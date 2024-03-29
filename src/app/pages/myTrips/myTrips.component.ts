import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TripService } from 'src/app/services/trip.service';
import { DialogService } from 'src/app/services/dialog.service';
import { Trip, Tripstop } from 'src/app/models/tripModels';

@Component({
  selector: 'myTrips',
  templateUrl: './myTrips.component.html'
})
export class MyTripsComponent implements OnInit {
  allTrips: Trip[] = [];
  allTripStops: Tripstop[] = [];

  filteredTrips: Trip[] = [];

  showAddTripDialog: boolean;

  selectedFilterName: string = "";

  constructor(
    private router: Router,
    private tripService: TripService,
    public dialogService: DialogService
  ) { 
    this.showAddTripDialog = false;
  }

  async ngOnInit(): Promise<void> {
    await this.loadData();
  }

  loadData() {
    this.tripService.getAllTrips().subscribe(r => {
      this.allTrips = r;
      this.filteredTrips = this.allTrips;
    });
  }

  onAddTrip() {
    this.dialogService.isDialogOpen = true;
  }

  onEditTrip(tripId: number) {
    this.router.navigate(['/editTrip', tripId]);
  }

  filterTable(value: any, col: string) {
    switch(col) {
      case 'name':
        this.selectedFilterName = value;
        break;
    }

    this.tripService.getFilteredTrips(null, this.selectedFilterName).subscribe(r => {
      this.filteredTrips = r;
    });
  }

}
