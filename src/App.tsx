import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { AuthModal } from './components/AuthModal';
import { FoodDetailModal } from './components/FoodDetailModal';
import { ProjectVivaModal } from './components/ProjectVivaModal';
import { HomePage } from './pages/HomePage';
import { MenuPage } from './pages/MenuPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrdersPage } from './pages/OrdersPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { FoodCategory, FoodItem, Order } from './types';

function AppContent() {
  const [currentView, setCurrentView] = useState<'home' | 'menu' | 'checkout' | 'orders' | 'admin'>('home');
  const [menuInitialCategory, setMenuInitialCategory] = useState<FoodCategory>('All');
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [isProjectGuideOpen, setIsProjectGuideOpen] = useState(false);
  const [recentOrderId, setRecentOrderId] = useState<string | undefined>(undefined);
  const [orderToast, setOrderToast] = useState<{ orderNumber: string; amount: number } | null>(null);

  const handleNavigate = (view: string, category?: FoodCategory) => {
    if (category) {
      setMenuInitialCategory(category);
    }
    setCurrentView(view as any);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOrderSuccess = (order: Order) => {
    setRecentOrderId(order.orderNumber);
    setOrderToast({ orderNumber: order.orderNumber, amount: order.totalAmount });
    setCurrentView('orders');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      setOrderToast(null);
    }, 6000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fafaf9] text-stone-900 selection:bg-orange-100 selection:text-orange-900">
      
      {/* Top Banner (Optional dismissible prompt / free delivery hint) */}
      <div className="bg-orange-600 text-white text-xs py-1.5 px-4 text-center font-medium tracking-wide">
        <span>🎉 Use coupon code <strong>FOODIE50</strong> for 50% OFF · FREE delivery on orders above ₹399</span>
      </div>

      {/* Main Top Navigation */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenProjectGuide={() => setIsProjectGuideOpen(true)}
      />

      {/* Order Toast Notification */}
      {orderToast && (
        <div className="fixed top-20 right-4 z-50 p-4 bg-stone-900 text-white rounded-2xl shadow-2xl border border-stone-800 animate-in slide-in-from-top-4 flex items-center gap-3 max-w-sm">
          <span className="text-2xl">🎉</span>
          <div>
            <h4 className="font-heading font-bold text-xs text-white">
              Order {orderToast.orderNumber} Placed!
            </h4>
            <p className="text-[11px] text-stone-400">
              Your ₹{orderToast.amount} meal is now being prepared in our kitchen.
            </p>
          </div>
        </div>
      )}

      {/* Primary View Content */}
      <main className="flex-1">
        {currentView === 'home' && (
          <HomePage
            onNavigate={handleNavigate}
            onSelectFood={(food) => setSelectedFood(food)}
          />
        )}

        {currentView === 'menu' && (
          <MenuPage
            initialCategory={menuInitialCategory}
            onSelectFood={(food) => setSelectedFood(food)}
          />
        )}

        {currentView === 'checkout' && (
          <CheckoutPage
            onBack={() => handleNavigate('menu')}
            onOrderSuccess={handleOrderSuccess}
          />
        )}

        {currentView === 'orders' && (
          <OrdersPage
            activeOrderId={recentOrderId}
            onExploreMenu={() => handleNavigate('menu')}
          />
        )}

        {currentView === 'admin' && (
          <AdminDashboard />
        )}
      </main>

      {/* Global Modals & Drawers */}
      <CartDrawer onCheckout={() => handleNavigate('checkout')} />
      <FoodDetailModal food={selectedFood} onClose={() => setSelectedFood(null)} />
      <AuthModal />
      <ProjectVivaModal
        isOpen={isProjectGuideOpen}
        onClose={() => setIsProjectGuideOpen(false)}
      />

      {/* Domain-authentic Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}
