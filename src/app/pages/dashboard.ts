import { Component, OnInit } from '@angular/core';
import { TripService } from 'src/app/services/trip.service';
import { DialogService } from 'src/app/services/dialog.service';
import { Trip } from 'src/app/models/trip';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class TripsOverviewComponent implements OnInit {
  allTrips: Trip[] = [];
  filteredTrips: Trip[] = [];

  showAddTripDialog: boolean;

  selectedFilterName: string = "";
  selectedFilterLocation: string = "";

  constructor(
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
      this.allTrips = r.$values;
      this.filteredTrips = this.allTrips;
    });
  }

  onAddTrip() {
    this.dialogService.isDialogOpen = true;
  }

  filterTable(value: any, col: string) {
    switch(col) {
      case 'name':
        this.selectedFilterName = value;
        break;
      case 'location':
        this.selectedFilterLocation = value;
        break;
    }

    this.tripService.getFilteredTrips(this.selectedFilterName, this.selectedFilterLocation).subscribe(r => {
      this.filteredTrips = r.$values;
    });
  }
}
