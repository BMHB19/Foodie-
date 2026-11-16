import React, { useState, useEffect } from 'react';
import { ArrowRight, Search, Clock, ShieldCheck, Award, Sparkles, ChevronRight } from 'lucide-react';
import { FoodItem, FoodCategory } from '../types';
import { api } from '../services/api';
import { FoodCard } from '../components/FoodCard';

interface HomePageProps {
  onNavigate: (view: string, category?: FoodCategory) => void;
  onSelectFood: (food: FoodItem) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onSelectFood }) => {
  const [featuredFoods, setFeaturedFoods] = useState<FoodItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const foods = await api.getFoods({ featured: true });
        setFeaturedFoods(foods.slice(0, 4));
      } catch (err) {
        console.error('Failed to load featured foods:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate('menu');
    }
  };

  const categories: Array<{ id: FoodCategory; name: string; emoji: string; desc: string }> = [
    { id: 'Burger', name: 'Gourmet Burgers', emoji: '🍔', desc: 'Brioche buns & patties' },
    { id: 'Pizza', name: 'Artisan Pizzas', emoji: '🍕', desc: 'Stone-baked crusts' },
    { id: 'North Indian', name: 'North Indian', emoji: '🍛', desc: 'Rich curries & tandoor' },
    { id: 'South Indian', name: 'South Indian', emoji: '🥘', desc: 'Crispy dosas & idlis' },
    { id: 'Desserts', name: 'Sweet Desserts', emoji: '🍰', desc: 'Cakes & gulab jamuns' },
    { id: 'Beverages', name: 'Beverages', emoji: '🍹', desc: 'Lassis & coolers' },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      
      {/* Hero Section */}
      <section className="relative pt-6 sm:pt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Headline & Action */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-orange-600 bg-orange-50 px-3 py-1.5 rounded-full border border-orange-200/60">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Superfast 30-Minute Food Delivery in Bangalore</span>
              </div>

              <h1 className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl text-stone-900 tracking-tight leading-[1.1]">
                Craving Delicious Meals?{' '}
                <span className="text-orange-600">Delivered Hot</span> to Your Door.
              </h1>

              <p className="text-stone-600 text-base sm:text-lg leading-relaxed max-w-xl">
                Explore hand-crafted pizzas, juicy gourmet burgers, fragrant biryanis, and comforting curries. Made with fresh local ingredients and delivered with lightning speed.
              </p>

              {/* Search Bar */}
              <form
                onSubmit={handleSearchSubmit}
                className="flex items-center gap-2 p-1.5 bg-white rounded-2xl border border-stone-200 shadow-sm max-w-md focus-within:border-orange-500 transition-colors"
              >
                <div className="pl-3 text-stone-400">
                  <Search className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search chicken burger, margherita pizza, dosa..."
                  className="w-full text-xs sm:text-sm py-2 px-1 focus:outline-none text-stone-800"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer shrink-0"
                >
                  Search
                </button>
              </form>

              {/* Quick Feature Badges */}
              <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-stone-600">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-orange-600" />
                  <span>Avg. 30 Mins Delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>100% Hygienic Kitchen</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-500" />
                  <span>Free Delivery on ₹399+</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Asset */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-xl aspect-4/3 sm:aspect-16/11 bg-stone-100 border border-stone-200">
                <img
                  src="/src/assets/images/foodie_hero_spread_1793729623022.jpg"
                  alt="Delicious FoodieHub Table Spread"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-transparent pointer-events-none" />
                
                {/* Overlay Badge */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-stone-200 flex items-center justify-between shadow-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🔥</span>
                    <div>
                      <h4 className="font-heading font-bold text-xs text-stone-900">Chef's Signature Spread</h4>
                      <p className="text-[11px] text-stone-500">Over 1,200+ orders delivered today</p>
                    </div>
                  </div>
                  <button
                    onClick={() => onNavigate('menu')}
                    className="px-3.5 py-1.5 bg-orange-600 text-white rounded-lg text-xs font-semibold hover:bg-orange-700 transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <span>Order Now</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Categories Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-stone-900">
              Explore Popular Categories
            </h2>
            <p className="text-stone-500 text-xs sm:text-sm mt-1">
              Select your favorite culinary style to view freshly prepared meals
            </p>
          </div>
          <button
            onClick={() => onNavigate('menu')}
            className="text-xs sm:text-sm font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1 cursor-pointer"
          >
            <span>View All Menu</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onNavigate('menu', cat.id)}
              className="p-4 rounded-2xl bg-white border border-stone-200 hover:border-orange-300 hover:shadow-sm transition-all text-left flex flex-col justify-between group cursor-pointer"
            >
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">
                {cat.emoji}
              </div>
              <div>
                <h3 className="font-heading font-bold text-sm text-stone-900 group-hover:text-orange-600 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-[11px] text-stone-400 mt-0.5 line-clamp-1">
                  {cat.desc}
                </p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Featured / Chef's Specials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-orange-600 uppercase tracking-wider mb-1">
              <span>Chef's Choice</span>
            </div>
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-stone-900">
              Most Loved Dishes
            </h2>
          </div>
          <button
            onClick={() => onNavigate('menu')}
            className="text-xs sm:text-sm font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1 cursor-pointer"
          >
            <span>Explore Full Catalog</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-72 rounded-2xl bg-stone-200 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredFoods.map((food) => (
              <FoodCard key={food._id} food={food} onSelect={onSelectFood} />
            ))}
          </div>
        )}
      </section>

      {/* How FoodieHub Works */}
      <section className="bg-stone-100/70 border-y border-stone-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-stone-900">
              How FoodieHub Delivers Happiness
            </h2>
            <p className="text-stone-500 text-xs sm:text-sm mt-2">
              Simple 3-step experience designed for effortless food ordering
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-white rounded-3xl border border-stone-200/80 shadow-xs flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center text-2xl mb-4 font-bold">
                1
              </div>
              <h3 className="font-heading font-bold text-lg text-stone-900 mb-2">
                Browse & Customize
              </h3>
              <p className="text-stone-500 text-xs sm:text-sm leading-relaxed">
                Filter our menu by pizza, burger, North Indian or South Indian. Add to cart with custom quantity and promo codes.
              </p>
            </div>

            <div className="p-6 bg-white rounded-3xl border border-stone-200/80 shadow-xs flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center text-2xl mb-4 font-bold">
                2
              </div>
              <h3 className="font-heading font-bold text-lg text-stone-900 mb-2">
                Quick Kitchen Prep
              </h3>
              <p className="text-stone-500 text-xs sm:text-sm leading-relaxed">
                Our master chefs freshly prepare your meal upon order confirmation adhering to strict hygiene and temperature standards.
              </p>
            </div>

            <div className="p-6 bg-white rounded-3xl border border-stone-200/80 shadow-xs flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center text-2xl mb-4 font-bold">
                3
              </div>
              <h3 className="font-heading font-bold text-lg text-stone-900 mb-2">
                Live Status & Delivery
              </h3>
              <p className="text-stone-500 text-xs sm:text-sm leading-relaxed">
                Track your order progress step-by-step from Confirmed to Preparing to Out for Delivery right on your screen.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Trust / Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-stone-900">
            Loved by 10,000+ Foodies
          </h2>
          <p className="text-stone-500 text-xs sm:text-sm mt-1">
            Real feedback from satisfied food lovers across Bangalore
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs">
            <div className="flex items-center gap-1 text-amber-400 mb-3 text-sm">
              {'★'.repeat(5)}
            </div>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed mb-4">
              "The Wood-Fired Margherita Pizza arrived sizzling hot within 22 minutes! The mozzarella pull and fresh basil taste was like sitting in an Italian trattoria."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-orange-200 text-orange-800 font-bold text-xs flex items-center justify-center">
                HB
              </div>
              <div>
                <h4 className="font-heading font-semibold text-xs text-stone-900">Harshith Babu</h4>
                <p className="text-[11px] text-stone-400">Indiranagar, Bangalore</p>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs">
            <div className="flex items-center gap-1 text-amber-400 mb-3 text-sm">
              {'★'.repeat(5)}
            </div>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed mb-4">
              "The Crispy Gourmet Chicken Burger is arguably the best in town. Thick crispy fillet and delicious garlic sauce. The online tracking is super smooth!"
            </p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-200 text-blue-800 font-bold text-xs flex items-center justify-center">
                PS
              </div>
              <div>
                <h4 className="font-heading font-semibold text-xs text-stone-900">Pooja Sharma</h4>
                <p className="text-[11px] text-stone-400">Koramangala, Bangalore</p>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs">
            <div className="flex items-center gap-1 text-amber-400 mb-3 text-sm">
              {'★'.repeat(5)}
            </div>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed mb-4">
              "Tandoori Paneer Tikka and Dal Makhani are absolute perfection. Used coupon FOODIE50 for 50% discount and got free delivery on my order."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-200 text-emerald-800 font-bold text-xs flex items-center justify-center">
                AK
              </div>
              <div>
                <h4 className="font-heading font-semibold text-xs text-stone-900">Aditya Kumar</h4>
                <p className="text-[11px] text-stone-400">Whitefield, Bangalore</p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
