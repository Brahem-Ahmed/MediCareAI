import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Disease, Symptom, MedicalRecord } from '../models/medical.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MedicalService {
  private diseaseUrl = `${environment.apiUrl}/diseases`;
  private symptomUrl = `${environment.apiUrl}/symptoms`;
  private recordUrl = `${environment.apiUrl}/records`;

  constructor(private http: HttpClient) {}

  // Diseases
  getAllDiseases(): Observable<Disease[]> {
    return this.http.get<Disease[]>(this.diseaseUrl);
  }

  getDiseaseById(id: number): Observable<Disease> {
    return this.http.get<Disease>(`${this.diseaseUrl}/${id}`);
  }

  getDiseasesBySpecialty(specialtyId: number): Observable<Disease[]> {
    return this.http.get<Disease[]>(`${this.diseaseUrl}/by-specialty/${specialtyId}`);
  }

  createDisease(disease: Disease): Observable<Disease> {
    return this.http.post<Disease>(this.diseaseUrl, disease);
  }

  updateDisease(id: number, disease: Partial<Disease>): Observable<Disease> {
    return this.http.put<Disease>(`${this.diseaseUrl}/${id}`, disease);
  }

  deleteDisease(id: number): Observable<void> {
    return this.http.delete<void>(`${this.diseaseUrl}/${id}`);
  }

  // Symptoms
  getAllSymptoms(): Observable<Symptom[]> {
    return this.http.get<Symptom[]>(this.symptomUrl);
  }

  getSymptomById(id: number): Observable<Symptom> {
    return this.http.get<Symptom>(`${this.symptomUrl}/${id}`);
  }

  createSymptom(symptom: Symptom): Observable<Symptom> {
    return this.http.post<Symptom>(this.symptomUrl, symptom);
  }

  updateSymptom(id: number, symptom: Partial<Symptom>): Observable<Symptom> {
    return this.http.put<Symptom>(`${this.symptomUrl}/${id}`, symptom);
  }

  deleteSymptom(id: number): Observable<void> {
    return this.http.delete<void>(`${this.symptomUrl}/${id}`);
  }

  // Medical Records
  getAllRecords(): Observable<MedicalRecord[]> {
    return this.http.get<MedicalRecord[]>(this.recordUrl);
  }

  getMyRecords(): Observable<MedicalRecord[]> {
    return this.http.get<MedicalRecord[]>(`${this.recordUrl}/me`);
  }

  getRecordById(id: number): Observable<MedicalRecord> {
    return this.http.get<MedicalRecord>(`${this.recordUrl}/${id}`);
  }

  createRecord(patientId: number, record: MedicalRecord): Observable<MedicalRecord> {
    return this.http.post<MedicalRecord>(`${this.recordUrl}/patient/${patientId}`, record);
  }

  updateRecord(id: number, record: Partial<MedicalRecord>): Observable<MedicalRecord> {
    return this.http.put<MedicalRecord>(`${this.recordUrl}/${id}`, record);
  }

  deleteRecord(id: number): Observable<void> {
    return this.http.delete<void>(`${this.recordUrl}/${id}`);
  }
}
