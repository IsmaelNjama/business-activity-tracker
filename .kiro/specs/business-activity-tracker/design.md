# Design Document: Business Activity Tracker

## Overview

The Business Activity Tracker is a React-based web application built with Vite, TypeScript, Tailwind CSS, and shadcn/ui components. The application enables employees to log various business activities (expenses, sales, customer service, production, and storage) and provides role-based dashboards for employees and administrators to monitor activities.

### Technology Stack

- **Frontend Framework**: React 18+ with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Form Validation**: Zod
- **State Management**: React Context API + hooks
- **Routing**: React Router v6
- **Form Handling**: React Hook Form
- **Image Upload**: File API with preview capabilities
- **Data Persistence**: LocalStorage (for MVP) with architecture ready for backend integration

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Presentation Layer                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Pages      │  │  Components  │  │   Layouts    │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                          │
┌─────────────────────────────────────────────────────────┐
│                     Application Layer                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Contexts   │  │    Hooks     │  │  Validators  │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                          │
┌─────────────────────────────────────────────────────────┐
│                       Data Layer                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Services   │  │    Types     │  │   Storage    │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Folder Structure

```
src/
├── components/
│   ├── ui/                    # shadcn/ui components
│   ├── auth/                  # Authentication components
│   ├── dashboard/             # Dashboard components
│   ├── activities/            # Activity logging components
│   └── shared/                # Shared/common components
├── pages/
│   ├── Login.tsx
│   ├── Signup.tsx
│   ├── EmployeeDashboard.tsx
│   ├── AdminDashboard.tsx
│   └── Profile.tsx
├── layouts/
│   ├── AuthLayout.tsx
│   └── DashboardLayout.tsx
├── contexts/
│   ├── AuthContext.tsx
│   └── ActivityContext.tsx
├── hooks/
│   ├── useAuth.ts
│   ├── useActivities.ts
│   └── useImageUpload.ts
├── lib/
│   ├── validators.ts          # Zod schemas
│   ├── utils.ts               # Utility functions
│   └── constants.ts           # App constants
├── services/
│   ├── authService.ts
│   ├── activityService.ts
│   └── storageService.ts
├── types/
│   └── index.ts               # TypeScript type definitions
└── App.tsx
```

## Components and Interfaces

### Core Type Definitions

```typescript
// User Types
interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  gender: 'male' | 'female' | 'other';
  role: 'employee' | 'admin';
  createdAt: string;
}

// Activity Types
type ActivityType = 'expense' | 'sales' | 'customer' | 'production' | 'storage';

interface BaseActivity {
  id: string;
  userId: string;
  type: ActivityType;
  createdAt: string;
  updatedAt: string;
}

interface ExpenseActivity extends BaseActivity {
  type: 'expense';
  receiptImage: string; // base64 or URL
  description?: string;
}

interface SalesActivity extends BaseActivity {
  type: 'sales';
  receiptImage: string;
  date: string;
  time: string;
  servingEmployee: string;
  buyerName: string;
}

interface CustomerActivity extends BaseActivity {
  type: 'customer';
  customerName: string;
  serviceDate: string;
  serviceType: string;
  notes?: string;
}

interface ProductionActivity extends BaseActivity {
  type: 'production';
  rawMaterialWeight: number;
  weightUnit: string;
  machineImageBefore: string;
  machineImageAfter: string;
  notes?: string;
}

interface StorageActivity extends BaseActivity {
  type: 'storage';
  location: string;
  itemDescription: string;
  quantity: number;
  condition?: string;
}

type Activity = ExpenseActivity | SalesActivity | CustomerActivity | ProductionActivity | StorageActivity;
```

### Authentication Components

#### SignupForm Component
- Uses React Hook Form with Zod validation
- Fields: firstName, lastName, email, phoneNumber, gender, password, confirmPassword
- Real-time validation feedback
- Password strength indicator
- Gender selection dropdown

#### LoginForm Component
- Email and password fields
- Business information display section (values, mission, goals)
- Remember me checkbox
- Forgot password link (UI only for MVP)

