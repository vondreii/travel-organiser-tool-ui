import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TripService } from 'src/app/services/trip.service';
import { LocationService } from 'src/app/services/location.service';
import { Trip, Tripstop } from 'src/app/models/tripModels';
import { Destination, Country, Region } from 'src/app/models/locationModels';
import { GlobalHelperService } from 'src/app/services/globalHelper.service';

@Component({
  selector: 'editTrip',
  templateUrl: './editTrip.component.html'
})
export class EditTripComponent implements OnInit {
  currentTrip: Trip;
  currentTripStops: Tripstop[] = [];

  editedTrip: Trip;
  isEditTripDetails: boolean = false;
  isEditTripDetailsInvalidInput: boolean = false;

  editedTripStop: Tripstop;
  isEditTripStop: boolean[] = [];
  isEditTripStopInvalidInput: boolean = false;

  isDeleteTripDialog: boolean = false;
  isDeleteTripstopDialog: boolean = false;
  deleteTripStop: Tripstop;

  newTripStop: Tripstop;
  isAddNewTripstop: boolean = false;
  isNewTripInvalidInput: boolean = false;

  allRegions: Region[] = [];
  filteredCountries: Country[] = [];
  filteredDestinations: Destination[] = [];

  inputTypes = InputTypes;

  showAddEditDeleteButtons: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private locationService: LocationService,
    private tripService: TripService,
    private globalHelperService: GlobalHelperService
  ) { 
    this.currentTrip = tripService.initializeNewTrip();
    this.editedTrip = tripService.initializeNewTrip();
    this.editedTripStop = tripService.initializeNewTripstop();
    this.deleteTripStop = tripService.initializeNewTripstop();
    this.newTripStop = tripService.initializeNewTripstop();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const currentTripId = +params['id']; 

      this.tripService.getFilteredTrips(currentTripId, null).subscribe(r => {
        this.currentTrip = r[0];
        this.isEditTripStop = new Array(this.currentTrip.NoOfDestinations).fill(false);
        this.loadTripstops(currentTripId);
      });
    });
  }

  loadTripstops(currentTripId: number) {
    this.tripService.GetAllTripstops(currentTripId).subscribe(r => {
      this.currentTripStops = r;
      this.currentTripStops.forEach(t => {
        t.Startdate = this.globalHelperService.convertDateForInput(new Date(t.Startdate));
        t.Enddate = this.globalHelperService.convertDateForInput(new Date(t.Enddate));
      });
    });
  }

  

  showOrHideAddEditDeleteButtons() {
    this.showAddEditDeleteButtons = 
      !this.isEditTripDetails &&
      !this.isEditTripStop.some(x => x) &&
      !this.isAddNewTripstop;
  }

  // Edit, save, cancel trip details eg name
  onEditTripDetails() {
    this.isEditTripDetails = true;
    this.showOrHideAddEditDeleteButtons();
    this.editedTrip = { ...this.currentTrip };
  }

  onDeleteTrip() {
    this.isDeleteTripDialog = true;
    document.body.style.overflow = 'hidden';
  }

  onDeleteTripConfirmed() {
    this.tripService.deleteTrip(this.currentTrip).subscribe(
      (response) => {
        this.isDeleteTripDialog = false;
        document.body.style.overflow = 'unset';
        this.router.navigate(['/myTrips']);
      },
      (error) => {
        console.error('An error occurred:', error);
      }
    );
  }

  onDeleteTripCancelled() {
    this.isDeleteTripDialog = false;
    document.body.style.overflow = 'unset';
  }

  onSaveTripDetails() {
    if (this.editedTrip.Name === "") {
      this.isEditTripDetailsInvalidInput = true;
      return;
    }
    this.isEditTripDetailsInvalidInput = false;

    this.isEditTripDetails = false;
    this.showOrHideAddEditDeleteButtons();
    this.currentTrip = this.editedTrip;

    this.tripService.editTrip(this.currentTrip).subscribe(
      (response) => {
        console.error('Success');
      },
      (error) => {
        console.error('An error occurred:', error);
      }
    );
  }

  onCancelTripDetails() {
    this.isEditTripDetails = false;
    this.isEditTripDetailsInvalidInput = false;
    this.showOrHideAddEditDeleteButtons();
  }
  
  // Edit, save, cancel trip stop destinations
  onEditTripStop(index: number){
    this.isEditTripStop[index] = true; 
    this.showOrHideAddEditDeleteButtons();
    this.editedTripStop = { ...this.currentTripStops[index] };

    this.locationService.getAllRegions().toPromise().then(r => {
      this.allRegions = r;
    });
    this.locationService.getAllCountriesByRegion(this.editedTripStop.RegionID).subscribe(r => {
      this.filteredCountries = r;
    });
    this.locationService.getAllDestinationsByCountry(this.editedTripStop.CountryID).subscribe(r => {
      this.filteredDestinations = r;
    });
  }

  onDeleteTripStop(index: number){
    this.isDeleteTripstopDialog = true;
    this.deleteTripStop = this.currentTripStops[index];
    document.body.style.overflow = 'hidden';
  }

  onDeleteTripstopConfirmed() {
    this.tripService.deleteTripstop(this.deleteTripStop).subscribe(
      (response) => {
        this.loadTripstops(this.currentTrip.Id);
        this.isDeleteTripstopDialog = false;
        document.body.style.overflow = 'unset';
      },
      (error) => {
        console.error('An error occurred:', error);
      }
    );
  }

  onDeleteTripstopCancelled() {
    this.isDeleteTripstopDialog = false;
    document.body.style.overflow = 'unset';
  }

  onEditTripStopChangeDropdown(inputType: InputTypes, data: any) {
    const value = parseInt(data.target.value);
    if(value === null || isNaN(value)) {
      return;
    }

    switch(inputType) {
      case InputTypes.Region:
          this.editedTripStop.RegionID = value;
          this.locationService.getAllCountriesByRegion(value).toPromise().then(r => {
            this.filteredCountries = r;
            this.editedTripStop.CountryID = this.filteredCountries[0].Id;
            this.locationService.getAllDestinationsByCountry(this.editedTripStop.CountryID).toPromise().then(r => {
              this.filteredDestinations = r;
              this.editedTripStop.DestinationID = this.filteredDestinations[0].Id;
            });
          });
          break;

      case InputTypes.Country:
          this.editedTripStop.CountryID = value;
          this.locationService.getAllDestinationsByCountry(value).toPromise().then(r => {
            this.filteredDestinations = r;
            this.editedTripStop.DestinationID = this.filteredDestinations[0].Id;
          });
          break;

      case InputTypes.Destination:
          this.editedTripStop.DestinationID = value;
          break;
    }
  }

  onSaveEditTripstop(index: number) {
    if (new Date(this.editedTripStop.Startdate) > new Date(this.editedTripStop.Enddate)) {
      this.isEditTripStopInvalidInput = true;
      return;
    }
    this.isEditTripStopInvalidInput = false;
    this.isEditTripStop[index] = false; 
    this.showOrHideAddEditDeleteButtons();

    this.editedTripStop.Startdate = this.globalHelperService.convertToDateISOString(this.editedTripStop.Startdate);
    this.editedTripStop.Enddate = this.globalHelperService.convertToDateISOString(this.editedTripStop.Enddate);
    this.currentTripStops[index] = this.editedTripStop;

    this.tripService.editTripstop(this.currentTripStops[index]).subscribe(
      (response) => {
        this.loadTripstops(this.currentTrip.Id);
      },
      (error) => {
        console.error('An error occurred:', error);
      }
    );
  }

  onCancelEditTripStop(index: number) {
    this.isEditTripStop[index] = false; 
    this.isEditTripStopInvalidInput = false;
    this.showOrHideAddEditDeleteButtons();
  }

  // Add, save, cancel new trip stop destination
  onAddNewTripStop() {
    this.isAddNewTripstop = true;
    this.showOrHideAddEditDeleteButtons();
    const currentDate = new Date();
    const tomorrowDate = new Date(currentDate);
    tomorrowDate.setDate(currentDate.getDate() + 1);
    this.newTripStop.Startdate = this.globalHelperService.convertDateForInput(currentDate);
    this.newTripStop.Enddate = this.globalHelperService.convertDateForInput(tomorrowDate);
    this.newTripStop.RegionID = 1;
    this.locationService.getAllRegions().toPromise().then(r => {
      this.allRegions = r;
    });
    this.locationService.getAllCountriesByRegion(this.newTripStop.RegionID).subscribe(r => {
      this.filteredCountries = r;
      this.newTripStop.CountryID = this.filteredCountries[0].Id;
      this.locationService.getAllDestinationsByCountry(this.newTripStop.CountryID).subscribe(r => {
        this.filteredDestinations = r;
        this.newTripStop.DestinationID = this.filteredCountries[0].Id;
      });
    });
  }

  onAddNewTripStopChangeDropdown(inputType: InputTypes, data: any) {
    const value = parseInt(data.target.value);
    if(value === null || isNaN(value)) {
      return;
    }

    switch(inputType) {
      case InputTypes.Region:
          this.newTripStop.RegionID = value;
          this.locationService.getAllCountriesByRegion(value).toPromise().then(r => {
            this.filteredCountries = r;
            this.newTripStop.CountryID = this.filteredCountries[0].Id;
            this.locationService.getAllDestinationsByCountry(this.newTripStop.CountryID).toPromise().then(r => {
              this.filteredDestinations = r;
              this.newTripStop.DestinationID = this.filteredDestinations[0].Id;
            });
          });
          break;

      case InputTypes.Country:
          this.newTripStop.CountryID = value;
          this.locationService.getAllDestinationsByCountry(value).toPromise().then(r => {
            this.filteredDestinations = r;
            this.newTripStop.DestinationID = this.filteredDestinations[0].Id;
          });
          break;

      case InputTypes.Destination:
          this.newTripStop.DestinationID = value;
          break;
    }
  }

  onSaveAddNewTripStop() {
    if (new Date(this.newTripStop.Startdate) > new Date(this.newTripStop.Enddate)) {
      this.isNewTripInvalidInput = true;
      return;
    }
    this.isNewTripInvalidInput = false;
    this.isAddNewTripstop = false; 
    this.showOrHideAddEditDeleteButtons();

    this.newTripStop.Startdate = this.globalHelperService.convertToDateISOString(this.newTripStop.Startdate);
    this.newTripStop.Enddate = this.globalHelperService.convertToDateISOString(this.newTripStop.Enddate);
    this.newTripStop.TripID = this.currentTrip.Id;

    this.tripService.saveNewTripstop(this.newTripStop).subscribe(
      (response) => {
        this.loadTripstops(this.currentTrip.Id);
      },
      (error) => {
        console.error('An error occurred:', error);
      }
    );
  }

  onCancelAddNewTripStop() {
    this.newTripStop = this.tripService.initializeNewTripstop();
    this.isAddNewTripstop = false;
    this.isNewTripInvalidInput = false;
    this.showOrHideAddEditDeleteButtons();
  }
}

enum InputTypes {
  TripName = 0,
  StartDate = 1,
  EndDate = 2,
  Region = 3,
  Country = 4,
  Destination = 5
}