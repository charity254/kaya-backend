import React, { useState } from 'react';
import { MapPin, Navigation, Layers, ArrowRight, CheckCircle, ArrowLeft } from 'lucide-react';

interface FarmMappingProps {
  onComplete: () => void;
  onBack: () => void;
}

export function FarmMapping({ onComplete, onBack }: FarmMappingProps) {
  const [gpsStatus, setGpsStatus] = useState<'idle' | 'getting' | 'success'>('idle');
  const [formData, setFormData] = useState({
    latitude: '',
    longitude: '',
    farmSize: '',
    primaryCrop: '',
  });

  const crops = [
    'Maize', 'Beans', 'Potatoes', 'Tomatoes', 'Cabbage', 'Kale (Sukuma Wiki)',
    'Carrots', 'Onions', 'Wheat', 'Rice', 'Coffee', 'Tea', 'Bananas', 'Mangoes',
    'Avocados', 'Cassava', 'Sweet Potatoes'
  ];

  const handleGetGPS = () => {
    setGpsStatus('getting');
    
    // Simulate GPS acquisition - use demo coordinates for testing
    setTimeout(() => {
      // Sample coordinates in Kenya (Nairobi area)
      const demoCoordinates = {
        latitude: '-1.286389',
        longitude: '36.817223',
      };
      
      setFormData({
        ...formData,
        ...demoCoordinates,
      });
      setGpsStatus('success');
    }, 1500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Generate unique farm_id
    const farmId = `FARM-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    
    const farmData = {
      farmId,
      ...formData,
      createdAt: new Date().toISOString(),
      verified: true,
    };
    
    console.log('Farm registered:', farmData);
    onComplete();
  };

  return (
    <div className="min-h-screen bg-[#fafaf8] flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-6">
        <button onClick={onBack} className="p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors mb-4">
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-xl font-bold text-gray-900 mb-1">Map Your Farm</h1>
        <p className="text-sm text-gray-600">Record your farm location and details</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
        <div className="max-w-md mx-auto space-y-5">
          {/* GPS Coordinates */}
          <div className="bg-white rounded-xl border-2 border-[#2d5f3f]/20 p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900 flex items-center">
                <Navigation className="w-5 h-5 mr-2 text-[#2d5f3f]" />
                GPS Location
              </h3>
              {gpsStatus === 'success' && (
                <CheckCircle className="w-5 h-5 text-green-600" />
              )}
            </div>

            {gpsStatus === 'idle' && (
              <button
                type="button"
                onClick={handleGetGPS}
                className="w-full bg-[#2d5f3f] text-white rounded-xl py-3 font-semibold flex items-center justify-center space-x-2 hover:bg-[#234a32] transition-colors"
              >
                <MapPin className="w-5 h-5" />
                <span>Get Current Location</span>
              </button>
            )}

            {gpsStatus === 'getting' && (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2d5f3f] mx-auto mb-2" />
                <p className="text-sm text-gray-600">Getting GPS coordinates...</p>
              </div>
            )}

            {gpsStatus === 'success' && (
              <div className="space-y-3">
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-xs text-green-700 font-semibold mb-1">Location captured successfully</p>
                  <p className="text-xs text-gray-600 mb-1">Latitude: {formData.latitude}</p>
                  <p className="text-xs text-gray-600">Longitude: {formData.longitude}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setGpsStatus('idle')}
                  className="w-full text-[#2d5f3f] text-sm font-semibold py-2"
                >
                  Update Location
                </button>
              </div>
            )}
          </div>

          {/* Farm Size */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Layers className="w-4 h-4 inline mr-1" />
              Farm Size (acres) *
            </label>
            <input
              type="number"
              step="0.1"
              placeholder="e.g., 2.5"
              value={formData.farmSize}
              onChange={(e) => setFormData({ ...formData, farmSize: e.target.value })}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2d5f3f]"
              required
            />
          </div>

          {/* Primary Crop */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Primary Crop Type *
            </label>
            <select
              value={formData.primaryCrop}
              onChange={(e) => setFormData({ ...formData, primaryCrop: e.target.value })}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2d5f3f]"
              required
            >
              <option value="">Select primary crop</option>
              {crops.map((crop) => (
                <option key={crop} value={crop}>{crop}</option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">Choose the main crop you grow</p>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-sm text-blue-900">
              <strong>Note:</strong> This information helps buyers understand your farm and builds trust in your produce. Your GPS location verifies that your farm is located in Kenya.
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={gpsStatus !== 'success'}
            className="w-full bg-[#2d5f3f] text-white rounded-xl py-4 font-semibold text-lg flex items-center justify-center space-x-2 shadow-md hover:bg-[#234a32] transition-colors mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>Complete Setup</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}