### Dashboard Components

#### EmployeeDashboard
- Activity summary cards (counts for each activity type)
- Recent activities list
- Quick action buttons for logging new activities
- Activity charts (bar/line charts showing activity trends)
- Filter controls (date range, activity type)

#### AdminDashboard
- Organization-wide activity summary
- Employee activity table with sorting and filtering
- Aggregate statistics
- Activity distribution charts
- Employee performance metrics

### Activity Logging Components

#### ExpenseReceiptUpload
- Image upload with drag-and-drop
- Image preview
- Optional description field
- File size validation (max 10MB)

#### SalesReceiptForm
- Image upload
- Date picker
- Time picker
- Serving employee field (auto-filled with current user)
- Buyer name input
- Form validation with Zod

#### CustomerServiceForm
- Customer name input
- Service date picker
- Service type dropdown/input
- Notes textarea
- Submit button with loading state

#### ProductionActivityForm
- Raw material weight input with unit selector
- Before production image upload
- After production image upload
- Notes textarea
- Multi-step form layout

#### StorageInfoForm
- Location input/dropdown
- Item description textarea
- Quantity input with validation
- Condition notes textarea

### Shared Components

#### ActivityCard
- Displays activity summary
- Type-specific icons
- Timestamp display
- Click to expand for details

#### ImageUploadZone
- Drag-and-drop area
- File browser button
- Image preview with remove option
- File type and size validation
- Progress indicator

#### StatCard
- Displays metric with icon
- Trend indicator (up/down)
- Color-coded by activity type

#### FilterPanel
- Date range picker
- Activity type multi-select
- Employee selector (admin only)
- Apply/Reset buttons

## Data Models

### Validation Schemas (Zod)

```typescript
// Signup Schema
const signupSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phoneNumber: z.string().regex(/^\+?[\d\s-()]+$/, 'Invalid phone number'),
  gender: z.enum(['male', 'female', 'other']),
  password: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

// Login Schema
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

// Sales Receipt Schema
const salesReceiptSchema = z.object({
  receiptImage: z.string().min(1, 'Receipt image is required'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  time: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format'),
  servingEmployee: z.string().min(1, 'Serving employee is required'),
  buyerName: z.string().min(2, 'Buyer name must be at least 2 characters')
});

// Production Activity Schema
const productionSchema = z.object({
  rawMaterialWeight: z.number().positive('Weight must be positive'),
  weightUnit: z.string().min(1, 'Unit is required'),
  machineImageBefore: z.string().min(1, 'Before image is required'),
  machineImageAfter: z.string().min(1, 'After image is required'),
  notes: z.string().optional()
});

// Storage Schema
const storageSchema = z.object({
  location: z.string().min(2, 'Location is required'),
  itemDescription: z.string().min(5, 'Description must be at least 5 characters'),
  quantity: z.number().nonnegative('Quantity cannot be negative'),
  condition: z.string().optional()
});
```

### State Management

#### AuthContext
```typescript
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: SignupData) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
}
```

#### ActivityContext
```typescript
interface ActivityContextType {
  activities: Activity[];
  addActivity: (activity: Omit<Activity, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  getActivitiesByUser: (userId: string) => Activity[];
  getActivitiesByType: (type: ActivityType) => Activity[];
  filterActivities: (filters: ActivityFilters) => Activity[];
  loading: boolean;
  error: string | null;
}
```

## Routing Structure

```typescript
const routes = [
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <Login /> },
      { path: 'signup', element: <Signup /> }
    ]
  },
  {
    path: '/dashboard',
    element: <ProtectedRoute><DashboardLayout /></ProtectedRoute>,
    children: [
      { path: 'employee', element: <EmployeeDashboard /> },
      { path: 'admin', element: <AdminRoute><AdminDashboard /></AdminRoute> },
      { path: 'profile', element: <Profile /> }
    ]
  }
];
```

## Error Handling

### Form Validation Errors
- Display inline error messages below form fields
- Highlight invalid fields with red border
- Prevent submission until all errors are resolved
- Show summary of errors at form level for complex forms

