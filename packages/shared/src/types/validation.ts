import { z } from 'zod';

// User Validation Schemas
export const UserPlanSchema = z.object({
  type: z.enum(['free', 'pro']),
  limits: z.object({
    creativesPerMonth: z.number(),
    alertsPerMonth: z.number(),
    searchesPerDay: z.number(),
  }),
  features: z.array(z.string()),
});

export const SubscriptionSchema = z.object({
  id: z.string(),
  status: z.enum(['active', 'inactive', 'canceled', 'past_due']),
  currentPeriodStart: z.date(),
  currentPeriodEnd: z.date(),
  cancelAtPeriodEnd: z.boolean(),
  stripeSubscriptionId: z.string().optional(),
});

export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  displayName: z.string(),
  photoURL: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  plan: UserPlanSchema,
  subscription: SubscriptionSchema.optional(),
});

// Creative Validation Schemas
export const HookTypeSchema = z.enum([
  'urgency',
  'curiosity',
  'fear',
  'social_proof',
  'authority',
  'scarcity',
  'benefit',
  'problem_solution',
  'question',
  'story',
  'listicle',
  'how_to',
  'comparison',
  'testimonial',
  'discount',
  'free',
  'guarantee',
  'limited_time',
  'exclusive',
  'trending',
  'new',
  'other',
]);

export const CreativeAnalysisSchema = z.object({
  hookType: HookTypeSchema,
  niche: z.string(),
  tags: z.array(z.string()),
  sentiment: z.enum(['positive', 'negative', 'neutral']),
  urgencyLevel: z.enum(['low', 'medium', 'high']),
  emotionalTriggers: z.array(z.string()),
  suggestions: z.array(z.string()),
  confidence: z.number().min(0).max(1),
  processedAt: z.date(),
});

export const CreativeSchema = z.object({
  id: z.string(),
  headline: z.string(),
  description: z.string(),
  thumbnailUrl: z.string().optional(),
  videoUrl: z.string().optional(),
  destinationUrl: z.string().url(),
  callToAction: z.string(),
  startDate: z.date(),
  endDate: z.date().optional(),
  pageName: z.string(),
  platform: z.enum(['facebook', 'instagram']),
  format: z.enum(['image', 'video', 'carousel']),
  analysis: CreativeAnalysisSchema.optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  hash: z.string(),
  isActive: z.boolean(),
  engagementScore: z.number().optional(),
  reactionsCount: z.number().optional(),
  commentsCount: z.number().optional(),
  sharesCount: z.number().optional(),
});

// Search and Filter Validation Schemas
export const SearchFiltersSchema = z.object({
  keyword: z.string().optional(),
  niche: z.string().optional(),
  hookType: HookTypeSchema.optional(),
  format: z.enum(['image', 'video', 'carousel']).optional(),
  platform: z.enum(['facebook', 'instagram']).optional(),
  callToAction: z.string().optional(),
  dateRange: z.object({
    start: z.date(),
    end: z.date(),
  }).optional(),
  pageName: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const SearchResultSchema = z.object({
  creatives: z.array(CreativeSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  filters: SearchFiltersSchema,
});

// Alert Validation Schemas
export const AlertSchema = z.object({
  id: z.string(),
  userId: z.string(),
  type: z.enum(['pattern', 'keyword', 'niche', 'hook']),
  condition: z.object({
    filters: SearchFiltersSchema,
    threshold: z.number(),
    timeframe: z.enum(['hour', 'day', 'week']),
  }),
  isActive: z.boolean(),
  lastTriggered: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Scraping Validation Schemas
export const ScrapingConfigSchema = z.object({
  maxPages: z.number(),
  delayBetweenRequests: z.number(),
  useProxy: z.boolean(),
  userAgent: z.string(),
  keywords: z.array(z.string()).optional(),
  targetNiches: z.array(z.string()).optional(),
});

export const ScrapingJobSchema = z.object({
  id: z.string(),
  status: z.enum(['pending', 'running', 'completed', 'failed']),
  startTime: z.date(),
  endTime: z.date().optional(),
  creativesFound: z.number(),
  creativesProcessed: z.number(),
  errors: z.array(z.string()),
  config: ScrapingConfigSchema,
});

// API Request Validation Schemas
export const LoginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const RegisterRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  displayName: z.string().min(2),
});

export const CreateAlertRequestSchema = z.object({
  type: z.enum(['pattern', 'keyword', 'niche', 'hook']),
  condition: z.object({
    filters: SearchFiltersSchema,
    threshold: z.number().min(1),
    timeframe: z.enum(['hour', 'day', 'week']),
  }),
});

export const UpdateAlertRequestSchema = z.object({
  isActive: z.boolean().optional(),
  condition: z.object({
    filters: SearchFiltersSchema,
    threshold: z.number().min(1),
    timeframe: z.enum(['hour', 'day', 'week']),
  }).optional(),
});

// API Response Validation Schemas
export const ApiResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  error: z.string().optional(),
  message: z.string().optional(),
});

export const PaginatedResponseSchema = z.object({
  items: z.array(z.any()),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  hasNext: z.boolean(),
  hasPrev: z.boolean(),
});

// Utility function to validate data
export const validateData = <T>(schema: z.ZodSchema<T>, data: unknown): T => {
  return schema.parse(data);
};

// Utility function to safely validate data
export const safeValidateData = <T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; error: string } => {
  try {
    const result = schema.parse(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors.map((e) => e.message).join(', ') };
    }
    return { success: false, error: 'Validation failed' };
  }
};