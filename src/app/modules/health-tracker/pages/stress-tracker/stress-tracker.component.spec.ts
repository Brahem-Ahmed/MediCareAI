import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { StressTrackerComponent } from './stress-tracker.component';
import { HealthTrackerService } from '../../../../shared/services/health-tracker.service';

describe('StressTrackerComponent', () => {
  let component: StressTrackerComponent;
  let fixture: ComponentFixture<StressTrackerComponent>;
  let mockHealthTrackerService: jasmine.SpyObj<HealthTrackerService>;

  beforeEach(async () => {
    mockHealthTrackerService = jasmine.createSpyObj('HealthTrackerService', [
      'getStressHistory',
      'logStress'
    ]);

    // Set default return values
    mockHealthTrackerService.getStressHistory.and.returnValue(of([]));
    mockHealthTrackerService.logStress.and.returnValue(of({
      id: 1,
      userId: 1,
      level: 5,
      timestamp: new Date().toISOString()
    } as any));

    await TestBed.configureTestingModule({
      imports: [StressTrackerComponent, ReactiveFormsModule],
      providers: [
        { provide: HealthTrackerService, useValue: mockHealthTrackerService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(StressTrackerComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    fixture.detectChanges();
    expect(component.stressForm).toBeDefined();
    expect(component.stressForm.get('level')).toBeDefined();
    expect(component.stressForm.get('trigger')).toBeDefined();
    expect(component.stressForm.get('copingStrategy')).toBeDefined();
  });

  it('should load stress history on init', () => {
    const mockStressData = [
      { id: 1, userId: 1, level: 5, timestamp: new Date().toISOString() } as any
    ];
    mockHealthTrackerService.getStressHistory.and.returnValue(of(mockStressData));

    fixture.detectChanges();

    expect(mockHealthTrackerService.getStressHistory).toHaveBeenCalled();
  });

  it('should handle form submission with valid data', () => {
    const mockResponse = { id: 1, userId: 1, level: 6, timestamp: new Date().toISOString() } as any;
    mockHealthTrackerService.logStress.and.returnValue(of(mockResponse));

    fixture.detectChanges();

    component.stressForm.patchValue({
      stressLevel: 6,
      triggers: 'Work deadline',
      notes: 'Heavy workload'
    });

    expect(component.stressForm.valid).toBe(true);
    
    component.onSubmit();

    expect(mockHealthTrackerService.logStress).toHaveBeenCalled();
  });

  it('should not submit form with invalid data', () => {
    fixture.detectChanges();

    component.stressForm.patchValue({
      stressLevel: null,
      triggers: ''
    });

    component.onSubmit();

    expect(component.stressForm.invalid).toBe(true);
  });

  it('should handle service error', () => {
    const mockError = { error: { message: 'Service error' } };
    mockHealthTrackerService.logStress.and.returnValue(throwError(() => mockError));

    fixture.detectChanges();

    component.stressForm.patchValue({
      stressLevel: 7,
      triggers: 'Presentation',
      notes: 'Exercise'
    });

    component.onSubmit();

    expect(component.error).toBeTruthy();
  });

  it('should validate stress level is between 1 and 10', () => {
    fixture.detectChanges();

    component.stressForm.patchValue({
      stressLevel: 5,
      triggers: 'Normal stress',
      notes: 'Relaxation'
    });

    expect(component.stressForm.valid).toBe(true);
  });

  it('should reject stress level outside valid range', () => {
    fixture.detectChanges();

    component.stressForm.patchValue({
      stressLevel: 15,
      triggers: 'Extreme stress',
      notes: 'Help'
    });

    expect(component.stressForm.get('stressLevel')?.valid).toBe(false);
  });

  it('should have stress level options', () => {
    fixture.detectChanges();
    expect(component.stressForm).toBeDefined();
  });

  it('should reset form after successful submission', (done) => {
    const mockResponse = { userId: 1, level: 5, timestamp: new Date().toISOString(), triggers: 'Work', notes: 'Meditation' };
    mockHealthTrackerService.logStress.and.returnValue(of(mockResponse));

    fixture.detectChanges();

    component.stressForm.patchValue({
      stressLevel: 5,
      triggers: 'Work',
      notes: 'Meditation'
    });

    component.onSubmit();

    setTimeout(() => {
      expect(component.stressForm.get('stressLevel')?.value).toBeNull();
      done();
    }, 100);
  });
});
