// User Types
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  kcUsername: string;
  zone: string;
  city: string;
  country: string;
  phoneNumber: string;
  church: string;
  email: string;
  password: string;
  verificationToken?: string;
  verified: boolean;
  verifiedAt?: Date;
  verificationTokenExpiresAt?: Date;
  resetToken?: string;
  resetTokenExpiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Product Types
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number; // Decimal from DB, but we'll use number for frontend
  imageUrl: string;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}

// Cart Types
export interface CartItem {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
  product: Product; // Include the full product data
}

export interface Cart {
  cartItems: CartItem[];
}

// Order Types
export enum OrderStatus {
  PENDING = 'pending',
  PAID = 'paid',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled'
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  product: Product;
}

export interface Order {
  id: string;
  userId: string;
  totalAmount: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
  items: OrderItem[];
}

// Event Types
export interface Event {
  id: string;
  title: string;
  date: Date;
  minister: string;
  platform: string;
  time: string;
  imageUrl?: string;
  link?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Program Types
export interface Program {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  isLive: boolean;
  startTime: Date;
  endTime: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Comment Types
export interface Comment {
  id: string;
  userId: string;
  programId: string;
  content: string;
  createdAt: Date;
  user: User;
}

// User Program Types
export interface UserProgram {
  id: string;
  userId: string;
  programId: string;
  joinedAt: Date;
  watchedDuration?: number;
  participated: boolean;
  user: User;
  program: Program;
}

// Form Types for Auth
export interface SignupFormValues {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  country: string;
  city: string;
  zone: string;
  church: string;
  email: string;
  kcUsername: string;
  password: string;
  confirmPassword: string;
}

export interface LoginFormValues {
  email: string;
  password: string;
}

export interface ResetPasswordFormValues {
  newPassword: string;
  confirmPassword: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
} 