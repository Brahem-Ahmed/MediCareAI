import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { ActivityTrackerComponent } from './activity-tracker.component';
import { HealthTrackerService } from '../../../../shared/services/health-tracker.service';

describe('ActivityTrackerComponent', () => {
  let component: ActivityTrackerComponent;
  let fixture: ComponentFixture<ActivityTrackerComponent>;
  let mockHealthTrackerService: jasmine.SpyObj<HealthTrackerService>;

  beforeEach(async () => {
    mockHealthTrackerService = jasmine.createSpyObj('HealthTrackerService', [
      'getActivityHistory',
      'logActivity'
    ]);

    // Set default return values
    mockHealthTrackerService.getActivityHistory.and.returnValue(of([]));
    mockHealthTrackerService.logActivity.and.returnValue(of({
      id: 1,
      userId: 1,
      type: 'RUNNING' as const,
      duration: 30,
      intensity: 'HIGH' as const,
      timestamp: new Date().toISOString()
    } as any));

    await TestBed.configureTestingModule({
      imports: [ActivityTrackerComponent, ReactiveFormsModule],
      providers: [
        { provide: HealthTrackerService, useValue: mockHealthTrackerService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ActivityTrackerComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    fixture.detectChanges();
    expect(component.activityForm).toBeDefined();
    expect(component.activityForm.get('type')).toBeDefined();
    expect(component.activityForm.get('duration')).toBeDefined();
    expect(component.activityForm.get('intensity')).toBeDefined();
    expect(component.activityForm.get('notes')).toBeDefined();
  });

  it('should load activity history on init', () => {
    const mockActivityData = [
      { id: 1, userId: 1, type: 'RUNNING' as const, duration: 30, intensity: 'HIGH' as const, timestamp: new Date().toISOString() } as any
    ];
    mockHealthTrackerService.getActivityHistory.and.returnValue(of(mockActivityData));

    fixture.detectChanges();

    expect(mockHealthTrackerService.getActivityHistory).toHaveBeenCalled();
  });

  it('should handle form submission with valid data', () => {
    const mockResponse = { id: 1, userId: 1, type: 'RUNNING', duration: 45, intensity: 'HIGH', timestamp: new Date().toISOString() } as any;
    mockHealthTrackerService.logActivity.and.returnValue(of(mockResponse));

    fixture.detectChanges();

    component.activityForm.patchValue({
      type: 'RUNNING',
      duration: 45,
      intensity: 'HIGH',
      notes: 'Morning run'
    });

    expect(component.activityForm.valid).toBe(true);

    component.onSubmit();

    expect(mockHealthTrackerService.logActivity).toHaveBeenCalled();
  });

  it('should not submit form with invalid data', () => {
    fixture.detectChanges();

    component.activityForm.patchValue({
      type: '',
      duration: null
    });

    component.onSubmit();

    expect(component.activityForm.invalid).toBe(true);
    expect(mockHealthTrackerService.logActivity).not.toHaveBeenCalled();
  });

  it('should handle service error', () => {
    const mockError = { error: { message: 'Service error' } };
    mockHealthTrackerService.logActivity.and.returnValue(throwError(() => mockError));

    fixture.detectChanges();

    component.activityForm.patchValue({
      type: 'CYCLING',
      duration: 60,
      intensity: 'MEDIUM',
      notes: 'Evening cycle'
    });

    component.onSubmit();

    expect(component.error).toBeTruthy();
  });

  it('should validate duration is positive', () => {
    fixture.detectChanges();

    component.activityForm.patchValue({
      type: 'WALKING',
      duration: 30,
      intensity: 'LOW',
      notes: 'Casual walk'
    });

    expect(component.activityForm.valid).toBe(true);
  });

  it('should reject negative or zero duration', () => {
    fixture.detectChanges();

    component.activityForm.patchValue({
      type: 'RUNNING',
      duration: 0,
      intensity: 'HIGH',
      notes: 'Invalid'
    });

    expect(component.activityForm.get('duration')?.valid).toBe(false);
  });

  it('should have activity type options', () => {
    fixture.detectChanges();
    expect(component.activityTypes).toBeDefined();
    expect(component.activityTypes.length).toBeGreaterThan(0);
  });

  it('should have intensity level options', () => {
    fixture.detectChanges();
    expect(component.intensityLevels).toBeDefined();
    expect(component.intensityLevels.length).toBeGreaterThan(0);
  });

  it('should reset form after successful submission', (done) => {
    const mockResponse = { id: 1, userId: 1, type: 'SWIMMING' as const, duration: 45, intensity: 'MODERATE' as const, timestamp: new Date().toISOString() };
    mockHealthTrackerService.logActivity.and.returnValue(of(mockResponse));

    fixture.detectChanges();

    component.activityForm.patchValue({
      type: 'SWIMMING',
      duration: 45,
      intensity: 'MODERATE',
      notes: 'Pool time'
    });

    component.onSubmit();

    setTimeout(() => {
      expect(component.activityForm.get('type')?.value).toBeNull();
      done();
    }, 100);
  });
});
