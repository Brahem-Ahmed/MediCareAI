import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Appointment, DoctorAvailability } from '../models/appointment.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private apiUrl = `${environment.apiUrl}/appointments`;
  private availabilityUrl = `${environment.apiUrl}/availability`;

  constructor(private http: HttpClient) {}

  // Appointments
  getAllAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(this.apiUrl);
  }

  getAppointmentById(id: number): Observable<Appointment> {
    return this.http.get<Appointment>(`${this.apiUrl}/${id}`);
  }

  getMyAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.apiUrl}/me`);
  }

  getDoctorAppointments(doctorId: number): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.apiUrl}/doctor/${doctorId}`);
  }

  createAppointment(appointment: Appointment): Observable<Appointment> {
    return this.http.post<Appointment>(this.apiUrl, appointment);
  }

  updateAppointment(id: number, appointment: Partial<Appointment>): Observable<Appointment> {
    return this.http.put<Appointment>(`${this.apiUrl}/${id}`, appointment);
  }

  cancelAppointment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  markAsNoShow(id: number): Observable<Appointment> {
    return this.http.post<Appointment>(`${this.apiUrl}/${id}/no-show`, {});
  }

  // Doctor Availability
  getDoctorAvailability(doctorId: number): Observable<DoctorAvailability[]> {
    return this.http.get<DoctorAvailability[]>(`${this.availabilityUrl}/doctor/${doctorId}`);
  }

  createAvailability(availability: DoctorAvailability): Observable<DoctorAvailability> {
    return this.http.post<DoctorAvailability>(this.availabilityUrl, availability);
  }

  updateAvailability(id: number, availability: Partial<DoctorAvailability>): Observable<DoctorAvailability> {
    return this.http.put<DoctorAvailability>(`${this.availabilityUrl}/${id}`, availability);
  }

  deleteAvailability(id: number): Observable<void> {
    return this.http.delete<void>(`${this.availabilityUrl}/${id}`);
  }
}
