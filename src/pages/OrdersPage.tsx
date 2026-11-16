import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle2, ChevronRight, Package, Truck, ChefHat, RefreshCw, FileText, X, AlertCircle } from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface OrdersPageProps {
  onExploreMenu: () => void;
  activeOrderId?: string;
}

export const OrdersPage: React.FC<OrdersPageProps> = ({ onExploreMenu, activeOrderId }) => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState<Order | null>(null);

  const fetchOrders = async () => {
    try {
      const data = await api.getOrders(user?._id);
      setOrders(data);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // Poll every 8 seconds for live kitchen updates
    const interval = setInterval(fetchOrders, 8000);
    return () => clearInterval(interval);
  }, [user]);

  const steps: Array<{ status: OrderStatus; label: string; icon: React.ReactNode }> = [
    { status: 'Pending', label: 'Order Placed', icon: <Clock className="w-4 h-4" /> },
    { status: 'Confirmed', label: 'Confirmed', icon: <CheckCircle2 className="w-4 h-4" /> },
    { status: 'Preparing', label: 'In Kitchen', icon: <ChefHat className="w-4 h-4" /> },
    { status: 'Out for Delivery', label: 'Out for Delivery', icon: <Truck className="w-4 h-4" /> },
    { status: 'Delivered', label: 'Delivered', icon: <Package className="w-4 h-4" /> },
  ];

  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'Pending':
        return 0;
      case 'Confirmed':
        return 1;
      case 'Preparing':
        return 2;
      case 'Out for Delivery':
        return 3;
      case 'Delivered':
        return 4;
      default:
        return 0;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-stone-900 tracking-tight">
            My Orders & Live Tracking
          </h1>
          <p className="text-stone-500 text-xs sm:text-sm mt-1">
            Real-time delivery progress and past meal order receipts
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="self-start sm:self-auto flex items-center gap-2 px-3 py-1.5 rounded-xl border border-stone-200 hover:border-stone-300 bg-white text-xs font-semibold text-stone-700 transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5 text-stone-500" />
          <span>Refresh Status</span>
        </button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-48 rounded-3xl bg-stone-100 animate-pulse" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-stone-200 space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center mx-auto text-2xl">
            📦
          </div>
          <h3 className="font-heading font-bold text-lg text-stone-900">No Orders Yet</h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            You haven't placed any food orders yet. Explore our delicious menu to order your first meal!
          </p>
          <button
            onClick={onExploreMenu}
            className="px-5 py-2.5 bg-orange-600 text-white rounded-xl text-xs font-semibold hover:bg-orange-700 transition-colors cursor-pointer"
          >
            Explore Menu
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const currentStepIdx = getStepIndex(order.status);
            const isDelivered = order.status === 'Delivered';

            return (
              <div
                key={order._id}
                className={`bg-white rounded-3xl border transition-all p-6 sm:p-8 space-y-6 shadow-xs ${
                  order.orderNumber === activeOrderId
                    ? 'border-orange-500 ring-2 ring-orange-500/20'
                    : 'border-stone-200'
                }`}
              >
                {/* Order Top Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-100 gap-3">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-base text-stone-900">
                        {order.orderNumber}
                      </span>
                      <span
                        className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                          order.status === 'Delivered'
                            ? 'bg-emerald-50 text-emerald-700'
                            : order.status === 'Cancelled'
                            ? 'bg-red-50 text-red-700'
                            : 'bg-orange-50 text-orange-700'
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <span className="text-[11px] text-stone-400 block mt-0.5">
                      Placed on {new Date(order.createdAt).toLocaleDateString()} at{' '}
                      {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setSelectedReceiptOrder(order)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 hover:border-stone-300 text-xs font-semibold text-stone-700 transition-colors cursor-pointer bg-stone-50"
                    >
                      <FileText className="w-3.5 h-3.5 text-stone-500" />
                      <span>View Receipt</span>
                    </button>
                    <span className="font-mono font-bold text-lg text-stone-900 tabular-nums">
                      ₹{order.totalAmount}
                    </span>
                  </div>
                </div>

                {/* Visual Order Status Stepper */}
                {order.status !== 'Cancelled' && (
                  <div className="py-2">
                    <div className="relative flex items-center justify-between">
                      {/* Connecting Line */}
                      <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-stone-100 -z-0" />
                      <div
                        className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-orange-600 transition-all duration-500 -z-0"
                        style={{
                          width: `${(currentStepIdx / (steps.length - 1)) * 100}%`,
                        }}
                      />

                      {steps.map((step, idx) => {
                        const isCompleted = idx <= currentStepIdx;
                        const isCurrent = idx === currentStepIdx;

                        return (
                          <div key={step.status} className="flex flex-col items-center relative z-10">
                            <div
                              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                                isCompleted
                                  ? 'bg-orange-600 text-white shadow-xs'
                                  : 'bg-stone-200 text-stone-400'
                              } ${isCurrent && !isDelivered ? 'ring-4 ring-orange-200 animate-pulse' : ''}`}
                            >
                              {step.icon}
                            </div>
                            <span
                              className={`text-[11px] font-semibold mt-2 whitespace-nowrap text-center ${
                                isCompleted ? 'text-stone-900' : 'text-stone-400'
                              }`}
                            >
                              {step.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Items preview and Delivery Address */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-2">
                  <div className="md:col-span-8 space-y-2">
                    <h4 className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">
                      Ordered Dishes ({order.items.length})
                    </h4>
                    <div className="space-y-2">
                      {order.items.map((item, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 border border-stone-200/60 text-xs"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={item.image}
                              alt={item.name}
                              referrerPolicy="no-referrer"
                              className="w-9 h-9 rounded-lg object-cover bg-stone-200 shrink-0"
                            />
                            <div className="truncate">
                              <span className="font-semibold text-stone-900 block truncate">
                                {item.name}
                              </span>
                              <span className="text-stone-400 font-mono text-[11px]">
                                {item.quantity} × ₹{item.price}
                              </span>
                            </div>
                          </div>
                          <span className="font-mono font-semibold tabular-nums text-stone-800 shrink-0">
                            ₹{item.price * item.quantity}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="md:col-span-4 p-4 rounded-2xl bg-stone-50/80 border border-stone-200/60 text-xs space-y-2.5">
                    <h4 className="font-semibold text-stone-700 uppercase tracking-wider text-[11px]">
                      Delivery Details
                    </h4>
                    <p className="text-stone-600 leading-relaxed">
                      <strong className="text-stone-800">{order.customerName}</strong>
                      <br />
                      {order.address}, {order.city} - {order.pincode}
                    </p>
                    <p className="text-stone-500">
                      Phone: <span className="font-mono text-stone-700">{order.customerPhone}</span>
                    </p>
                    <div className="pt-2 border-t border-stone-200/80 flex items-center justify-between text-stone-500">
                      <span>Payment</span>
                      <span className="font-semibold text-stone-800">{order.paymentMethod}</span>
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Receipt Modal */}
      {selectedReceiptOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs">
          <div
            className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-150 relative space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <span className="text-xl">🧾</span>
                <h3 className="font-heading font-bold text-lg text-stone-900">
                  Tax Invoice & Receipt
                </h3>
              </div>
              <button
                onClick={() => setSelectedReceiptOrder(null)}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs space-y-1 text-stone-600 font-mono">
              <div className="flex justify-between">
                <span>Order ID:</span>
                <strong className="text-stone-900">{selectedReceiptOrder.orderNumber}</strong>
              </div>
              <div className="flex justify-between">
                <span>Date:</span>
                <span>{new Date(selectedReceiptOrder.createdAt).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Customer:</span>
                <span>{selectedReceiptOrder.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <span className="text-orange-600 font-bold">{selectedReceiptOrder.status}</span>
              </div>
            </div>

            <div className="py-2 border-y border-stone-200 space-y-1.5 text-xs">
              {selectedReceiptOrder.items.map((it, idx) => (
                <div key={idx} className="flex justify-between text-stone-700">
                  <span>
                    {it.name} (x{it.quantity})
                  </span>
                  <span className="font-mono tabular-nums">₹{it.price * it.quantity}</span>
                </div>
              ))}
            </div>

            <div className="space-y-1 text-xs text-stone-600 font-mono">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₹{selectedReceiptOrder.subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charge:</span>
                <span>{selectedReceiptOrder.deliveryFee === 0 ? 'FREE' : `₹${selectedReceiptOrder.deliveryFee}`}</span>
              </div>
              <div className="flex justify-between">
                <span>GST (5%):</span>
                <span>₹{selectedReceiptOrder.tax}</span>
              </div>
              {selectedReceiptOrder.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Discount:</span>
                  <span>-₹{selectedReceiptOrder.discount}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-stone-900 pt-2 border-t border-stone-200">
                <span>Total Paid:</span>
                <span className="text-orange-600">₹{selectedReceiptOrder.totalAmount}</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedReceiptOrder(null)}
              className="w-full py-2.5 bg-stone-900 text-white rounded-xl text-xs font-semibold hover:bg-stone-800 transition-colors cursor-pointer"
            >
              Close Receipt
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
