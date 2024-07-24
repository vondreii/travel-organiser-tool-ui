import { Component, OnInit, HostListener  } from '@angular/core';
import { Country, Destination, TerrainTypes } from 'src/app/models/locationModels';
import { LocationService } from 'src/app/services/location.service';
import { PopulationTypes, ClimateTypes, TerrainType } from 'src/app/models/locationModels';

@Component({
  selector: 'app-browse',
  templateUrl: './browse.component.html'
})
export class BrowseComponent implements OnInit {
  allCountries: Country[] = [];
  filteredDestinations: Destination[] = [];
  pageNumbers: number[] = [];
  take: number = 18;
  currentPage: number = 1;

  filters: FilterFields; 
  filterTypes = FilterTypes;
  currentFilterType: FilterTypes = 0;

  constructor(private locationService: LocationService) { 
    this.filters = {
      populationTypeId: 0, 
      climateTypeId: 0,
      terrainTypeId: 0
    }
  }

  ngOnInit(): void {
    this.locationService.getAllCountries(0, this.take).toPromise().then(r => {
        this.allCountries = r.Items;
        const totalPages = Math.ceil(r.TotalCount / this.take);
        this.pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
    });
  }

  onFilterTypeChange(newFilterType: number) {
    this.currentFilterType = newFilterType;

    switch(newFilterType) {
      case this.filterTypes.Countries: 
        this.filters = { populationTypeId: 0, climateTypeId: 0, terrainTypeId: 0 };
        break;
      case this.filterTypes.Cities:    
        this.filters = { populationTypeId: PopulationTypes.City, climateTypeId: 0, terrainTypeId: 0 };
        break;
      case this.filterTypes.Towns:     
        this.filters = { populationTypeId: PopulationTypes.Town, climateTypeId: 0, terrainTypeId: 0 };
        break;
      case this.filterTypes.Sunny:  
        this.filters = { populationTypeId: 0, climateTypeId: ClimateTypes.Sunny, terrainTypeId: 0 };
        break;
      case this.filterTypes.Tropical:  
        this.filters = { populationTypeId: 0, climateTypeId: ClimateTypes.Tropical, terrainTypeId: 0 };
        break;
      case this.filterTypes.Chilly:   
        this.filters = { populationTypeId: 0, climateTypeId: ClimateTypes.Chilly, terrainTypeId: 0 };
        break;
      case this.filterTypes.Snowy:  
        this.filters = { populationTypeId: 0, climateTypeId: ClimateTypes.Snowy, terrainTypeId: 0 };
        break;
      case this.filterTypes.Mountains: 
        this.filters = { populationTypeId: 0, climateTypeId: 0, terrainTypeId: TerrainTypes.Mountains };
        break;
      case this.filterTypes.Rural:     
        this.filters = { populationTypeId: PopulationTypes.RuralNonUrban, climateTypeId: 0, terrainTypeId: 0 };
        break;
    }

    this.refreshPage(1);
  }

  isCurrentPage(pageNumber: number): boolean {
    return pageNumber === this.currentPage;
  }

  refreshPage(pageNumber: number) {
    this.currentPage = pageNumber;
    const skip = (pageNumber - 1) * this.take;

    if (this.currentFilterType === this.filterTypes.Countries) {
      this.locationService.getAllCountries(skip, this.take).toPromise().then(r => {
        this.allCountries = r.Items;
        const totalPages = Math.ceil(r.TotalCount / this.take);
        this.pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    }
    else {
      this.locationService.getFilteredDestinations(skip, this.take, this.filters.populationTypeId, this.filters.climateTypeId, this.filters.terrainTypeId).toPromise().then(r => {
        this.filteredDestinations = r.Items;
        const totalPages = Math.ceil(r.TotalCount / this.take);
        this.pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    }
  }
}

export interface FilterFields {
  populationTypeId: number;
  climateTypeId: number;
  terrainTypeId: number;
}

enum FilterTypes {
  Countries = 0,
  Cities = 1,
  Towns = 2,
  Sunny = 3,
  Tropical = 4,
  Chilly = 5,
  Snowy = 6,
  Mountains = 7,
  Rural = 8
}
