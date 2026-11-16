import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';

import { connectDatabase, isMongoConnected, seedMongoDatabase } from './backend/config/db.ts';
import { UserModel } from './backend/models/User.ts';
import { FoodModel } from './backend/models/Food.ts';
import { OrderModel } from './backend/models/Order.ts';
import { SEED_FOODS } from './backend/data/seedData.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProduction = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'foodiehub_mern_jwt_secret_dev';

// --- Local JSON Fallback Store (used when MONGODB_URI is not provided) ---
const DATA_DIR = path.resolve(__dirname, 'data');
const DB_FILE = path.resolve(DATA_DIR, 'db.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

interface FallbackDatabaseSchema {
  users: Array<{
    _id: string;
    name: string;
    email: string;
    password: string;
    role: 'customer' | 'admin';
    phone?: string;
    address?: string;
    createdAt: string;
  }>;
  foods: Array<{
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
  }>;
  orders: Array<{
    _id: string;
    orderNumber: string;
    userId?: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    items: Array<{
      foodId: string;
      name: string;
      quantity: number;
      price: number;
      image: string;
      veg: boolean;
    }>;
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
    status: 'Pending' | 'Confirmed' | 'Preparing' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
    createdAt: string;
    updatedAt: string;
  }>;
}

function getInitialFallbackDatabase(): FallbackDatabaseSchema {
  const adminPassword = bcrypt.hashSync('admin123', 10);
  const userPassword = bcrypt.hashSync('password123', 10);

  return {
    users: [
      {
        _id: 'usr_admin_1',
        name: 'Restaurant Manager',
        email: 'admin@foodiehub.com',
        password: adminPassword,
        role: 'admin',
        phone: '+91 98765 43210',
        address: 'FoodieHub Central Kitchen, MG Road, Bangalore',
        createdAt: new Date().toISOString(),
      },
      {
        _id: 'usr_harshith_1',
        name: 'Harshith Babu',
        email: 'harshith@gmail.com',
        password: userPassword,
        role: 'customer',
        phone: '+91 98450 12345',
        address: '#42, 4th Cross, Indiranagar, Bangalore',
        createdAt: new Date().toISOString(),
      },
    ],
    foods: SEED_FOODS.map((food, idx) => ({
      _id: `food_${idx + 1}`,
      ...food,
    })),
    orders: [
      {
        _id: 'ord_demo_101',
        orderNumber: 'ORD-84192',
        userId: 'usr_harshith_1',
        customerName: 'Harshith Babu',
        customerEmail: 'harshith@gmail.com',
        customerPhone: '+91 98450 12345',
        items: [
          {
            foodId: 'food_1',
            name: 'Crispy Gourmet Chicken Burger',
            quantity: 2,
            price: 149,
            image: '/src/assets/images/dish_chicken_burger_1793729623084.jpg',
            veg: false,
          },
          {
            foodId: 'food_13',
            name: 'Royal Kesar Mango Lassi',
            quantity: 1,
            price: 99,
            image: 'https://images.unsplash.com/photo-1528736235302-52922df5c122?w=800&auto=format&fit=crop&q=80',
            veg: true,
          },
        ],
        subtotal: 397,
        deliveryFee: 0,
        tax: 20,
        discount: 50,
        totalAmount: 367,
        address: '#42, 4th Cross, Indiranagar',
        city: 'Bangalore',
        pincode: '560038',
        deliveryNotes: 'Please ring the doorbell and leave at door',
        paymentMethod: 'Cash on Delivery (COD)',
        status: 'Preparing',
        createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      },
      {
        _id: 'ord_demo_100',
        orderNumber: 'ORD-76210',
        userId: 'usr_harshith_1',
        customerName: 'Harshith Babu',
        customerEmail: 'harshith@gmail.com',
        customerPhone: '+91 98450 12345',
        items: [
          {
            foodId: 'food_2',
            name: 'Wood-Fired Margherita Pizza',
            quantity: 1,
            price: 249,
            image: '/src/assets/images/dish_margherita_pizza_1793729624791.jpg',
            veg: true,
          },
          {
            foodId: 'food_12',
            name: 'Molten Belgian Chocolate Lava Cake',
            quantity: 1,
            price: 159,
            image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&auto=format&fit=crop&q=80',
            veg: true,
          },
        ],
        subtotal: 408,
        deliveryFee: 0,
        tax: 20,
        discount: 81,
        totalAmount: 347,
        address: '#42, 4th Cross, Indiranagar',
        city: 'Bangalore',
        pincode: '560038',
        paymentMethod: 'UPI / Online',
        status: 'Delivered',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
      },
    ],
  };
}

function readFallbackDatabase(): FallbackDatabaseSchema {
  try {
    if (!fs.existsSync(DB_FILE)) {
      const initial = getInitialFallbackDatabase();
      fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
      return initial;
    }
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(data);
    // Migrate legacy fallback records that had passwordHash/salt to bcrypt password
    let migrated = false;
    if (Array.isArray(parsed.users)) {
      parsed.users = parsed.users.map((u: any) => {
        if (!u.password) {
          migrated = true;
          const defaultPwd = u.email === 'admin@foodiehub.com' ? 'admin123' : 'password123';
          return { ...u, password: bcrypt.hashSync(defaultPwd, 10) };
        }
        return u;
      });
    }
    if (migrated) {
      fs.writeFileSync(DB_FILE, JSON.stringify(parsed, null, 2), 'utf-8');
    }
    return parsed;
  } catch (err) {
    console.error('Error reading fallback DB, re-initializing...', err);
    const initial = getInitialFallbackDatabase();
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
    return initial;
  }
}

function writeFallbackDatabase(db: FallbackDatabaseSchema): void {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing fallback DB:', err);
  }
}

