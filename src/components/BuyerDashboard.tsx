import React, { useState } from 'react';
import { ArrowLeft, ShoppingBag, Search, MapPin, Calendar, TrendingUp, CheckCircle, Package, Eye } from 'lucide-react';
import { ProduceDetails } from './ProduceDetails';
import { OrderPlacement } from './OrderPlacement';
import { BuyerSourcingMap } from './BuyerSourcingMap';
import { OrderTracking } from './OrderTracking';

interface BuyerDashboardProps {
  onBack: () => void;
  buyerType: 'supplier_trader' | 'exporter';
}

export function BuyerDashboard({ onBack, buyerType }: BuyerDashboardProps) {
  const [selectedProduce, setSelectedProduce] = useState<any>(null);
  const [showOrderPlacement, setShowOrderPlacement] = useState(false);
  const [view, setView] = useState<'catalog' | 'orders' | 'track'>('catalog');

  const availableProduce = [
    {
      id: 'KT-045',
      crop: 'Tomatoes',
      quantity: '250 kg',
      price: '$125',
      farmer: 'John Mwangi',
      location: 'Kiambu County',
      harvestDate: 'Jan 20, 2026',
      quality: 'Grade A',
      verified: true,
      source: 'direct',
    },
    {
      id: 'KT-046',
      crop: 'Cabbage',
      quantity: '180 kg',
      price: '$90',
      farmer: 'Mary Njeri',
      location: 'Nakuru County',
      harvestDate: 'Jan 18, 2026',
      quality: 'Grade A',
      verified: true,
      source: 'aggregator',
      aggregator: 'Central Collection Hub',
    },
    {
      id: 'KT-047',
      crop: 'Carrots',
      quantity: '300 kg',
      price: '$150',
      farmer: 'Peter Oloo',
      location: 'Nyandarua County',
      harvestDate: 'Jan 19, 2026',
      quality: 'Grade B',
      verified: true,
      source: 'aggregator',
      aggregator: 'Central Collection Hub',
    },
  ];

  const myOrders = [
    {
      orderId: 'ORD-001',
      batchId: 'KT-045',
      crop: 'Tomatoes',
      quantity: '100 kg',
      totalPrice: '$50',
      farmer: 'John Mwangi',
      status: 'pending',
      createdAt: 'Jan 22, 2026',
      canCancel: true,
    },
    {
      orderId: 'ORD-002',
      batchId: 'KT-046',
      crop: 'Cabbage',
      quantity: '50 kg',
      totalPrice: '$25',
      farmer: 'Mary Njeri',
      status: 'confirmed',
      createdAt: 'Jan 21, 2026',
      canCancel: false,
    },
  ];

  if (showOrderPlacement && selectedProduce) {
    return (
      <OrderPlacement
        selectedProduce={selectedProduce}
        onBack={() => {
          setShowOrderPlacement(false);
          setSelectedProduce(null);
        }}
        onComplete={() => {
          setShowOrderPlacement(false);
          setSelectedProduce(null);
          setView('orders');
        }}
      />
    );
  }

  if (selectedProduce && !showOrderPlacement) {
    return (
      <ProduceDetails
        produce={selectedProduce}
        onBack={() => setSelectedProduce(null)}
        onOrder={() => setShowOrderPlacement(true)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#fafaf8] flex flex-col">
      {/* Header */}
      <div className="bg-[#2d5f3f] text-white p-6 pb-8">
        <div className="flex items-center justify-between mb-6">
          <button onClick={onBack} className="p-2 -ml-2 hover:bg-white/10 rounded-lg transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center">
            <ShoppingBag className="w-5 h-5 mr-2" />
            <span className="font-semibold">Kilimo Trace</span>
          </div>
          <div className="w-10" />
        </div>

        <h1 className="text-2xl font-bold mb-1">
          {buyerType === 'exporter' ? 'Export Dashboard' : 'Buyer Dashboard'}
        </h1>
        <p className="text-white/80 text-sm">
          {buyerType === 'exporter' ? 'Source certified produce for export' : 'Browse traceable produce'}
        </p>

        {/* Search Bar */}
        {view === 'catalog' && (
          <div className="relative mt-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search produce..."
              className="w-full bg-white/10 border border-white/20 rounded-xl pl-12 pr-4 py-3 text-white placeholder-white/60 focus:outline-none focus:bg-white/20"
            />
          </div>
        )}
      </div>

      {/* View Toggle */}
      {view !== 'track' && (
        <div className="bg-white border-b border-gray-200 px-6 py-3">
          <div className="flex space-x-2">
            <button
              onClick={() => setView('catalog')}
              className={`flex-1 py-2 rounded-lg font-semibold text-sm transition-all ${
                view === 'catalog'
                  ? 'bg-[#2d5f3f] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Produce Catalog
            </button>
            <button
              onClick={() => setView('orders')}
              className={`flex-1 py-2 rounded-lg font-semibold text-sm transition-all ${
                view === 'orders'
                  ? 'bg-[#2d5f3f] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              My Orders ({myOrders.length})
            </button>
          </div>
        </div>
      )}

      {/* Sourcing Map - Visible only in catalog view */}
      {view === 'catalog' && (
        <div className="px-6 pt-6 pb-4">
          <BuyerSourcingMap buyerType={buyerType} />
        </div>
      )}

      {/* Content */}
      {view === 'catalog' ? (
        <>
          {/* Filter Pills */}
          <div className="px-6 py-4 flex space-x-2 overflow-x-auto">
            <button className="px-4 py-2 bg-white border-2 border-[#2d5f3f] text-[#2d5f3f] rounded-full text-sm font-semibold whitespace-nowrap">
              All
            </button>
            <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-full text-sm whitespace-nowrap hover:border-gray-400">
              Direct from Farmers
            </button>
            <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-full text-sm whitespace-nowrap hover:border-gray-400">
              From Aggregators
            </button>
            {buyerType === 'exporter' && (
              <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-full text-sm whitespace-nowrap hover:border-gray-400">
                Certified Only
              </button>
            )}
          </div>

          {/* Produce List */}
          <div className="flex-1 px-6 pb-6 overflow-y-auto">
            <div className="space-y-3">
              {availableProduce.map((produce) => (
                <button
                  key={produce.id}
                  onClick={() => setSelectedProduce(produce)}
                  className="w-full bg-white rounded-xl p-4 shadow-sm text-left hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-lg text-gray-900">{produce.crop}</h3>
                        {produce.verified && (
                          <CheckCircle className="w-4 h-4 text-[#2d5f3f]" />
                        )}
                        {produce.source === 'aggregator' && (
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                            Via Aggregator
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{produce.quantity} available</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-[#2d5f3f]">{produce.price}</p>
                      <p className="text-xs text-gray-500">{produce.quality}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-3">
                    <div className="flex items-center">
                      <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                      <span className="truncate">{produce.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1 flex-shrink-0" />
                      <span>{produce.harvestDate}</span>
                    </div>
                  </div>

                  {produce.source === 'aggregator' && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 mb-3">
                      <p className="text-xs text-blue-800">
                        <Package className="w-3 h-3 inline mr-1" />
                        Aggregated by: <strong>{produce.aggregator}</strong>
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center text-xs text-gray-600">
                      <div className="w-6 h-6 bg-[#2d5f3f] rounded-full flex items-center justify-center text-white text-xs font-semibold mr-2">
                        {produce.farmer.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span>{produce.farmer}</span>
                    </div>
                    <span className="text-[#2d5f3f] text-sm font-semibold flex items-center">
                      <Eye className="w-4 h-4 mr-1" />
                      View Details
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      ) : view === 'track' ? (
        <OrderTracking onBack={() => setView('catalog')} />
      ) : (
        /* Orders View */
        <div className="flex-1 px-6 py-6 overflow-y-auto">
          <h2 className="font-semibold text-gray-900 mb-3">My Orders</h2>
          {myOrders.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No orders yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {myOrders.map((order) => (
                <div key={order.orderId} className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Order #{order.orderId}</p>
                      <h3 className="font-semibold text-gray-900">{order.crop}</h3>
                      <p className="text-sm text-gray-600">{order.quantity}</p>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                      order.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                      order.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {order.status}
                    </span>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3 mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Batch ID</span>
                      <span className="font-mono text-xs text-gray-900">{order.batchId}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Farmer</span>
                      <span className="text-gray-900">{order.farmer}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total</span>
                      <span className="font-semibold text-[#2d5f3f]">{order.totalPrice}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{order.createdAt}</span>
                    {order.canCancel && (
                      <button className="text-red-600 font-semibold hover:text-red-700">
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="bg-white border-t border-gray-200 px-6 py-4">
        <div className="flex justify-around">
          <button
            onClick={() => setView('catalog')}
            className={`flex flex-col items-center ${
              view === 'catalog' ? 'text-[#2d5f3f]' : 'text-gray-400'
            }`}
          >
            <ShoppingBag className="w-6 h-6 mb-1" />
            <span className="text-xs font-semibold">Browse</span>
          </button>
          <button
            onClick={() => setView('orders')}
            className={`flex flex-col items-center ${
              view === 'orders' ? 'text-[#2d5f3f]' : 'text-gray-400'
            }`}
          >
            <TrendingUp className="w-6 h-6 mb-1" />
            <span className="text-xs">Orders</span>
          </button>
          <button
            onClick={() => setView('track')}
            className={`flex flex-col items-center ${
              view === 'track' ? 'text-[#2d5f3f]' : 'text-gray-400'
            }`}
          >
            <MapPin className="w-6 h-6 mb-1" />
            <span className="text-xs">Track</span>
          </button>
        </div>
      </div>
    </div>
  );
}