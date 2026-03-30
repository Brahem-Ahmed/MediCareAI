import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { WellnessDashboardComponent } from './wellness-dashboard.component';
import { HealthTrackerService } from '../../../../shared/services/health-tracker.service';

describe('WellnessDashboardComponent', () => {
  let component: WellnessDashboardComponent;
  let fixture: ComponentFixture<WellnessDashboardComponent>;
  let mockHealthTrackerService: jasmine.SpyObj<HealthTrackerService>;

  beforeEach(async () => {
    mockHealthTrackerService = jasmine.createSpyObj('HealthTrackerService', [
      'getMoodHistoryWithAnalytics',
      'getStressHistoryWithAnalytics',
      'getSleepHistoryWithAnalytics',
      'getActivityHistory'
    ]);

    // Set default return values
    mockHealthTrackerService.getMoodHistoryWithAnalytics.and.returnValue(of({
      userId: 1,
      moods: [],
      dateRange: '7d',
      average: 7
    }));
    mockHealthTrackerService.getStressHistoryWithAnalytics.and.returnValue(of({
      userId: 1,
      stressEntries: [],
      dateRange: '7d',
      averageLevel: 5
    }));
    mockHealthTrackerService.getSleepHistoryWithAnalytics.and.returnValue(of({
      userId: 1,
      sleepEntries: [],
      dateRange: '7d',
      averageDuration: 7,
      averageQuality: 8
    }));
    mockHealthTrackerService.getActivityHistory.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [WellnessDashboardComponent],
      providers: [
        { provide: HealthTrackerService, useValue: mockHealthTrackerService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(WellnessDashboardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize on component init', () => {
    fixture.detectChanges();
    expect(component).toBeDefined();
  });

  it('should load mood history on init', () => {
    const mockMoodHistory = {
      userId: 1,
      moods: [
        { id: 1, userId: 1, mood: 'HAPPY' as const, intensity: 8, timestamp: new Date().toISOString() }
      ],
      dateRange: '7d',
      average: 7.5
    };

    mockHealthTrackerService.getMoodHistoryWithAnalytics.and.returnValue(of(mockMoodHistory));

    fixture.detectChanges();

    expect(mockHealthTrackerService.getMoodHistoryWithAnalytics).toHaveBeenCalled();
  });

  it('should load stress history on init', () => {
    const mockStressHistory = {
      userId: 1,
      stressEntries: [
        { id: 1, userId: 1, level: 5, trigger: 'Work', timestamp: new Date().toISOString() }
      ],
      dateRange: '7d',
      averageLevel: 5.5
    };

    mockHealthTrackerService.getStressHistoryWithAnalytics.and.returnValue(of(mockStressHistory));

    fixture.detectChanges();

    expect(mockHealthTrackerService.getStressHistoryWithAnalytics).toHaveBeenCalled();
  });

  it('should load sleep history on init', () => {
    const mockSleepHistory = {
      userId: 1,
      sleepEntries: [
        { id: 1, userId: 1, duration: 8, quality: 8, sleepStart: new Date().toISOString(), sleepEnd: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(), timestamp: new Date().toISOString() }
      ],
      dateRange: '7d',
      averageDuration: 7.5,
      averageQuality: 8
    };

    mockHealthTrackerService.getSleepHistoryWithAnalytics.and.returnValue(of(mockSleepHistory));

    fixture.detectChanges();

    expect(mockHealthTrackerService.getSleepHistoryWithAnalytics).toHaveBeenCalled();
  });

  it('should load activity history on init', () => {
    const mockActivityHistory = [
      { id: 1, userId: 1, type: 'RUNNING' as const, duration: 30, intensity: 'HIGH' as const, timestamp: new Date().toISOString() }
    ];

    mockHealthTrackerService.getActivityHistory.and.returnValue(of(mockActivityHistory));

    fixture.detectChanges();

    expect(mockHealthTrackerService.getActivityHistory).toHaveBeenCalled();
  });

  it('should load all health metrics on init', () => {
    const mockMoodHistory = {
      userId: 1,
      moods: [
        { id: 1, userId: 1, mood: 'HAPPY' as const, intensity: 8, timestamp: new Date().toISOString() }
      ],
      dateRange: '7d',
      average: 7.5
    };

    const mockStressHistory = {
      userId: 1,
      stressEntries: [
        { id: 1, userId: 1, level: 5, trigger: 'Work', timestamp: new Date().toISOString() }
      ],
      dateRange: '7d',
      averageLevel: 5.5
    };

    const mockSleepHistory = {
      userId: 1,
      sleepEntries: [
        { id: 1, userId: 1, duration: 8, quality: 8, sleepStart: new Date().toISOString(), sleepEnd: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(), timestamp: new Date().toISOString() }
      ],
      dateRange: '7d',
      averageDuration: 7.5,
      averageQuality: 8
    };

    const mockActivityHistory: any[] = [];

    mockHealthTrackerService.getMoodHistoryWithAnalytics.and.returnValue(of(mockMoodHistory));
    mockHealthTrackerService.getStressHistoryWithAnalytics.and.returnValue(of(mockStressHistory));
    mockHealthTrackerService.getSleepHistoryWithAnalytics.and.returnValue(of(mockSleepHistory));
    mockHealthTrackerService.getActivityHistory.and.returnValue(of(mockActivityHistory));

    fixture.detectChanges();

    expect(mockHealthTrackerService.getMoodHistoryWithAnalytics).toHaveBeenCalled();
    expect(mockHealthTrackerService.getStressHistoryWithAnalytics).toHaveBeenCalled();
    expect(mockHealthTrackerService.getSleepHistoryWithAnalytics).toHaveBeenCalled();
    expect(mockHealthTrackerService.getActivityHistory).toHaveBeenCalled();
  });

  it('should render dashboard template', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled).toBeTruthy();
  });

  it('should display wellness metrics', () => {
    const mockMoodHistory = {
      userId: 1,
      moods: [
        { id: 1, userId: 1, mood: 'HAPPY' as const, intensity: 8, timestamp: new Date().toISOString() }
      ],
      dateRange: '7d',
      average: 8
    };

    mockHealthTrackerService.getMoodHistoryWithAnalytics.and.returnValue(of(mockMoodHistory));

    fixture.detectChanges();

    expect(mockHealthTrackerService.getMoodHistoryWithAnalytics).toHaveBeenCalled();
  });

  it('should handle empty health data gracefully', () => {
    const mockMoodHistory = {
      userId: 1,
      moods: [],
      dateRange: '7d',
      average: 0
    };

    mockHealthTrackerService.getMoodHistoryWithAnalytics.and.returnValue(of(mockMoodHistory));

    fixture.detectChanges();

    expect(component).toBeTruthy();
  });
});
