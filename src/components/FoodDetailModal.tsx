import React, { useState } from 'react';
import { X, Star, Clock, Flame, Plus, Minus, ShoppingBag } from 'lucide-react';
import { FoodItem } from '../types';
import { useCart } from '../context/CartContext';

interface FoodDetailModalProps {
  food: FoodItem | null;
  onClose: () => void;
}

export const FoodDetailModal: React.FC<FoodDetailModalProps> = ({ food, onClose }) => {
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);
  const [imageError, setImageError] = useState(false);

  if (!food) return null;

  const handleAddToCart = () => {
    addToCart(food, qty);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs">
      <div
        className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Image Header */}
        <div className="relative aspect-16/10 bg-stone-100">
          {!imageError ? (
            <img
              src={food.image}
              alt={food.name}
              referrerPolicy="no-referrer"
              onError={() => setImageError(true)}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-stone-100 text-stone-400 text-5xl">
              🍽️
            </div>
          )}

          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-stone-900/70 hover:bg-stone-900 text-white p-2 rounded-full backdrop-blur-xs transition-colors cursor-pointer"
            aria-label="Close details"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Veg/Non-veg badge */}
          <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-md shadow-xs flex items-center gap-2 text-xs font-semibold">
            <div
              className={`w-3.5 h-3.5 border flex items-center justify-center ${
                food.veg ? 'border-emerald-600' : 'border-red-600'
              }`}
            >
              <div className={`w-1.5 h-1.5 rounded-full ${food.veg ? 'bg-emerald-600' : 'bg-red-600'}`} />
            </div>
            <span className={food.veg ? 'text-emerald-700' : 'text-red-700'}>
              {food.veg ? '100% Pure Veg' : 'Non-Vegetarian'}
            </span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
            <span className="font-semibold text-orange-600 uppercase tracking-wider">
              {food.category}
            </span>
            <div className="flex items-center gap-1.5 font-medium text-stone-700">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{food.rating.toFixed(1)} rating</span>
            </div>
          </div>

          <h2 className="font-heading font-bold text-2xl text-stone-900 mb-2">
            {food.name}
          </h2>

          <p className="text-stone-600 text-sm leading-relaxed mb-6">
            {food.description}
          </p>

          {/* Highlights */}
          <div className="grid grid-cols-3 gap-3 p-3 bg-stone-50 rounded-2xl border border-stone-200/70 text-xs mb-6">
            <div className="flex flex-col items-center text-center">
              <Clock className="w-4 h-4 text-stone-500 mb-1" />
              <span className="text-stone-400">Prep Time</span>
              <span className="font-semibold text-stone-800">{food.prepTime}</span>
            </div>
            <div className="flex flex-col items-center text-center border-x border-stone-200">
              <Flame className="w-4 h-4 text-orange-500 mb-1" />
              <span className="text-stone-400">Calories</span>
              <span className="font-semibold text-stone-800">{food.calories || 450} kcal</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <span className="text-sm mb-0.5">🌿</span>
              <span className="text-stone-400">Ingredients</span>
              <span className="font-semibold text-stone-800">Fresh & Natural</span>
            </div>
          </div>

          {/* Footer Controls */}
          <div className="flex items-center justify-between gap-4 pt-4 border-t border-stone-100">
            <div>
              <span className="text-xs text-stone-400 block">Total Price</span>
              <span className="font-heading font-bold text-2xl text-stone-900 tabular-nums">
                ₹{food.price * qty}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {/* Stepper */}
              <div className="flex items-center bg-stone-100 rounded-xl p-1 text-sm font-semibold text-stone-800">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white transition-colors cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center tabular-nums">{qty}</span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add to Cart button */}
              <button
                onClick={handleAddToCart}
                disabled={!food.available}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 disabled:bg-stone-300 text-white font-semibold text-sm transition-colors cursor-pointer shadow-sm"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
