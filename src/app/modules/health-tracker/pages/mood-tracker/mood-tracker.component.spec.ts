import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { MoodTrackerComponent } from './mood-tracker.component';
import { HealthTrackerService } from '../../../../shared/services/health-tracker.service';

describe('MoodTrackerComponent', () => {
  let component: MoodTrackerComponent;
  let fixture: ComponentFixture<MoodTrackerComponent>;
  let mockHealthTrackerService: jasmine.SpyObj<HealthTrackerService>;

  const mockMoodHistory = {
    userId: 1,
    moods: [
      { id: 1, userId: 1, mood: 'HAPPY' as const, intensity: 8, timestamp: new Date().toISOString() }
    ],
    dateRange: '7d',
    average: 7.5
  };

  beforeEach(async () => {
    mockHealthTrackerService = jasmine.createSpyObj('HealthTrackerService', [
      'getMoodHistoryWithAnalytics',
      'logMood'
    ]);

    // Set default return values
    mockHealthTrackerService.getMoodHistoryWithAnalytics.and.returnValue(of(mockMoodHistory));
    mockHealthTrackerService.logMood.and.returnValue(of({ id: 1, userId: 1, mood: 'HAPPY' as const, intensity: 8, timestamp: new Date().toISOString() }));

    await TestBed.configureTestingModule({
      imports: [MoodTrackerComponent, ReactiveFormsModule],
      providers: [
        { provide: HealthTrackerService, useValue: mockHealthTrackerService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MoodTrackerComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    fixture.detectChanges();
    expect(component.moodForm).toBeDefined();
    expect(component.moodForm.get('mood')).toBeDefined();
    expect(component.moodForm.get('intensity')).toBeDefined();
    expect(component.moodForm.get('notes')).toBeDefined();
  });

  it('should load mood history on init', () => {
    fixture.detectChanges();
    expect(mockHealthTrackerService.getMoodHistoryWithAnalytics).toHaveBeenCalled();
  });

  it('should handle form submission with valid data', () => {
    fixture.detectChanges();

    component.moodForm.patchValue({
      mood: 'HAPPY',
      intensity: 8,
      notes: 'Feeling great'
    });

    expect(component.moodForm.valid).toBe(true);

    component.onSubmit();

    expect(mockHealthTrackerService.logMood).toHaveBeenCalled();
  });

  it('should not submit form with invalid data', () => {
    fixture.detectChanges();

    component.moodForm.patchValue({
      mood: '',
      intensity: null
    });

    component.onSubmit();

    expect(component.moodForm.invalid).toBe(true);
    expect(mockHealthTrackerService.logMood).not.toHaveBeenCalled();
  });

  it('should handle service error', () => {
    mockHealthTrackerService.logMood.and.returnValue(throwError(() => ({ error: { message: 'Service error' } })));

    fixture.detectChanges();

    component.moodForm.patchValue({
      mood: 'SAD',
      intensity: 4,
      notes: 'Not feeling well'
    });

    component.onSubmit();

    expect(component.error).toBeTruthy();
  });

  it('should display mood options', () => {
    fixture.detectChanges();
    expect(component.moodOptions).toBeDefined();
    expect(component.moodOptions.length).toBeGreaterThan(0);
  });

  it('should reset form after successful submission', fakeAsync(() => {
    fixture.detectChanges();

    component.moodForm.patchValue({
      mood: 'HAPPY',
      intensity: 8,
      notes: 'Feeling great'
    });

    component.onSubmit();
    tick();

    expect(component.moodForm.get('mood')?.value).toBe('HAPPY');
    expect(component.moodForm.get('intensity')?.value).toBe(5);
  }));

  it('should accept intensity between 1 and 10', () => {
    fixture.detectChanges();

    component.moodForm.patchValue({
      mood: 'HAPPY',
      intensity: 5,
      notes: 'Neutral'
    });

    expect(component.moodForm.valid).toBe(true);
  });

  it('should reject intensity outside valid range', () => {
    fixture.detectChanges();

    component.moodForm.patchValue({
      mood: 'HAPPY',
      intensity: 15,
      notes: 'Invalid'
    });

    expect(component.moodForm.get('intensity')?.valid).toBe(false);
  });
});
