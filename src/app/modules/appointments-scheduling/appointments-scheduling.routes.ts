import { Routes } from '@angular/router';

import { AuthGuard } from '../../services/auth.guard';
import { DashboardShellComponent } from '../../shared/components/dashboard-shell/dashboard-shell.component';

export const APPOINTMENTS_SCHEDULING_ROUTES: Routes = [
  {
    path: 'appointments',
    component: DashboardShellComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN', 'DOCTOR', 'NURSE', 'PATIENT'] },
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('../admin/components/appointments/appointment-list.component').then((m) => m.AppointmentListComponent)
      },
      {
        path: '',
        loadComponent: () => import('../admin/components/appointments/appointment-list.component').then((m) => m.AppointmentListComponent)
      },
      {
        path: 'create',
        loadComponent: () => import('../admin/components/appointments/appointment-create.component').then((m) => m.AppointmentCreateComponent)
      }
    ]
  }
];
