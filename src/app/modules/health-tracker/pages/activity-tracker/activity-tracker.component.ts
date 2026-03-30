import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HealthTrackerService } from '../../../../shared/services/health-tracker.service';

interface ActivityLog {
  id?: number;
  type: 'WALKING' | 'RUNNING' | 'CYCLING' | 'SWIMMING' | 'YOGA' | 'GYM' | 'SPORTS' | 'HIKING' | 'SPORTS_OTHER';
  duration: number; // in minutes
  caloriesBurned?: number;
  distance?: number; // in km
  intensity: 'LOW' | 'MODERATE' | 'HIGH';
  notes?: string;
  timestamp: string;
}

@Component({
  selector: 'app-activity-tracker',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './activity-tracker.component.html',
  styleUrls: ['./activity-tracker.component.css']
})
export class ActivityTrackerComponent implements OnInit {
  activityForm!: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  success = '';
  activityHistory: ActivityLog[] = [];
  totalDuration = 0;
  totalCalories = 0;
  averageIntensity = 'MODERATE';

  activityTypes = ['WALKING', 'RUNNING', 'CYCLING', 'SWIMMING', 'YOGA', 'GYM', 'SPORTS', 'HIKING', 'SPORTS_OTHER'];
  intensityLevels = ['LOW', 'MODERATE', 'HIGH'];

  private fb = inject(FormBuilder);
  private healthTrackerService = inject(HealthTrackerService);

  ngOnInit(): void {
    this.initializeForm();
    this.loadActivityHistory();
  }

  private initializeForm(): void {
    this.activityForm = this.fb.group({
      type: ['', Validators.required],
      duration: ['', [Validators.required, Validators.min(1), Validators.max(1440)]],
      caloriesBurned: [''],
      distance: [''],
      intensity: ['MODERATE', Validators.required],
      notes: ['']
    });
  }

  private loadActivityHistory(): void {
    const userId = parseInt(localStorage.getItem('userId') || '0', 10);
    this.healthTrackerService.getActivityHistory(userId, '30d').subscribe({
      next: (data: any) => {
        this.activityHistory = data;
        this.calculateStats();
      },
      error: (error: any) => {
        console.error('Error loading activity history:', error);
      }
    });
  }

  private calculateStats(): void {
    if (this.activityHistory.length > 0) {
      this.totalDuration = this.activityHistory.reduce((acc, item) => acc + item.duration, 0);
      this.totalCalories = this.activityHistory.reduce((acc, item) => acc + (item.caloriesBurned || 0), 0);
    }
  }

  calculateCalories(): number {
    const type = this.activityForm.get('type')?.value;
    const duration = this.activityForm.get('duration')?.value;
    const intensity = this.activityForm.get('intensity')?.value;

    if (!type || !duration) return 0;

    // Rough estimates of calories burned per minute by activity type and intensity
    const calorieRates: any = {
      WALKING: { LOW: 3, MODERATE: 5, HIGH: 7 },
      RUNNING: { LOW: 8, MODERATE: 12, HIGH: 15 },
      CYCLING: { LOW: 6, MODERATE: 10, HIGH: 15 },
      SWIMMING: { LOW: 7, MODERATE: 10, HIGH: 12 },
      YOGA: { LOW: 2, MODERATE: 3, HIGH: 4 },
      GYM: { LOW: 4, MODERATE: 7, HIGH: 10 },
      SPORTS: { LOW: 5, MODERATE: 8, HIGH: 11 },
      HIKING: { LOW: 5, MODERATE: 8, HIGH: 11 },
      SPORTS_OTHER: { LOW: 5, MODERATE: 8, HIGH: 11 }
    };

    const rate = calorieRates[type]?.[intensity] || 5;
    return Math.round(duration * rate);
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.activityForm.invalid) {
      return;
    }

    this.loading = true;
    const userId = parseInt(localStorage.getItem('userId') || '0', 10);

    const activityWithUserId = {
      userId,
      type: this.activityForm.value.type,
      duration: this.activityForm.value.duration,
      caloriesBurned: this.calculateCalories(),
      distance: this.activityForm.value.distance || null,
      intensity: this.activityForm.value.intensity,
      notes: this.activityForm.value.notes || '',
      timestamp: new Date().toISOString()
    };

    this.healthTrackerService.logActivity(activityWithUserId).subscribe({
      next: () => {
        this.loading = false;
        this.success = 'Activity recorded successfully!';
        this.activityForm.reset({ intensity: 'MODERATE' });
        this.submitted = false;
        this.loadActivityHistory();
        setTimeout(() => {
          this.success = '';
        }, 3000);
      },
      error: (error: any) => {
        this.loading = false;
        this.error = error?.error?.message || 'Failed to record activity';
      }
    });
  }

  getActivityIcon(type: string): string {
    const icons: any = {
      WALKING: '🚶',
      RUNNING: '🏃',
      CYCLING: '🚴',
      SWIMMING: '🏊',
      YOGA: '🧘',
      GYM: '💪',
      SPORTS: '⚽',
      HIKING: '🏔️',
      SPORTS_OTHER: '🏆'
    };
    return icons[type] || '🏃';
  }

  formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  }

  get f() {
    return this.activityForm.controls;
  }
}
