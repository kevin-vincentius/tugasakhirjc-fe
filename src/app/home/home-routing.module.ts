import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { GuardService } from '../core/services/guard.service';
import { RoomDetailComponent } from './pages/home/pages/room-detail/room-detail.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { MyBookingsComponent } from './pages/my-bookings/my-bookings.component';
import { ListBookingComponent } from './pages/list-bookings/list-booking.component';
import { UserManagementComponent } from './pages/user-management/user-management.component';
import { CalendarComponent } from './pages/home/pages/calendar/calendar.component';

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [GuardService] },
  { path: 'home', component: HomeComponent, canActivate: [GuardService] },
  // { path: 'room/:roomNumber', component: RoomDetailComponent, canActivate: [GuardService] },
  { path: 'room/:roomNumber', component: CalendarComponent, canActivate: [GuardService]},
  { path: 'my-bookings', component: MyBookingsComponent, canActivate: [GuardService] },
  { path: 'profile', component: ProfileComponent, canActivate: [GuardService] },
  { path: 'list-bookings', component: ListBookingComponent, canActivate: [GuardService] },
  { path: 'user-management', component: UserManagementComponent, canActivate: [GuardService]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
