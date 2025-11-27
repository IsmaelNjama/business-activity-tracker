import { z } from 'zod';

// Signup Schema
export const signupSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phoneNumber: z.string().regex(/^\+?[\d\s\-()]+$/, 'Invalid phone number'),
  gender: z.enum(['male', 'female', 'other'], {
    errorMap: () => ({ message: 'Please select a gender' })
  }),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

export type SignupFormData = z.infer<typeof signupSchema>;

// Login Schema
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

export type LoginFormData = z.infer<typeof loginSchema>;

// Expense Receipt Schema
export const expenseSchema = z.object({
  receiptImage: z.string().min(1, 'Receipt image is required'),
  description: z.string().optional()
});

export type ExpenseFormData = z.infer<typeof expenseSchema>;

// Sales Receipt Schema
export const salesReceiptSchema = z.object({
  receiptImage: z.string().min(1, 'Receipt image is required'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  time: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format (HH:MM)'),
  servingEmployee: z.string().min(1, 'Serving employee is required'),
  buyerName: z.string().min(2, 'Buyer name must be at least 2 characters')
});

export type SalesReceiptFormData = z.infer<typeof salesReceiptSchema>;

// Customer Service Schema
export const customerServiceSchema = z.object({
  customerName: z.string().min(2, 'Customer name must be at least 2 characters'),
  serviceDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  serviceType: z.string().min(2, 'Service type is required'),
  notes: z.string().optional()
});

export type CustomerServiceFormData = z.infer<typeof customerServiceSchema>;

// Production Activity Schema
export const productionSchema = z.object({
  rawMaterialWeight: z.number().positive('Weight must be positive'),
  weightUnit: z.string().min(1, 'Unit is required'),
  machineImageBefore: z.string().min(1, 'Before image is required'),
  machineImageAfter: z.string().min(1, 'After image is required'),
  notes: z.string().optional()
});

export type ProductionFormData = z.infer<typeof productionSchema>;

// Storage Schema
export const storageSchema = z.object({
  location: z.string().min(2, 'Location is required'),
  itemDescription: z.string().min(5, 'Description must be at least 5 characters'),
  quantity: z.number().nonnegative('Quantity cannot be negative'),
  condition: z.string().optional()
});

export type StorageFormData = z.infer<typeof storageSchema>;

// Profile Update Schema
export const profileUpdateSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phoneNumber: z.string().regex(/^\+?[\d\s\-()]+$/, 'Invalid phone number'),
  gender: z.enum(['male', 'female', 'other'])
});

export type ProfileUpdateFormData = z.infer<typeof profileUpdateSchema>;
