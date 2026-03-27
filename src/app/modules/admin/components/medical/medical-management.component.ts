import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SpecialtyService } from '../../../../shared/services/specialty.service';
import { MedicalService } from '../../../../shared/services/medical.service';
import { Specialty } from '../../../../shared/models/specialty.model';
import { Disease, Symptom } from '../../../../shared/models/medical.model';

@Component({
  selector: 'app-medical-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './medical-management.component.html',
  styleUrls: ['./medical-management.component.css']
})
export class MedicalManagementComponent implements OnInit {
  specialties: Specialty[] = [];
  diseases: Disease[] = [];
  activeTab: 'specialties' | 'diseases' | 'symptoms' = 'specialties';
  loading = false;

  constructor(
    private specialtyService: SpecialtyService,
    private medicalService: MedicalService
  ) {}

  ngOnInit(): void {
    this.loadSpecialties();
    this.loadDiseases();
  }

  loadSpecialties(): void {
    this.specialtyService.getAllSpecialties().subscribe({
      next: (data) => this.specialties = data,
      error: (error) => console.error('Error loading specialties:', error)
    });
  }

  loadDiseases(): void {
    this.medicalService.getAllDiseases().subscribe({
      next: (data) => this.diseases = data,
      error: (error) => console.error('Error loading diseases:', error)
    });
  }

  deleteSpecialty(id: number): void {
    if (confirm('Delete this specialty?')) {
      this.specialtyService.deleteSpecialty(id).subscribe({
        next: () => this.loadSpecialties(),
        error: (error) => console.error('Error:', error)
      });
    }
  }

  deleteDisease(id: number): void {
    if (confirm('Delete this disease?')) {
      this.medicalService.deleteDisease(id).subscribe({
        next: () => this.loadDiseases(),
        error: (error) => console.error('Error:', error)
      });
    }
  }
}
