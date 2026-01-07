// User Types
export interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  gender: 'male' | 'female' | 'other';
  role: 'employee' | 'admin';
  createdAt: string;
}

// Activity Types
export type ActivityType = 'expense' | 'sales' | 'customer' | 'production' | 'storage';

export interface BaseActivity {
  id: string;
  userId: string;
  type: ActivityType;
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseActivity extends BaseActivity {
  type: 'expense';
  receiptImage: string; // base64 or URL
  description?: string;
}

export interface SalesActivity extends BaseActivity {
  type: 'sales';
  receiptImage: string;
  date: string;
  time: string;
  servingEmployee: string;
  buyerName: string;
}

export interface CustomerActivity extends BaseActivity {
  type: 'customer';
  customerName: string;
  serviceDate: string;
  serviceType: string;
  notes?: string;
}

export interface ProductionActivity extends BaseActivity {
  type: 'production';
  rawMaterialWeight: number;
  weightUnit: string;
  machineImageBefore: string;
  machineImageAfter: string;
  notes?: string;
}

export interface StorageActivity extends BaseActivity {
  type: 'storage';
  location: string;
  itemDescription: string;
  quantity: number;
  condition?: string;
}

export type Activity = 
  | ExpenseActivity 
  | SalesActivity 
  | CustomerActivity 
  | ProductionActivity 
  | StorageActivity;

// Form Data Types
export interface SignupData {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  gender: 'male' | 'female' | 'other';
  password: string;
  confirmPassword: string;
}

export type EmployeeRegisterPayload = Omit<SignupData, 'confirmPassword'>

export interface LoginData {
  username: string;
  password: string;
}

export interface LoginResponse {
  employee: User;
  access_token: string;
  token_type: string;
}


// Filter Types
export interface ActivityFilters {
  userId?: string;
  type?: ActivityType;
  startDate?: string;
  endDate?: string;
}
