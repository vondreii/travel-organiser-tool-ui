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

  allRegions: Region[] = [];
  filteredCountries: Country[] = [];
  filteredDestinations: Destination[] = [];

  inputTypes = InputTypes;

  showEditButton: boolean = true;
  isEditTrip: boolean = false;
  isEditTripStop: boolean[] = [];

  tripstopStartTimes: any[] = [];
  tripstopEndTimes: any[] = [];

  // calendarDays: any[] = [];

  // years: number[] = [];
  // months: string[] = [];
  // days: number[] = [];


  constructor(
    private route: ActivatedRoute,
    private locationService: LocationService,
    private tripService: TripService,
  ) { 
    this.currentTrip = tripService.initializeNewTrip();
    this.editedTrip = tripService.initializeNewTrip();
    this.editedTripStop = tripService.initializeNewTripstop();
    // this.setCalendar();
  }

  setCalendar() {
    // this.calendarDays = [
    //   { name: 'January', days: Array.from({ length: 31 }, (_, index) => index + 1) },
    //   { name: 'February', days: [] },
    //   { name: 'March', days: Array.from({ length: 31 }, (_, index) => index + 1) },
    //   { name: 'April', days: Array.from({ length: 30 }, (_, index) => index + 1) },
    //   { name: 'May', days: Array.from({ length: 31 }, (_, index) => index + 1) },
    //   { name: 'June', days: Array.from({ length: 30 }, (_, index) => index + 1) },
    //   { name: 'July', days: Array.from({ length: 31 }, (_, index) => index + 1) },
    //   { name: 'August', days: Array.from({ length: 31 }, (_, index) => index + 1) },
    //   { name: 'September', days: Array.from({ length: 30 }, (_, index) => index + 1) },
    //   { name: 'October', days: Array.from({ length: 31 }, (_, index) => index + 1) },
    //   { name: 'November', days: Array.from({ length: 30 }, (_, index) => index + 1) },
    //   { name: 'December', days: Array.from({ length: 31 }, (_, index) => index + 1) }
    // ];

    // const currentYear = new Date().getFullYear();
    // const isLeapYear = (currentYear % 4 == 0 && currentYear % 100 != 0) || currentYear % 400 == 0;

    // isLeapYear ?
    //   this.calendarDays[1].days = Array.from({ length: 29 }, (_, index) => index + 1) :
    //   this.calendarDays[1].days = Array.from({ length: 28 }, (_, index) => index + 1);

    // this.months = this.calendarDays.map(x => x.name);
    // this.days = this.calendarDays.find(x => x.name === new Date().getMonth()).days;
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const currentTripId = +params['id']; 

      this.tripService.getFilteredTrips(currentTripId, null).subscribe(r => {
        this.currentTrip = r[0];

        this.tripService.GetAllTripstops(currentTripId).subscribe(r => {
          this.currentTripStops = r;
          this.currentTripStops.forEach(t => {
            this.tripstopStartTimes.push({
              Day: new Date(t.Startdate).getUTCDate(), Month: new Date(t.Startdate).getUTCMonth(), Year: new Date(t.Startdate).getUTCFullYear(),
            });
            this.tripstopEndTimes.push({
              Day: new Date(t.Enddate).getUTCDate(), Month: new Date(t.Enddate).getUTCMonth(), Year: new Date(t.Enddate).getUTCFullYear(),
            });
            this.isEditTripStop.push(false);
          });
        });
      });
    });
  }

  showOrHideEditButtons() {
    this.showEditButton = !this.isEditTripStop.some(x => x) && !this.isEditTrip;
  }

  onEditTrip() {
    this.isEditTrip = true;
    this.showOrHideEditButtons();
    this.editedTrip = { ...this.currentTrip };
  }

  onSaveTrip() {
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
    this.currentTripStops[index] = this.editedTripStop;

    this.tripService.editTripstop(this.currentTripStops[index]).subscribe(
      (response) => {
        this.tripService.GetAllTripstops(this.currentTrip.Id).subscribe(r => {
          this.currentTripStops = r;
        });
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

  onInputChangeDropdown(inputType: InputTypes, data: any, index: number) {
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
}

enum InputTypes {
  TripName = 0,
  Region = 1,
  Country = 2,
  Destination = 3
}