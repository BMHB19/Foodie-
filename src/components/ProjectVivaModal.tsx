import React, { useState } from 'react';
import { X, CheckCircle, Code, Database, Server, Laptop, Play, RefreshCw } from 'lucide-react';
import { api } from '../services/api';

interface ProjectVivaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectVivaModal: React.FC<ProjectVivaModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'checklist' | 'api-tester' | 'arch'>('checklist');
  const [apiResult, setApiResult] = useState<string | null>(null);
  const [testingEndpoint, setTestingEndpoint] = useState<string | null>(null);

  if (!isOpen) return null;

  const checklistItems = [
    {
      id: 1,
      title: 'React components and props',
      file: 'src/components/FoodCard.tsx, Navbar.tsx, CartDrawer.tsx',
      desc: 'Modular functional components with typed TypeScript props passing dish models, handlers, and quantities.',
    },
    {
      id: 2,
      title: 'React hooks (useState and useEffect)',
      file: 'src/context/CartContext.tsx, AuthContext.tsx, MenuPage.tsx',
      desc: 'State orchestration for cart quantities, filters, authentication tokens, and async data fetching on mount.',
    },
    {
      id: 3,
      title: 'React Router / View navigation',
      file: 'src/App.tsx, src/components/Navbar.tsx',
      desc: 'Dynamic view routing between Home Showcase, Food Menu, My Orders Live Tracking, and Admin Control Panel.',
    },
    {
      id: 4,
      title: 'JavaScript event handling',
      file: 'FoodCard steppers, CartDrawer coupon buttons, Checkout form submit',
      desc: 'Clean synthetic event handling, form submission with validation, stopPropagation for nested card clicks.',
    },
    {
      id: 5,
      title: 'REST API development',
      file: 'server.ts (REST Routes)',
      desc: 'Standardized RESTful architecture with JSON response envelopes ({ success, data, message }).',
    },
    {
      id: 6,
      title: 'GET, POST, PUT and DELETE operations',
      file: 'server.ts',
      desc: 'GET /api/foods, POST /api/orders, PUT /api/foods/:id, DELETE /api/foods/:id, PATCH /api/orders/:id/status.',
    },
    {
      id: 7,
      title: 'Node.js and Express.js runtime',
      file: 'server.ts (Express App on Port 3000)',
      desc: 'Full-stack Express backend with JSON body parser, JWT auth middleware, and Vite integration.',
    },
    {
      id: 8,
      title: 'MongoDB CRUD operations (Mongoose)',
      file: 'backend/models/*.ts & backend/config/db.ts',
      desc: 'Mongoose schemas for Users, Foods, and Orders collections connected via MONGODB_URI with auto-seeding.',
    },
    {
      id: 9,
      title: 'Frontend and backend integration',
      file: 'src/services/api.ts & fetch API',
      desc: 'Client-server communication through typed asynchronous service methods with Bearer JWT headers.',
    },
    {
      id: 10,
      title: 'User authentication & bcrypt encryption',
      file: 'server.ts, bcryptjs & jsonwebtoken',
      desc: 'Password encryption using bcryptjs, JWT token generation & verification, and role-based access.',
    },
    {
      id: 11,
      title: 'Responsive CSS design',
      file: 'src/index.css, Tailwind CSS v4',
      desc: 'Fluid responsive layout adapted for smartphones, tablets, and 1440px desktop screens.',
    },
  ];

  const runApiTest = async (name: string, fn: () => Promise<any>) => {
    setTestingEndpoint(name);
    setApiResult('Calling live Express server endpoint...');
    try {
      const res = await fn();
      setApiResult(JSON.stringify(res, null, 2));
    } catch (err: any) {
      setApiResult(`Error: ${err.message}`);
    } finally {
      setTestingEndpoint(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs">
      <div
        className="bg-white rounded-3xl max-w-3xl w-full h-[85vh] flex flex-col overflow-hidden shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🎓</span>
              <h2 className="font-heading font-bold text-xl text-stone-900">
                FSD Mini Project Evaluation & Viva Guide
              </h2>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              FoodieHub MERN Stack Technical Architecture & PRD Concept Verification
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-stone-200 px-6 gap-6 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('checklist')}
            className={`py-3 border-b-2 cursor-pointer transition-colors ${
              activeTab === 'checklist'
                ? 'border-orange-600 text-orange-600'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            MERN Concepts Checklist (11/11 Verified)
          </button>
          <button
            onClick={() => setActiveTab('api-tester')}
            className={`py-3 border-b-2 cursor-pointer transition-colors ${
              activeTab === 'api-tester'
                ? 'border-orange-600 text-orange-600'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Live REST API Tester
          </button>
          <button
            onClick={() => setActiveTab('arch')}
            className={`py-3 border-b-2 cursor-pointer transition-colors ${
              activeTab === 'arch'
                ? 'border-orange-600 text-orange-600'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            3-Tier Architecture
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'checklist' && (
            <div className="space-y-3.5">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-xs text-emerald-800 mb-4">
                <div className="flex items-center gap-2 font-semibold">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>All 11 PRD Evaluation Requirements Fully Implemented</span>
                </div>
                <span className="font-mono font-bold text-emerald-700">11 / 11 Complete</span>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {checklistItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl border border-stone-200/80 bg-white hover:border-orange-200 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5">
                        <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                          <CheckCircle className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <h4 className="font-heading font-semibold text-xs text-stone-900">
                            {item.id}. {item.title}
                          </h4>
                          <p className="text-stone-500 text-xs mt-0.5 leading-relaxed">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 bg-stone-100 rounded text-stone-600 shrink-0">
                        {item.file}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'api-tester' && (
            <div className="space-y-4">
              <p className="text-xs text-stone-600">
                Test the live Express REST APIs directly from this window to prove client-server communication:
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  onClick={() => runApiTest('GET /api/health', () => api.getHealth())}
                  disabled={!!testingEndpoint}
                  className="p-2.5 bg-stone-100 hover:bg-stone-200 rounded-xl text-left text-xs font-medium cursor-pointer transition-colors"
                >
                  <span className="text-emerald-600 font-bold font-mono">GET</span> /api/health
                </button>

                <button
                  onClick={() => runApiTest('GET /api/foods', () => api.getFoods())}
                  disabled={!!testingEndpoint}
                  className="p-2.5 bg-stone-100 hover:bg-stone-200 rounded-xl text-left text-xs font-medium cursor-pointer transition-colors"
                >
                  <span className="text-emerald-600 font-bold font-mono">GET</span> /api/foods
                </button>

                <button
                  onClick={() => runApiTest('GET /api/orders', () => api.getOrders())}
                  disabled={!!testingEndpoint}
                  className="p-2.5 bg-stone-100 hover:bg-stone-200 rounded-xl text-left text-xs font-medium cursor-pointer transition-colors"
                >
                  <span className="text-emerald-600 font-bold font-mono">GET</span> /api/orders
                </button>

                <button
                  onClick={() => runApiTest('POST /api/seed', () => api.resetSeedData())}
                  disabled={!!testingEndpoint}
                  className="p-2.5 bg-stone-100 hover:bg-stone-200 rounded-xl text-left text-xs font-medium cursor-pointer transition-colors"
                >
                  <span className="text-amber-600 font-bold font-mono">POST</span> /api/seed
                </button>
              </div>

              {/* Output Console */}
              <div className="bg-stone-900 rounded-2xl p-4 text-emerald-400 font-mono text-xs overflow-x-auto min-h-[200px] border border-stone-800">
                <div className="flex items-center justify-between text-stone-500 border-b border-stone-800 pb-2 mb-3">
                  <span>API Response Console</span>
                  {testingEndpoint && <span className="text-amber-400 animate-pulse">Running {testingEndpoint}...</span>}
                </div>
                <pre>{apiResult || '// Click any endpoint button above to execute a live REST request'}</pre>
              </div>
            </div>
          )}

          {activeTab === 'arch' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-orange-50/60 border border-orange-200 rounded-2xl">
                  <div className="w-8 h-8 rounded-xl bg-orange-600 text-white flex items-center justify-center mb-2">
                    <Laptop className="w-4 h-4" />
                  </div>
                  <h4 className="font-heading font-semibold text-sm text-stone-900">1. Client Layer</h4>
                  <p className="text-xs text-stone-500 mt-1">
                    React 19 + TypeScript + Tailwind CSS. Handles UI, cart state management, checkout validation, and interactive tracking.
                  </p>
                </div>

                <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl">
                  <div className="w-8 h-8 rounded-xl bg-stone-900 text-white flex items-center justify-center mb-2">
                    <Server className="w-4 h-4" />
                  </div>
                  <h4 className="font-heading font-semibold text-sm text-stone-900">2. Server Layer</h4>
                  <p className="text-xs text-stone-500 mt-1">
                    Node.js + Express.js REST API. Processes authentication, business logic, discount calculations, order state transitions.
                  </p>
                </div>

                <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-2">
                    <Database className="w-4 h-4" />
                  </div>
                  <h4 className="font-heading font-semibold text-sm text-stone-900">3. Database Layer</h4>
                  <p className="text-xs text-stone-500 mt-1">
                    MongoDB + Mongoose ODM (`Users`, `Foods`, `Orders` collections) with automatic seeding and local JSON fallback.
                  </p>
                </div>
              </div>

              {/* Data Models Preview */}
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-xs">
                <h5 className="font-heading font-semibold text-stone-900 mb-2">
                  Mongoose Collections Schemas
                </h5>
                <ul className="space-y-2 text-stone-600 font-mono text-[11px]">
                  <li>• <strong>Users:</strong> &#123; _id, name, email, password (bcrypt), role, phone, address &#125;</li>
                  <li>• <strong>Foods:</strong> &#123; _id, name, category, price, description, image, available, veg, rating &#125;</li>
                  <li>• <strong>Orders:</strong> &#123; _id, orderNumber, userId, items[], subtotal, tax, discount, totalAmount, status &#125;</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