// --- JWT Helpers ---
function generateToken(userId: string, email: string, role: string): string {
  return jwt.sign({ userId, email, role }, JWT_SECRET, { expiresIn: '7d' });
}

function verifyToken(token: string): { userId: string; email: string; role: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; email: string; role: string };
  } catch {
    return null;
  }
}

const app = express();
app.use(express.json());

// Auth Middleware
function authMiddleware(req: Request, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }
  const token = authHeader.split(' ')[1];
  const verified = verifyToken(token);
  if (verified) {
    (req as any).user = verified;
  }
  next();
}

app.use(authMiddleware);

// --- REST API ROUTES ---

// 1. Food Routes
app.get('/api/foods', async (req: Request, res: Response) => {
  try {
    const { category, search, veg, featured } = req.query;

    if (isMongoConnected()) {
      const filter: Record<string, any> = {};
      if (category && category !== 'All') {
        filter.category = new RegExp(`^${String(category)}$`, 'i');
      }
      if (search) {
        const q = String(search).trim();
        filter.$or = [
          { name: new RegExp(q, 'i') },
          { description: new RegExp(q, 'i') },
          { category: new RegExp(q, 'i') },
        ];
      }
      if (veg !== undefined && veg !== '') {
        filter.veg = veg === 'true';
      }
      if (featured === 'true') {
        filter.isFeatured = true;
      }

      const results = await FoodModel.find(filter).sort({ createdAt: -1 }).lean();
      return res.json({ success: true, count: results.length, data: results });
    }

    // Fallback JSON Store
    const db = readFallbackDatabase();
    let results = [...db.foods];

    if (category && category !== 'All') {
      results = results.filter(
        (item) => item.category.toLowerCase() === String(category).toLowerCase()
      );
    }
    if (search) {
      const q = String(search).toLowerCase();
      results = results.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q)
      );
    }
    if (veg !== undefined && veg !== '') {
      const isVeg = veg === 'true';
      results = results.filter((item) => item.veg === isVeg);
    }
    if (featured === 'true') {
      results = results.filter((item) => item.isFeatured);
    }

    return res.json({ success: true, count: results.length, data: results });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
});

