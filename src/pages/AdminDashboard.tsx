import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, CheckCircle2, Clock, ChefHat, Truck, Package, RefreshCw, AlertCircle, DollarSign, ShoppingBag, X } from 'lucide-react';
import { FoodItem, Order, OrderStatus, FoodCategory } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const AdminDashboard: React.FC = () => {
  const { user, loginAsDemoAdmin } = useAuth();
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'orders' | 'menu'>('orders');

  // Food Form Modal State
  const [isFoodModalOpen, setIsFoodModalOpen] = useState(false);
  const [editingFood, setEditingFood] = useState<FoodItem | null>(null);
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<FoodCategory>('Burger');
  const [formPrice, setFormPrice] = useState<number>(149);
  const [formDesc, setFormDesc] = useState('');
  const [formImage, setFormImage] = useState('');
  const [formVeg, setFormVeg] = useState(true);
  const [formAvailable, setFormAvailable] = useState(true);
  const [formPrepTime, setFormPrepTime] = useState('20-25 mins');
  const [savingFood, setSavingFood] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [fetchedFoods, fetchedOrders] = await Promise.all([
        api.getFoods(),
        api.getOrders(),
      ]);
      setFoods(fetchedFoods);
      setOrders(fetchedOrders);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await api.updateOrderStatus(orderId, newStatus);
      setStatusMessage(`Order updated to "${newStatus}"`);
      setTimeout(() => setStatusMessage(null), 3000);
      fetchData();
    } catch (err: any) {
      alert(`Error updating order: ${err.message}`);
    }
  };

  const handleOpenAddFood = () => {
    setEditingFood(null);
    setFormName('');
    setFormCategory('Burger');
    setFormPrice(149);
    setFormDesc('');
    setFormImage('/src/assets/images/dish_chicken_burger_1793729623084.jpg');
    setFormVeg(true);
    setFormAvailable(true);
    setFormPrepTime('20-25 mins');
    setIsFoodModalOpen(true);
  };

  const handleOpenEditFood = (food: FoodItem) => {
    setEditingFood(food);
    setFormName(food.name);
    setFormCategory(food.category);
    setFormPrice(food.price);
    setFormDesc(food.description);
    setFormImage(food.image);
    setFormVeg(food.veg);
    setFormAvailable(food.available);
    setFormPrepTime(food.prepTime);
    setIsFoodModalOpen(true);
  };

  const handleDeleteFood = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}" from the menu?`)) {
      try {
        await api.deleteFood(id);
        setStatusMessage(`"${name}" was deleted from the menu.`);
        setTimeout(() => setStatusMessage(null), 3000);
        fetchData();
      } catch (err: any) {
        alert(err.message || 'Failed to delete food item');
      }
    }
  };

  const handleSaveFood = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingFood(true);

    try {
      const payload = {
        name: formName,
        category: formCategory as any,
        price: Number(formPrice),
        description: formDesc,
        image: formImage || '/src/assets/images/dish_chicken_burger_1793729623084.jpg',
        veg: formVeg,
        available: formAvailable,
        prepTime: formPrepTime,
      };

      if (editingFood) {
        await api.updateFood(editingFood._id, payload);
        setStatusMessage(`Updated "${formName}" successfully!`);
      } else {
        await api.createFood(payload);
        setStatusMessage(`Added "${formName}" to menu!`);
      }

      setIsFoodModalOpen(false);
      setTimeout(() => setStatusMessage(null), 3000);
      fetchData();
    } catch (err: any) {
      alert(err.message || 'Failed to save food item');
    } finally {
      setSavingFood(false);
    }
  };

  const handleResetSeedData = async () => {
    if (confirm('Reset all foods and orders to default demo state?')) {
      await api.resetSeedData();
      setStatusMessage('Database reset to fresh demo data!');
      setTimeout(() => setStatusMessage(null), 3000);
      fetchData();
    }
  };

  // Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.status !== 'Cancelled' ? o.totalAmount : 0), 0);
  const activeOrdersCount = orders.filter((o) => o.status !== 'Delivered' && o.status !== 'Cancelled').length;
  const deliveredOrdersCount = orders.filter((o) => o.status === 'Delivered').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Header & Role Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-200 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚡</span>
            <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-stone-900 tracking-tight">
              Restaurant Admin Dashboard
            </h1>
          </div>
          <p className="text-stone-500 text-xs sm:text-sm mt-1">
            Order processing, kitchen dispatch, and menu price management
          </p>
        </div>

        <div className="flex items-center gap-3">
          {user?.role !== 'admin' && (
            <button
              onClick={loginAsDemoAdmin}
              className="px-3 py-1.5 bg-orange-100 hover:bg-orange-200 text-orange-800 rounded-xl text-xs font-semibold cursor-pointer"
            >
              Switch to Admin Role
            </button>
          )}

          <button
            onClick={fetchData}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 hover:border-stone-300 bg-white text-xs font-semibold text-stone-700 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-stone-500" />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleResetSeedData}
            className="px-3 py-1.5 rounded-xl border border-red-200 hover:bg-red-50 text-xs font-semibold text-red-600 transition-colors cursor-pointer"
          >
            Reset DB
          </button>
        </div>
      </div>

      {statusMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 rounded-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Overview KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Sales</span>
            <DollarSign className="w-4 h-4 text-orange-600" />
          </div>
          <div className="font-heading font-bold text-2xl text-stone-900 font-mono tabular-nums">
            ₹{totalRevenue}
          </div>
          <span className="text-[11px] text-stone-400">From all completed orders</span>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Kitchen Orders</span>
            <ChefHat className="w-4 h-4 text-amber-500" />
          </div>
          <div className="font-heading font-bold text-2xl text-stone-900 font-mono tabular-nums">
            {activeOrdersCount}
          </div>
          <span className="text-[11px] text-amber-600 font-medium">Pending or In Preparation</span>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Delivered Orders</span>
            <Package className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="font-heading font-bold text-2xl text-stone-900 font-mono tabular-nums">
            {deliveredOrdersCount}
          </div>
          <span className="text-[11px] text-stone-400">Successfully completed</span>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Menu Catalog</span>
            <ShoppingBag className="w-4 h-4 text-blue-600" />
          </div>
          <div className="font-heading font-bold text-2xl text-stone-900 font-mono tabular-nums">
            {foods.length} Dishes
          </div>
          <span className="text-[11px] text-stone-400">Available across 7 categories</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-stone-200">
        <div className="flex gap-6 text-sm font-semibold">
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3 border-b-2 cursor-pointer transition-colors ${
              activeTab === 'orders'
                ? 'border-orange-600 text-orange-600'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Live Kitchen Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('menu')}
            className={`py-3 border-b-2 cursor-pointer transition-colors ${
              activeTab === 'menu'
                ? 'border-orange-600 text-orange-600'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Manage Food Menu ({foods.length})
          </button>
        </div>

        {activeTab === 'menu' && (
          <button
            onClick={handleOpenAddFood}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer shadow-2xs mb-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Dish</span>
          </button>
        )}
      </div>

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-stone-200 text-stone-500">
              No orders received yet.
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-stone-900">
                          {order.orderNumber}
                        </span>
                        <span
                          className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                            order.status === 'Delivered'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-orange-50 text-orange-700'
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <span className="text-xs text-stone-500">
                        {order.customerName} · {order.customerPhone} · {order.city}
                      </span>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="font-mono font-bold text-sm text-stone-900">
                        ₹{order.totalAmount} ({order.paymentMethod})
                      </span>
                    </div>
                  </div>

                  {/* Items list */}
                  <div className="flex flex-wrap gap-2 text-xs">
                    {order.items.map((it, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-stone-100 text-stone-700 font-medium"
                      >
                        {it.name} <strong className="text-stone-900">x{it.quantity}</strong>
                      </span>
                    ))}
                  </div>

                  {/* Status advance action buttons */}
                  <div className="pt-2 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <span className="text-stone-500 font-medium">Advance Order Workflow:</span>
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        onClick={() => handleUpdateOrderStatus(order._id, 'Confirmed')}
                        disabled={order.status === 'Confirmed'}
                        className="px-2.5 py-1 rounded-lg border border-stone-200 hover:bg-stone-50 text-stone-700 cursor-pointer disabled:opacity-40"
                      >
                        1. Confirm
                      </button>
                      <button
                        onClick={() => handleUpdateOrderStatus(order._id, 'Preparing')}
                        disabled={order.status === 'Preparing'}
                        className="px-2.5 py-1 rounded-lg border border-stone-200 hover:bg-stone-50 text-stone-700 cursor-pointer disabled:opacity-40"
                      >
                        2. In Kitchen
                      </button>
                      <button
                        onClick={() => handleUpdateOrderStatus(order._id, 'Out for Delivery')}
                        disabled={order.status === 'Out for Delivery'}
                        className="px-2.5 py-1 rounded-lg border border-stone-200 hover:bg-stone-50 text-stone-700 cursor-pointer disabled:opacity-40"
                      >
                        3. Dispatch Delivery
                      </button>
                      <button
                        onClick={() => handleUpdateOrderStatus(order._id, 'Delivered')}
                        disabled={order.status === 'Delivered'}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold cursor-pointer disabled:opacity-40"
                      >
                        4. Mark Delivered
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Menu Tab */}
      {activeTab === 'menu' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {foods.map((food) => (
            <div
              key={food._id}
              className="p-4 bg-white rounded-2xl border border-stone-200 shadow-2xs flex gap-3 justify-between"
            >
              <img
                src={food.image}
                alt={food.name}
                referrerPolicy="no-referrer"
                className="w-20 h-20 rounded-xl object-cover bg-stone-100 shrink-0"
              />
              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[10px] font-bold text-orange-600 uppercase">
                      {food.category}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                        food.available ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                      }`}
                    >
                      {food.available ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                  <h4 className="font-heading font-semibold text-xs text-stone-900 truncate">
                    {food.name}
                  </h4>
                  <span className="font-mono font-bold text-sm text-stone-900">
                    ₹{food.price}
                  </span>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-stone-100">
                  <button
                    onClick={() => handleOpenEditFood(food)}
                    className="flex items-center gap-1 text-[11px] font-semibold text-stone-600 hover:text-stone-900 cursor-pointer"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDeleteFood(food._id, food.name)}
                    className="flex items-center gap-1 text-[11px] font-semibold text-red-600 hover:text-red-700 cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Food Modal */}
      {isFoodModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs">
          <div
            className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-150 relative space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-heading font-bold text-lg text-stone-900">
                {editingFood ? 'Edit Food Item' : 'Add New Food Item'}
              </h3>
              <button
                onClick={() => setIsFoodModalOpen(false)}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveFood} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Dish Name *</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Truffle Mushroom Pizza"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Category *</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-orange-500 cursor-pointer"
                  >
                    <option value="Burger">Burger</option>
                    <option value="Pizza">Pizza</option>
                    <option value="North Indian">North Indian</option>
                    <option value="South Indian">South Indian</option>
                    <option value="Desserts">Desserts</option>
                    <option value="Beverages">Beverages</option>
                    <option value="Hot Drinks">Hot Drinks</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-orange-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Description *</label>
                <textarea
                  rows={2}
                  required
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Delicious ingredients, preparation style..."
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Image URL</label>
                <input
                  type="text"
                  value={formImage}
                  onChange={(e) => setFormImage(e.target.value)}
                  placeholder="/src/assets/images/... or web URL"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3 pt-1">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Dietary Type</label>
                  <select
                    value={formVeg ? 'veg' : 'non-veg'}
                    onChange={(e) => setFormVeg(e.target.value === 'veg')}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-orange-500"
                  >
                    <option value="veg">Pure Veg</option>
                    <option value="non-veg">Non-Veg</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Stock Status</label>
                  <select
                    value={formAvailable ? 'true' : 'false'}
                    onChange={(e) => setFormAvailable(e.target.value === 'true')}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-orange-500"
                  >
                    <option value="true">In Stock</option>
                    <option value="false">Out of Stock</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Prep Time</label>
                  <input
                    type="text"
                    value={formPrepTime}
                    onChange={(e) => setFormPrepTime(e.target.value)}
                    placeholder="20-25 mins"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="pt-3 flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setIsFoodModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-200 text-stone-600 font-semibold hover:bg-stone-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingFood}
                  className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-xl cursor-pointer shadow-2xs"
                >
                  {savingFood ? 'Saving...' : editingFood ? 'Save Changes' : 'Add Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
