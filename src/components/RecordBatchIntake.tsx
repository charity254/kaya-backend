import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, Package, Calendar, CheckCircle2, AlertCircle, ChevronRight, TrendingUp, Info } from 'lucide-react';

interface RecordBatchIntakeProps {
  onBack: () => void;
}

interface FarmerBatch {
  batchId: string;
  cropType: string;
  quantity: string;
  unit: string;
  harvestDate: string;
  plantingDate: string;
  condition: string;
  yieldPerAcre: string;
  fertilizerUsed: string;
  fertilizerType?: string;
  fertilizerAmount?: string;
  pesticideUsed: string;
  pesticideType?: string;
  pesticideAmount?: string;
}

interface Farmer {
  id: string;
  name: string;
  contact: string;
  location: string;
  availableBatches: FarmerBatch[];
}

interface MarketPrice {
  min: number;
  max: number;
  avg: number;
  trend: 'up' | 'down' | 'stable';
}

const MARKET_PRICES: Record<string, MarketPrice> = {
  'Tomatoes': { min: 0.45, max: 0.55, avg: 0.50, trend: 'up' },
  'Cabbage': { min: 0.35, max: 0.45, avg: 0.40, trend: 'stable' },
  'Onions': { min: 0.60, max: 0.80, avg: 0.70, trend: 'up' },
  'Carrots': { min: 0.50, max: 0.70, avg: 0.60, trend: 'down' },
  'Potatoes': { min: 0.40, max: 0.60, avg: 0.50, trend: 'stable' },
  'Maize': { min: 0.25, max: 0.35, avg: 0.30, trend: 'up' },
  'Beans': { min: 0.80, max: 1.00, avg: 0.90, trend: 'up' },
};

