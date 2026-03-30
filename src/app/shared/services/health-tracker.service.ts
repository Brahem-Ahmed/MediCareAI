import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Mood,
  MoodHistory,
  Stress,
  StressHistory,
  Sleep,
  SleepHistory,
  Activity,
  ActivityHistory,
  WellnessMetrics,
  HealthEvent,
  HealthGoal,
  HealthReport,
  AiRecommendation
} from '../models/health-tracking.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HealthTrackerService {
  private baseUrl = environment.apiUrl.replace(/\/+$/, '');
  private moodsUrl = `${this.baseUrl}/moods`;
  private stressUrl = `${this.baseUrl}/stresss`; // Note: Backend has typo
  private sleepsUrl = `${this.baseUrl}/sleeps`;
  private activitiesUrl = `${this.baseUrl}/activities`;
  private wellnessUrl = `${this.baseUrl}/well-being-metrics`;
  private healthEventsUrl = `${this.baseUrl}/health-events`;
  private healthGoalsUrl = `${this.baseUrl}/health-goals`;
  private healthReportsUrl = `${this.baseUrl}/health-reports`;
  private recommendationsUrl = `${this.baseUrl}/recommendations`;

  constructor(private http: HttpClient) {}

  // ==================== MOOD TRACKING ====================

  /**
   * Log mood entry
   */
  logMood(mood: Mood): Observable<Mood> {
    return this.http.post<Mood>(this.moodsUrl, mood);
  }

  /**
   * Get mood history
   */
  getMoodHistory(userId: number, dateRange: string = '7d'): Observable<Mood[]> {
    const params = new HttpParams()
      .set('userId', userId.toString())
      .set('dateRange', dateRange);

    return this.http.get<Mood[]>(this.moodsUrl, { params });
  }

  /**
   * Get mood history with analytics
   */
  getMoodHistoryWithAnalytics(userId: number, dateRange: string = '7d'): Observable<MoodHistory> {
    const params = new HttpParams()
      .set('userId', userId.toString())
      .set('dateRange', dateRange);

    return this.http.get<MoodHistory>(`${this.moodsUrl}/analytics`, { params });
  }

  /**
   * Get specific mood entry
   */
  getMoodById(id: number): Observable<Mood> {
    return this.http.get<Mood>(`${this.moodsUrl}/${id}`);
  }

  /**
   * Delete mood entry
   */
  deleteMood(id: number): Observable<void> {
    return this.http.delete<void>(`${this.moodsUrl}/${id}`);
  }

  // ==================== STRESS TRACKING ====================

  /**
   * Log stress level
   */
  logStress(stress: Stress): Observable<Stress> {
    return this.http.post<Stress>(this.stressUrl, stress);
  }

  /**
   * Get stress history
   */
  getStressHistory(userId: number, dateRange: string = '7d'): Observable<Stress[]> {
    const params = new HttpParams()
      .set('userId', userId.toString())
      .set('dateRange', dateRange);

    return this.http.get<Stress[]>(this.stressUrl, { params });
  }

  /**
   * Get stress history with analytics
   */
  getStressHistoryWithAnalytics(userId: number, dateRange: string = '7d'): Observable<StressHistory> {
    const params = new HttpParams()
      .set('userId', userId.toString())
      .set('dateRange', dateRange);

    return this.http.get<StressHistory>(`${this.stressUrl}/analytics`, { params });
  }

  /**
   * Get specific stress entry
   */
  getStressById(id: number): Observable<Stress> {
    return this.http.get<Stress>(`${this.stressUrl}/${id}`);
  }

  /**
   * Delete stress entry
   */
  deleteStress(id: number): Observable<void> {
    return this.http.delete<void>(`${this.stressUrl}/${id}`);
  }

  // ==================== SLEEP TRACKING ====================

  /**
   * Log sleep data
   */
  logSleep(sleep: Sleep): Observable<Sleep> {
    return this.http.post<Sleep>(this.sleepsUrl, sleep);
  }

  /**
   * Get sleep history
   */
  getSleepHistory(userId: number, dateRange: string = '7d'): Observable<Sleep[]> {
    const params = new HttpParams()
      .set('userId', userId.toString())
      .set('dateRange', dateRange);

    return this.http.get<Sleep[]>(this.sleepsUrl, { params });
  }

  /**
   * Get sleep history with analytics
   */
  getSleepHistoryWithAnalytics(userId: number, dateRange: string = '7d'): Observable<SleepHistory> {
    const params = new HttpParams()
      .set('userId', userId.toString())
      .set('dateRange', dateRange);

    return this.http.get<SleepHistory>(`${this.sleepsUrl}/analytics`, { params });
  }

  /**
   * Get specific sleep entry
   */
  getSleepById(id: number): Observable<Sleep> {
    return this.http.get<Sleep>(`${this.sleepsUrl}/${id}`);
  }

  /**
   * Delete sleep entry
   */
  deleteSleep(id: number): Observable<void> {
    return this.http.delete<void>(`${this.sleepsUrl}/${id}`);
  }

  // ==================== ACTIVITY TRACKING ====================

  /**
   * Log activity
   */
  logActivity(activity: Activity): Observable<Activity> {
    return this.http.post<Activity>(this.activitiesUrl, activity);
  }

  /**
   * Get activity history
   */
  getActivityHistory(userId: number, dateRange: string = '7d'): Observable<Activity[]> {
    const params = new HttpParams()
      .set('userId', userId.toString())
      .set('dateRange', dateRange);

    return this.http.get<Activity[]>(this.activitiesUrl, { params });
  }

  /**
   * Get activity history with analytics
   */
  getActivityHistoryWithAnalytics(userId: number, dateRange: string = '7d'): Observable<ActivityHistory> {
    const params = new HttpParams()
      .set('userId', userId.toString())
      .set('dateRange', dateRange);

    return this.http.get<ActivityHistory>(`${this.activitiesUrl}/analytics`, { params });
  }

  /**
   * Get specific activity entry
   */
  getActivityById(id: number): Observable<Activity> {
    return this.http.get<Activity>(`${this.activitiesUrl}/${id}`);
  }

  /**
   * Delete activity entry
   */
  deleteActivity(id: number): Observable<void> {
    return this.http.delete<void>(`${this.activitiesUrl}/${id}`);
  }

  // ==================== WELLNESS METRICS ====================

  /**
   * Get wellness metrics for a user
   */
  getWellnessMetrics(userId: number): Observable<WellnessMetrics> {
    return this.http.get<WellnessMetrics>(`${this.wellnessUrl}/${userId}`);
  }

  /**
   * Get wellness metrics for current user
   */
  getCurrentUserWellnessMetrics(): Observable<WellnessMetrics> {
    return this.http.get<WellnessMetrics>(`${this.wellnessUrl}/me`);
  }

  /**
   * Get wellness trends
   */
  getWellnessTrends(userId: number, period: '7d' | '30d' | '90d' = '30d'): Observable<any> {
    const params = new HttpParams().set('period', period);
    return this.http.get<any>(`${this.wellnessUrl}/${userId}/trends`, { params });
  }

  // ==================== HEALTH EVENTS ====================

  /**
   * Create health event
   */
  createHealthEvent(event: HealthEvent): Observable<HealthEvent> {
    return this.http.post<HealthEvent>(this.healthEventsUrl, event);
  }

  /**
   * Get health events for a user
   */
  getHealthEvents(userId: number, limit: number = 10): Observable<HealthEvent[]> {
    const params = new HttpParams()
      .set('userId', userId.toString())
      .set('limit', limit.toString());

    return this.http.get<HealthEvent[]>(this.healthEventsUrl, { params });
  }

  /**
   * Get critical health alerts
   */
  getCriticalAlerts(userId: number): Observable<HealthEvent[]> {
    const params = new HttpParams().set('userId', userId.toString());
    return this.http.get<HealthEvent[]>(`${this.healthEventsUrl}/critical`, { params });
  }

  /**
   * Acknowledge health event
   */
  acknowledgeHealthEvent(eventId: number): Observable<void> {
    return this.http.post<void>(`${this.healthEventsUrl}/${eventId}/acknowledge`, {});
  }

  // ==================== HEALTH GOALS ====================

  /**
   * Create health goal
   */
  createHealthGoal(goal: HealthGoal): Observable<HealthGoal> {
    return this.http.post<HealthGoal>(this.healthGoalsUrl, goal);
  }

  /**
   * Get user health goals
   */
  getUserHealthGoals(userId: number): Observable<HealthGoal[]> {
    const params = new HttpParams().set('userId', userId.toString());
    return this.http.get<HealthGoal[]>(this.healthGoalsUrl, { params });
  }

  /**
   * Update health goal
   */
  updateHealthGoal(id: number, goal: Partial<HealthGoal>): Observable<HealthGoal> {
    return this.http.put<HealthGoal>(`${this.healthGoalsUrl}/${id}`, goal);
  }

  /**
   * Delete health goal
   */
  deleteHealthGoal(id: number): Observable<void> {
    return this.http.delete<void>(`${this.healthGoalsUrl}/${id}`);
  }

  // ==================== HEALTH REPORTS ====================

  /**
   * Generate health report
   */
  generateHealthReport(userId: number, period: '7d' | '30d' | '90d'): Observable<HealthReport> {
    const params = new HttpParams()
      .set('userId', userId.toString())
      .set('period', period);

    return this.http.get<HealthReport>(this.healthReportsUrl, { params });
  }

  /**
   * Get health report history
   */
  getHealthReportHistory(userId: number): Observable<HealthReport[]> {
    const params = new HttpParams().set('userId', userId.toString());
    return this.http.get<HealthReport[]>(`${this.healthReportsUrl}/history`, { params });
  }

  /**
   * Export health report
   */
  exportHealthReport(userId: number, period: '7d' | '30d' | '90d', format: 'pdf' | 'csv'): Observable<Blob> {
    const params = new HttpParams()
      .set('userId', userId.toString())
      .set('period', period)
      .set('format', format);

    return this.http.get(`${this.healthReportsUrl}/export`, { params, responseType: 'blob' });
  }

  // ==================== AI RECOMMENDATIONS ====================

  /**
   * Get AI recommendations for user
   */
  getRecommendations(userId: number): Observable<AiRecommendation[]> {
    const params = new HttpParams().set('userId', userId.toString());
    return this.http.get<AiRecommendation[]>(this.recommendationsUrl, { params });
  }

  /**
   * Get recommendations by type
   */
  getRecommendationsByType(
    userId: number,
    type: 'SLEEP' | 'STRESS' | 'ACTIVITY' | 'MOOD' | 'GENERAL'
  ): Observable<AiRecommendation[]> {
    const params = new HttpParams()
      .set('userId', userId.toString())
      .set('type', type);

    return this.http.get<AiRecommendation[]>(`${this.recommendationsUrl}/by-type`, { params });
  }

  /**
   * Mark recommendation as completed
   */
  markRecommendationCompleted(recommendationId: number): Observable<void> {
    return this.http.post<void>(`${this.recommendationsUrl}/${recommendationId}/complete`, {});
  }

  /**
   * Dismiss recommendation
   */
  dismissRecommendation(recommendationId: number): Observable<void> {
    return this.http.post<void>(`${this.recommendationsUrl}/${recommendationId}/dismiss`, {});
  }
}
