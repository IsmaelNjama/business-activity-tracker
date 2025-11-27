// Application Constants

// Business Information
export const BUSINESS_INFO = {
  name: 'Business Activity Tracker',
  values: [
    'Integrity in all operations',
    'Customer satisfaction first',
    'Continuous improvement',
    'Team collaboration'
  ],
  mission: 'To streamline business operations and empower employees with efficient activity tracking tools.',
  shortTermGoals: [
    'Digitize all business activity records',
    'Improve employee productivity tracking',
    'Reduce manual paperwork by 80%'
  ],
  longTermGoals: [
    'Achieve complete digital transformation',
    'Implement AI-powered analytics',
    'Expand to multi-location support',
    'Integrate with enterprise systems'
  ]
};

// Activity Types
export const ACTIVITY_TYPES = {
  EXPENSE: 'expense',
  SALES: 'sales',
  CUSTOMER: 'customer',
  PRODUCTION: 'production',
  STORAGE: 'storage'
} as const;

export const ACTIVITY_LABELS: Record<string, string> = {
  expense: 'Expense Receipt',
  sales: 'Sales Receipt',
  customer: 'Customer Service',
  production: 'Production Activity',
  storage: 'Storage Information'
};

export const ACTIVITY_COLORS: Record<string, string> = {
  expense: 'text-red-600 bg-red-50',
  sales: 'text-green-600 bg-green-50',
  customer: 'text-blue-600 bg-blue-50',
  production: 'text-purple-600 bg-purple-50',
  storage: 'text-amber-600 bg-amber-50'
};

// User Roles
export const USER_ROLES = {
  EMPLOYEE: 'employee',
  ADMIN: 'admin'
} as const;

// Gender Options
export const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' }
] as const;

// Weight Units
export const WEIGHT_UNITS = [
  { value: 'kg', label: 'Kilograms (kg)' },
  { value: 'g', label: 'Grams (g)' },
  { value: 'lb', label: 'Pounds (lb)' },
  { value: 'oz', label: 'Ounces (oz)' },
  { value: 'ton', label: 'Tons' }
] as const;

// Service Types
export const SERVICE_TYPES = [
  'Product Inquiry',
  'Technical Support',
  'Complaint Resolution',
  'Order Assistance',
  'General Consultation',
  'After-Sales Service',
  'Other'
] as const;

// Storage Locations (common locations)
export const STORAGE_LOCATIONS = [
  'Warehouse A',
  'Warehouse B',
  'Cold Storage',
  'Main Storage',
  'Backup Storage',
  'Production Floor',
  'Loading Dock',
  'Other'
] as const;

// File Upload
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
export const ACCEPTED_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];

// Image Compression
export const IMAGE_COMPRESSION = {
  maxWidth: 1920,
  maxHeight: 1080,
  quality: 0.8,
  thumbnailSize: 200,
  thumbnailQuality: 0.7
};

// Session
export const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes in milliseconds
export const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds (deprecated, use SESSION_TIMEOUT_MS)
export const SESSION_CHECK_INTERVAL = 60 * 1000; // Check every minute

// LocalStorage Keys
export const STORAGE_KEYS = {
  USERS: 'bat_users',
  ACTIVITIES: 'bat_activities',
  CURRENT_USER: 'bat_current_user',
  SESSION: 'bat_session'
} as const;

// Pagination
export const DEFAULT_PAGE_SIZE = 20;
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

// Date Formats
export const DATE_FORMAT = 'YYYY-MM-DD';
export const TIME_FORMAT = 'HH:mm';
export const DATETIME_FORMAT = 'YYYY-MM-DD HH:mm';

// Validation
export const PASSWORD_MIN_LENGTH = 8;
export const NAME_MIN_LENGTH = 2;
export const DESCRIPTION_MIN_LENGTH = 5;

// Dashboard
export const DASHBOARD_REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes

// Chart Colors
export const CHART_COLORS = {
  expense: '#dc2626',
  sales: '#16a34a',
  customer: '#2563eb',
  production: '#9333ea',
  storage: '#f59e0b'
};

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  EMPLOYEE_DASHBOARD: '/dashboard/employee',
  ADMIN_DASHBOARD: '/dashboard/admin',
  PROFILE: '/dashboard/profile',
  ACTIVITIES: '/dashboard/activities'
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  GENERIC: 'An error occurred. Please try again.',
  NETWORK: 'Network error. Please check your connection.',
  STORAGE_FULL: 'Storage limit reached. Please contact administrator.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  SESSION_EXPIRED: 'Your session has expired. Please log in again.',
  INVALID_CREDENTIALS: 'Invalid email or password.',
  EMAIL_EXISTS: 'An account with this email already exists.',
  FILE_TOO_LARGE: 'File size must be less than 10MB.',
  INVALID_FILE_TYPE: 'Please upload a valid image file.'
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  SIGNUP: 'Account created successfully!',
  LOGIN: 'Welcome back!',
  LOGOUT: 'Logged out successfully.',
  PROFILE_UPDATED: 'Profile updated successfully.',
  ACTIVITY_CREATED: 'Activity logged successfully.',
  ACTIVITY_UPDATED: 'Activity updated successfully.',
  ACTIVITY_DELETED: 'Activity deleted successfully.'
} as const;
