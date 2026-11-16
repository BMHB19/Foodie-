import React from 'react';
import { Phone, Mail, MapPin, Clock, Heart } from 'lucide-react';

export const Footer: React.FC<{ onNavigate: (view: string) => void }> = ({ onNavigate }) => {
  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-stone-800">
          
          {/* Brand & mission */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🍽️</span>
              <span className="font-heading font-extrabold text-2xl text-white tracking-tight">
                Foodie<span className="text-orange-500">Hub</span>
              </span>
            </div>
            <p className="text-stone-400 text-sm leading-relaxed">
              Delicious chef-prepared meals delivered fresh and piping hot to your doorstep in 30 minutes. Order your favorite dishes online.
            </p>
            <div className="flex items-center gap-2 text-xs text-orange-400">
              <Clock className="w-4 h-4" />
              <span>Open Daily: 10:00 AM – 11:30 PM</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-semibold text-white text-base mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-sm text-stone-400">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Home Showcase
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('menu')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Explore Food Menu
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('orders')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Track Live Orders
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('admin')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Restaurant Admin Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-heading font-semibold text-white text-base mb-4">Top Cuisines</h4>
            <ul className="space-y-2.5 text-sm text-stone-400">
              <li>Wood-Fired Pizza</li>
              <li>Gourmet Burgers</li>
              <li>North Indian Curries</li>
              <li>Crispy South Indian Dosas</li>
              <li>Artisanal Desserts & Shakes</li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="font-heading font-semibold text-white text-base mb-4">Central Kitchen</h4>
            <ul className="space-y-3 text-sm text-stone-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                <span>#42 100ft Road, Indiranagar, Bangalore, 560038</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-orange-500 shrink-0" />
                <span>+91 98450 12345 / 080-42998800</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-orange-500 shrink-0" />
                <span>support@foodiehub.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright and tech credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© {new Date().getFullYear()} FoodieHub. All rights reserved.</p>
          <div className="flex items-center gap-1 text-stone-400">
            <span>Built with MERN Stack (MongoDB · Express.js · React.js · Node.js)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
