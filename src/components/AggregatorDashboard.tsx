import React, { useState } from 'react';
import { Home, Package, Store, Wallet, User, Plus, Calendar, Sprout, Eye, TrendingUp, Filter, ArrowLeft, MapPin } from 'lucide-react';
import { RecordBatchIntake } from './RecordBatchIntake';
import { AggregatorTraceabilityMap } from './AggregatorTraceabilityMap';

interface AggregatorDashboardProps {
  onBack: () => void;
  profile?: any;
}

type NavigationTab = 'home' | 'inventory' | 'market' | 'wallet' | 'profile';

export function AggregatorDashboard({ onBack, profile }: AggregatorDashboardProps) {
  const [activeTab, setActiveTab] = useState<NavigationTab>('home');
  const [showRecordIntake, setShowRecordIntake] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<any>(null);

  // Mock inventory data
  const inventory = [
    {
      id: 'INV-001',
      crop: 'Tomatoes',
      quantity: 250,
      unit: 'kg',
      grade: 'A',
      farmer: 'John Mwangi',
      farmerLocation: 'Kiambu County',
      intakeDate: 'Jan 20, 2026',
      batchId: 'KT-1737547200-ABC123XYZ',
      status: 'available',
    },
    {
      id: 'INV-002',
      crop: 'Cabbage',
      quantity: 180,
      unit: 'kg',
      grade: 'A',
      farmer: 'Mary Njeri',
      farmerLocation: 'Nakuru County',
      intakeDate: 'Jan 18, 2026',
      batchId: 'KT-1737460800-DEF456UVW',
      status: 'available',
    },
    {
      id: 'INV-003',
      crop: 'Carrots',
      quantity: 300,
      unit: 'kg',
      grade: 'B',
      farmer: 'Peter Oloo',
      farmerLocation: 'Nyandarua County',
      intakeDate: 'Jan 15, 2026',
      batchId: 'KT-1737201600-GHI789RST',
      status: 'sold',
    },
  ];

  const transactions = [
    { id: 1, type: 'sale', amount: '$125', crop: 'Tomatoes 250kg', date: 'Jan 20, 2026', buyer: 'Fresh Markets Ltd', status: 'paid' },
    { id: 2, type: 'sale', amount: '$90', crop: 'Cabbage 180kg', date: 'Jan 18, 2026', buyer: 'Export Co', status: 'paid' },
    { id: 3, type: 'purchase', amount: '$80', crop: 'Carrots 300kg', date: 'Jan 15, 2026', farmer: 'Peter Oloo', status: 'pending' },
  ];

  // Calculate stats
  const totalStock = inventory.reduce((sum, item) => sum + item.quantity, 0);
  const cropTypes = [...new Set(inventory.map(item => item.crop))].length;
  const totalBatches = inventory.length;
  const availableStock = inventory.filter(item => item.status === 'available').length;
  
  const gradeDistribution = {
    A: inventory.filter(item => item.grade === 'A').length,
    B: inventory.filter(item => item.grade === 'B').length,
    C: inventory.filter(item => item.grade === 'C').length,
  };

  const totalEarnings = transactions
    .filter(tx => tx.type === 'sale')
    .reduce((sum, tx) => sum + parseFloat(tx.amount.replace('$', '')), 0);
  const pendingPayments = transactions.filter(tx => tx.status === 'pending').length;

  if (showRecordIntake) {
    return <RecordBatchIntake onBack={() => setShowRecordIntake(false)} />;
  }

  if (selectedBatch) {
    return (
      <div className="min-h-screen bg-[#fafaf8] flex flex-col">
        <div className="bg-white border-b border-gray-200 p-6">
          <button
            onClick={() => setSelectedBatch(null)}
            className="p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors mb-4"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Batch Details</h1>
        </div>

        <div className="flex-1 p-6 overflow-y-auto pb-24">
          <div className="max-w-md mx-auto space-y-4">
            {/* Batch Info */}
            <div className="bg-white rounded-xl p-4 border-2 border-[#2d5f3f]">
              <p className="text-xs text-gray-600 mb-1">Batch ID</p>
              <p className="font-mono text-sm font-bold text-[#2d5f3f] break-all">{selectedBatch.batchId}</p>
            </div>

            <div className="bg-white rounded-xl p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Batch Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Crop</span>
                  <span className="text-sm font-semibold text-gray-900">{selectedBatch.crop}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Quantity</span>
                  <span className="text-sm font-semibold text-gray-900">{selectedBatch.quantity} {selectedBatch.unit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Grade</span>
                  <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
                    selectedBatch.grade === 'A' ? 'bg-green-100 text-green-700' :
                    selectedBatch.grade === 'B' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-orange-100 text-orange-700'
                  }`}>
                    Grade {selectedBatch.grade}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Intake Date</span>
                  <span className="text-sm font-semibold text-gray-900">{selectedBatch.intakeDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Status</span>
                  <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
                    selectedBatch.status === 'available' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {selectedBatch.status === 'available' ? 'Available' : 'Sold'}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Farmer Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Farmer Name</span>
                  <span className="text-sm font-semibold text-gray-900">{selectedBatch.farmer}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Location</span>
                  <span className="text-sm font-semibold text-gray-900">{selectedBatch.farmerLocation}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

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
            <Package className="w-6 h-6 mr-2" />
            <span className="font-semibold text-lg">Kilimo Trace</span>
          </div>
          <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>
        <h1 className="text-xl font-bold">
          {activeTab === 'home' && 'Dashboard'}
          {activeTab === 'inventory' && 'Inventory'}
          {activeTab === 'market' && 'Market'}
          {activeTab === 'wallet' && 'Wallet'}
          {activeTab === 'profile' && 'Profile'}
        </h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-24">
        {activeTab === 'home' && (
          <HomeTab
            totalStock={totalStock}
            cropTypes={cropTypes}
            totalBatches={totalBatches}
            availableStock={availableStock}
            gradeDistribution={gradeDistribution}
            totalEarnings={totalEarnings}
            profile={profile}
          />
        )}

        {activeTab === 'inventory' && (
          <InventoryTab
            inventory={inventory}
            totalStock={totalStock}
            cropTypes={cropTypes}
            totalBatches={totalBatches}
            gradeDistribution={gradeDistribution}
            onRecordIntake={() => setShowRecordIntake(true)}
            onViewBatch={setSelectedBatch}
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

        {activeTab === 'profile' && <ProfileTab onBack={onBack} profile={profile} />}
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
    { id: 'inventory' as NavigationTab, icon: Package, label: 'Inventory' },
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
function HomeTab({ totalStock, cropTypes, totalBatches, availableStock, gradeDistribution, totalEarnings, profile }: any) {
  const facilityName = profile?.facilityName || 'Central Collection Hub';
  const areaName = profile?.areaName;

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#e8915f] to-[#d17845] rounded-2xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-1">{facilityName}</h2>
        <p className="text-white/80">
          {areaName ? `${areaName} Area` : 'Hub Overview'}
        </p>
      </div>

      {/* Inventory Summary */}
      <div className="bg-white rounded-xl p-5 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-4">Inventory Summary</h3>
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <p className="text-3xl font-bold text-green-600">{totalStock}kg</p>
            <p className="text-xs text-gray-600 mt-1">Total Stock</p>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <p className="text-3xl font-bold text-blue-600">{cropTypes}</p>
            <p className="text-xs text-gray-600 mt-1">Crop Types</p>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <p className="text-3xl font-bold text-purple-600">{totalBatches}</p>
            <p className="text-xs text-gray-600 mt-1">Batches</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <Package className="w-8 h-8 text-[#e8915f] mb-2" />
          <p className="text-2xl font-bold text-gray-900">{availableStock}</p>
          <p className="text-xs text-gray-600">Available Batches</p>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <Wallet className="w-8 h-8 text-green-600 mb-2" />
          <p className="text-2xl font-bold text-gray-900">${totalEarnings}</p>
          <p className="text-xs text-gray-600">Total Revenue</p>
        </div>
      </div>

      {/* Traceability Map - Nearby Farmers */}
      <AggregatorTraceabilityMap />

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-3">Quick Actions</h3>
        <div className="space-y-2">
          <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 flex items-center justify-between">
            <span className="text-sm text-gray-700">View All Inventory</span>
            <span className="text-[#2d5f3f] text-sm">→</span>
          </button>
          <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 flex items-center justify-between">
            <span className="text-sm text-gray-700">Recent Intakes</span>
            <span className="text-[#2d5f3f] text-sm">→</span>
          </button>
          <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 flex items-center justify-between">
            <span className="text-sm text-gray-700">Sales Report</span>
            <span className="text-[#2d5f3f] text-sm">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// Inventory Tab
function InventoryTab({ inventory, totalStock, cropTypes, totalBatches, gradeDistribution, onRecordIntake, onViewBatch }: any) {
  const [filterGrade, setFilterGrade] = useState<string>('all');

  const filteredInventory = filterGrade === 'all' 
    ? inventory 
    : inventory.filter((item: any) => item.grade === filterGrade);

  return (
    <div className="p-6 space-y-5">
      {/* Inventory Summary Card */}
      <div className="bg-white rounded-xl p-5 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-4">Inventory Summary</h3>
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">{totalStock}kg</p>
            <p className="text-xs text-gray-600 mt-1">Total Stock</p>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">{cropTypes}</p>
            <p className="text-xs text-gray-600 mt-1">Crop Types</p>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <p className="text-2xl font-bold text-purple-600">{totalBatches}</p>
            <p className="text-xs text-gray-600 mt-1">Batches</p>
          </div>
        </div>

        {/* Quality Distribution */}
        <div className="border-t pt-4">
          <p className="text-sm font-semibold text-gray-700 mb-3">Quality Distribution</p>
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
              <p className="text-xl font-bold text-green-700">{gradeDistribution.A}</p>
              <p className="text-xs text-gray-600">Grade A</p>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-xl font-bold text-yellow-700">{gradeDistribution.B}</p>
              <p className="text-xs text-gray-600">Grade B</p>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg border border-orange-200">
              <p className="text-xl font-bold text-orange-700">{gradeDistribution.C}</p>
              <p className="text-xs text-gray-600">Grade C</p>
            </div>
          </div>
        </div>
      </div>

      {/* Record Intake Button */}
      <button
        onClick={onRecordIntake}
        className="w-full bg-[#2d5f3f] text-white rounded-xl p-4 flex items-center justify-center space-x-2 shadow-md hover:bg-[#234a32] transition-colors"
      >
        <Plus className="w-5 h-5" />
        <span className="font-semibold">Record Batch Intake</span>
      </button>

      {/* Filter Pills */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        <button
          onClick={() => setFilterGrade('all')}
          className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap ${
            filterGrade === 'all'
              ? 'bg-[#2d5f3f] text-white'
              : 'bg-white border border-gray-300 text-gray-700'
          }`}
        >
          All Inventory ({inventory.length})
        </button>
        <button
          onClick={() => setFilterGrade('A')}
          className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap ${
            filterGrade === 'A'
              ? 'bg-green-600 text-white'
              : 'bg-white border border-gray-300 text-gray-700'
          }`}
        >
          Grade A
        </button>
        <button
          onClick={() => setFilterGrade('B')}
          className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap ${
            filterGrade === 'B'
              ? 'bg-yellow-600 text-white'
              : 'bg-white border border-gray-300 text-gray-700'
          }`}
        >
          Grade B
        </button>
        <button
          onClick={() => setFilterGrade('C')}
          className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap ${
            filterGrade === 'C'
              ? 'bg-orange-600 text-white'
              : 'bg-white border border-gray-300 text-gray-700'
          }`}
        >
          Grade C
        </button>
      </div>

      {/* Inventory List */}
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-900">Stock by Crop Type</h3>
        {filteredInventory.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center shadow-sm">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No stock available</p>
          </div>
        ) : (
          filteredInventory.map((item: any) => (
            <div key={item.id} className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-lg">{item.crop}</h3>
                  <p className="text-2xl text-[#e8915f] font-bold">{item.quantity} {item.unit}</p>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                  item.grade === 'A' ? 'bg-green-100 text-green-700' :
                  item.grade === 'B' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-orange-100 text-orange-700'
                }`}>
                  Grade {item.grade}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                <div className="flex items-center text-gray-600">
                  <Sprout className="w-4 h-4 mr-1" />
                  <span>{item.farmer}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span className="truncate">{item.farmerLocation}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex items-center text-xs text-gray-600">
                  <Calendar className="w-3 h-3 mr-1" />
                  <span>Intake: {item.intakeDate}</span>
                </div>
                <button
                  onClick={() => onViewBatch(item)}
                  className="text-[#e8915f] text-sm font-semibold flex items-center hover:text-[#d17845]"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  View Details
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// Market Tab
function MarketTab() {
  const marketDemand = [
    { buyer: 'Fresh Markets Ltd', demand: 'Tomatoes, Cabbage', volume: '500 kg/week', price: 'Premium' },
    { buyer: 'Export Co', demand: 'Grade A only', volume: '1000 kg/week', price: 'Negotiable' },
    { buyer: 'Local Retailers', demand: 'Mixed vegetables', volume: '300 kg/week', price: 'Standard' },
  ];

  const pricesTrend = [
    { crop: 'Tomatoes', price: '$0.50/kg', trend: 'up', change: '+5%' },
    { crop: 'Cabbage', price: '$0.40/kg', trend: 'up', change: '+3%' },
    { crop: 'Carrots', price: '$0.60/kg', trend: 'down', change: '-2%' },
  ];

  return (
    <div className="p-6 space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h3 className="font-semibold text-blue-900 mb-1">Market Insights</h3>
        <p className="text-sm text-blue-800">Current market demand and pricing trends</p>
      </div>

      <h2 className="font-semibold text-gray-900">Current Prices</h2>
      <div className="space-y-2">
        {pricesTrend.map((item) => (
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

      <h2 className="font-semibold text-gray-900 mt-6">Buyer Demand</h2>
      <div className="space-y-3">
        {marketDemand.map((buyer, index) => (
          <div key={index} className="bg-white rounded-xl p-4 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-2">{buyer.buyer}</h3>
            <div className="space-y-1 text-sm">
              <p className="text-gray-600">
                <span className="font-semibold">Demand:</span> {buyer.demand}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Volume:</span> {buyer.volume}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Price:</span> {buyer.price}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Wallet Tab
function WalletTab({ transactions, totalEarnings, pendingPayments }: any) {
  return (
    <div className="p-6 space-y-4">
      {/* Balance Card */}
      <div className="bg-gradient-to-br from-[#e8915f] to-[#d17845] rounded-2xl p-6 text-white">
        <p className="text-white/80 text-sm mb-1">Total Revenue</p>
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
                <p className="text-xs text-gray-600">
                  {tx.type === 'sale' ? `Sold to: ${tx.buyer}` : `Purchased from: ${tx.farmer}`}
                </p>
              </div>
              <div className="text-right">
                <p className={`font-bold ${tx.type === 'sale' ? 'text-green-600' : 'text-orange-600'}`}>
                  {tx.type === 'sale' ? '+' : '-'}{tx.amount}
                </p>
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
function ProfileTab({ onBack, profile }: any) {
  const facilityName = profile?.facilityName || 'Central Collection Hub';
  const areaName = profile?.areaName || 'Kinoo Center';
  const county = profile?.county || 'Nairobi County';

  // Personal user details
  const firstName = profile?.firstName || 'Admin';
  const lastName = profile?.lastName || 'User';
  const email = profile?.email || 'admin@kilimotrace.com';
  const phone = profile?.phoneNumber || '+254 712 345 678';

  return (
    <div className="p-6 space-y-4">
      <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
        <div className="w-20 h-20 bg-[#e8915f] rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-2xl">
          <Store className="w-10 h-10" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">{facilityName}</h2>
        <p className="text-sm text-gray-600 font-medium">{areaName}</p>
        <p className="text-xs text-gray-500 mt-1">{county}</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <h3 className="font-semibold text-gray-900 p-4 border-b border-gray-200 flex items-center">
          <User className="w-4 h-4 mr-2 text-[#e8915f]" />
          User Profile
        </h3>
        <div className="p-4 space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Full Name</span>
            <span className="text-sm font-semibold text-gray-900">{firstName} {lastName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Email</span>
            <span className="text-sm font-semibold text-gray-900">{email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Phone</span>
            <span className="text-sm font-semibold text-gray-900">{phone}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <h3 className="font-semibold text-gray-900 p-4 border-b border-gray-200 flex items-center">
          <Store className="w-4 h-4 mr-2 text-[#e8915f]" />
          Facility Details
        </h3>
        <div className="p-4 space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Facility Name</span>
            <span className="text-sm font-semibold text-gray-900">{facilityName}</span>
          </div>
           <div className="flex justify-between">
            <span className="text-sm text-gray-600">Area Name</span>
            <span className="text-sm font-semibold text-gray-900">{areaName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Capacity</span>
            <span className="text-sm font-semibold text-gray-900">2000 kg</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Location</span>
            <span className="text-sm font-semibold text-gray-900">{county}</span>
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
