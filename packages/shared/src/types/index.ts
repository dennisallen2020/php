// User and Authentication Types
export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: Date;
  updatedAt: Date;
  plan: UserPlan;
  subscription?: Subscription;
}

export interface UserPlan {
  type: 'free' | 'pro';
  limits: {
    creativesPerMonth: number;
    alertsPerMonth: number;
    searchesPerDay: number;
  };
  features: string[];
}

export interface Subscription {
  id: string;
  status: 'active' | 'inactive' | 'canceled' | 'past_due';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  stripeSubscriptionId?: string;
}

// Creative Types
export interface Creative {
  id: string;
  headline: string;
  description: string;
  thumbnailUrl?: string;
  videoUrl?: string;
  destinationUrl: string;
  callToAction: string;
  startDate: Date;
  endDate?: Date;
  pageName: string;
  platform: 'facebook' | 'instagram';
  format: 'image' | 'video' | 'carousel';
  
  // AI Analysis
  analysis?: CreativeAnalysis;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  hash: string; // For deduplication
  isActive: boolean;
  
  // Engagement (future feature)
  engagementScore?: number;
  reactionsCount?: number;
  commentsCount?: number;
  sharesCount?: number;
}

export interface CreativeAnalysis {
  hookType: HookType;
  niche: string;
  tags: string[];
  sentiment: 'positive' | 'negative' | 'neutral';
  urgencyLevel: 'low' | 'medium' | 'high';
  emotionalTriggers: string[];
  suggestions: string[];
  confidence: number; // 0-1
  processedAt: Date;
}

export type HookType = 
  | 'urgency'
  | 'curiosity'
  | 'fear'
  | 'social_proof'
  | 'authority'
  | 'scarcity'
  | 'benefit'
  | 'problem_solution'
  | 'question'
  | 'story'
  | 'listicle'
  | 'how_to'
  | 'comparison'
  | 'testimonial'
  | 'discount'
  | 'free'
  | 'guarantee'
  | 'limited_time'
  | 'exclusive'
  | 'trending'
  | 'new'
  | 'other';

// Search and Filter Types
export interface SearchFilters {
  keyword?: string;
  niche?: string;
  hookType?: HookType;
  format?: Creative['format'];
  platform?: Creative['platform'];
  callToAction?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  pageName?: string;
  isActive?: boolean;
}

export interface SearchResult {
  creatives: Creative[];
  total: number;
  page: number;
  limit: number;
  filters: SearchFilters;
}

// Trending and Analytics Types
export interface TrendingAnalysis {
  id: string;
  period: 'day' | 'week' | 'month';
  topHookTypes: Array<{
    hookType: HookType;
    count: number;
    percentage: number;
  }>;
  topNiches: Array<{
    niche: string;
    count: number;
    percentage: number;
  }>;
  topFormats: Array<{
    format: Creative['format'];
    count: number;
    percentage: number;
  }>;
  topCTAs: Array<{
    cta: string;
    count: number;
    percentage: number;
  }>;
  emergingTrends: Array<{
    trend: string;
    growthRate: number;
    count: number;
  }>;
  generatedAt: Date;
}

export interface Alert {
  id: string;
  userId: string;
  type: 'pattern' | 'keyword' | 'niche' | 'hook';
  condition: {
    filters: SearchFilters;
    threshold: number;
    timeframe: 'hour' | 'day' | 'week';
  };
  isActive: boolean;
  lastTriggered?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface AlertTrigger {
  id: string;
  alertId: string;
  triggeredAt: Date;
  matchedCreatives: Creative[];
  message: string;
  sent: boolean;
}

// Scraper Types
export interface ScrapingJob {
  id: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  startTime: Date;
  endTime?: Date;
  creativesFound: number;
  creativesProcessed: number;
  errors: string[];
  config: ScrapingConfig;
}

export interface ScrapingConfig {
  maxPages: number;
  delayBetweenRequests: number;
  useProxy: boolean;
  userAgent: string;
  keywords?: string[];
  targetNiches?: string[];
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T = any> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Dashboard Types
export interface DashboardStats {
  totalCreatives: number;
  creativesToday: number;
  creativesThisWeek: number;
  creativesThisMonth: number;
  topPerformingHooks: Array<{
    hookType: HookType;
    count: number;
    change: number; // percentage change from previous period
  }>;
  recentAlerts: AlertTrigger[];
  systemHealth: {
    scraperStatus: 'healthy' | 'warning' | 'error';
    lastScrapingJob: Date;
    apiResponseTime: number;
  };
}

// Export all types
export * from './validation';