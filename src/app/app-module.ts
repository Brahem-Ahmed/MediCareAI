import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { LandingComponent } from './landing/landing.component';
import { AdminComponent } from './admin/admin.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { AuthInterceptor } from './services/auth.interceptor';

// Admin Module Components
import { DashboardComponent } from './admin/modules/dashboard/dashboard.component';
import { UserListComponent } from './admin/modules/user-management/user-list.component';
import { AppointmentListComponent } from './admin/modules/appointments/appointment-list.component';
import { MedicalManagementComponent } from './admin/modules/medical/medical-management.component';
import { EventsListComponent } from './admin/modules/events/events-list.component';
import { SubscriptionManagementComponent } from './admin/modules/subscriptions/subscription-management.component';
import { ForumManagementComponent } from './admin/modules/forum/forum-management.component';

@NgModule({
  declarations: [
    App,
    LandingComponent,
    AdminComponent,
    LoginComponent,
    SignupComponent,
    ForgotPasswordComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    FormsModule,
    // Admin Module Components (Standalone)
    DashboardComponent,
    UserListComponent,
    AppointmentListComponent,
    MedicalManagementComponent,
    EventsListComponent,
    SubscriptionManagementComponent,
    ForumManagementComponent
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(
      withInterceptorsFromDi()
    ),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [App]
})
export class AppModule { }
