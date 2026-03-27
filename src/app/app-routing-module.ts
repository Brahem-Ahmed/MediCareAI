import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { AdminComponent } from './admin/admin.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { AuthGuard } from './services/auth.guard';
import { DashboardComponent } from './admin/modules/dashboard/dashboard.component';
import { UserListComponent } from './admin/modules/user-management/user-list.component';
import { UserCreateComponent } from './admin/modules/user-management/user-create.component';
import { AppointmentListComponent } from './admin/modules/appointments/appointment-list.component';
import { AppointmentCreateComponent } from './admin/modules/appointments/appointment-create.component';
import { MedicalManagementComponent } from './admin/modules/medical/medical-management.component';
import { EventsListComponent } from './admin/modules/events/events-list.component';
import { SubscriptionManagementComponent } from './admin/modules/subscriptions/subscription-management.component';
import { ForumManagementComponent } from './admin/modules/forum/forum-management.component';

const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  {
    path: 'pharmacy',
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/pharmacy/pharmacy-home.component').then(m => m.PharmacyHomeComponent)
      },
      {
        path: 'medicines',
        loadComponent: () => import('./pages/pharmacy/medicine-catalog.component').then(m => m.MedicineCatalogComponent)
      },
      {
        path: 'medicines/:id',
        loadComponent: () => import('./pages/pharmacy/medicine-detail.component').then(m => m.MedicineDetailComponent)
      },
      {
        path: 'cart',
        loadComponent: () => import('./pages/pharmacy/cart.component').then(m => m.CartComponent)
      },
      {
        path: 'checkout',
        loadComponent: () => import('./pages/pharmacy/checkout.component').then(m => m.CheckoutComponent)
      },
      {
        path: 'order-confirmation',
        loadComponent: () => import('./pages/pharmacy/order-confirmation.component').then(m => m.OrderConfirmationComponent)
      },
      {
        path: 'prescriptions',
        loadComponent: () => import('./pages/pharmacy/prescriptions-list.component').then(m => m.PrescriptionsListComponent)
      },
      {
        path: 'inventory',
        loadComponent: () => import('./pages/pharmacy/inventory.component').then(m => m.InventoryComponent)
      },
      {
        path: 'refills',
        loadComponent: () => import('./pages/pharmacy/refills.component').then(m => m.RefillsComponent)
      }
    ]
  },
  { 
    path: 'admin', 
    component: AdminComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN'] },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'users', component: UserListComponent },
      { path: 'users/create', component: UserCreateComponent },
      { path: 'appointments', component: AppointmentListComponent },
      { path: 'appointments/create', component: AppointmentCreateComponent },
      { path: 'medical', component: MedicalManagementComponent },
      { path: 'events', component: EventsListComponent },
      { path: 'subscriptions', component: SubscriptionManagementComponent },
      { path: 'forum', component: ForumManagementComponent }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
