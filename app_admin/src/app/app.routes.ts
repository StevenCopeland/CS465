import { Routes } from '@angular/router';
import { AddTripComponent } from './add-trip/add-trip';
import { EditTripComponent } from './edit-trip/edit-trip';
import { TripListing } from './trip-listing/trip-listing';

export const routes: Routes = [
    { path: 'add-trip', component: AddTripComponent },
    { path: 'edit-trip', component: EditTripComponent },
    { path: '', component: TripListing, pathMatch: 'full' }
];
