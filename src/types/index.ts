export type FoodCategory =
  | 'All'
  | 'Pizza'
  | 'Burger'
  | 'North Indian'
  | 'South Indian'
  | 'Desserts'
  | 'Beverages';

export interface FoodItem {
  _id: string;
  name: string;
  category: 'Pizza' | 'Burger' | 'North Indian' | 'South Indian' | 'Desserts' | 'Beverages';
  price: number;
  description: string;
  image: string;
  available: boolean;
  veg: boolean;
  rating: number;
  prepTime: string;
  isFeatured?: boolean;
  calories?: number;
}

export interface CartItem {
  food: FoodItem;
  quantity: number;
}

export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Preparing'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled';

export interface OrderItem {
  foodId: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
  veg: boolean;
}

export interface Order {
  _id: string;
  orderNumber: string;
  userId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  discount: number;
  totalAmount: number;
  address: string;
  city: string;
  pincode: string;
  deliveryNotes?: string;
  paymentMethod: 'Cash on Delivery (COD)' | 'UPI / Online';
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  phone?: string;
  address?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  message?: string;
}

export interface PromoCode {
  code: string;
  discountPercent?: number;
  flatDiscount?: number;
  maxDiscount?: number;
  minOrder: number;
  description: string;
}
