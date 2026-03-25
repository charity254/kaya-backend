import React, { useState } from 'react';
import { ArrowLeft, Calendar, Package, Sprout, CheckCircle2, AlertCircle, Droplet, Leaf } from 'lucide-react';

interface RecordHarvestProps {
  onBack: () => void;
  primaryCrop?: string;
  farmSize?: string;
}

export function RecordHarvest({ onBack, primaryCrop = 'Tomatoes', farmSize = '2.5' }: RecordHarvestProps) {
  const [submitted, setSubmitted] = useState(false);
  const [batchId, setBatchId] = useState('');
  const [formData, setFormData] = useState({
    cropType: primaryCrop,
    plantingDate: '',
    harvestDate: new Date().toISOString().split('T')[0],
    quantity: '',
    condition: 'good',
    fertilizerUsed: 'none',
    fertilizerType: '',
    fertilizerAmount: '',
    pesticideUsed: 'none',
    pesticideType: '',
    pesticideAmount: '',
    // Marketplace listing fields
    pricePerKg: '',
    minimumOrder: '',
    availableUntil: '',
    deliveryFarmPickup: false,
    deliveryAvailable: false,
    deliveryAggregation: true,
    paymentTerms: 'cash_on_delivery',
    specialNotes: '',
  });

  const calculateYield = () => {
    if (!formData.quantity || !farmSize) return 0;
    const quantity = parseFloat(formData.quantity);
    const size = parseFloat(farmSize);
    return (quantity / size).toFixed(2);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Auto-generate immutable batch_id (UUID format)
    const generatedBatchId = `KT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    
    const batchData = {
      batchId: generatedBatchId,
      ...formData,
      yieldPerAcre: calculateYield(),
      status: 'available',
      createdAt: new Date().toISOString(),
      immutable: true,
    };
    
    console.log('Batch created:', batchData);
    setBatchId(generatedBatchId);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#fafaf8] flex flex-col items-center justify-center p-6">
        <div className="bg-white rounded-2xl p-8 text-center max-w-sm shadow-lg">
          <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Harvest Recorded!</h2>
          
          {/* Batch ID Display */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-4">
            <p className="text-xs text-gray-600 mb-1">Batch ID</p>
            <p className="font-mono font-bold text-[#2d5f3f] break-all">{batchId}</p>
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-600">Quantity:</span>
                <span className="font-semibold">{formData.quantity} kg</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">Yield:</span>
                <span className="font-semibold text-[#2d5f3f]">{calculateYield()} kg/acre</span>
              </div>
            </div>
          </div>

          <p className="text-gray-600 mb-6">
            Your produce has been registered with complete input records for full traceability.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6 text-left">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-blue-900">
                This batch is now immutable and cannot be edited after aggregator intake.
              </p>
            </div>
          </div>

          <button
            onClick={onBack}
            className="w-full bg-[#2d5f3f] text-white rounded-xl py-3 font-semibold hover:bg-[#234a32] transition-colors"
          >
            Back to Dashboard
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
          <button onClick={onBack} className="p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-gray-900 ml-2">Record Harvest & Production Log</h1>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 p-6 overflow-y-auto">
        <form onSubmit={handleSubmit} className="space-y-5 max-w-md mx-auto">
          {/* Crop Type (Pre-filled from farm) */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Sprout className="w-4 h-4 inline mr-1" />
              Crop Type
            </label>
            <input
              type="text"
              value={formData.cropType}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-500 bg-gray-50"
              readOnly
            />
            <p className="text-xs text-gray-500 mt-1">From your farm profile</p>
          </div>

          {/* Planting Date */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              Planting Date *
            </label>
            <input
              type="date"
              value={formData.plantingDate}
              onChange={(e) => setFormData({ ...formData, plantingDate: e.target.value })}
              max={formData.harvestDate}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2d5f3f]"
              required
            />
            <p className="text-xs text-gray-500 mt-1">When was the crop planted?</p>
          </div>

          {/* Harvest Date */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              Harvest Date *
            </label>
            <input
              type="date"
              value={formData.harvestDate}
              onChange={(e) => setFormData({ ...formData, harvestDate: e.target.value })}
              max={new Date().toISOString().split('T')[0]}
              min={formData.plantingDate}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2d5f3f]"
              required
            />
          </div>

          {/* Harvested Quantity */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Package className="w-4 h-4 inline mr-1" />
              Harvested Quantity (kg) *
            </label>
            <input
              type="number"
              step="0.1"
              placeholder="Enter quantity in kg"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2d5f3f]"
              required
            />
            {formData.quantity && farmSize && (
              <p className="text-xs text-green-600 mt-1 font-semibold">
                Yield: {calculateYield()} kg per acre
              </p>
            )}
          </div>

          {/* Condition */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Condition *
            </label>
            <div className="space-y-2">
              {[
                { value: 'good', label: 'Good', color: 'green' },
                { value: 'fair', label: 'Fair', color: 'yellow' },
                { value: 'poor', label: 'Poor', color: 'red' },
              ].map((option) => (
                <label
                  key={option.value}
                  className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    formData.condition === option.value
                      ? 'border-[#2d5f3f] bg-[#2d5f3f]/5'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <input
                    type="radio"
                    name="condition"
                    value={option.value}
                    checked={formData.condition === option.value}
                    onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                    className="w-5 h-5 text-[#2d5f3f] focus:ring-[#2d5f3f]"
                  />
                  <span className="ml-3 font-semibold text-gray-900">{option.label}</span>
                  <div className={`ml-auto w-3 h-3 rounded-full bg-${option.color}-500`} />
                </label>
              ))}
            </div>
          </div>

          {/* Fertilizer Section */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
              <Leaf className="w-5 h-5 mr-2 text-green-600" />
              Fertilizer Use
            </h3>
            
            <div className="mb-3">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Fertilizer Used? *
              </label>
              <div className="flex space-x-3">
                <label className={`flex-1 flex items-center justify-center p-3 border-2 rounded-xl cursor-pointer transition-all ${
                  formData.fertilizerUsed === 'yes' ? 'border-green-600 bg-green-100' : 'border-gray-300'
                }`}>
                  <input
                    type="radio"
                    name="fertilizerUsed"
                    value="yes"
                    checked={formData.fertilizerUsed === 'yes'}
                    onChange={(e) => setFormData({ ...formData, fertilizerUsed: e.target.value })}
                    className="sr-only"
                  />
                  <span className="font-semibold text-sm">Yes</span>
                </label>
                <label className={`flex-1 flex items-center justify-center p-3 border-2 rounded-xl cursor-pointer transition-all ${
                  formData.fertilizerUsed === 'none' ? 'border-green-600 bg-green-100' : 'border-gray-300'
                }`}>
                  <input
                    type="radio"
                    name="fertilizerUsed"
                    value="none"
                    checked={formData.fertilizerUsed === 'none'}
                    onChange={(e) => setFormData({ ...formData, fertilizerUsed: e.target.value })}
                    className="sr-only"
                  />
                  <span className="font-semibold text-sm">None</span>
                </label>
              </div>
            </div>

            {formData.fertilizerUsed === 'yes' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Fertilizer Type *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., NPK 17-17-17, Organic Compost"
                    value={formData.fertilizerType}
                    onChange={(e) => setFormData({ ...formData, fertilizerType: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    required={formData.fertilizerUsed === 'yes'}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Amount Used (kg) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="0.0"
                    value={formData.fertilizerAmount}
                    onChange={(e) => setFormData({ ...formData, fertilizerAmount: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    required={formData.fertilizerUsed === 'yes'}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Pesticide Section */}
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
              <Droplet className="w-5 h-5 mr-2 text-orange-600" />
              Pesticide Use
            </h3>
            
            <div className="mb-3">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Pesticide Used? *
              </label>
              <div className="flex space-x-3">
                <label className={`flex-1 flex items-center justify-center p-3 border-2 rounded-xl cursor-pointer transition-all ${
                  formData.pesticideUsed === 'yes' ? 'border-orange-600 bg-orange-100' : 'border-gray-300'
                }`}>
                  <input
                    type="radio"
                    name="pesticideUsed"
                    value="yes"
                    checked={formData.pesticideUsed === 'yes'}
                    onChange={(e) => setFormData({ ...formData, pesticideUsed: e.target.value })}
                    className="sr-only"
                  />
                  <span className="font-semibold text-sm">Yes</span>
                </label>
                <label className={`flex-1 flex items-center justify-center p-3 border-2 rounded-xl cursor-pointer transition-all ${
                  formData.pesticideUsed === 'none' ? 'border-orange-600 bg-orange-100' : 'border-gray-300'
                }`}>
                  <input
                    type="radio"
                    name="pesticideUsed"
                    value="none"
                    checked={formData.pesticideUsed === 'none'}
                    onChange={(e) => setFormData({ ...formData, pesticideUsed: e.target.value })}
                    className="sr-only"
                  />
                  <span className="font-semibold text-sm">None</span>
                </label>
              </div>
            </div>

            {formData.pesticideUsed === 'yes' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Pesticide Type *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Malathion, Neem Oil"
                    value={formData.pesticideType}
                    onChange={(e) => setFormData({ ...formData, pesticideType: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required={formData.pesticideUsed === 'yes'}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Amount Used (liters/kg) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="0.0"
                    value={formData.pesticideAmount}
                    onChange={(e) => setFormData({ ...formData, pesticideAmount: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required={formData.pesticideUsed === 'yes'}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-blue-900 font-semibold mb-1">Complete Traceability</p>
                <p className="text-sm text-blue-800">
                  Recording fertilizer and pesticide use ensures full transparency and builds buyer trust. This batch cannot be edited after creation.
                </p>
              </div>
            </div>
          </div>

          {/* Marketplace Listing Section */}
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
              <Package className="w-5 h-5 mr-2 text-purple-600" />
              List for Sale
            </h3>
            
            <div className="space-y-3">
              {/* Price per kg */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Price per kg ($) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="Enter your selling price"
                  value={formData.pricePerKg}
                  onChange={(e) => setFormData({ ...formData, pricePerKg: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              {/* Minimum Order */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Minimum Order (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="Minimum order quantity"
                  value={formData.minimumOrder}
                  onChange={(e) => setFormData({ ...formData, minimumOrder: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Available Until */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Available Until
                </label>
                <input
                  type="date"
                  value={formData.availableUntil}
                  onChange={(e) => setFormData({ ...formData, availableUntil: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Delivery Options */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Delivery Options
                </label>
                <div className="space-y-2">
                  <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={formData.deliveryFarmPickup}
                      onChange={(e) => setFormData({ ...formData, deliveryFarmPickup: e.target.checked })}
                      className="w-4 h-4 text-purple-600 focus:ring-purple-500 rounded"
                    />
                    <span className="ml-3 text-sm text-gray-900">Farm Pickup</span>
                  </label>
                  <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={formData.deliveryAvailable}
                      onChange={(e) => setFormData({ ...formData, deliveryAvailable: e.target.checked })}
                      className="w-4 h-4 text-purple-600 focus:ring-purple-500 rounded"
                    />
                    <span className="ml-3 text-sm text-gray-900">Delivery Available</span>
                  </label>
                  <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={formData.deliveryAggregation}
                      onChange={(e) => setFormData({ ...formData, deliveryAggregation: e.target.checked })}
                      className="w-4 h-4 text-purple-600 focus:ring-purple-500 rounded"
                    />
                    <span className="ml-3 text-sm text-gray-900">Aggregation Center</span>
                  </label>
                </div>
              </div>

              {/* Payment Terms */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Payment Terms
                </label>
                <select
                  value={formData.paymentTerms}
                  onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="cash_on_delivery">Cash on Delivery</option>
                  <option value="cash_on_pickup">Cash on Pickup</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="mobile_money">Mobile Money</option>
                  <option value="negotiable">Negotiable</option>
                </select>
              </div>

              {/* Special Notes */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Special Notes
                </label>
                <textarea
                  value={formData.specialNotes}
                  onChange={(e) => setFormData({ ...formData, specialNotes: e.target.value })}
                  placeholder="Any special conditions, certifications, or notes for buyers..."
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#2d5f3f] text-white rounded-xl py-4 font-semibold text-lg shadow-md hover:bg-[#234a32] transition-colors mt-8"
          >
            Create Batch with Production Log
          </button>
        </form>
      </div>
    </div>
  );
}