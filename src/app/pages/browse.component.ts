import { Component, OnInit } from '@angular/core';
import { Country } from 'src/app/models/country';
import { LocationService } from 'src/app/services/location.service';

@Component({
  selector: 'app-browse',
  templateUrl: './browse.component.html'
})
export class BrowseComponent implements OnInit {
  allCountries: Country[] = [];

  constructor(private locationService: LocationService) { }

  ngOnInit(): void {
    // Just display a list of countries here
    // Todo: Fix
    // Also fix loading
    this.locationService.getAllCountries().toPromise().then(r => {
        this.allCountries = r.$values;
    });
  }

}
