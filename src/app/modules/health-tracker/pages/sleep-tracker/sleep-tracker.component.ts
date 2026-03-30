import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HealthTrackerService } from '../../../../shared/services/health-tracker.service';

interface SleepLog {
  id?: number;
  date: string;
  bedTime: string;
  wakeTime: string;
  totalDuration: number; // in hours
  quality: number; // 1-10 scale
  disturbances?: string[];
  notes?: string;
}

@Component({
  selector: 'app-sleep-tracker',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sleep-tracker.component.html',
  styleUrls: ['./sleep-tracker.component.css']
})
export class SleepTrackerComponent implements OnInit {
  sleepForm!: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  success = '';
  sleepHistory: SleepLog[] = [];
  averageSleep = 0;
  averageQuality = 0;

  private fb = inject(FormBuilder);
  private healthTrackerService = inject(HealthTrackerService);

  ngOnInit(): void {
    this.initializeForm();
    this.loadSleepHistory();
  }

  private initializeForm(): void {
    this.sleepForm = this.fb.group({
      date: ['', Validators.required],
      bedTime: ['', Validators.required],
      wakeTime: ['', Validators.required],
      quality: ['', [Validators.required, Validators.min(1), Validators.max(10)]],
      disturbances: [''],
      notes: ['']
    });
  }

  private loadSleepHistory(): void {
    const userId = parseInt(localStorage.getItem('userId') || '0', 10);
    this.healthTrackerService.getSleepHistory(userId, '30d').subscribe({
      next: (data: any) => {
        this.sleepHistory = data;
        this.calculateAverages();
      },
      error: (error: any) => {
        console.error('Error loading sleep history:', error);
      }
    });
  }

  private calculateAverages(): void {
    if (this.sleepHistory.length > 0) {
      const totalDuration = this.sleepHistory.reduce((acc, item) => acc + item.totalDuration, 0);
      const totalQuality = this.sleepHistory.reduce((acc, item) => acc + item.quality, 0);
      this.averageSleep = Math.round((totalDuration / this.sleepHistory.length) * 10) / 10;
      this.averageQuality = Math.round((totalQuality / this.sleepHistory.length) * 10) / 10;
    }
  }

  calculateDuration(): number {
    const bedTime = this.sleepForm.get('bedTime')?.value;
    const wakeTime = this.sleepForm.get('wakeTime')?.value;

    if (!bedTime || !wakeTime) return 0;

    const bed = new Date(`2000-01-01 ${bedTime}`);
    const wake = new Date(`2000-01-01 ${wakeTime}`);

    // Handle case where wake time is the next day
    if (wake < bed) {
      wake.setDate(wake.getDate() + 1);
    }

    const diff = (wake.getTime() - bed.getTime()) / (1000 * 60 * 60);
    return Math.round(diff * 10) / 10;
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.sleepForm.invalid) {
      return;
    }

    this.loading = true;
    const userId = parseInt(localStorage.getItem('userId') || '0', 10);
    const bedTime = this.sleepForm.value.bedTime;
    const wakeTime = this.sleepForm.value.wakeTime;
    const date = this.sleepForm.value.date;

    const bedTimeDate = new Date(`${date}T${bedTime}`);
    const wakeTimeDate = new Date(`${date}T${wakeTime}`);

    // Handle case where wake time is the next day
    if (wakeTimeDate < bedTimeDate) {
      wakeTimeDate.setDate(wakeTimeDate.getDate() + 1);
    }

    const sleepWithUserId = {
      userId,
      duration: this.calculateDuration(),
      quality: this.sleepForm.value.quality,
      notes: this.sleepForm.value.notes || '',
      sleepStart: bedTimeDate.toISOString(),
      sleepEnd: wakeTimeDate.toISOString(),
      timestamp: new Date().toISOString()
    };

    this.healthTrackerService.logSleep(sleepWithUserId).subscribe({
      next: () => {
        this.loading = false;
        this.success = 'Sleep record added successfully!';
        this.sleepForm.reset();
        this.submitted = false;
        this.loadSleepHistory();
        setTimeout(() => {
          this.success = '';
        }, 3000);
      },
      error: (error: any) => {
        this.loading = false;
        this.error = error?.error?.message || 'Failed to record sleep';
      }
    });
  }

  getQualityLabel(quality: number): string {
    if (quality <= 2) return 'Poor';
    if (quality <= 4) return 'Fair';
    if (quality <= 6) return 'Good';
    if (quality <= 8) return 'Very Good';
    return 'Excellent';
  }

  getQualityColor(quality: number): string {
    if (quality <= 2) return 'danger';
    if (quality <= 4) return 'warning';
    if (quality <= 6) return 'info';
    if (quality <= 8) return 'primary';
    return 'success';
  }

  isHealthyDuration(hours: number): boolean {
    return hours >= 7 && hours <= 9;
  }

  get f() {
    return this.sleepForm.controls;
  }
}
