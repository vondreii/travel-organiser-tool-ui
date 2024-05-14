import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BrowseComponent } from './pages/browse/browse.component';
import { MyTripsComponent } from './pages/myTrips/myTrips.component';
import { EditTripComponent } from './pages/myTrips/editTrip.component';

const routes: Routes = [
  { path: '', component: BrowseComponent },
  { path: 'browse', component: BrowseComponent },
  { path: 'myTrips', component: MyTripsComponent },
  { path: 'editTrip/:id', component: EditTripComponent }
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
