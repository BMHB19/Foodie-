import { FoodItem, Order, User, AuthResponse, FoodCategory } from '../types';

const API_BASE = '/api';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('foodiehub_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const api = {
  // Foods
  async getFoods(params?: { category?: FoodCategory; search?: string; veg?: boolean; featured?: boolean }): Promise<FoodItem[]> {
    const query = new URLSearchParams();
    if (params?.category && params.category !== 'All') query.set('category', params.category);
    if (params?.search) query.set('search', params.search);
    if (params?.veg !== undefined) query.set('veg', String(params.veg));
    if (params?.featured) query.set('featured', 'true');

    const res = await fetch(`${API_BASE}/foods?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch food items');
    const data = await res.json();
    return data.data;
  },

  async getFoodById(id: string): Promise<FoodItem> {
    const res = await fetch(`${API_BASE}/foods/${id}`);
    if (!res.ok) throw new Error('Failed to fetch food item');
    const data = await res.json();
    return data.data;
  },

  async createFood(food: Partial<FoodItem>): Promise<FoodItem> {
    const res = await fetch(`${API_BASE}/foods`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(food),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to create food item');
    }
    const data = await res.json();
    return data.data;
  },

  async updateFood(id: string, updates: Partial<FoodItem>): Promise<FoodItem> {
    const res = await fetch(`${API_BASE}/foods/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(updates),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to update food item');
    }
    const data = await res.json();
    return data.data;
  },

  async deleteFood(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/foods/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
    if (!res.ok) throw new Error('Failed to delete food item');
  },

  // Auth
  async login(email: string, password: string): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');
    return data;
  },

  async register(payload: { name: string; email: string; password: string; phone?: string; address?: string; role?: 'customer' | 'admin' }): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Registration failed');
    return data;
  },

  async getCurrentUser(): Promise<User | null> {
    const token = localStorage.getItem('foodiehub_token');
    if (!token) return null;
    try {
      const res = await fetch(`${API_BASE}/users/me`, {
        headers: getAuthHeader(),
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data.user;
    } catch {
      return null;
    }
  },

  // Orders
  async createOrder(orderData: any): Promise<Order> {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(orderData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to place order');
    return data.data;
  },

  async getOrders(userId?: string): Promise<Order[]> {
    const query = userId ? `?userId=${encodeURIComponent(userId)}` : '';
    const res = await fetch(`${API_BASE}/orders${query}`, {
      headers: getAuthHeader(),
    });
    if (!res.ok) throw new Error('Failed to fetch orders');
    const data = await res.json();
    return data.data;
  },

  async getOrderById(id: string): Promise<Order> {
    const res = await fetch(`${API_BASE}/orders/${id}`, {
      headers: getAuthHeader(),
    });
    if (!res.ok) throw new Error('Order not found');
    const data = await res.json();
    return data.data;
  },

  async updateOrderStatus(id: string, status: string): Promise<Order> {
    const res = await fetch(`${API_BASE}/orders/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update order status');
    return data.data;
  },

  // Utilities
  async resetSeedData(): Promise<any> {
    const res = await fetch(`${API_BASE}/seed`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to reset data');
    return res.json();
  },

  async getHealth(): Promise<any> {
    const res = await fetch(`${API_BASE}/health`);
    return res.json();
  },
};
