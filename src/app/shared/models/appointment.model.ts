export interface Appointment {
  id?: number;
  doctorId: number;
  patientId: number;
  startTime: string;
  endTime: string;
  consultationType: 'IN_PERSON' | 'VIDEO' | 'PHONE';
  reasonForVisit?: string;
  timeZone?: string;
  urgent?: boolean;
  status?: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
}

export interface AppointmentDTO extends Appointment {}

export interface DoctorAvailability {
  id?: number;
  doctorId: number;
  startTime: string;
  endTime: string;
  blocked?: boolean;
  maxAppointments?: number;
}
