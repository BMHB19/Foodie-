import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, ShieldCheck, MapPin, Phone, User, Banknote, CreditCard, ShoppingBag, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Order } from '../types';

interface CheckoutPageProps {
  onBack: () => void;
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onBack, onOrderSuccess }) => {
  const { items, subtotal, deliveryFee, tax, discount, totalAmount, appliedCoupon, clearCart } = useCart();
  const { user } = useAuth();

  const [customerName, setCustomerName] = useState(user?.name || 'Harshith Babu');
  const [customerEmail, setCustomerEmail] = useState(user?.email || 'harshith@gmail.com');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '+91 98450 12345');
  const [address, setAddress] = useState(user?.address || '#42, 4th Cross, Indiranagar');
  const [city, setCity] = useState('Bangalore');
  const [pincode, setPincode] = useState('560038');
  const [deliveryNotes, setDeliveryNotes] = useState('Please ring the doorbell and leave at doorstep');
  const [paymentMethod, setPaymentMethod] = useState<'Cash on Delivery (COD)' | 'UPI / Online'>('Cash on Delivery (COD)');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="font-heading font-bold text-2xl text-stone-900">Your cart is empty</h2>
        <p className="text-xs text-stone-500">
          Please add items to your cart before proceeding to checkout.
        </p>
        <button
          onClick={onBack}
          className="px-6 py-2.5 bg-orange-600 text-white rounded-xl text-xs font-semibold hover:bg-orange-700 transition-colors cursor-pointer"
        >
          Return to Menu
        </button>
      </div>
    );
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const orderPayload = {
        items: items.map((i) => ({
          foodId: i.food._id,
          name: i.food.name,
          quantity: i.quantity,
          price: i.food.price,
          image: i.food.image,
          veg: i.food.veg,
        })),
        customerName,
        customerEmail,
        customerPhone,
        address,
        city,
        pincode,
        deliveryNotes,
        paymentMethod,
        discountCode: appliedCoupon?.code,
      };

      const placedOrder = await api.createOrder(orderPayload);
      clearCart();
      onOrderSuccess(placedOrder);
    } catch (err: any) {
      setError(err.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-stone-900 mb-6 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Ordering</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* Left Column: Delivery Details Form */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs">
            <div className="flex items-center gap-2.5 mb-6 pb-4 border-b border-stone-100">
              <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-heading font-bold text-xl text-stone-900">
                  1. Delivery Information
                </h2>
                <p className="text-xs text-stone-500">
                  Enter your address where the food should be delivered
                </p>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-xs text-red-700 rounded-xl">
                {error}
              </div>
            )}

            <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Customer Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Contact Phone *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Delivery Street Address *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Flat/House No., Street, Landmark"
                    className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    City / Area
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    PIN Code
                  </label>
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-orange-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Delivery Notes for Rider (Optional)
                </label>
                <input
                  type="text"
                  value={deliveryNotes}
                  onChange={(e) => setDeliveryNotes(e.target.value)}
                  placeholder="e.g. Ring doorbell, leave with security"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* Payment Method Selector */}
              <div className="pt-6 border-t border-stone-100">
                <label className="block text-xs font-semibold text-stone-700 mb-3">
                  2. Choose Payment Method (Mini Project Mode)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Cash on Delivery (COD)')}
                    className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                      paymentMethod === 'Cash on Delivery (COD)'
                        ? 'border-orange-600 bg-orange-50/50 ring-1 ring-orange-600'
                        : 'border-stone-200 bg-white hover:border-stone-300'
                    }`}
                  >
                    <Banknote className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-heading font-semibold text-xs text-stone-900">
                        Cash on Delivery (COD)
                      </h4>
                      <p className="text-[11px] text-stone-500 mt-0.5">
                        Pay cash or UPI upon receiving delivery
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('UPI / Online')}
                    className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                      paymentMethod === 'UPI / Online'
                        ? 'border-orange-600 bg-orange-50/50 ring-1 ring-orange-600'
                        : 'border-stone-200 bg-white hover:border-stone-300'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-stone-700 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-heading font-semibold text-xs text-stone-900">
                        UPI / Instant Pay
                      </h4>
                      <p className="text-[11px] text-stone-500 mt-0.5">
                        Google Pay, PhonePe, Paytm simulation
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Order Summary & Place Order */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4 sticky top-24">
            <h3 className="font-heading font-bold text-lg text-stone-900 pb-3 border-b border-stone-100 flex items-center justify-between">
              <span>Order Summary</span>
              <span className="text-xs text-stone-500 font-normal">
                {items.length} {items.length === 1 ? 'dish' : 'dishes'}
              </span>
            </h3>

            {/* Items scroll */}
            <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
              {items.map(({ food, quantity }) => (
                <div key={food._id} className="flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={food.image}
                      alt={food.name}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-lg object-cover bg-stone-100 shrink-0"
                    />
                    <div className="truncate">
                      <h5 className="font-medium text-stone-900 truncate">{food.name}</h5>
                      <span className="text-stone-400 font-mono text-[11px]">
                        {quantity} × ₹{food.price}
                      </span>
                    </div>
                  </div>
                  <span className="font-mono font-semibold tabular-nums text-stone-800 shrink-0">
                    ₹{food.price * quantity}
                  </span>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="pt-3 border-t border-stone-100 space-y-2 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Items Total</span>
                <span className="font-mono tabular-nums text-stone-900">₹{subtotal}</span>
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
                <span>Govt. Taxes (5% GST)</span>
                <span className="font-mono tabular-nums text-stone-900">₹{tax}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Discount Applied ({appliedCoupon?.code})</span>
                  <span className="font-mono tabular-nums">-₹{discount}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold text-stone-900 pt-3 border-t border-stone-200">
                <span>Total Amount to Pay</span>
                <span className="font-mono tabular-nums text-orange-600 text-lg">
                  ₹{totalAmount}
                </span>
              </div>
            </div>

            {/* Place Order CTA */}
            <button
              type="submit"
              form="checkout-form"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-orange-600 hover:bg-orange-700 disabled:bg-stone-300 text-white rounded-xl font-heading font-semibold text-sm transition-all cursor-pointer shadow-sm flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{loading ? 'Processing Order...' : `Place Order (₹${totalAmount})`}</span>
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-stone-400 text-center pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Secured Order with Live Kitchen Status Updates</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
