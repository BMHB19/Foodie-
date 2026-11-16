import React, { useState } from 'react';
import { X, Plus, Minus, Trash2, Tag, ArrowRight, ShoppingBag, Check } from 'lucide-react';
import { useCart, AVAILABLE_COUPONS } from '../context/CartContext';

interface CartDrawerProps {
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onCheckout }) => {
  const {
    items,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    subtotal,
    deliveryFee,
    tax,
    discount,
    totalAmount,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponMessage, setCouponMessage] = useState<{ text: string; error?: boolean } | null>(null);

  if (!isCartOpen) return null;

  const handleApplyCoupon = (code: string) => {
    const result = applyCoupon(code);
    if (result.success) {
      setCouponMessage({ text: result.message, error: false });
      setCouponInput('');
    } else {
      setCouponMessage({ text: result.message, error: true });
    }
  };

  const handleCheckout = () => {
    closeCart();
    onCheckout();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-950/60 backdrop-blur-xs flex justify-end">
      <div
        className="w-full max-w-md bg-white h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-orange-600" />
            <h2 className="font-heading font-bold text-lg text-stone-900">Your Cart</h2>
            <span className="text-xs bg-stone-100 text-stone-600 font-semibold px-2 py-0.5 rounded-full">
              {items.length} {items.length === 1 ? 'item' : 'items'}
            </span>
          </div>
          <button
            onClick={closeCart}
            className="p-2 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-500">
              <div className="w-16 h-16 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center mb-4">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="font-heading font-bold text-lg text-stone-900 mb-1">
                Your cart is empty
              </h3>
              <p className="text-xs text-stone-500 max-w-xs mb-6">
                Explore our mouth-watering pizzas, burgers, curries, and desserts to add items to your cart.
              </p>
              <button
                onClick={closeCart}
                className="px-5 py-2.5 bg-orange-600 text-white rounded-xl text-xs font-semibold hover:bg-orange-700 transition-colors cursor-pointer"
              >
                Browse Menu
              </button>
            </div>
          ) : (
            <>
              {items.map(({ food, quantity }) => (
                <div
                  key={food._id}
                  className="flex items-center gap-3 p-3 bg-stone-50 rounded-2xl border border-stone-200/70"
                >
                  <img
                    src={food.image}
                    alt={food.name}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-xl object-cover shrink-0 bg-stone-200"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <div
                        className={`w-2.5 h-2.5 border flex items-center justify-center ${
                          food.veg ? 'border-emerald-600' : 'border-red-600'
                        }`}
                      >
                        <div
                          className={`w-1 h-1 rounded-full ${
                            food.veg ? 'bg-emerald-600' : 'bg-red-600'
                          }`}
                        />
                      </div>
                      <h4 className="font-heading font-semibold text-xs text-stone-900 truncate">
                        {food.name}
                      </h4>
                    </div>
                    <div className="text-xs text-stone-500 font-mono tabular-nums">
                      ₹{food.price} × {quantity} ={' '}
                      <span className="font-semibold text-stone-800">₹{food.price * quantity}</span>
                    </div>

                    {/* Stepper */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center bg-white border border-stone-200 rounded-lg p-0.5 text-xs">
                        <button
                          onClick={() => updateQuantity(food._id, quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center text-stone-600 hover:text-stone-900 cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center font-bold tabular-nums text-stone-800">
                          {quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(food._id, quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center text-stone-600 hover:text-stone-900 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(food._id)}
                        className="text-stone-400 hover:text-red-600 p-1 transition-colors cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Promo Code section */}
              <div className="pt-2 border-t border-stone-200">
                <label className="block text-xs font-semibold text-stone-700 mb-1.5 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-orange-600" />
                  <span>Have a Promo Code?</span>
                </label>

                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span className="font-bold">{appliedCoupon.code}</span> applied!
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-emerald-700 font-semibold hover:underline cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        placeholder="e.g. FOODIE50"
                        className="flex-1 px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs uppercase focus:outline-none focus:border-orange-500"
                      />
                      <button
                        onClick={() => handleApplyCoupon(couponInput)}
                        disabled={!couponInput.trim()}
                        className="px-4 py-2 bg-stone-900 disabled:bg-stone-300 text-white rounded-xl text-xs font-semibold hover:bg-stone-800 transition-colors cursor-pointer"
                      >
                        Apply
                      </button>
                    </div>

                    {/* Quick suggestion tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {AVAILABLE_COUPONS.map((coupon) => (
                        <button
                          key={coupon.code}
                          onClick={() => handleApplyCoupon(coupon.code)}
                          className="px-2 py-1 rounded-md bg-stone-100 hover:bg-orange-50 hover:text-orange-600 text-[11px] font-mono font-medium text-stone-600 transition-colors cursor-pointer"
                        >
                          {coupon.code}
                        </button>
                      ))}
                    </div>

                    {couponMessage && (
                      <p
                        className={`text-[11px] mt-1.5 ${
                          couponMessage.error ? 'text-red-600' : 'text-emerald-600 font-medium'
                        }`}
                      >
                        {couponMessage.text}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Delivery threshold callout */}
              <div className="p-3 bg-amber-50/70 border border-amber-200/60 rounded-xl text-xs text-amber-900 flex items-center justify-between">
                <span>
                  {subtotal >= 399
                    ? '🎉 You unlocked FREE Delivery!'
                    : `Add ₹${399 - subtotal} more to get FREE Delivery`}
                </span>
                <span className="font-semibold text-amber-800">
                  {subtotal >= 399 ? '₹0' : '₹40'}
                </span>
              </div>
            </>
          )}
        </div>

        {/* Footer Bill & Checkout */}
        {items.length > 0 && (
          <div className="p-5 border-t border-stone-200 bg-stone-50/70 space-y-3">
            <div className="space-y-1.5 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-mono tabular-nums text-stone-900 font-medium">₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className="font-mono tabular-nums">
                  {deliveryFee === 0 ? (
                    <span className="text-emerald-600 font-semibold">FREE</span>
                  ) : (
                    `₹${deliveryFee}`
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Taxes & Restaurant Packaging (5% GST)</span>
                <span className="font-mono tabular-nums text-stone-900 font-medium">₹{tax}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Coupon Discount</span>
                  <span className="font-mono tabular-nums">-₹{discount}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold text-stone-900 pt-2 border-t border-stone-200">
                <span>To Pay</span>
                <span className="font-mono tabular-nums text-orange-600">₹{totalAmount}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full py-3.5 px-4 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-heading font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
