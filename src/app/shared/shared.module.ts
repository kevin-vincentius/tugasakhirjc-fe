import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { MessageValidationComponent } from './components/message-validation/message-validation.component';
import { SidebarComponent } from './layouts/sidebar/sidebar.component';
import { NavbarRightComponent } from './layouts/navbar-right/navbar-right.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

@NgModule({
  declarations: [
    MessageValidationComponent,
    SidebarComponent,
    NavbarRightComponent,
  ],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  providers: [provideHttpClient()],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MessageValidationComponent,
    SidebarComponent,
    NavbarRightComponent,
  ],
})
export class SharedModule {}
