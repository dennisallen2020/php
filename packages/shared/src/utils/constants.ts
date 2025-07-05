// App Configuration
export const APP_CONFIG = {
  NAME: 'TrendSniper',
  VERSION: '1.0.0',
  DESCRIPTION: 'Plataforma SaaS para extração, análise e exibição de tendências de criativos da Meta Ads Library',
  AUTHOR: 'TrendSniper Team',
} as const;

// User Plans
export const USER_PLANS = {
  FREE: {
    type: 'free' as const,
    limits: {
      creativesPerMonth: 30,
      alertsPerMonth: 1,
      searchesPerDay: 10,
    },
    features: [
      'Busca básica de criativos',
      'Visualização de tendências',
      '1 alerta por mês',
      'Análise básica de ganchos',
    ],
  },
  PRO: {
    type: 'pro' as const,
    limits: {
      creativesPerMonth: 10000,
      alertsPerMonth: 50,
      searchesPerDay: 1000,
    },
    features: [
      'Busca avançada de criativos',
      'Análise completa de tendências',
      'Alertas ilimitados',
      'Análise avançada de ganchos',
      'Exportação CSV/XLSX',
      'API de acesso',
      'Suporte prioritário',
    ],
  },
} as const;

// Hook Types with Labels
export const HOOK_TYPES = {
  urgency: 'Urgência',
  curiosity: 'Curiosidade',
  fear: 'Medo',
  social_proof: 'Prova Social',
  authority: 'Autoridade',
  scarcity: 'Escassez',
  benefit: 'Benefício',
  problem_solution: 'Problema/Solução',
  question: 'Pergunta',
  story: 'História',
  listicle: 'Lista',
  how_to: 'Como Fazer',
  comparison: 'Comparação',
  testimonial: 'Depoimento',
  discount: 'Desconto',
  free: 'Gratuito',
  guarantee: 'Garantia',
  limited_time: 'Tempo Limitado',
  exclusive: 'Exclusivo',
  trending: 'Tendência',
  new: 'Novo',
  other: 'Outro',
} as const;

// Niches
export const NICHES = [
  'Emagrecimento',
  'Ganho de Massa',
  'Saúde e Bem-estar',
  'Beleza e Estética',
  'Relacionamentos',
  'Dinheiro e Investimentos',
  'Educação Online',
  'Tecnologia',
  'Casa e Decoração',
  'Moda e Estilo',
  'Alimentação',
  'Pets',
  'Viagem e Turismo',
  'Esportes',
  'Entretenimento',
  'Outros',
] as const;

// Platforms
export const PLATFORMS = {
  facebook: 'Facebook',
  instagram: 'Instagram',
} as const;

// Formats
export const FORMATS = {
  image: 'Imagem',
  video: 'Vídeo',
  carousel: 'Carrossel',
} as const;

// Common CTAs
export const COMMON_CTAS = [
  'Saiba mais',
  'Comprar agora',
  'Inscreva-se',
  'Baixar',
  'Cadastre-se',
  'Entre em contato',
  'Solicitar orçamento',
  'Ver mais',
  'Clique aqui',
  'Acesse agora',
  'Garanta já',
  'Começar agora',
] as const;

// Scraping Configuration
export const SCRAPING_CONFIG = {
  DEFAULT_DELAY: 2000, // 2 seconds
  DEFAULT_MAX_PAGES: 10,
  DEFAULT_USER_AGENT: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  MAX_RETRIES: 3,
  TIMEOUT: 30000, // 30 seconds
} as const;

// API Configuration
export const API_CONFIG = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  RATE_LIMIT: {
    WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    MAX_REQUESTS: 100,
  },
} as const;

// OpenAI Configuration
export const OPENAI_CONFIG = {
  MODEL: 'gpt-4-turbo-preview',
  MAX_TOKENS: 2000,
  TEMPERATURE: 0.3,
} as const;

// Date Ranges
export const DATE_RANGES = {
  TODAY: 'today',
  YESTERDAY: 'yesterday',
  LAST_7_DAYS: 'last_7_days',
  LAST_30_DAYS: 'last_30_days',
  LAST_90_DAYS: 'last_90_days',
  CUSTOM: 'custom',
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  GENERIC: 'Algo deu errado. Tente novamente.',
  NETWORK: 'Erro de conexão. Verifique sua internet.',
  UNAUTHORIZED: 'Acesso negado. Faça login novamente.',
  FORBIDDEN: 'Você não tem permissão para essa ação.',
  NOT_FOUND: 'Recurso não encontrado.',
  VALIDATION: 'Dados inválidos. Verifique os campos.',
  RATE_LIMIT: 'Muitas tentativas. Tente novamente em alguns minutos.',
  PLAN_LIMIT: 'Limite do plano atingido. Faça upgrade para continuar.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  GENERIC: 'Operação realizada com sucesso!',
  SAVED: 'Dados salvos com sucesso!',
  DELETED: 'Item removido com sucesso!',
  UPDATED: 'Dados atualizados com sucesso!',
  CREATED: 'Item criado com sucesso!',
  EMAIL_SENT: 'Email enviado com sucesso!',
} as const;

// Regex Patterns
export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
  URL: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
  PHONE: /^\+?[\d\s\-\(\)]{8,}$/,
} as const;

// Firebase Collections
export const FIREBASE_COLLECTIONS = {
  USERS: 'users',
  CREATIVES: 'creatives',
  ALERTS: 'alerts',
  ALERT_TRIGGERS: 'alert_triggers',
  SCRAPING_JOBS: 'scraping_jobs',
  TRENDING_ANALYSIS: 'trending_analysis',
} as const;

// Cache Keys
export const CACHE_KEYS = {
  TRENDING_ANALYSIS: 'trending_analysis',
  DASHBOARD_STATS: 'dashboard_stats',
  CREATIVE_SEARCH: 'creative_search',
} as const;

// Time Constants
export const TIME_CONSTANTS = {
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
  WEEK: 7 * 24 * 60 * 60 * 1000,
  MONTH: 30 * 24 * 60 * 60 * 1000,
} as const;