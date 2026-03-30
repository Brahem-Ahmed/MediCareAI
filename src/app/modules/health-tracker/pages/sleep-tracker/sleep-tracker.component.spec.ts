import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { SleepTrackerComponent } from './sleep-tracker.component';
import { HealthTrackerService } from '../../../../shared/services/health-tracker.service';

describe('SleepTrackerComponent', () => {
  let component: SleepTrackerComponent;
  let fixture: ComponentFixture<SleepTrackerComponent>;
  let mockHealthTrackerService: jasmine.SpyObj<HealthTrackerService>;

  beforeEach(async () => {
    mockHealthTrackerService = jasmine.createSpyObj('HealthTrackerService', [
      'getSleepHistory',
      'logSleep'
    ]);

    // Set default return values
    mockHealthTrackerService.getSleepHistory.and.returnValue(of([]));
    mockHealthTrackerService.logSleep.and.returnValue(of({
      id: 1,
      userId: 1,
      duration: 8,
      quality: 8,
      sleepStart: new Date().toISOString(),
      sleepEnd: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
      timestamp: new Date().toISOString()
    } as any));

    await TestBed.configureTestingModule({
      imports: [SleepTrackerComponent, ReactiveFormsModule],
      providers: [
        { provide: HealthTrackerService, useValue: mockHealthTrackerService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SleepTrackerComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    fixture.detectChanges();
    expect(component.sleepForm).toBeDefined();
    expect(component.sleepForm.get('date')).toBeDefined();
    expect(component.sleepForm.get('bedTime')).toBeDefined();
    expect(component.sleepForm.get('wakeTime')).toBeDefined();
    expect(component.sleepForm.get('quality')).toBeDefined();
  });

  it('should load sleep history on init', () => {
    const mockSleepData = [
      { id: 1, userId: 1, duration: 8, quality: 8, sleepStart: new Date().toISOString(), sleepEnd: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(), timestamp: new Date().toISOString() } as any
    ];
    mockHealthTrackerService.getSleepHistory.and.returnValue(of(mockSleepData));

    fixture.detectChanges();

    expect(mockHealthTrackerService.getSleepHistory).toHaveBeenCalled();
  });

  it('should handle form submission with valid data', () => {
    const mockResponse = { id: 1, userId: 1, duration: 8, quality: 8, sleepStart: new Date().toISOString(), sleepEnd: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(), timestamp: new Date().toISOString() } as any;
    mockHealthTrackerService.logSleep.and.returnValue(of(mockResponse));

    fixture.detectChanges();

    component.sleepForm.patchValue({
      date: new Date().toISOString().split('T')[0],
      bedTime: '22:00',
      wakeTime: '06:00',
      quality: 8,
      disturbances: [],
      notes: ''
    });

    expect(component.sleepForm.valid).toBe(true);

    component.onSubmit();

    expect(mockHealthTrackerService.logSleep).toHaveBeenCalled();
  });

  it('should not submit form with invalid data', () => {
    fixture.detectChanges();

    component.sleepForm.patchValue({
      date: '',
      bedTime: ''
    });

    component.onSubmit();

    expect(component.sleepForm.invalid).toBe(true);
  });

  it('should handle service error', () => {
    const mockError = { error: { message: 'Service error' } };
    mockHealthTrackerService.logSleep.and.returnValue(throwError(() => mockError));

    fixture.detectChanges();

    component.sleepForm.patchValue({
      date: new Date().toISOString().split('T')[0],
      bedTime: '23:00',
      wakeTime: '07:00',
      quality: 6
    });

    component.onSubmit();

    expect(component.error).toBeTruthy();
  });

  it('should validate sleep end is after sleep start', () => {
    fixture.detectChanges();

    component.sleepForm.patchValue({
      date: new Date().toISOString().split('T')[0],
      bedTime: '22:00',
      wakeTime: '06:00',
      quality: 8
    });

    expect(component.sleepForm.valid).toBe(true);
  });

  it('should have sleep quality field', () => {
    fixture.detectChanges();
    expect(component.sleepForm.get('quality')).toBeDefined();
  });

  it('should reset form after successful submission', (done) => {
    const mockResponse = { id: 1, userId: 1, duration: 8, quality: 8, sleepStart: new Date().toISOString(), sleepEnd: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(), timestamp: new Date().toISOString() } as any;
    mockHealthTrackerService.logSleep.and.returnValue(of(mockResponse));

    fixture.detectChanges();

    component.sleepForm.patchValue({
      date: new Date().toISOString().split('T')[0],
      bedTime: '22:00',
      wakeTime: '06:00',
      quality: 8
    });

    component.onSubmit();

    setTimeout(() => {
      expect(component.sleepForm.get('date')?.value).toBeNull();
      done();
    }, 100);
  });
});
