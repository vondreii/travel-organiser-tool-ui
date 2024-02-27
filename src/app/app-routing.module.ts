import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './pages/dashboard.component';
import { BrowseComponent } from './pages/browse.component';
import { MyTripsComponent } from './pages/myTrips.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'browse', component: BrowseComponent },
  { path: 'myTrips', component: MyTripsComponent }
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
