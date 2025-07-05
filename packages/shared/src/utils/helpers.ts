import { format, formatDistanceToNow, isValid, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Creative, HookType, SearchFilters } from '../types';

// Date utilities
export const formatDate = (date: Date | string, pattern: string = 'dd/MM/yyyy'): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return isValid(dateObj) ? format(dateObj, pattern, { locale: ptBR }) : '';
};

export const formatDateDistance = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return isValid(dateObj) ? formatDistanceToNow(dateObj, { addSuffix: true, locale: ptBR }) : '';
};

export const formatDateTime = (date: Date | string): string => {
  return formatDate(date, 'dd/MM/yyyy HH:mm');
};

// String utilities
export const truncateString = (str: string, maxLength: number): string => {
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength) + '...';
};

export const slugify = (str: string): string => {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const camelToSnake = (str: string): string => {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
};

export const snakeToCamel = (str: string): string => {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
};

// URL utilities
export const isValidUrl = (url: string): boolean => {
  try {
    // Use a simple regex for validation instead of URL constructor
    const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    return urlRegex.test(url);
  } catch {
    return false;
  }
};

export const extractDomain = (url: string): string => {
  try {
    const match = url.match(/^(?:https?:\/\/)?(?:www\.)?([^\/]+)/);
    return match ? match[1] : '';
  } catch {
    return '';
  }
};

export const addHttps = (url: string): string => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `https://${url}`;
};

// Number utilities
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('pt-BR').format(num);
};

export const formatCurrency = (amount: number, currency: string = 'BRL'): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency,
  }).format(amount);
};

export const formatPercentage = (value: number, decimals: number = 1): string => {
  return `${(value * 100).toFixed(decimals)}%`;
};

// Array utilities
export const removeDuplicates = <T>(array: T[], key?: keyof T): T[] => {
  if (!key) return [...new Set(array)];
  
  const seen = new Set();
  return array.filter(item => {
    const value = item[key];
    if (seen.has(value)) return false;
    seen.add(value);
    return true;
  });
};

export const groupBy = <T, K extends keyof T>(array: T[], key: K): Record<string, T[]> => {
  return array.reduce((groups, item) => {
    const groupKey = String(item[key]);
    if (!groups[groupKey]) groups[groupKey] = [];
    groups[groupKey].push(item);
    return groups;
  }, {} as Record<string, T[]>);
};

export const sortBy = <T>(array: T[], key: keyof T, direction: 'asc' | 'desc' = 'asc'): T[] => {
  return [...array].sort((a, b) => {
    const aValue = a[key];
    const bValue = b[key];
    
    if (aValue < bValue) return direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return direction === 'asc' ? 1 : -1;
    return 0;
  });
};

// Hash utilities
export const generateHash = (str: string): string => {
  let hash = 0;
  if (str.length === 0) return hash.toString();
  
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  return Math.abs(hash).toString(36);
};

export const generateCreativeHash = (creative: Partial<Creative>): string => {
  const hashString = `${creative.headline || ''}${creative.destinationUrl || ''}${creative.startDate || ''}`;
  return generateHash(hashString);
};

// Validation utilities
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPassword = (password: string): boolean => {
  return password.length >= 6;
};

export const isEmptyObject = (obj: Record<string, any>): boolean => {
  return Object.keys(obj).length === 0;
};

// Search utilities
export const buildSearchQuery = (filters: SearchFilters): string => {
  const queryParts: string[] = [];
  
  if (filters.keyword) {
    queryParts.push(`keyword:${filters.keyword}`);
  }
  
  if (filters.niche) {
    queryParts.push(`niche:${filters.niche}`);
  }
  
  if (filters.hookType) {
    queryParts.push(`hook:${filters.hookType}`);
  }
  
  if (filters.platform) {
    queryParts.push(`platform:${filters.platform}`);
  }
  
  if (filters.format) {
    queryParts.push(`format:${filters.format}`);
  }
  
  return queryParts.join(' ');
};

export const highlightSearchTerms = (text: string, searchTerm: string): string => {
  if (!searchTerm || !text) return text;
  
  const regex = new RegExp(`(${searchTerm})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
};

// Creative utilities
export const getCreativeTypeBadgeColor = (hookType: HookType): string => {
  const colors: Record<HookType, string> = {
    urgency: 'bg-red-100 text-red-800',
    curiosity: 'bg-purple-100 text-purple-800',
    fear: 'bg-orange-100 text-orange-800',
    social_proof: 'bg-blue-100 text-blue-800',
    authority: 'bg-indigo-100 text-indigo-800',
    scarcity: 'bg-yellow-100 text-yellow-800',
    benefit: 'bg-green-100 text-green-800',
    problem_solution: 'bg-teal-100 text-teal-800',
    question: 'bg-pink-100 text-pink-800',
    story: 'bg-violet-100 text-violet-800',
    listicle: 'bg-cyan-100 text-cyan-800',
    how_to: 'bg-lime-100 text-lime-800',
    comparison: 'bg-amber-100 text-amber-800',
    testimonial: 'bg-emerald-100 text-emerald-800',
    discount: 'bg-rose-100 text-rose-800',
    free: 'bg-green-100 text-green-800',
    guarantee: 'bg-blue-100 text-blue-800',
    limited_time: 'bg-red-100 text-red-800',
    exclusive: 'bg-purple-100 text-purple-800',
    trending: 'bg-pink-100 text-pink-800',
    new: 'bg-cyan-100 text-cyan-800',
    other: 'bg-gray-100 text-gray-800',
  };
  
  return colors[hookType] || colors.other;
};

export const getFormatIcon = (format: Creative['format']): string => {
  const icons: Record<Creative['format'], string> = {
    image: '🖼️',
    video: '🎥',
    carousel: '🎠',
  };
  
  return icons[format] || '📄';
};

export const getPlatformIcon = (platform: Creative['platform']): string => {
  const icons: Record<Creative['platform'], string> = {
    facebook: '👥',
    instagram: '📸',
  };
  
  return icons[platform] || '📱';
};

// File utilities
export const downloadAsJSON = (data: any, filename: string): void => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const downloadAsCSV = (data: any[], filename: string): void => {
  if (data.length === 0) return;
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// Local storage utilities
export const getFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
};

export const setToLocalStorage = <T>(key: string, value: T): void => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Silently fail if localStorage is not available
  }
};

export const removeFromLocalStorage = (key: string): void => {
  try {
    window.localStorage.removeItem(key);
  } catch {
    // Silently fail if localStorage is not available
  }
};

// Debounce utility
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Random utilities
export const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const getRandomElement = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};