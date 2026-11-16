import React, { useState, useEffect } from 'react';
import { Search, Filter, SlidersHorizontal, RefreshCw } from 'lucide-react';
import { FoodItem, FoodCategory } from '../types';
import { api } from '../services/api';
import { FoodCard } from '../components/FoodCard';

interface MenuPageProps {
  initialCategory?: FoodCategory;
  onSelectFood: (food: FoodItem) => void;
}

export const MenuPage: React.FC<MenuPageProps> = ({
  initialCategory = 'All',
  onSelectFood,
}) => {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<FoodCategory>(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [vegOnly, setVegOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');

  const categories: FoodCategory[] = [
    'All',
    'Burger',
    'Pizza',
    'North Indian',
    'South Indian',
    'Desserts',
    'Beverages',
  ];

  const fetchFoods = async () => {
    setLoading(true);
    try {
      const data = await api.getFoods({
        category: selectedCategory,
        search: searchQuery,
        veg: vegOnly ? true : undefined,
      });
      setFoods(data);
    } catch (err) {
      console.error('Error fetching foods:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, [selectedCategory, vegOnly]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchFoods();
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Apply sorting
  const sortedFoods = [...foods].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-stone-900 tracking-tight">
          Our Food Menu
        </h1>
        <p className="text-stone-500 text-xs sm:text-sm">
          Browse through {foods.length} handcrafted dishes, prepared fresh to order.
        </p>
      </div>

      {/* Control Bar: Search & Filters */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dishes by name or ingredients..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-orange-500 transition-colors shadow-2xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-xs text-stone-400 hover:text-stone-600"
              >
                Clear
              </button>
            )}
          </div>

          {/* Controls: Pure Veg toggle & Sorting */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Pure Veg Switch */}
            <button
              onClick={() => setVegOnly(!vegOnly)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                vegOnly
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                  : 'bg-white border-stone-200 text-stone-700 hover:border-stone-300'
              }`}
            >
              <div
                className={`w-3.5 h-3.5 border flex items-center justify-center ${
                  vegOnly ? 'border-emerald-600' : 'border-stone-400'
                }`}
              >
                <div
                  className={`w-1.5 h-1.5 rounded-full ${
                    vegOnly ? 'bg-emerald-600' : 'bg-transparent'
                  }`}
                />
              </div>
              <span>Pure Veg Only</span>
            </button>

            {/* Sorting Dropdown */}
            <div className="relative flex items-center">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs font-semibold text-stone-700 focus:outline-none focus:border-orange-500 cursor-pointer shadow-2xs"
              >
                <option value="featured">Sort by: Recommended</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated (★)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Pills (Functional filter tabs) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-orange-600 text-white shadow-xs'
                    : 'bg-white hover:bg-stone-100 text-stone-600 border border-stone-200'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Food Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="h-80 rounded-2xl bg-stone-100 animate-pulse" />
          ))}
        </div>
      ) : sortedFoods.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-stone-200 space-y-4 max-w-lg mx-auto">
          <div className="text-4xl">🔍</div>
          <h3 className="font-heading font-bold text-lg text-stone-900">
            No matching food items found
          </h3>
          <p className="text-xs text-stone-500">
            Try adjusting your search query, clearing filters, or switching categories.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
              setVegOnly(false);
            }}
            className="px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-semibold hover:bg-stone-800 transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedFoods.map((food) => (
            <FoodCard key={food._id} food={food} onSelect={onSelectFood} />
          ))}
        </div>
      )}

    </div>
  );
};
