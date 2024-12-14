import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './pages/signin/login.component';
import { SharedModule } from '../shared/shared.module';
import { HomeModule } from '../home/home.module';

@NgModule({
  declarations: [LoginComponent],
  imports: [CommonModule, AuthRoutingModule, SharedModule, HomeModule],
})
export class AuthModule {}