export function RecordBatchIntake({ onBack }: RecordBatchIntakeProps) {
  const [step, setStep] = useState<'search' | 'selectBatch' | 'details' | 'submitted'>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFarmer, setSelectedFarmer] = useState<Farmer | null>(null);
  const [selectedBatch, setSelectedBatch] = useState<FarmerBatch | null>(null);
  const [intakeId, setIntakeId] = useState('');
  const [priceWarning, setPriceWarning] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    grade: 'A',
    intakeDate: new Date().toISOString().split('T')[0],
    pricePerKg: '',
    totalPrice: '',
    condition: 'good',
    notes: '',
  });

  // Mock farmer data with available batches
  const farmers: Farmer[] = [
    {
      id: 'FARM-001',
      name: 'John Mwangi',
      contact: '+254 712 345 678',
      location: 'Kiambu County',
      availableBatches: [
        {
          batchId: 'KT-1737547200-ABC123XYZ',
          cropType: 'Tomatoes',
          quantity: '250',
          unit: 'kg',
          harvestDate: 'Jan 20, 2026',
          plantingDate: 'Oct 15, 2025',
          condition: 'good',
          yieldPerAcre: '100.00',
          fertilizerUsed: 'yes',
          fertilizerType: 'NPK 17-17-17',
          fertilizerAmount: '15 kg',
          pesticideUsed: 'none',
        },
      ],
    },
    {
      id: 'FARM-002',
      name: 'Mary Njeri',
      contact: '+254 712 345 679',
      location: 'Nakuru County',
      availableBatches: [
        {
          batchId: 'KT-1737460800-DEF456UVW',
          cropType: 'Cabbage',
          quantity: '180',
          unit: 'kg',
          harvestDate: 'Jan 18, 2026',
          plantingDate: 'Oct 12, 2025',
          condition: 'good',
          yieldPerAcre: '72.00',
          fertilizerUsed: 'yes',
          fertilizerType: 'Organic Compost',
          fertilizerAmount: '20 kg',
          pesticideUsed: 'yes',
          pesticideType: 'Neem Oil',
          pesticideAmount: '2 liters',
        },
        {
          batchId: 'KT-1737461900-XYZ789ABC',
          cropType: 'Onions',
          quantity: '150',
          unit: 'kg',
          harvestDate: 'Jan 17, 2026',
          plantingDate: 'Oct 10, 2025',
          condition: 'excellent',
          yieldPerAcre: '60.00',
          fertilizerUsed: 'yes',
          fertilizerType: 'Organic Compost',
          fertilizerAmount: '18 kg',
          pesticideUsed: 'none',
        },
      ],
    },
    {
      id: 'FARM-003',
      name: 'Peter Oloo',
      contact: '+254 712 345 680',
      location: 'Nyandarua County',
      availableBatches: [
        {
          batchId: 'KT-1737201600-GHI789RST',
          cropType: 'Carrots',
          quantity: '300',
          unit: 'kg',
          harvestDate: 'Jan 15, 2026',
          plantingDate: 'Oct 10, 2025',
          condition: 'fair',
          yieldPerAcre: '120.00',
          fertilizerUsed: 'none',
          pesticideUsed: 'none',
        },
      ],
    },
  ];

  const filteredFarmers = farmers.filter(farmer =>
    farmer.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFarmerSelect = (farmer: Farmer) => {
    setSelectedFarmer(farmer);
    setStep('selectBatch');
  };

  const handleBatchSelect = (batch: FarmerBatch) => {
    setSelectedBatch(batch);
    setStep('details');
    // Reset form data when selecting a new batch
    setFormData({
      grade: 'A',
      intakeDate: new Date().toISOString().split('T')[0],
      pricePerKg: '',
      totalPrice: '',
      condition: 'good',
      notes: '',
    });
    setPriceWarning(null);
  };

  const handlePriceChange = (pricePerKg: string) => {
    setFormData({ ...formData, pricePerKg });
    
    // Check for price warning
    if (selectedBatch) {
      const marketPrice = MARKET_PRICES[selectedBatch.cropType];
      const price = parseFloat(pricePerKg);
      
      if (marketPrice && !isNaN(price)) {
        if (price < marketPrice.min) {
          setPriceWarning(`Price is below market trend (Min: $${marketPrice.min}). Ensure fair pricing for the farmer.`);
        } else {
          setPriceWarning(null);
        }
      } else {
        setPriceWarning(null);
      }

      if (pricePerKg) {
        const total = (parseFloat(selectedBatch.quantity) * parseFloat(pricePerKg)).toFixed(2);
        setFormData({ ...formData, pricePerKg, totalPrice: total });
      } else {
        setFormData({ ...formData, pricePerKg, totalPrice: '' });
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const generatedIntakeId = `INT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    
    const intakeData = {
      intakeId: generatedIntakeId,
      farmerBatchId: selectedBatch?.batchId,
      farmerName: selectedFarmer?.name,
      farmerContact: selectedFarmer?.contact,
      farmerLocation: selectedFarmer?.location,
      cropType: selectedBatch?.cropType,
      quantity: selectedBatch?.quantity,
      unit: selectedBatch?.unit,
      ...formData,
      status: 'available',
      createdAt: new Date().toISOString(),
      immutable: true,
    };
    
    console.log('Batch intake recorded:', intakeData);
    setIntakeId(generatedIntakeId);
    setStep('submitted');
  };

  // Success Screen
  if (step === 'submitted') {
    return (
      <div className="min-h-screen bg-[#fafaf8] flex flex-col items-center justify-center p-6">
        <div className="bg-white rounded-2xl p-8 text-center max-w-sm shadow-lg">
          <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Intake Recorded!</h2>
          
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-4">
            <p className="text-xs text-gray-600 mb-1">Intake ID</p>
            <p className="font-mono font-bold text-[#e8915f] break-all">{intakeId}</p>
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-600">Farmer:</span>
                <span className="font-semibold">{selectedFarmer?.name}</span>
              </div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-600">Crop:</span>
                <span className="font-semibold">{selectedBatch?.cropType}</span>
              </div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-600">Quantity:</span>
                <span className="font-semibold">{selectedBatch?.quantity} {selectedBatch?.unit}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">Total:</span>
                <span className="font-semibold text-[#2d5f3f]">${formData.totalPrice}</span>
              </div>
            </div>
          </div>

          <p className="text-gray-600 mb-6">
            Batch intake successfully recorded with full traceability.
          </p>

          <button
            onClick={onBack}
            className="w-full bg-[#2d5f3f] text-white rounded-xl py-3 font-semibold hover:bg-[#234a32] transition-colors"
          >
            Back to Inventory
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafaf8] flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="flex items-center mb-4">
          <button
            onClick={() => {
              if (step === 'search') {
                onBack();
              } else if (step === 'selectBatch') {
                setStep('search');
                setSelectedFarmer(null);
              } else if (step === 'details') {
                setStep('selectBatch');
                setSelectedBatch(null);
              }
            }}
            className="p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-gray-900 ml-2">
            {step === 'search' && 'Search Farmer'}
            {step === 'selectBatch' && 'Select Batch'}
            {step === 'details' && 'Batch Details'}
          </h1>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center space-x-2">
          <div className={`flex-1 h-1 rounded-full ${step === 'search' ? 'bg-[#2d5f3f]' : 'bg-gray-200'}`} />
          <div className={`flex-1 h-1 rounded-full ${step === 'selectBatch' || step === 'details' ? 'bg-[#2d5f3f]' : 'bg-gray-200'}`} />
          <div className={`flex-1 h-1 rounded-full ${step === 'details' ? 'bg-[#2d5f3f]' : 'bg-gray-200'}`} />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {/* Step 1: Search Farmer */}
        {step === 'search' && (
          <div className="space-y-4 max-w-md mx-auto">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm text-blue-900">
                <strong>Step 1:</strong> Search for the farmer by name
              </p>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search farmer name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border border-gray-300 rounded-xl pl-12 pr-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2d5f3f]"
                autoFocus
              />
            </div>

            {/* Farmers List */}
            <div className="space-y-3">
              {searchQuery === '' ? (
                <div className="text-center py-12">
                  <Search className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Start typing to search farmers</p>
                </div>
              ) : filteredFarmers.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No farmers found</p>
                </div>
              ) : (
                filteredFarmers.map((farmer) => (
                  <button
                    key={farmer.id}
                    onClick={() => handleFarmerSelect(farmer)}
                    className="w-full bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow text-left"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{farmer.name}</h3>
                        <p className="text-sm text-gray-600">{farmer.location}</p>
                        <p className="text-xs text-gray-500 mt-1">{farmer.contact}</p>
                        <p className="text-xs text-[#2d5f3f] font-semibold mt-2">
                          {farmer.availableBatches.length} available batch{farmer.availableBatches.length !== 1 && 'es'}
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        )}

        {/* Step 2: Select Batch */}
        {step === 'selectBatch' && selectedFarmer && (
          <div className="space-y-4 max-w-md mx-auto">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm text-blue-900">
                <strong>Step 2:</strong> Select a batch from {selectedFarmer.name}
              </p>
            </div>

            {/* Farmer Info */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">{selectedFarmer.name}</h3>
              <p className="text-sm text-gray-600">{selectedFarmer.location}</p>
              <p className="text-sm text-gray-600">{selectedFarmer.contact}</p>
            </div>

            {/* Available Batches */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">Available Batches ({selectedFarmer.availableBatches.length})</h3>
              {selectedFarmer.availableBatches.map((batch) => (
                <button
                  key={batch.batchId}
                  onClick={() => handleBatchSelect(batch)}
                  className="w-full bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow text-left border-2 border-gray-200 hover:border-[#2d5f3f]"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 text-lg">{batch.cropType}</h4>
                      <p className="text-2xl text-[#e8915f] font-bold">{batch.quantity} {batch.unit}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3 mb-2">
                    <p className="text-xs text-gray-600 mb-1">Batch ID</p>
                    <p className="text-xs font-mono text-gray-900 break-all">{batch.batchId}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-600">Harvest:</span>
                      <span className="ml-1 font-semibold text-gray-900">{batch.harvestDate}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Condition:</span>
                      <span className="ml-1 font-semibold text-gray-900 capitalize">{batch.condition}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Intake Details */}
        {step === 'details' && selectedBatch && selectedFarmer && (
          <form onSubmit={handleSubmit} className="space-y-5 max-w-md mx-auto">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm text-blue-900">
                <strong>Step 3:</strong> Complete intake details
              </p>
            </div>

            {/* Farmer & Batch Info (Auto-populated, read-only) */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Farmer & Batch Information</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Farmer Name</label>
                  <input
                    type="text"
                    value={selectedFarmer.name}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-700"
                    readOnly
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Crop Type</label>
                    <input
                      type="text"
                      value={selectedBatch.cropType}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-700"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Quantity</label>
                    <input
                      type="text"
                      value={`${selectedBatch.quantity} ${selectedBatch.unit}`}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-700"
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Market Intelligence Hint */}
            {MARKET_PRICES[selectedBatch.cropType] && (
              <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-indigo-100 p-2 rounded-full">
                    <TrendingUp className="w-5 h-5 text-indigo-700" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-indigo-900 text-sm">Market Intelligence</h4>
                    <p className="text-xs text-indigo-800 mt-1">
                      Current market price for <strong>{selectedBatch.cropType}</strong> is trending 
                      <strong className="mx-1">
                        {MARKET_PRICES[selectedBatch.cropType].trend === 'up' ? '↗ Up' : 
                         MARKET_PRICES[selectedBatch.cropType].trend === 'down' ? '↘ Down' : '→ Stable'}
                      </strong>
                    </p>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className="text-xs bg-white px-2 py-1 rounded border border-indigo-200 text-indigo-800 font-mono">
                        Min: ${MARKET_PRICES[selectedBatch.cropType].min}
                      </span>
                      <span className="text-xs bg-white px-2 py-1 rounded border border-indigo-200 text-indigo-800 font-mono">
                        Avg: ${MARKET_PRICES[selectedBatch.cropType].avg}
                      </span>
                      <span className="text-xs bg-white px-2 py-1 rounded border border-indigo-200 text-indigo-800 font-mono">
                        Max: ${MARKET_PRICES[selectedBatch.cropType].max}
                      </span>
                    </div>
                    <p className="text-[10px] text-indigo-600 mt-2 italic">
                      Tip: Offer a fair price within this range to support farmer sustainability.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Intake Details */}
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Intake Details</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Quality Grade *
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['A', 'B', 'C'].map((grade) => (
                      <label
                        key={grade}
                        className={`flex flex-col items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                          formData.grade === grade
                            ? grade === 'A' ? 'border-green-600 bg-green-600 shadow-lg' :
                              grade === 'B' ? 'border-yellow-600 bg-yellow-600 shadow-lg' :
                              'border-orange-600 bg-orange-600 shadow-lg'
                            : 'border-gray-300 bg-white hover:border-gray-400'
                        }`}
                      >
                        <input
                          type="radio"
                          name="grade"
                          value={grade}
                          checked={formData.grade === grade}
                          onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                          className="sr-only"
                        />
                        <span className={`text-2xl font-bold mb-1 ${
                          formData.grade === grade ? 'text-white' : 'text-gray-700'
                        }`}>
                          {grade}
                        </span>
                        <span className={`text-xs font-semibold ${
                          formData.grade === grade ? 'text-white' : 'text-gray-600'
                        }`}>
                          Grade {grade}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Intake Date *
                  </label>
                  <input
                    type="date"
                    value={formData.intakeDate}
                    onChange={(e) => setFormData({ ...formData, intakeDate: e.target.value })}
                    max={new Date().toISOString().split('T')[0]}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Price per kg ($) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.pricePerKg}
                      onChange={(e) => handlePriceChange(e.target.value)}
                      className={`w-full border rounded-lg pl-7 pr-3 py-2 text-sm focus:outline-none focus:ring-2 ${
                        priceWarning 
                          ? 'border-red-300 focus:ring-red-500 bg-red-50' 
                          : 'border-gray-300 focus:ring-orange-500'
                      }`}
                      required
                    />
                  </div>
                  {priceWarning && (
                    <div className="flex items-start mt-2 text-red-600 text-xs">
                      <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0 mt-0.5" />
                      <span>{priceWarning}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Total Price ($)
                  </label>
                  <input
                    type="text"
                    value={formData.totalPrice}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-50 font-bold text-[#2d5f3f]"
                    readOnly
                  />
                  <p className="text-xs text-gray-500 mt-1">Auto-calculated</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Notes (Optional)
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Any additional notes..."
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <div className="flex items-start space-x-2">
                <Info className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-yellow-900 font-semibold mb-1">Traceability Record</p>
                  <p className="text-sm text-yellow-800">
                    This intake record will be permanently linked to the farmer's batch ID ({selectedBatch.batchId}).
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[#2d5f3f] text-white rounded-xl py-4 font-semibold text-lg shadow-md hover:bg-[#234a32] transition-colors mt-8"
            >
              Record Batch Intake
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
