import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DialogService } from 'src/app/services/dialog.service';
import { TripService } from 'src/app/services/trip.service';
import { LocationService } from 'src/app/services/location.service';
import { Trip } from 'src/app/models/trip';
import { Location } from 'src/app/models/location';
import { Country } from 'src/app/models/country';
import { Region } from 'src/app/models/region';

@Component({
  selector: 'addTripDialog',
  templateUrl: './addTripDialog.component.html'
})
export class AddTripDialogComponent implements OnInit {
  trip: Trip

  allRegions: Region[] = [];
  filteredCountries: Country[] = [];
  filteredLocations: Location[] = [];

  pageFields: PageFields[] = [];
  inputTypes = InputTypes;
  isPageValid: boolean;

  @Output()
  itemAdded = new EventEmitter();

  constructor(
    private tripService: TripService,
    private locationService: LocationService,
    private dialogService: DialogService
  ) { 
    this.trip = this.tripService.initializeNewTrip();
    this.setPageFields();
    this.isPageValid = true;
  }

  async ngOnInit(): Promise<void> {
    this.locationService.getAllRegions().toPromise().then(r => {
        this.allRegions = r.$values;
    });
  }

  setPageFields() {
    this.pageFields = [
      { inputType: InputTypes.TripName, isValid: true },
      { inputType: InputTypes.Region, isValid: true },
      { inputType: InputTypes.Country, isValid: true },
      { inputType: InputTypes.Location, isValid: true }
    ]
  }

  onInputChangeText(inputType: InputTypes) {
    switch(inputType) {
      case InputTypes.TripName:
          this.runValidation(InputTypes.TripName);
        break;
    }
  }

  onInputChangeDropdown(inputType: InputTypes, data: any) {
    const value = parseInt(data.target.value);
    if(value === null || isNaN(value)) {
      return;
    }

    switch(inputType) {
      case InputTypes.Region:
          this.trip.regionID = value;
          this.locationService.getAllCountriesByRegion(value).toPromise().then(r => {
            this.filteredCountries = r.$values;
            this.trip.countryID = 0;
          })
          this.runValidation(InputTypes.Region);
        break;

      case InputTypes.Country:
          this.trip.countryID = value;
          this.locationService.getAllLocationsByCountry(value).toPromise().then(r => {
            this.filteredLocations = r.$values;
            this.trip.locationID = 0;
          });
          if (!this.pageFields[InputTypes.Country].isValid) {
            this.runValidation(InputTypes.Country);
          }
        break;

      case InputTypes.Location:
          if (!this.pageFields[InputTypes.Location].isValid) {
            this.runValidation(InputTypes.Location);
          }
        break;
    }
  }

  onCancelAddTrip() {
    this.dialogService.isDialogOpen = false;
  }

  onSubmit() {
    this.runValidation(InputTypes.TripName);
    this.runValidation(InputTypes.Region);
    this.runValidation(InputTypes.Country);
    this.runValidation(InputTypes.Location);

    if(!this.isPageValid) {
      return;
    }

    this.tripService.saveNewTrip(this.trip).subscribe(
      (response) => {
        this.trip = this.tripService.initializeNewTrip();
        this.dialogService.isDialogOpen = false;
        this.itemAdded.emit();
      },
      (error) => {
        console.error('An error occurred:', error);
      }
    );
  }

  runValidation(inputType: InputTypes) {
    switch(inputType) {
      case InputTypes.TripName:
          this.pageFields[InputTypes.TripName].isValid = this.trip.name !== '';
        break;
      case InputTypes.Region:
          this.pageFields[InputTypes.Region].isValid = this.trip.regionID !== 0;
        break;
      case InputTypes.Country:
          if (this.trip.regionID !== 0) {
            this.pageFields[InputTypes.Country].isValid = this.trip.countryID !== 0;
          }
        break;
      case InputTypes.Location:
          if (this.trip.countryID !== 0) {
            this.pageFields[InputTypes.Location].isValid = this.trip.locationID !== 0;
          }
        break;
    }
    
    this.isPageValid = this.pageFields[InputTypes.TripName].isValid &&
      this.pageFields[InputTypes.Region].isValid &&
      this.pageFields[InputTypes.Country].isValid &&
      this.pageFields[InputTypes.Location].isValid
  }
}

export interface PageFields {
  inputType: InputTypes;
  isValid: boolean;
}

enum InputTypes {
  TripName = 0,
  Region = 1,
  Country = 2,
  Location = 3
}
