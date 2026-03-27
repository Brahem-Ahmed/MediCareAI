import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AppointmentService } from '../../../../shared/services/appointment.service';
import { Appointment } from '../../../../shared/models/appointment.model';

@Component({
  selector: 'app-appointment-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './appointment-list.component.html',
  styleUrls: ['./appointment-list.component.css']
})
export class AppointmentListComponent implements OnInit {
  appointments: Appointment[] = [];
  loading = false;
  error: string | null = null;
  selectedStatus: string = 'ALL';

  constructor(
    private appointmentService: AppointmentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments(): void {
    this.loading = true;
    this.error = null;
    // Note: You may need to create an admin endpoint for all appointments
    this.appointmentService.getAllAppointments().subscribe({
      next: (appointments) => {
        this.appointments = appointments;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load appointments';
        this.loading = false;
        console.error('Error loading appointments:', error);
      }
    });
  }

  get filteredAppointments(): Appointment[] {
    if (this.selectedStatus === 'ALL') {
      return this.appointments;
    }
    return this.appointments.filter(app => app.status === this.selectedStatus);
  }

  markAsNoShow(id: number): void {
    this.appointmentService.markAsNoShow(id).subscribe({
      next: () => {
        this.loadAppointments();
      },
      error: (error) => {
        console.error('Error marking as no-show:', error);
      }
    });
  }

  cancelAppointment(id: number): void {
    if (confirm('Cancel this appointment?')) {
      this.appointmentService.cancelAppointment(id).subscribe({
        next: () => {
          this.loadAppointments();
        },
        error: (error) => {
          console.error('Error canceling appointment:', error);
        }
      });
    }
  }

  scheduleAppointment(): void {
    this.router.navigate(['/admin/appointments/create']);
  }
}
