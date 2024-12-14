import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './pages/home/home.component';
import { SharedModule } from '../shared/shared.module';
import { RoomDetailComponent } from './pages/home/pages/room-detail/room-detail.component';
import { FormsModule } from '@angular/forms';
import { MyBookingsComponent } from './pages/my-bookings/my-bookings.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { ListBookingComponent } from './pages/list-bookings/list-booking.component';
import { UserManagementComponent } from './pages/user-management/user-management.component';
import {
  AgendaService,
  DayService,
  MonthService,
  ScheduleModule,
  WeekService,
  WorkWeekService,
} from '@syncfusion/ej2-angular-schedule';
import { CalendarComponent } from './pages/home/pages/calendar/calendar.component';

@NgModule({
  declarations: [
    HomeComponent,
    MyBookingsComponent,
    RoomDetailComponent,
    ProfileComponent,
    ListBookingComponent,
    UserManagementComponent,
    CalendarComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    HomeRoutingModule,
    SharedModule,
    ScheduleModule,
  ],
  providers: [
    DayService,
    WeekService,
    WorkWeekService,
    MonthService,
    AgendaService,
  ],
})
export class HomeModule {}
