import mongoose, { Schema, Document } from 'mongoose';

export interface IFood extends Document {
  name: string;
  category: 'Pizza' | 'Burger' | 'North Indian' | 'South Indian' | 'Desserts' | 'Beverages' | 'Breakfast';
  price: number;
  description: string;
  image: string;
  available: boolean;
  veg: boolean;
  rating: number;
  prepTime: string;
  isFeatured: boolean;
  calories?: number;
  createdAt: Date;
  updatedAt: Date;
}

const foodSchema = new Schema<IFood>(
  {
    name: {
      type: String,
      required: [true, 'Food name is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Pizza', 'Burger', 'North Indian', 'South Indian', 'Desserts', 'Beverages'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    image: {
      type: String,
      default: '/src/assets/images/dish_chicken_burger_1793729623084.jpg',
    },
    available: {
      type: Boolean,
      default: true,
    },
    veg: {
      type: Boolean,
      default: true,
    },
    rating: {
      type: Number,
      default: 4.8,
      min: 0,
      max: 5,
    },
    prepTime: {
      type: String,
      default: '20-25 mins',
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    calories: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

export const FoodModel = mongoose.models.Food || mongoose.model<IFood>('Food', foodSchema);
