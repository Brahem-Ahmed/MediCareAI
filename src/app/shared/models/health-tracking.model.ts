/**
 * Health Tracking Models
 * Supports mood, stress, sleep, activity tracking and wellness metrics
 */

export interface Mood {
  id?: number;
  userId: number;
  mood: 'HAPPY' | 'SAD' | 'ANXIOUS' | 'CALM' | 'FRUSTRATED' | 'CONTENT' | 'NEUTRAL';
  intensity: number; // 1-10 scale
  notes?: string;
  timestamp: string;
  createdAt?: string;
}

export interface MoodHistory {
  userId: number;
  moods: Mood[];
  dateRange: string; // e.g., "7d", "30d"
  average?: number;
  trend?: 'UP' | 'DOWN' | 'STABLE';
}

export interface Stress {
  id?: number;
  userId: number;
  level: number; // 1-10 scale
  trigger?: string; // What caused the stress
  notes?: string;
  timestamp: string;
  createdAt?: string;
}

export interface StressHistory {
  userId: number;
  stressEntries: Stress[];
  dateRange: string;
  averageLevel?: number;
  trend?: 'UP' | 'DOWN' | 'STABLE';
  commonTriggers?: string[];
}

export interface Sleep {
  id?: number;
  userId: number;
  duration: number; // hours
  quality: number; // 1-10 scale
  notes?: string;
  sleepStart: string;
  sleepEnd: string;
  timestamp: string;
  createdAt?: string;
}

export interface SleepHistory {
  userId: number;
  sleepEntries: Sleep[];
  dateRange: string;
  averageDuration?: number;
  averageQuality?: number;
  trend?: 'UP' | 'DOWN' | 'STABLE';
}

export type ActivityType = 
  | 'WALKING' 
  | 'RUNNING' 
  | 'CYCLING' 
  | 'SWIMMING' 
  | 'YOGA' 
  | 'GYM' 
  | 'SPORTS' 
  | 'HIKING' 
  | 'SPORTS_OTHER';

export interface Activity {
  id?: number;
  userId: number;
  type: ActivityType;
  duration: number; // minutes
  caloriesBurned?: number;
  distance?: number; // km
  intensity?: 'LOW' | 'MODERATE' | 'HIGH';
  notes?: string;
  timestamp: string;
  createdAt?: string;
}

export interface ActivityHistory {
  userId: number;
  activities: Activity[];
  dateRange: string;
  totalDuration?: number; // total minutes
  totalCalories?: number;
  totalDistance?: number;
  averagePerDay?: {
    duration: number;
    calories: number;
  };
  activityBreakdown?: {
    [key in ActivityType]: number;
  };
}

export interface WellnessMetrics {
  userId: number;
  date?: string;
  
  // Overall wellness score
  overallWellness: number; // 0-100
  overallTrend?: 'UP' | 'DOWN' | 'STABLE';
  
  // Mood metrics
  mood: {
    current?: string;
    average7d: number;
    average30d?: number;
    trend?: 'UP' | 'DOWN' | 'STABLE';
  };
  
  // Stress metrics
  stress: {
    current?: number;
    average7d: number;
    average30d?: number;
    trend?: 'UP' | 'DOWN' | 'STABLE';
    commonTriggers?: string[];
  };
  
  // Sleep metrics
  sleep: {
    lastNight?: number; // hours
    average7d: number; // hours
    average30d?: number; // hours
    quality7d?: number; // 1-10
    trend?: 'UP' | 'DOWN' | 'STABLE';
  };
  
  // Activity metrics
  activity: {
    today?: number; // calories
    average7d: number; // calories per day
    average30d?: number;
    steps?: number;
    trend?: 'UP' | 'DOWN' | 'STABLE';
  };
  
  // Health recommendations
  recommendations: string[];
  alerts?: string[]; // Critical alerts
  lastUpdated: string;
}

export interface HealthEventType {
  SLEEP_GOAL_MISSED: boolean;
  STRESS_SPIKE: boolean;
  ACTIVITY_MILESTONE: boolean;
  MOOD_CHANGE: boolean;
  HEALTH_ALERT: boolean;
}

export interface HealthEvent {
  id?: number;
  userId: number;
  type: keyof HealthEventType;
  title: string;
  description: string;
  severity?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  timestamp: string;
  createdAt?: string;
}

export interface HealthGoal {
  id?: number;
  userId: number;
  goalType: 'SLEEP' | 'ACTIVITY' | 'STRESS' | 'MOOD' | 'WEIGHT';
  targetValue: number;
  currentValue?: number;
  unit: string;
  deadline?: string;
  status?: 'ACTIVE' | 'COMPLETED' | 'ABANDONED';
  createdAt?: string;
  completedAt?: string;
}

export interface HealthReport {
  userId: number;
  period: '7d' | '30d' | '90d';
  generatedAt: string;
  summary: string;
  keyMetrics: WellnessMetrics;
  insights: string[];
  recommendations: string[];
  compareToPreviousPeriod?: {
    wellnessChange: number; // percentage change
    mood: number;
    stress: number;
    sleep: number;
    activity: number;
  };
}

export interface AiRecommendation {
  id?: number;
  userId: number;
  type: 'SLEEP' | 'STRESS' | 'ACTIVITY' | 'MOOD' | 'GENERAL';
  title: string;
  description: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH';
  actionItems?: string[];
  validFrom?: string;
  validUntil?: string;
  createdAt?: string;
}