app.get('/api/foods/:id', async (req: Request, res: Response) => {
  try {
    const foodId = String(req.params.id);
    if (isMongoConnected()) {
      if (!mongoose.isValidObjectId(foodId)) {
        return res.status(404).json({ success: false, message: 'Food item not found' });
      }
      const food = await FoodModel.findById(foodId).lean();
      if (!food) {
        return res.status(404).json({ success: false, message: 'Food item not found' });
      }
      return res.json({ success: true, data: food });
    }

    const db = readFallbackDatabase();
    const food = db.foods.find((f) => f._id === foodId);
    if (!food) {
      return res.status(404).json({ success: false, message: 'Food item not found' });
    }
    return res.json({ success: true, data: food });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
});

app.post('/api/foods', async (req: Request, res: Response) => {
  try {
    const { name, category, price, description, image, available, veg, prepTime, calories, isFeatured } = req.body;

    if (!name || !category || price === undefined) {
      return res.status(400).json({ success: false, message: 'Name, category, and price are required' });
    }

    const foodPayload = {
      name: String(name).trim(),
      category,
      price: Number(price),
      description: String(description || ''),
      image: String(image || '/src/assets/images/dish_chicken_burger_1793729623084.jpg'),
      available: available !== undefined ? Boolean(available) : true,
      veg: Boolean(veg),
      rating: 4.8,
      prepTime: String(prepTime || '20-25 mins'),
      isFeatured: Boolean(isFeatured),
      calories: calories ? Number(calories) : undefined,
    };

    if (isMongoConnected()) {
      const created = await FoodModel.create(foodPayload);
      return res.status(201).json({ success: true, data: created, message: 'Food item created successfully' });
    }

    const db = readFallbackDatabase();
    const newFood = {
      _id: `food_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      ...foodPayload,
    };
    db.foods.unshift(newFood);
    writeFallbackDatabase(db);
    return res.status(201).json({ success: true, data: newFood, message: 'Food item created successfully' });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
});

app.put('/api/foods/:id', async (req: Request, res: Response) => {
  try {
    const foodId = String(req.params.id);
    if (isMongoConnected()) {
      if (!mongoose.isValidObjectId(foodId)) {
        return res.status(404).json({ success: false, message: 'Food item not found' });
      }
      const updates: Record<string, any> = { ...req.body };
      if (updates.price !== undefined) updates.price = Number(updates.price);
      if (updates.available !== undefined) updates.available = Boolean(updates.available);
      if (updates.veg !== undefined) updates.veg = Boolean(updates.veg);

      const updated = await FoodModel.findByIdAndUpdate(foodId, updates, { new: true, runValidators: true }).lean();
      if (!updated) {
        return res.status(404).json({ success: false, message: 'Food item not found' });
      }
      return res.json({ success: true, data: updated, message: 'Food item updated successfully' });
    }

    const db = readFallbackDatabase();
    const index = db.foods.findIndex((f) => f._id === foodId);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Food item not found' });
    }

    const existing = db.foods[index];
    const updated = {
      ...existing,
      ...req.body,
      price: req.body.price !== undefined ? Number(req.body.price) : existing.price,
      available: req.body.available !== undefined ? Boolean(req.body.available) : existing.available,
      veg: req.body.veg !== undefined ? Boolean(req.body.veg) : existing.veg,
    };
    db.foods[index] = updated;
    writeFallbackDatabase(db);
    return res.json({ success: true, data: updated, message: 'Food item updated successfully' });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
});

app.delete('/api/foods/:id', async (req: Request, res: Response) => {
  try {
    const foodId = String(req.params.id);
    if (isMongoConnected()) {
      if (!mongoose.isValidObjectId(foodId)) {
        return res.status(404).json({ success: false, message: 'Food item not found' });
      }
      const deleted = await FoodModel.findByIdAndDelete(foodId);
      if (!deleted) {
        return res.status(404).json({ success: false, message: 'Food item not found' });
      }
      return res.json({ success: true, message: 'Food item deleted successfully' });
    }

    const db = readFallbackDatabase();
    const initialLength = db.foods.length;
    db.foods = db.foods.filter((f) => f._id !== foodId);
    if (db.foods.length === initialLength) {
      return res.status(404).json({ success: false, message: 'Food item not found' });
    }
    writeFallbackDatabase(db);
    return res.json({ success: true, message: 'Food item deleted successfully' });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
});

// 2. Authentication Routes
app.post('/api/users/register', async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone, address, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const hashedPassword = await bcrypt.hash(String(password), 10);

    if (isMongoConnected()) {
      const existing = await UserModel.findOne({ email: normalizedEmail });
      if (existing) {
        return res.status(400).json({ success: false, message: 'An account with this email already exists' });
      }

      const created = await UserModel.create({
        name: String(name).trim(),
        email: normalizedEmail,
        password: hashedPassword,
        role: role === 'admin' ? 'admin' : 'customer',
        phone: phone ? String(phone).trim() : undefined,
        address: address ? String(address).trim() : undefined,
      });

      const token = generateToken(String(created._id), created.email, created.role);
      return res.status(201).json({
        success: true,
        user: {
          _id: String(created._id),
          name: created.name,
          email: created.email,
          role: created.role,
          phone: created.phone,
          address: created.address,
        },
        token,
        message: 'User registered successfully',
      });
    }

    const db = readFallbackDatabase();
    const existingUser = db.users.find((u) => u.email.toLowerCase() === normalizedEmail);
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists' });
    }

    const newUser = {
      _id: `usr_${Date.now()}`,
      name: String(name).trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: (role === 'admin' ? 'admin' : 'customer') as 'admin' | 'customer',
      phone: phone ? String(phone).trim() : undefined,
      address: address ? String(address).trim() : undefined,
      createdAt: new Date().toISOString(),
    };
    db.users.push(newUser);
    writeFallbackDatabase(db);

    const token = generateToken(newUser._id, newUser.email, newUser.role);
    return res.status(201).json({
      success: true,
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        phone: newUser.phone,
        address: newUser.address,
      },
      token,
      message: 'User registered successfully',
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
});

app.post('/api/users/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    if (isMongoConnected()) {
      const user = await UserModel.findOne({ email: normalizedEmail });
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }
      const isValid = await bcrypt.compare(String(password), user.password);
      if (!isValid) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }

      const token = generateToken(String(user._id), user.email, user.role);
      return res.json({
        success: true,
        user: {
          _id: String(user._id),
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          address: user.address,
        },
        token,
        message: 'Logged in successfully',
      });
    }

    const db = readFallbackDatabase();
    const user = db.users.find((u) => u.email.toLowerCase() === normalizedEmail);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isValid = await bcrypt.compare(String(password), user.password);
    if (!isValid) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = generateToken(user._id, user.email, user.role);
    return res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
      },
      token,
      message: 'Logged in successfully',
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
});

app.get('/api/users/me', async (req: Request, res: Response) => {
  try {
    const authUser = (req as any).user;
    if (!authUser) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    if (isMongoConnected()) {
      if (!mongoose.isValidObjectId(authUser.userId)) {
        return res.status(401).json({ success: false, message: 'Invalid session token' });
      }
      const user = await UserModel.findById(authUser.userId).select('-password').lean();
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      return res.json({
        success: true,
        user: {
          _id: String(user._id),
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          address: user.address,
        },
      });
    }

    const db = readFallbackDatabase();
    const user = db.users.find((u) => u._id === authUser.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    return res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
      },
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
});

// 3. Orders Routes
app.get('/api/orders', async (req: Request, res: Response) => {
  try {
    const authUser = (req as any).user;
    const { userId } = req.query;

    if (isMongoConnected()) {
      const filter: Record<string, any> = {};
      if (userId) {
        filter.userId = String(userId);
      } else if (authUser && authUser.role !== 'admin') {
        filter.userId = String(authUser.userId);
      }

      const orders = await OrderModel.find(filter).sort({ createdAt: -1 }).lean();
      return res.json({ success: true, count: orders.length, data: orders });
    }

    const db = readFallbackDatabase();
    let orders = [...db.orders];

    if (userId) {
      orders = orders.filter((o) => o.userId === String(userId));
    } else if (authUser && authUser.role !== 'admin') {
      orders = orders.filter((o) => o.userId === authUser.userId);
    }

    orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return res.json({ success: true, count: orders.length, data: orders });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
});

app.get('/api/orders/:id', async (req: Request, res: Response) => {
  try {
    const idParam = String(req.params.id);
    if (isMongoConnected()) {
      const query = mongoose.isValidObjectId(idParam)
        ? { $or: [{ _id: idParam }, { orderNumber: idParam }] }
        : { orderNumber: idParam };
      const order = await OrderModel.findOne(query).lean();
      if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found' });
      }
      return res.json({ success: true, data: order });
    }

    const db = readFallbackDatabase();
    const order = db.orders.find((o) => o._id === idParam || o.orderNumber === idParam);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    return res.json({ success: true, data: order });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
});

app.post('/api/orders', async (req: Request, res: Response) => {
  try {
    const {
      items,
      customerName,
      customerEmail,
      customerPhone,
      address,
      city,
      pincode,
      deliveryNotes,
      paymentMethod,
      discountCode,
    } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Order must contain at least one item' });
    }

    if (!customerName || !customerPhone || !address) {
      return res.status(400).json({
        success: false,
        message: 'Customer name, phone number, and delivery address are required',
      });
    }

    let subtotal = 0;
    const sanitizedItems = items.map((item: any) => {
      const qty = Math.max(1, Number(item.quantity) || 1);
      const price = Number(item.price) || 0;
      subtotal += price * qty;
      return {
        foodId: String(item.foodId),
        name: String(item.name),
        quantity: qty,
        price,
        image: String(item.image || ''),
        veg: Boolean(item.veg),
      };
    });

    const deliveryFee = subtotal >= 399 ? 0 : 40;
    const tax = Math.round(subtotal * 0.05);

    let discount = 0;
    if (discountCode) {
      const code = String(discountCode).trim().toUpperCase();
      if (code === 'FOODIE50' && subtotal >= 199) {
        discount = Math.min(100, Math.round(subtotal * 0.5));
      } else if (code === 'WELCOME20' && subtotal >= 149) {
        discount = Math.round(subtotal * 0.2);
      } else if (code === 'FEAST75' && subtotal >= 399) {
        discount = 75;
      }
    }

    const totalAmount = Math.max(0, subtotal + deliveryFee + tax - discount);
    const authUser = (req as any).user;

    const orderPayload = {
      orderNumber: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      userId: authUser ? String(authUser.userId) : undefined,
      customerName: String(customerName).trim(),
      customerEmail: customerEmail ? String(customerEmail).trim() : 'guest@foodiehub.com',
      customerPhone: String(customerPhone).trim(),
      items: sanitizedItems,
      subtotal,
      deliveryFee,
      tax,
      discount,
      totalAmount,
      address: String(address).trim(),
      city: String(city || 'Bangalore').trim(),
      pincode: String(pincode || '560001').trim(),
      deliveryNotes: deliveryNotes ? String(deliveryNotes).trim() : undefined,
      paymentMethod: (paymentMethod === 'UPI / Online' ? 'UPI / Online' : 'Cash on Delivery (COD)') as
        | 'Cash on Delivery (COD)'
        | 'UPI / Online',
      status: 'Pending' as const,
    };

    if (isMongoConnected()) {
      const created = await OrderModel.create(orderPayload);
      return res.status(201).json({
        success: true,
        data: created,
        message: 'Order placed successfully! Preparing your delicious meal.',
      });
    }

    const db = readFallbackDatabase();
    const newOrder = {
      _id: `ord_${Date.now()}`,
      ...orderPayload,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    db.orders.unshift(newOrder);
    writeFallbackDatabase(db);
    return res.status(201).json({
      success: true,
      data: newOrder,
      message: 'Order placed successfully! Preparing your delicious meal.',
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
});

app.patch('/api/orders/:id/status', async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const idParam = String(req.params.id);

    if (isMongoConnected()) {
      const query = mongoose.isValidObjectId(idParam)
        ? { $or: [{ _id: idParam }, { orderNumber: idParam }] }
        : { orderNumber: idParam };
      const updated = await OrderModel.findOneAndUpdate(
        query,
        { status },
        { new: true, runValidators: true }
      ).lean();

      if (!updated) {
        return res.status(404).json({ success: false, message: 'Order not found' });
      }
      return res.json({
        success: true,
        data: updated,
        message: `Order status updated to ${status}`,
      });
    }

    const db = readFallbackDatabase();
    const orderIndex = db.orders.findIndex((o) => o._id === idParam || o.orderNumber === idParam);
    if (orderIndex === -1) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    db.orders[orderIndex].status = status;
    db.orders[orderIndex].updatedAt = new Date().toISOString();
    writeFallbackDatabase(db);

    return res.json({
      success: true,
      data: db.orders[orderIndex],
      message: `Order status updated to ${status}`,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
});

// 4. Seed / Reset Route
app.post('/api/seed', async (_req: Request, res: Response) => {
  try {
    if (isMongoConnected()) {
      const stats = await seedMongoDatabase(true);
      return res.json({
        success: true,
        engine: 'MongoDB (Mongoose)',
        message: 'MongoDB collections reset to default seed data successfully',
        foodsCount: stats?.foodsCount || 0,
        usersCount: stats?.usersCount || 0,
        ordersCount: stats?.ordersCount || 0,
      });
    }

    const freshDb = getInitialFallbackDatabase();
    writeFallbackDatabase(freshDb);
    return res.json({
      success: true,
      engine: 'Local JSON Fallback',
      message: 'Database reset to default seed data successfully',
      foodsCount: freshDb.foods.length,
      usersCount: freshDb.users.length,
      ordersCount: freshDb.orders.length,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
});

// 5. Health Check
app.get('/api/health', async (_req: Request, res: Response) => {
  try {
    if (isMongoConnected()) {
      const [foods, orders, users] = await Promise.all([
        FoodModel.countDocuments(),
        OrderModel.countDocuments(),
        UserModel.countDocuments(),
      ]);
      return res.json({
        status: 'ok',
        engine: 'MongoDB (Mongoose)',
        databaseName: mongoose.connection.name,
        timestamp: new Date().toISOString(),
        database: { foods, orders, users },
      });
    }

    const db = readFallbackDatabase();
    return res.json({
      status: 'ok',
      engine: 'Local JSON Fallback (Set MONGODB_URI in .env to connect MongoDB)',
      timestamp: new Date().toISOString(),
      database: {
        foods: db.foods.length,
        orders: db.orders.length,
        users: db.users.length,
      },
    });
  } catch (err: any) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
});

// Serve frontend in development with Vite or production with static files
async function setupApp() {
  await connectDatabase();

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`\n  🍽️  FoodieHub full-stack server is running!`);
    console.log(`  ➜  Local:    http://localhost:${PORT}/`);
    console.log(`  ➜  Network:  http://127.0.0.1:${PORT}/`);
    console.log(
      `  ➜  Database: ${isMongoConnected() ? 'MongoDB (Mongoose Connected)' : 'Local JSON Store (Fallback)'}\n`
    );
  });
}

setupApp();
