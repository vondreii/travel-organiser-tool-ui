import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; 

import { AppComponent } from './app.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { BrowseComponent } from './pages/browse/browse.component';
import { NavbarComponent } from './shared/navbar.component';
import { AddTripDialogComponent } from './pages/myTrips/addTripDialog.component';
import { MyTripsComponent } from './pages/myTrips/myTrips.component';
import { EditTripComponent } from './pages/myTrips/editTrip.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    DashboardComponent,
    AddTripDialogComponent,
    EditTripComponent,
    BrowseComponent,
    MyTripsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
