import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TripService } from 'src/app/services/trip.service';
import { LocationService } from 'src/app/services/location.service';
import { Trip, Tripstop } from 'src/app/models/tripModels';
import { Destination, Country, Region } from 'src/app/models/locationModels';

@Component({
  selector: 'editTrip',
  templateUrl: './editTrip.component.html'
})
export class EditTripComponent implements OnInit {
  currentTrip: Trip;
  currentTripStops: Tripstop[] = [];

  editedTrip: Trip;
  editedTripStop: Tripstop;
  isEditTrip: boolean = false;
  isEditTripStop: boolean[] = [];
  isEditTripInvalidInput: boolean = false;

  newTripStop: Tripstop;
  newTripName: string = "";
  isAddAnotherTrip: boolean = false;
  isNewTripInvalidInput: boolean = false;

  allRegions: Region[] = [];
  filteredCountries: Country[] = [];
  filteredDestinations: Destination[] = [];

  inputTypes = InputTypes;

  showEditOrAddButtons: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private locationService: LocationService,
    private tripService: TripService,
  ) { 
    this.currentTrip = tripService.initializeNewTrip();
    this.editedTrip = tripService.initializeNewTrip();
    this.editedTripStop = tripService.initializeNewTripstop();
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
        t.Startdate = this.convertDate(new Date(t.Startdate));
        t.Enddate = this.convertDate(new Date(t.Enddate));
      });
    });
  }

  convertDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  convertToDateISOString(dateString: string): string {
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    return date.toISOString();
  }

  showOrHideEditButtons() {
    this.showEditOrAddButtons = 
      !this.isEditTripStop.some(x => x) && 
      !this.isEditTrip && 
      !this.isAddAnotherTrip;
  }

  onEditTrip() {
    this.isEditTrip = true;
    this.showOrHideEditButtons();
    this.editedTrip = { ...this.currentTrip };
  }

  onSaveTrip() {
    if (this.editedTrip.Name === "") {
      this.isEditTripInvalidInput = true;
      return;
    }
    this.isEditTripInvalidInput = false;

    this.isEditTrip = false;
    this.showOrHideEditButtons();
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

  onCancelEditingTrip() {
    this.isEditTrip = false;
    this.showOrHideEditButtons();
  }
  
  onEditTripStop(index: number){
    this.isEditTripStop[index] = true; 
    this.showOrHideEditButtons();
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

  onSaveTripstop(index: number) {
    this.isEditTripStop[index] = false; 
    this.showOrHideEditButtons();

    this.editedTripStop.Startdate = this.convertToDateISOString(this.editedTripStop.Startdate);
    this.editedTripStop.Enddate = this.convertToDateISOString(this.editedTripStop.Enddate);
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

  onCancelEditingTripStop(index: number) {
    this.isEditTripStop[index] = false; 
    this.showOrHideEditButtons();
  }

  onAddAnotherTrip() {
    this.isAddAnotherTrip = true;
    this.showOrHideEditButtons();
    const currentDate = new Date();
    const tomorrowDate = new Date(currentDate);
    tomorrowDate.setDate(currentDate.getDate() + 1);
    this.newTripStop.Startdate = this.convertDate(currentDate);
    this.newTripStop.Enddate = this.convertDate(tomorrowDate);
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

  onCancelAddingNewTrip() {
    this.newTripName = "";
    this.newTripStop = this.tripService.initializeNewTripstop();
    this.isAddAnotherTrip = false;
    this.showOrHideEditButtons();
  }

  onSaveAddingNewTrip() {
    // if (this.newTripName === "") {
    //   this.isNewTripInvalidInput = true;
    //   return;
    // }
    // this.isNewTripInvalidInput = false;
    this.isAddAnotherTrip = false; 
    this.showOrHideEditButtons();

    this.newTripStop.Startdate = this.convertToDateISOString(this.newTripStop.Startdate);
    this.newTripStop.Enddate = this.convertToDateISOString(this.newTripStop.Enddate);
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

  onEditTripChangeDropdown(inputType: InputTypes, data: any) {
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

  onAddTripChangeDropdown(inputType: InputTypes, data: any) {
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
}

enum InputTypes {
  TripName = 0,
  StartDate = 1,
  EndDate = 2,
  Region = 3,
  Country = 4,
  Destination = 5
}