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

  constructor(
    private route: ActivatedRoute,
    private locationService: LocationService,
    private tripService: TripService,
  ) { 
    this.currentTrip = tripService.initializeNewTrip();
    this.editedTrip = tripService.initializeNewTrip();
    this.editedTripStop = tripService.initializeNewTripstop();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      // Retrieve the trip ID from route parameters
      const currentTripId = +params['id']; 

      this.tripService.getFilteredTrips(currentTripId, null).subscribe(r => {
        this.currentTrip = r[0];

        this.tripService.GetAllTripstops(currentTripId).subscribe(r => {
          this.currentTripStops = r;
          this.currentTripStops.forEach(t => {
            this.isEditTripStop.push(false);
          });
        });
      });
    });
  }

  onEditTripDetails() {
    this.isEditTrip = true;
    this.showOrHideEditButtons();

    this.editedTrip = { ...this.currentTrip };
  }

  onSaveTrip() {
    this.isEditTrip = false;
    this.showOrHideEditButtons();
    this.currentTrip = this.editedTrip;
  }

  onCancelEditingTrip() {
    this.isEditTrip = false;
    this.showOrHideEditButtons();
  }

  showOrHideEditButtons() {
    this.showEditButton = !this.isEditTripStop.some(x => x) && !this.isEditTrip;
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

  onCancelEditingTripStop(index: number) {
    this.isEditTripStop[index] = false; 
    this.showOrHideEditButtons();
  }

  onSaveTripstop(index: number) {
    this.isEditTripStop[index] = false; 
    this.showOrHideEditButtons();
    this.currentTripStops[index] = this.editedTripStop;
  }

  onInputChangeDropdown(inputType: InputTypes, data: any, index: number) {
    const value = parseInt(data.target.value);
    if(value === null || isNaN(value)) {
      return;
    }

    switch(inputType) {
      case InputTypes.Region:
          this.editedTripStop.RegionID = value;
          const region = this.allRegions.find(x => x.Id === value);
          region !== undefined ? this.editedTripStop.RegionName = region.Name : '';
          this.getFilteredCountries(value)
          break;

      case InputTypes.Country:
          this.editedTripStop.CountryID = value;
          const country = this.filteredCountries.find(x => x.Id === value);
          country !== undefined ? this.editedTripStop.CountryName = country.Name : '';
          this.getFilteredDestinations(value);
          break;

      case InputTypes.Destination:
          this.editedTripStop.DestinationID = value;
          const destination = this.filteredDestinations.find(x => x.Id === value);
          if (destination !== undefined) {
            this.editedTripStop.DestinationName = destination.Name;
            this.editedTripStop.DestinationImageFileName = destination.ImageFilename;
          }
          break;
    }
  }

  getFilteredCountries(regionId: number) {
    this.locationService.getAllCountriesByRegion(regionId).toPromise().then(r => {
      this.filteredCountries = r;
      this.editedTripStop.CountryID = this.filteredCountries[0].Id;
      this.editedTripStop.CountryName = this.filteredCountries[0].Name;
      this.getFilteredDestinations(this.editedTripStop.CountryID);
    });
  }

  getFilteredDestinations(countryId: number) {
    this.locationService.getAllDestinationsByCountry(countryId).toPromise().then(r => {
      this.filteredDestinations = r;
      this.editedTripStop.DestinationID = this.filteredDestinations[0].Id;
      this.editedTripStop.DestinationName = this.filteredDestinations[0].Name;
      this.editedTripStop.DestinationImageFileName = this.filteredDestinations[0].ImageFilename;
    });
  }
}

enum InputTypes {
  TripName = 0,
  DestinationName = 1,
  Region = 2,
  Country = 3,
  Destination = 4
}