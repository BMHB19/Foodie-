import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { UserModel } from '../models/User.ts';
import { FoodModel } from '../models/Food.ts';
import { OrderModel } from '../models/Order.ts';
import { SEED_FOODS } from '../data/seedData.ts';

let mongoConnected = false;

export function isMongoConnected(): boolean {
  return mongoConnected && mongoose.connection.readyState === 1;
}

export async function seedMongoDatabase(forceReset = false) {
  if (!isMongoConnected()) return null;

  if (forceReset) {
    await Promise.all([
      UserModel.deleteMany({}),
      FoodModel.deleteMany({}),
      OrderModel.deleteMany({}),
    ]);
  }

  // 1. Seed Users if empty
  let usersCount = await UserModel.countDocuments();
  let customerUser = await UserModel.findOne({ email: 'harshith@gmail.com' });

  if (usersCount === 0) {
    const adminPassword = await bcrypt.hash('admin123', 10);
    const customerPassword = await bcrypt.hash('password123', 10);

    await UserModel.create({
      name: 'Restaurant Manager',
      email: 'admin@foodiehub.com',
      password: adminPassword,
      role: 'admin',
      phone: '+91 98765 43210',
      address: 'FoodieHub Central Kitchen, MG Road, Bangalore',
    });

    customerUser = await UserModel.create({
      name: 'Harshith Babu',
      email: 'harshith@gmail.com',
      password: customerPassword,
      role: 'customer',
      phone: '+91 98450 12345',
      address: '#42, 4th Cross, Indiranagar, Bangalore',
    });

    usersCount = 2;
  }

  // 2. Seed Foods if empty (or add missing Hot Drinks category items)
  let foodsCount = await FoodModel.countDocuments();
  let insertedFoods: any[] = [];
  if (foodsCount === 0) {
    insertedFoods = await FoodModel.insertMany(SEED_FOODS);
    foodsCount = insertedFoods.length;
  } else {
    const hotDrinksCount = await FoodModel.countDocuments({ category: 'Hot Drinks' });
    if (hotDrinksCount === 0) {
      const hotDrinksSeed = SEED_FOODS.filter((f) => f.category === 'Hot Drinks');
      if (hotDrinksSeed.length > 0) {
        await FoodModel.insertMany(hotDrinksSeed);
        foodsCount = await FoodModel.countDocuments();
      }
    }
    insertedFoods = await FoodModel.find().limit(14);
  }

  // 3. Seed Demo Orders if empty
  let ordersCount = await OrderModel.countDocuments();
  if (ordersCount === 0 && customerUser && insertedFoods.length >= 2) {
    const burger = insertedFoods.find((f) => f.name.includes('Chicken Burger')) || insertedFoods[0];
    const pizza = insertedFoods.find((f) => f.name.includes('Margherita')) || insertedFoods[1];
    const lassi = insertedFoods.find((f) => f.name.includes('Lassi')) || insertedFoods[0];
    const cake = insertedFoods.find((f) => f.name.includes('Lava Cake')) || insertedFoods[1];

    await OrderModel.insertMany([
      {
        orderNumber: 'ORD-84192',
        userId: String(customerUser._id),
        customerName: 'Harshith Babu',
        customerEmail: 'harshith@gmail.com',
        customerPhone: '+91 98450 12345',
        items: [
          {
            foodId: String(burger._id),
            name: burger.name,
            quantity: 2,
            price: burger.price,
            image: burger.image,
            veg: burger.veg,
          },
          {
            foodId: String(lassi._id),
            name: lassi.name,
            quantity: 1,
            price: lassi.price,
            image: lassi.image,
            veg: lassi.veg,
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
      },
      {
        orderNumber: 'ORD-76210',
        userId: String(customerUser._id),
        customerName: 'Harshith Babu',
        customerEmail: 'harshith@gmail.com',
        customerPhone: '+91 98450 12345',
        items: [
          {
            foodId: String(pizza._id),
            name: pizza.name,
            quantity: 1,
            price: pizza.price,
            image: pizza.image,
            veg: pizza.veg,
          },
          {
            foodId: String(cake._id),
            name: cake.name,
            quantity: 1,
            price: cake.price,
            image: cake.image,
            veg: cake.veg,
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
      },
    ]);
    ordersCount = 2;
  }

  return { usersCount, foodsCount, ordersCount };
}

export async function connectDatabase(): Promise<boolean> {
  const uri = process.env.MONGODB_URI?.trim();

  if (!uri || uri === 'MY_MONGODB_URI') {
    console.log('⚠️  MONGODB_URI not set in .env — using local JSON store fallback (data/db.json).');
    console.log('   To connect MongoDB, add MONGODB_URI=mongodb://127.0.0.1:27017/foodiehub to your .env file.');
    mongoConnected = false;
    return false;
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    mongoConnected = true;
    console.log(`✅ MongoDB connected successfully (${mongoose.connection.name})`);
    await seedMongoDatabase(false);
    return true;
  } catch (err: any) {
    mongoConnected = false;
    console.error(`❌ MongoDB connection failed: ${err.message}`);
    console.log('⚠️  Falling back to local JSON store (data/db.json) so the app stays operational.');
    return false;
  }
}
