import React, { useState } from 'react';
import { Home, ShoppingBag, Store, Wallet, User, Plus, Calendar, Package, Eye, TrendingUp, Sprout, ArrowLeft } from 'lucide-react';
import { RecordHarvest } from './RecordHarvest';
import { FarmerTraceabilityMap } from './FarmerTraceabilityMap';

interface FarmerDashboardProps {
  onBack: () => void;
}

type NavigationTab = 'home' | 'produce' | 'market' | 'wallet' | 'profile';

export function FarmerDashboard({ onBack }: FarmerDashboardProps) {
  const [activeTab, setActiveTab] = useState<NavigationTab>('home');
  const [showRecordHarvest, setShowRecordHarvest] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<any>(null);

  // Mock data - in real app this would come from backend
  const batches = [
    {
      batchId: 'KT-1737547200-ABC123XYZ',
      cropType: 'Tomatoes',
      quantity: '250 kg',
      harvestDate: 'Jan 20, 2026',
      plantingDate: 'Oct 15, 2025',
      condition: 'good',
      status: 'available',
      yieldPerAcre: '100.00',
      fertilizerUsed: 'yes',
      fertilizerType: 'NPK 17-17-17',
      fertilizerAmount: '15 kg',
      pesticideUsed: 'none',
      createdAt: 'Jan 20, 2026 08:30 AM'
    },
    {
      batchId: 'KT-1737460800-DEF456UVW',
      cropType: 'Tomatoes',
      quantity: '180 kg',
      harvestDate: 'Jan 18, 2026',
      plantingDate: 'Oct 12, 2025',
      condition: 'good',
      status: 'taken',
      yieldPerAcre: '72.00',
      fertilizerUsed: 'yes',
      fertilizerType: 'Organic Compost',
      fertilizerAmount: '20 kg',
      pesticideUsed: 'yes',
      pesticideType: 'Neem Oil',
      pesticideAmount: '2 liters',
      aggregator: 'Central Collection Hub',
      createdAt: 'Jan 18, 2026 09:15 AM'
    },
    {
      batchId: 'KT-1737201600-GHI789RST',
      cropType: 'Tomatoes',
      quantity: '300 kg',
      harvestDate: 'Jan 15, 2026',
      plantingDate: 'Oct 10, 2025',
      condition: 'fair',
      status: 'taken',
      yieldPerAcre: '120.00',
      fertilizerUsed: 'none',
      pesticideUsed: 'none',
      aggregator: 'Central Collection Hub',
      createdAt: 'Jan 15, 2026 07:45 AM'
    },
  ];

  const transactions = [
    { id: 1, type: 'sale', amount: '$125', crop: 'Tomatoes 250kg', date: 'Jan 20, 2026', buyer: 'Fresh Markets Ltd', status: 'paid' },
    { id: 2, type: 'sale', amount: '$90', crop: 'Cabbage 180kg', date: 'Jan 18, 2026', buyer: 'Central Collection Hub', status: 'paid' },
    { id: 3, type: 'sale', amount: '$150', crop: 'Carrots 300kg', date: 'Jan 15, 2026', buyer: 'Central Collection Hub', status: 'pending' },
  ];

  const totalHarvested = batches.reduce((sum, batch) => {
    return sum + parseFloat(batch.quantity.replace(' kg', ''));
  }, 0);

  const availableBatches = batches.filter(b => b.status === 'available').length;
  const totalEarnings = transactions.reduce((sum, tx) => sum + parseFloat(tx.amount.replace('$', '')), 0);
  const pendingPayments = transactions.filter(tx => tx.status === 'pending').length;

  if (showRecordHarvest) {
    return <RecordHarvest onBack={() => setShowRecordHarvest(false)} primaryCrop="Tomatoes" farmSize="2.5" />;
  }

  if (selectedBatch) {
    return (
      <div className="min-h-screen bg-[#fafaf8] flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-6">
          <button
            onClick={() => setSelectedBatch(null)}
            className="p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors mb-4"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Batch Production Log</h1>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto pb-24">
          <div className="max-w-md mx-auto space-y-4">
            {/* Batch ID */}
            <div className="bg-white rounded-xl p-4 border-2 border-[#2d5f3f]">
              <p className="text-xs text-gray-600 mb-1">Batch ID</p>
              <p className="font-mono text-sm font-bold text-[#2d5f3f] break-all">
                {selectedBatch.batchId}
              </p>
            </div>

            {/* Status */}
            <div className="bg-white rounded-xl p-4">
              <p className="text-xs text-gray-600 mb-2">Status</p>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                selectedBatch.status === 'available'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-blue-100 text-blue-700'
              }`}>
                {selectedBatch.status === 'available' ? 'Available' : 'Taken by Aggregator'}
              </span>
              {selectedBatch.aggregator && (
                <p className="text-sm text-gray-600 mt-2">
                  Collected by: <strong>{selectedBatch.aggregator}</strong>
                </p>
              )}
            </div>

            {/* Details */}
            <div className="bg-white rounded-xl p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Harvest Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Crop Type</span>
                  <span className="text-sm font-semibold text-gray-900">{selectedBatch.cropType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Quantity</span>
                  <span className="text-sm font-semibold text-gray-900">{selectedBatch.quantity}</span>
                </div>
                {selectedBatch.yieldPerAcre && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Yield per Acre</span>
                    <span className="text-sm font-semibold text-[#2d5f3f]">{selectedBatch.yieldPerAcre} kg/acre</span>
                  </div>
                )}
                {selectedBatch.plantingDate && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Planting Date</span>
                    <span className="text-sm font-semibold text-gray-900">{selectedBatch.plantingDate}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Harvest Date</span>
                  <span className="text-sm font-semibold text-gray-900">{selectedBatch.harvestDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Condition</span>
                  <span className="text-sm font-semibold text-gray-900 capitalize">{selectedBatch.condition}</span>
                </div>
              </div>
            </div>

            {/* Input Records */}
            <div className="bg-white rounded-xl p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Input Records</h3>
              
              {/* Fertilizer */}
              <div className="mb-4 pb-4 border-b border-gray-200">
                <p className="text-sm font-semibold text-gray-700 mb-2">Fertilizer Use</p>
                {selectedBatch.fertilizerUsed === 'yes' ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Type</span>
                      <span className="font-semibold text-gray-900">{selectedBatch.fertilizerType}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Amount</span>
                      <span className="font-semibold text-gray-900">{selectedBatch.fertilizerAmount}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-600 italic">No fertilizer used</p>
                )}
              </div>

              {/* Pesticide */}
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Pesticide Use</p>
                {selectedBatch.pesticideUsed === 'yes' ? (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Type</span>
                      <span className="font-semibold text-gray-900">{selectedBatch.pesticideType}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Amount</span>
                      <span className="font-semibold text-gray-900">{selectedBatch.pesticideAmount}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-600 italic">No pesticide used</p>
                )}
              </div>
            </div>

            {/* Immutable Notice */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <p className="text-xs text-gray-600">
                <strong>Note:</strong> This batch is immutable and cannot be edited or deleted.
                {selectedBatch.status === 'taken' && ' The aggregator has taken custody of this produce.'}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafaf8] flex flex-col">
      {/* Header */}
      <div className="bg-[#2d5f3f] text-white p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Sprout className="w-6 h-6 mr-2" />
            <span className="font-semibold text-lg">Kilimo Trace</span>
          </div>
          <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>
        <h1 className="text-xl font-bold">
          {activeTab === 'home' && 'Dashboard'}
          {activeTab === 'produce' && 'My Produce'}
          {activeTab === 'market' && 'Market'}
          {activeTab === 'wallet' && 'Earnings'}
          {activeTab === 'profile' && 'Profile'}
        </h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-24">
        {activeTab === 'home' && (
          <HomeTab
            totalHarvested={totalHarvested}
            batchCount={batches.length}
            availableBatches={availableBatches}
            totalEarnings={totalEarnings}
            onRecordHarvest={() => setShowRecordHarvest(true)}
          />
        )}

        {activeTab === 'produce' && (
          <ProduceTab
            batches={batches}
            onViewBatch={setSelectedBatch}
            onRecordHarvest={() => setShowRecordHarvest(true)}
          />
        )}

        {activeTab === 'market' && <MarketTab />}

        {activeTab === 'wallet' && (
          <WalletTab
            transactions={transactions}
            totalEarnings={totalEarnings}
            pendingPayments={pendingPayments}
          />
        )}

        {activeTab === 'profile' && <ProfileTab onBack={onBack} />}
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}

// Bottom Navigation Component
function BottomNavigation({ activeTab, onTabChange }: { activeTab: NavigationTab; onTabChange: (tab: NavigationTab) => void }) {
  const navItems = [
    { id: 'home' as NavigationTab, icon: Home, label: 'Home' },
    { id: 'produce' as NavigationTab, icon: ShoppingBag, label: 'Produce' },
    { id: 'market' as NavigationTab, icon: Store, label: 'Market' },
    { id: 'wallet' as NavigationTab, icon: Wallet, label: 'Wallet' },
    { id: 'profile' as NavigationTab, icon: User, label: 'Profile' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-3 safe-area-bottom">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center justify-center min-w-[60px] py-1 px-2 rounded-lg transition-all ${
                isActive ? 'text-[#2d5f3f]' : 'text-gray-500'
              }`}
            >
              <Icon className={`w-6 h-6 mb-1 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              <span className={`text-xs ${isActive ? 'font-semibold' : 'font-normal'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Home Tab
function HomeTab({ totalHarvested, batchCount, availableBatches, totalEarnings, onRecordHarvest }: any) {
  return (
    <div className="p-6 space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#2d5f3f] to-[#3a7050] rounded-2xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-1">Welcome Back!</h2>
        <p className="text-white/80">Here's your farm overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <Package className="w-8 h-8 text-[#2d5f3f] mb-2" />
          <p className="text-2xl font-bold text-gray-900">{totalHarvested} kg</p>
          <p className="text-xs text-gray-600">Total Harvested</p>
          <p className="text-xs text-gray-500 mt-1">{batchCount} batches</p>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <ShoppingBag className="w-8 h-8 text-[#e8915f] mb-2" />
          <p className="text-2xl font-bold text-gray-900">{availableBatches}</p>
          <p className="text-xs text-gray-600">Available</p>
          <p className="text-xs text-gray-500 mt-1">Ready for sale</p>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <Wallet className="w-8 h-8 text-green-600 mb-2" />
          <p className="text-2xl font-bold text-gray-900">${totalEarnings}</p>
          <p className="text-xs text-gray-600">Total Earnings</p>
          <p className="text-xs text-gray-500 mt-1">This month</p>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <TrendingUp className="w-8 h-8 text-blue-600 mb-2" />
          <p className="text-2xl font-bold text-gray-900">+24%</p>
          <p className="text-xs text-gray-600">Growth</p>
          <p className="text-xs text-gray-500 mt-1">vs last month</p>
        </div>
      </div>

      {/* Traceability Map - Nearby Aggregation Points */}
      <FarmerTraceabilityMap />

      {/* Quick Links */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-3">Quick Actions</h3>
        <div className="space-y-2">
          <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 flex items-center justify-between">
            <span className="text-sm text-gray-700">View Production Logs</span>
            <span className="text-[#2d5f3f] text-sm">→</span>
          </button>
          <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 flex items-center justify-between">
            <span className="text-sm text-gray-700">Browse Market Prices</span>
            <span className="text-[#2d5f3f] text-sm">→</span>
          </button>
          <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 flex items-center justify-between">
            <span className="text-sm text-gray-700">Payment History</span>
            <span className="text-[#2d5f3f] text-sm">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// Produce Tab
function ProduceTab({ batches, onViewBatch, onRecordHarvest }: any) {
  return (
    <div className="p-6 space-y-4">
      <button
        onClick={onRecordHarvest}
        className="w-full bg-[#2d5f3f] text-white rounded-xl p-4 flex items-center justify-center space-x-2 shadow-md"
      >
        <Plus className="w-5 h-5" />
        <span className="font-semibold">Record New Harvest</span>
      </button>

      <h2 className="font-semibold text-gray-900">My Batches</h2>
      <div className="space-y-3">
        {batches.map((batch: any) => (
          <div key={batch.batchId} className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                  {batch.batchId.slice(0, 15)}...
                </span>
                <h3 className="font-semibold text-gray-900 mt-2">{batch.cropType}</h3>
                <p className="text-lg text-[#2d5f3f] font-semibold">{batch.quantity}</p>
              </div>
              <span className={`text-xs px-3 py-1 rounded-full ${
                batch.status === 'available' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
              }`}>
                {batch.status === 'available' ? 'Available' : 'Taken'}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-600 mb-3">
              <div className="flex items-center">
                <Calendar className="w-3 h-3 mr-1" />
                <span>{batch.harvestDate}</span>
              </div>
              <div className="capitalize">
                <span className={`w-2 h-2 rounded-full inline-block mr-1 ${
                  batch.condition === 'good' ? 'bg-green-500' : batch.condition === 'fair' ? 'bg-yellow-500' : 'bg-red-500'
                }`} />
                {batch.condition}
              </div>
            </div>

            <button
              onClick={() => onViewBatch(batch)}
              className="w-full text-[#2d5f3f] text-sm font-semibold py-2 hover:bg-[#2d5f3f]/5 rounded-lg transition-colors flex items-center justify-center space-x-1"
            >
              <Eye className="w-4 h-4" />
              <span>View Production Log</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// Market Tab
function MarketTab() {
  const marketPrices = [
    { crop: 'Tomatoes', price: '$0.50/kg', trend: 'up', change: '+5%' },
    { crop: 'Cabbage', price: '$0.40/kg', trend: 'up', change: '+3%' },
    { crop: 'Carrots', price: '$0.60/kg', trend: 'down', change: '-2%' },
    { crop: 'Onions', price: '$0.45/kg', trend: 'up', change: '+7%' },
  ];

  return (
    <div className="p-6 space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h3 className="font-semibold text-blue-900 mb-1">Market Insights</h3>
        <p className="text-sm text-blue-800">Current market prices for your crops</p>
      </div>

      <h2 className="font-semibold text-gray-900">Today's Prices</h2>
      <div className="space-y-2">
        {marketPrices.map((item) => (
          <div key={item.crop} className="bg-white rounded-xl p-4 shadow-sm flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">{item.crop}</h3>
              <p className="text-lg text-[#2d5f3f] font-bold">{item.price}</p>
            </div>
            <div className={`flex items-center space-x-1 ${
              item.trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              <TrendingUp className={`w-5 h-5 ${item.trend === 'down' && 'rotate-180'}`} />
              <span className="font-semibold">{item.change}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-2">Nearby Buyers</h3>
        <div className="space-y-3">
          <div className="p-3 border border-gray-200 rounded-lg">
            <p className="font-semibold text-sm text-gray-900">Central Collection Hub</p>
            <p className="text-xs text-gray-600">5 km away • Buying all vegetables</p>
          </div>
          <div className="p-3 border border-gray-200 rounded-lg">
            <p className="font-semibold text-sm text-gray-900">Fresh Markets Ltd</p>
            <p className="text-xs text-gray-600">12 km away • Premium prices</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Wallet Tab
function WalletTab({ transactions, totalEarnings, pendingPayments }: any) {
  return (
    <div className="p-6 space-y-4">
      {/* Balance Card */}
      <div className="bg-gradient-to-br from-[#2d5f3f] to-[#3a7050] rounded-2xl p-6 text-white">
        <p className="text-white/80 text-sm mb-1">Total Earnings</p>
        <p className="text-4xl font-bold mb-4">${totalEarnings}</p>
        <div className="flex items-center justify-between text-sm">
          <span className="text-white/80">Pending: {pendingPayments}</span>
          <button className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg font-semibold transition-colors">
            Withdraw
          </button>
        </div>
      </div>

      {/* Transactions */}
      <h2 className="font-semibold text-gray-900">Recent Transactions</h2>
      <div className="space-y-3">
        {transactions.map((tx: any) => (
          <div key={tx.id} className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{tx.crop}</p>
                <p className="text-xs text-gray-600">{tx.buyer}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-[#2d5f3f]">{tx.amount}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  tx.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                }`}>
                  {tx.status}
                </span>
              </div>
            </div>
            <p className="text-xs text-gray-500">{tx.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Profile Tab
function ProfileTab({ onBack }: any) {
  return (
    <div className="p-6 space-y-4">
      <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
        <div className="w-20 h-20 bg-[#2d5f3f] rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">John Mwangi</h2>
        <p className="text-sm text-gray-600">+254 712 345 678</p>
        <p className="text-sm text-gray-600">Kiambu County</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm">
        <h3 className="font-semibold text-gray-900 p-4 border-b border-gray-200">Farm Details</h3>
        <div className="p-4 space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Farm Size</span>
            <span className="text-sm font-semibold text-gray-900">2.5 acres</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Primary Crop</span>
            <span className="text-sm font-semibold text-gray-900">Tomatoes</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Location</span>
            <span className="text-sm font-semibold text-gray-900">Field A</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <button className="w-full bg-white text-left p-4 rounded-xl shadow-sm hover:bg-gray-50">
          <span className="text-gray-900 font-semibold">Edit Profile</span>
        </button>
        <button className="w-full bg-white text-left p-4 rounded-xl shadow-sm hover:bg-gray-50">
          <span className="text-gray-900 font-semibold">Settings</span>
        </button>
        <button className="w-full bg-white text-left p-4 rounded-xl shadow-sm hover:bg-gray-50">
          <span className="text-gray-900 font-semibold">Help & Support</span>
        </button>
        <button
          onClick={onBack}
          className="w-full bg-red-50 text-left p-4 rounded-xl shadow-sm hover:bg-red-100"
        >
          <span className="text-red-600 font-semibold">Logout</span>
        </button>
      </div>
    </div>
  );
}