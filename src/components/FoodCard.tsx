import React, { useState } from 'react';
import { Plus, Minus, Star, Clock } from 'lucide-react';
import { FoodItem } from '../types';
import { useCart } from '../context/CartContext';

interface FoodCardProps {
  food: FoodItem;
  onSelect?: (food: FoodItem) => void;
}

export const FoodCard: React.FC<FoodCardProps> = ({ food, onSelect }) => {
  const { getItemQuantity, addToCart, updateQuantity } = useCart();
  const quantity = getItemQuantity(food._id);
  const [imageError, setImageError] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(food, 1);
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateQuantity(food._id, quantity + 1);
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateQuantity(food._id, quantity - 1);
  };

  return (
    <div
      onClick={() => onSelect?.(food)}
      className="group bg-white rounded-2xl border border-stone-200 hover:border-orange-200 hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col cursor-pointer"
    >
      {/* Food Image Container */}
      <div className="relative aspect-4/3 w-full bg-stone-100 overflow-hidden">
        {!imageError ? (
          <img
            src={food.image}
            alt={food.name}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-stone-100 text-stone-400 p-4 text-center">
            <span className="text-4xl mb-1">
              {food.category === 'Burger' ? '🍔' : food.category === 'Pizza' ? '🍕' : food.category === 'Desserts' ? '🍰' : food.category === 'Beverages' ? '🍹' : '🍛'}
            </span>
            <span className="text-xs font-medium text-stone-500">{food.name}</span>
          </div>
        )}

        {/* Veg / Non-Veg Indicator badge in top-left */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs p-1 rounded-sm shadow-xs flex items-center justify-center">
          <div
            className={`w-3.5 h-3.5 border flex items-center justify-center ${
              food.veg ? 'border-emerald-600' : 'border-red-600'
            }`}
          >
            <div
              className={`w-1.5 h-1.5 rounded-full ${
                food.veg ? 'bg-emerald-600' : 'bg-red-600'
              }`}
            />
          </div>
        </div>

        {/* Prep Time Tag */}
        <div className="absolute bottom-3 right-3 bg-stone-900/80 backdrop-blur-xs text-white text-[11px] font-medium px-2 py-0.5 rounded-md flex items-center gap-1">
          <Clock className="w-3 h-3 text-stone-300" />
          <span>{food.prepTime}</span>
        </div>
      </div>

      {/* Food Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1.5">
            <span className="font-semibold text-orange-600 uppercase tracking-wider text-[11px]">
              {food.category}
            </span>
            <div className="flex items-center gap-1 font-medium text-stone-700">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{food.rating.toFixed(1)}</span>
            </div>
          </div>

          {/* Dish Name */}
          <h3 className="font-heading font-semibold text-stone-900 text-base group-hover:text-orange-600 transition-colors line-clamp-1 mb-1">
            {food.name}
          </h3>

          {/* Description */}
          <p className="text-stone-500 text-xs line-clamp-2 leading-relaxed mb-3">
            {food.description}
          </p>
        </div>

        {/* Price and Cart Action */}
        <div className="pt-2 border-t border-stone-100 flex items-center justify-between mt-auto">
          <div>
            <span className="text-xs text-stone-400 block font-normal">Price</span>
            <span className="font-heading font-bold text-lg text-stone-900 tabular-nums">
              ₹{food.price}
            </span>
          </div>

          {food.available ? (
            quantity > 0 ? (
              <div
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-lg px-2 py-1 text-orange-700 text-xs font-semibold"
              >
                <button
                  onClick={handleDecrement}
                  className="w-5 h-5 rounded flex items-center justify-center hover:bg-orange-200 transition-colors cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="tabular-nums font-bold w-4 text-center">{quantity}</span>
                <button
                  onClick={handleIncrement}
                  className="w-5 h-5 rounded flex items-center justify-center hover:bg-orange-200 transition-colors cursor-pointer"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleAdd}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold transition-colors cursor-pointer shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            )
          ) : (
            <span className="text-xs text-stone-400 font-medium">Sold Out</span>
          )}
        </div>
      </div>
    </div>
  );
};
