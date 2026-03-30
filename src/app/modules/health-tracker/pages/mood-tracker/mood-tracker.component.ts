import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HealthTrackerService } from '../../../../shared/services/health-tracker.service';
import { Mood, MoodHistory } from '../../../../shared/models/health-tracking.model';

@Component({
  selector: 'app-mood-tracker',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './mood-tracker.component.html',
  styleUrls: ['./mood-tracker.component.css']
})
export class MoodTrackerComponent implements OnInit {
  moodForm!: FormGroup;
  moodHistory: Mood[] = [];
  moodHistoryWithAnalytics: MoodHistory | null = null;
  loading = false;
  submitted = false;
  error = '';

  moodOptions = ['HAPPY', 'SAD', 'ANXIOUS', 'CALM', 'FRUSTRATED', 'CONTENT', 'NEUTRAL'];

  private formBuilder = inject(FormBuilder);
  private healthTrackerService = inject(HealthTrackerService);

  ngOnInit(): void {
    this.initializeForm();
    this.loadMoodHistory();
  }

  private initializeForm(): void {
    this.moodForm = this.formBuilder.group({
      mood: ['HAPPY', Validators.required],
      intensity: [5, [Validators.required, Validators.min(1), Validators.max(10)]],
      notes: ['']
    });
  }

  loadMoodHistory(): void {
    this.loading = true;
    const userId = parseInt(localStorage.getItem('userId') || '0', 10);

    this.healthTrackerService.getMoodHistoryWithAnalytics(userId, '7d').subscribe({
      next: (data) => {
        this.moodHistoryWithAnalytics = data;
        this.moodHistory = data.moods;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading mood history:', error);
        this.loading = false;
        this.error = 'Failed to load mood history';
      }
    });
  }

  onSubmit(): void {
    this.submitted = true;
    this.error = '';

    if (this.moodForm.invalid) {
      return;
    }

    this.loading = true;
    const userId = parseInt(localStorage.getItem('userId') || '0', 10);

    const moodData: Mood = {
      userId,
      mood: this.moodForm.value.mood,
      intensity: this.moodForm.value.intensity,
      notes: this.moodForm.value.notes,
      timestamp: new Date().toISOString()
    };

    this.healthTrackerService.logMood(moodData).subscribe({
      next: () => {
        this.loading = false;
        this.submitted = false;
        this.moodForm.reset({ mood: 'HAPPY', intensity: 5 });
        this.loadMoodHistory();
      },
      error: (error) => {
        this.loading = false;
        this.error = error?.error?.message || 'Failed to log mood';
      }
    });
  }

  deleteMood(id?: number): void {
    if (!id) return;

    if (confirm('Are you sure you want to delete this mood entry?')) {
      this.healthTrackerService.deleteMood(id).subscribe({
        next: () => {
          this.loadMoodHistory();
        },
        error: (error) => {
          this.error = 'Failed to delete mood entry';
        }
      });
    }
  }

  get f() {
    return this.moodForm.controls;
  }
}
