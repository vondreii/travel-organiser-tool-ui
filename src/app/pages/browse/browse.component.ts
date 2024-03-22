import { Component, OnInit, HostListener  } from '@angular/core';
import { Country } from 'src/app/models/country';
import { LocationService } from 'src/app/services/location.service';

@Component({
  selector: 'app-browse',
  templateUrl: './browse.component.html'
})
export class BrowseComponent implements OnInit {
  allCountries: Country[] = [];
  pageNumbers: number[] = [];
  take: number = 5;
  currentPage: number = 1;

  constructor(private locationService: LocationService) { }

  ngOnInit(): void {
    this.locationService.getAllCountries(0, this.take).toPromise().then(r => {
        this.allCountries = r.Items;
        const totalPages = Math.ceil(r.TotalCount / 5);
        this.pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
    });
  }

  isCurrentPage(pageNumber: number): boolean {
    return pageNumber === this.currentPage;
  }

  loadNewCountries(pageNumber: number) {
    this.currentPage = pageNumber;
    const skip = (pageNumber - 1) * this.take;

    this.locationService.getAllCountries(skip, this.take).toPromise().then(r => {
        this.allCountries = r.Items;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}