### Image Upload Errors
- File size exceeded: "File size must be less than 10MB"
- Invalid file type: "Please upload a valid image file (JPEG, PNG, or PDF)"
- Upload failure: "Failed to upload image. Please try again"

### Authentication Errors
- Invalid credentials: "Invalid email or password"
- Email already exists: "An account with this email already exists"
- Session expired: Redirect to login with message

### Data Persistence Errors
- Storage quota exceeded: "Storage limit reached. Please contact administrator"
- Failed to save: "Failed to save data. Please try again"

## Testing Strategy

### Unit Testing
- Test Zod validation schemas with valid and invalid inputs
- Test utility functions (date formatting, image processing)
- Test custom hooks (useAuth, useActivities)
- Test form submission handlers

### Component Testing
- Test form components with various input combinations
- Test image upload component with different file types and sizes
- Test dashboard components with mock data
- Test filter and search functionality

### Integration Testing
- Test complete user flows (signup → login → create activity → view dashboard)
- Test role-based access (employee vs admin views)
- Test data persistence across page refreshes
- Test responsive behavior on different screen sizes

### Accessibility Testing
- Keyboard navigation through all forms and interactive elements
- Screen reader compatibility
- Color contrast compliance (WCAG AA)
- Focus indicators on all interactive elements

## UI/UX Design Patterns

### Color Scheme
- Primary: Blue (#3B82F6) - for primary actions and branding
- Secondary: Slate (#64748B) - for secondary elements
- Success: Green (#10B981) - for successful operations
- Warning: Amber (#F59E0B) - for warnings
- Error: Red (#EF4444) - for errors
- Background: White/Gray-50 for light mode

### Typography
- Headings: Font-bold, larger sizes (text-2xl, text-xl, text-lg)
- Body: Font-normal, text-base
- Labels: Font-medium, text-sm
- Captions: Font-normal, text-xs, text-gray-600

### Spacing and Layout
- Consistent padding: p-4, p-6, p-8 for different container sizes
- Card spacing: gap-4 between cards
- Form field spacing: space-y-4
- Section spacing: space-y-6 or space-y-8

### Interactive Elements
- Buttons: Rounded corners (rounded-md), hover states, disabled states
- Inputs: Border on focus, error states with red border
- Cards: Shadow on hover, clickable cards with cursor-pointer
- Images: Rounded corners, object-cover for consistent sizing

### Responsive Breakpoints
- Mobile: < 640px (sm)
- Tablet: 640px - 1024px (md, lg)
- Desktop: > 1024px (xl, 2xl)

### Dashboard Layout
- Sidebar navigation (collapsible on mobile)
- Top bar with user menu and notifications
- Main content area with grid layout for cards
- Responsive grid: 1 column (mobile), 2 columns (tablet), 3-4 columns (desktop)

## Performance Considerations

### Image Optimization
- Compress images before storing (reduce quality to 80%)
- Generate thumbnails for list views
- Lazy load images in activity lists
- Implement virtual scrolling for large activity lists

### Code Splitting
- Lazy load dashboard routes
- Separate bundles for employee and admin dashboards
- Dynamic imports for heavy components (charts, image editors)

### Caching Strategy
- Cache user profile data in memory
- Cache activity lists with timestamp-based invalidation
- Use React.memo for expensive components
- Implement debouncing for search and filter inputs

## Security Considerations

### Authentication
- Hash passwords before storage (use bcrypt or similar when backend is added)
- Implement session timeout (30 minutes of inactivity)
- Secure password requirements enforced by Zod validation
- No sensitive data in localStorage (only non-sensitive user info and activities)

### Authorization
- Route guards for protected pages
- Role-based component rendering
- Admin-only routes and features protected at component level

### Data Validation
- All user inputs validated with Zod schemas
- Sanitize user-generated content before display
- File upload restrictions (type, size)
- XSS prevention through React's built-in escaping

### Image Handling
- Validate image file types on upload
- Limit file sizes to prevent storage abuse
- Store images as base64 in localStorage (MVP) or URLs when backend is integrated
