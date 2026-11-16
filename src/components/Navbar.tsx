import React from 'react';
import { ShoppingBag, User as UserIcon, Shield, BookOpen, Menu as MenuIcon, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenProjectGuide: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onOpenProjectGuide,
}) => {
  const { itemCount, totalAmount, openCart } = useCart();
  const { user, isAdmin, openAuthModal, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'menu', label: 'Food Menu' },
    { id: 'orders', label: 'My Orders' },
    { id: 'admin', label: 'Admin Panel', badge: isAdmin ? 'Admin' : undefined },
  ];

  const handleNav = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-8">
        
        {/* Zone 1: Single Brand Wordmark */}
        <button
          onClick={() => handleNav('home')}
          className="flex items-center gap-2.5 text-left group cursor-pointer shrink-0"
        >
          <div className="w-10 h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center font-bold text-xl shadow-sm group-hover:bg-orange-700 transition-colors">
            🍽️
          </div>
          <div>
            <span className="font-heading font-extrabold text-2xl tracking-tight text-stone-900 group-hover:text-orange-600 transition-colors">
              Foodie<span className="text-orange-600">Hub</span>
            </span>
          </div>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-600">
          {navLinks.map((link) => {
            const isActive = currentView === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNav(link.id)}
                className={`transition-colors whitespace-nowrap cursor-pointer relative py-1 ${
                  isActive
                    ? 'text-orange-600 font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-600 rounded-full" />
                )}
              </button>
            );
          })}

          <button
            onClick={onOpenProjectGuide}
            className="flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-800 transition-colors whitespace-nowrap cursor-pointer px-2.5 py-1 rounded-md bg-stone-100 hover:bg-stone-200"
          >
            <BookOpen className="w-3.5 h-3.5 text-stone-600" />
            <span>FSD Evaluation Guide</span>
          </button>
        </nav>

        {/* Zone 3: Primary Action & User Bar */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Cart Button */}
          <button
            onClick={openCart}
            className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-sm font-medium transition-all shadow-xs cursor-pointer"
          >
            <div className="relative">
              <ShoppingBag className="w-4 h-4 text-orange-400" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </div>
            <span className="hidden sm:inline font-mono tabular-nums text-xs font-semibold text-stone-200">
              ₹{totalAmount}
            </span>
          </button>

          {/* User Profile or Login */}
          {user ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleNav(user.role === 'admin' ? 'admin' : 'orders')}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-stone-200 hover:border-stone-300 bg-stone-50 text-xs font-medium text-stone-800 transition-colors cursor-pointer"
                title={`Signed in as ${user.name} (${user.role})`}
              >
                {user.role === 'admin' ? (
                  <Shield className="w-3.5 h-3.5 text-orange-600" />
                ) : (
                  <UserIcon className="w-3.5 h-3.5 text-stone-600" />
                )}
                <span className="max-w-[100px] truncate hidden sm:inline">{user.name.split(' ')[0]}</span>
              </button>
              <button
                onClick={logout}
                className="text-xs text-stone-500 hover:text-red-600 cursor-pointer px-2 py-1"
                title="Logout"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => openAuthModal('login')}
              className="px-3.5 py-2 rounded-xl border border-stone-300 hover:border-orange-500 text-xs font-semibold text-stone-800 hover:text-orange-600 transition-colors cursor-pointer"
            >
              Sign In
            </button>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-stone-700 hover:text-stone-900 cursor-pointer"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-5 space-y-2">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNav(link.id)}
              className={`block w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
                currentView === link.id
                  ? 'bg-orange-50 text-orange-600 font-semibold'
                  : 'text-stone-700 hover:bg-stone-50'
              }`}
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => {
              onOpenProjectGuide();
              setMobileMenuOpen(false);
            }}
            className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg text-sm text-stone-600 hover:bg-stone-50"
          >
            <BookOpen className="w-4 h-4 text-stone-500" />
            <span>FSD Evaluation & Viva Guide</span>
          </button>
        </div>
      )}
    </header>
  );
};
