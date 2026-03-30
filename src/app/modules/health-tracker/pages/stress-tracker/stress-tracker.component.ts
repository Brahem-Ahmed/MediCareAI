import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HealthTrackerService } from '../../../../shared/services/health-tracker.service';

interface StressLevel {
  id?: number;
  level: number; // 1-10 scale
  timestamp: string;
  triggers?: string[];
  notes?: string;
}

@Component({
  selector: 'app-stress-tracker',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './stress-tracker.component.html',
  styleUrls: ['./stress-tracker.component.css']
})
export class StressTrackerComponent implements OnInit {
  stressForm!: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  success = '';
  stressHistory: StressLevel[] = [];
  averageStress = 0;

  private fb = inject(FormBuilder);
  private healthTrackerService = inject(HealthTrackerService);

  ngOnInit(): void {
    this.initializeForm();
    this.loadStressHistory();
  }

  private initializeForm(): void {
    this.stressForm = this.fb.group({
      stressLevel: ['', [Validators.required, Validators.min(1), Validators.max(10)]],
      triggers: [''],
      notes: ['']
    });
  }

  private loadStressHistory(): void {
    const userId = parseInt(localStorage.getItem('userId') || '0', 10);
    this.healthTrackerService.getStressHistory(userId, '30d').subscribe({
      next: (data: any) => {
        this.stressHistory = data;
        this.calculateAverageStress();
      },
      error: (error: any) => {
        console.error('Error loading stress history:', error);
      }
    });
  }

  private calculateAverageStress(): void {
    if (this.stressHistory.length > 0) {
      const sum = this.stressHistory.reduce((acc, item) => acc + item.level, 0);
      this.averageStress = Math.round((sum / this.stressHistory.length) * 10) / 10;
    }
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.stressForm.invalid) {
      return;
    }

    this.loading = true;
    const userId = parseInt(localStorage.getItem('userId') || '0', 10);
    const stressWithUserId = {
      userId,
      level: this.stressForm.value.stressLevel,
      trigger: this.stressForm.value.triggers || '',
      notes: this.stressForm.value.notes || '',
      timestamp: new Date().toISOString()
    };

    this.healthTrackerService.logStress(stressWithUserId).subscribe({
      next: () => {
        this.loading = false;
        this.success = 'Stress level recorded successfully!';
        this.stressForm.reset();
        this.submitted = false;
        this.loadStressHistory();
        setTimeout(() => {
          this.success = '';
        }, 3000);
      },
      error: (error: any) => {
        this.loading = false;
        this.error = error?.error?.message || 'Failed to record stress level';
      }
    });
  }

  getStressLabel(level: number): string {
    if (level <= 2) return 'Very Low';
    if (level <= 4) return 'Low';
    if (level <= 6) return 'Moderate';
    if (level <= 8) return 'High';
    return 'Very High';
  }

  getStressColor(level: number): string {
    if (level <= 2) return 'success';
    if (level <= 4) return 'info';
    if (level <= 6) return 'warning';
    if (level <= 8) return 'danger';
    return 'dark';
  }

  get f() {
    return this.stressForm.controls;
  }
}
