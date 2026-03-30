import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HealthTrackerService } from '../../../../shared/services/health-tracker.service';

interface HealthStats {
  moodScore: number;
  stressLevel: number;
  sleepQuality: number;
  activityMinutes: number;
  caloriesBurned: number;
}

@Component({
  selector: 'app-wellness-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './wellness-dashboard.component.html',
  styleUrls: ['./wellness-dashboard.component.css']
})
export class WellnessDashboardComponent implements OnInit {
  loading = true;
  healthStats: HealthStats = {
    moodScore: 0,
    stressLevel: 0,
    sleepQuality: 0,
    activityMinutes: 0,
    caloriesBurned: 0
  };

  wellnessScore = 0;
  recommendations: string[] = [];
  recentActivities: any[] = [];

  private healthTrackerService = inject(HealthTrackerService);

  ngOnInit(): void {
    this.loadWellnessData();
  }

  private loadWellnessData(): void {
    const userId = parseInt(localStorage.getItem('userId') || '0', 10);

    // Load all health metrics
    Promise.all([
      this.healthTrackerService.getMoodHistoryWithAnalytics(userId, '7d').toPromise(),
      this.healthTrackerService.getStressHistoryWithAnalytics(userId, '7d').toPromise(),
      this.healthTrackerService.getSleepHistoryWithAnalytics(userId, '7d').toPromise(),
      this.healthTrackerService.getActivityHistory(userId, '7d').toPromise()
    ])
      .then(([moodData, stressData, sleepData, activityData]: any) => {
        // Calculate health stats
        if (moodData) {
          this.healthStats.moodScore = moodData.average || 5;
        }
        if (stressData) {
          this.healthStats.stressLevel = stressData.averageLevel || 5;
        }
        if (sleepData) {
          this.healthStats.sleepQuality = sleepData.averageQuality || 5;
        }
        if (activityData && activityData.length > 0) {
          this.healthStats.activityMinutes = activityData.reduce((acc: number, a: any) => acc + a.duration, 0);
          this.healthStats.caloriesBurned = activityData.reduce((acc: number, a: any) => acc + (a.caloriesBurned || 0), 0);
          this.recentActivities = activityData.slice(0, 5);
        }

        this.calculateWellnessScore();
        this.generateRecommendations();
        this.loading = false;
      })
      .catch((error) => {
        console.error('Error loading wellness data:', error);
        this.loading = false;
      });
  }

  private calculateWellnessScore(): void {
    // Wellness score based on all metrics (0-100)
    const moodComponent = (this.healthStats.moodScore / 10) * 20;
    const stressComponent = ((10 - this.healthStats.stressLevel) / 10) * 20;
    const sleepComponent = (this.healthStats.sleepQuality / 10) * 20;
    const activityComponent = Math.min((this.healthStats.activityMinutes / 150) * 20, 20);
    const stressAndMoodComponent = ((moodComponent + stressComponent) / 40) * 20;

    this.wellnessScore = Math.round(
      (moodComponent + stressComponent + sleepComponent + activityComponent) / 4
    );
  }

  private generateRecommendations(): void {
    this.recommendations = [];

    if (this.healthStats.moodScore < 5) {
      this.recommendations.push('Try to increase positive activities and social interactions.');
    }

    if (this.healthStats.stressLevel > 7) {
      this.recommendations.push('Your stress levels are high. Consider meditation or relaxation techniques.');
    }

    if (this.healthStats.sleepQuality < 6) {
      this.recommendations.push('Improve your sleep quality by maintaining a consistent sleep schedule.');
    }

    if (this.healthStats.activityMinutes < 150) {
      this.recommendations.push('Aim for at least 150 minutes of moderate activity per week.');
    }

    if (this.recommendations.length === 0) {
      this.recommendations.push('Great job! Keep maintaining your healthy lifestyle.');
    }
  }

  getWellnessColor(): string {
    if (this.wellnessScore >= 80) return 'success';
    if (this.wellnessScore >= 60) return 'info';
    if (this.wellnessScore >= 40) return 'warning';
    return 'danger';
  }

  getWellnessStatus(): string {
    if (this.wellnessScore >= 80) return 'Excellent';
    if (this.wellnessScore >= 60) return 'Good';
    if (this.wellnessScore >= 40) return 'Fair';
    return 'Needs Improvement';
  }

  getMoodLabel(score: number): string {
    if (score <= 2) return '😢 Poor';
    if (score <= 4) return '😕 Fair';
    if (score <= 6) return '😐 Neutral';
    if (score <= 8) return '🙂 Good';
    return '😄 Excellent';
  }

  getStressLabel(level: number): string {
    if (level <= 2) return 'Very Low';
    if (level <= 4) return 'Low';
    if (level <= 6) return 'Moderate';
    if (level <= 8) return 'High';
    return 'Very High';
  }

  getSleepLabel(quality: number): string {
    if (quality <= 2) return 'Poor';
    if (quality <= 4) return 'Fair';
    if (quality <= 6) return 'Good';
    if (quality <= 8) return 'Very Good';
    return 'Excellent';
  }

  formatActivityDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  }
}
