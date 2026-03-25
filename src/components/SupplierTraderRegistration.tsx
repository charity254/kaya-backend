import React, { useState } from 'react';
import { Building2, MapPin, TrendingUp, Package, ArrowRight, Navigation, CheckCircle, User, Mail, Phone, ArrowLeft } from 'lucide-react';

interface SupplierTraderRegistrationProps {
  phoneNumber: string;
  onComplete: () => void;
  onBack: () => void;
}

export function SupplierTraderRegistration({ phoneNumber, onComplete, onBack }: SupplierTraderRegistrationProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    businessName: '',
    county: '',
    endMarketType: '',
    averageWeeklyVolume: '',
    preferredCrops: [] as string[],
    deliveryLocation: {
      latitude: null as number | null,
      longitude: null as number | null,
      address: '',
    },
  });
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationCaptured, setLocationCaptured] = useState(false);

  const kenyanCounties = [
    'Baringo', 'Bomet', 'Bungoma', 'Busia', 'Elgeyo-Marakwet', 'Embu', 'Garissa',
    'Homa Bay', 'Isiolo', 'Kajiado', 'Kakamega', 'Kericho', 'Kiambu', 'Kilifi',
    'Kirinyaga', 'Kisii', 'Kisumu', 'Kitui', 'Kwale', 'Laikipia', 'Lamu', 'Machakos',
    'Makueni', 'Mandera', 'Marsabit', 'Meru', 'Migori', 'Mombasa', 'Murang\'a',
    'Nairobi', 'Nakuru', 'Nandi', 'Narok', 'Nyamira', 'Nyandarua', 'Nyeri',
    'Samburu', 'Siaya', 'Taita-Taveta', 'Tana River', 'Tharaka-Nithi', 'Trans-Nzoia',
    'Turkana', 'Uasin Gishu', 'Vihiga', 'Wajir', 'West Pokot'
  ];

  const marketTypes = [
    { value: 'local', label: 'Local Market' },
    { value: 'wholesale', label: 'Wholesale' },
    { value: 'retail', label: 'Retail' },
    { value: 'institutional', label: 'Institutional (Schools, Hospitals)' },
  ];

  const crops = ['Tomatoes', 'Cabbage', 'Carrots', 'Onions', 'Potatoes', 'Maize', 'Beans'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const buyerProfile = {
      buyerId: `BUY-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      buyerType: 'supplier_trader',
      ...formData,
      phoneNumber,
      createdAt: new Date().toISOString(),
      immutable: true,
    };
    
    console.log('Buyer profile created:', buyerProfile);
    onComplete();
  };

  const toggleCrop = (crop: string) => {
    setFormData({
      ...formData,
      preferredCrops: formData.preferredCrops.includes(crop)
        ? formData.preferredCrops.filter(c => c !== crop)
        : [...formData.preferredCrops, crop]
    });
  };

  const captureLocation = async () => {
    setLocationLoading(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            deliveryLocation: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              address: `${formData.county || 'Kenya'}`,
            },
          });
          setLocationCaptured(true);
          setLocationLoading(false);
        },
        (error) => {
          console.error('Error obtaining location:', error.message);
          // Fallback: Use demo coordinates for Nairobi if geolocation fails
          setFormData({
            ...formData,
            deliveryLocation: {
              latitude: -1.286389,
              longitude: 36.817223,
              address: `${formData.county || 'Nairobi'}, Kenya`,
            },
          });
          setLocationCaptured(true);
          setLocationLoading(false);
          alert('Using demo location. In production, please enable location services.');
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      // Fallback: Use demo coordinates
      setFormData({
        ...formData,
        deliveryLocation: {
          latitude: -1.286389,
          longitude: 36.817223,
          address: `${formData.county || 'Nairobi'}, Kenya`,
        },
      });
      setLocationCaptured(true);
      setLocationLoading(false);
      alert('Geolocation not supported. Using demo location.');
    }
  };

  return (
    <div className="min-h-screen bg-[#fafaf8] flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-6">
        <h1 className="text-xl font-bold text-gray-900 mb-1">Supplier / Trader Registration</h1>
        <p className="text-sm text-gray-600">Complete your business profile</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
        <div className="max-w-md mx-auto space-y-5">
          {/* Personal Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-1" />
                First Name *
              </label>
              <input
                type="text"
                placeholder="John"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2d5f3f]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Last Name *
              </label>
              <input
                type="text"
                placeholder="Doe"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2d5f3f]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Mail className="w-4 h-4 inline mr-1" />
              Email Address *
            </label>
            <input
              type="email"
              placeholder="john.doe@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2d5f3f]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Phone className="w-4 h-4 inline mr-1" />
              Phone Number
            </label>
            <input
              type="text"
              value={`+254${phoneNumber}`}
              disabled
              className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 text-gray-500 cursor-not-allowed"
            />
          </div>

          {/* Business Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Building2 className="w-4 h-4 inline mr-1" />
              Business Name *
            </label>
            <input
              type="text"
              placeholder="Enter your business name"
              value={formData.businessName}
              onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2d5f3f]"
              required
            />
          </div>

          {/* County */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <MapPin className="w-4 h-4 inline mr-1" />
              County *
            </label>
            <select
              value={formData.county}
              onChange={(e) => setFormData({ ...formData, county: e.target.value })}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2d5f3f]"
              required
            >
              <option value="">Select county</option>
              {kenyanCounties.map((county) => (
                <option key={county} value={county}>{county}</option>
              ))}
            </select>
          </div>

          {/* End Market Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <TrendingUp className="w-4 h-4 inline mr-1" />
              End Market Type *
            </label>
            <div className="space-y-2">
              {marketTypes.map((market) => (
                <label
                  key={market.value}
                  className={`flex items-center p-3 border-2 rounded-xl cursor-pointer transition-all ${
                    formData.endMarketType === market.value
                      ? 'border-[#2d5f3f] bg-[#2d5f3f]/5'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <input
                    type="radio"
                    name="endMarketType"
                    value={market.value}
                    checked={formData.endMarketType === market.value}
                    onChange={(e) => setFormData({ ...formData, endMarketType: e.target.value })}
                    className="w-4 h-4 text-[#2d5f3f] focus:ring-[#2d5f3f]"
                    required
                  />
                  <span className="ml-3 text-sm font-medium text-gray-900">{market.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Average Weekly Volume */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Package className="w-4 h-4 inline mr-1" />
              Average Weekly Volume (kg) *
            </label>
            <input
              type="number"
              step="0.1"
              placeholder="e.g., 500"
              value={formData.averageWeeklyVolume}
              onChange={(e) => setFormData({ ...formData, averageWeeklyVolume: e.target.value })}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2d5f3f]"
              required
            />
          </div>

          {/* Preferred Crops (Optional) */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Preferred Crops (Optional)
            </label>
            <div className="flex flex-wrap gap-2">
              {crops.map((crop) => (
                <button
                  key={crop}
                  type="button"
                  onClick={() => toggleCrop(crop)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    formData.preferredCrops.includes(crop)
                      ? 'bg-[#2d5f3f] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {crop}
                </button>
              ))}
            </div>
          </div>

          {/* Delivery Location */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Navigation className="w-4 h-4 inline mr-1" />
              Default Delivery Location *
            </label>
            <button
              type="button"
              onClick={captureLocation}
              disabled={locationLoading}
              className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl border-2 transition-all ${
                locationCaptured
                  ? 'border-[#2d5f3f] bg-green-50 text-[#2d5f3f]'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
              } ${locationLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {locationLoading ? (
                <>
                  <Navigation className="w-5 h-5 animate-pulse" />
                  <span>Capturing Location...</span>
                </>
              ) : locationCaptured ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-semibold">Location Captured</span>
                </>
              ) : (
                <>
                  <Navigation className="w-5 h-5" />
                  <span>Capture GPS Location</span>
                </>
              )}
            </button>
            
            {locationCaptured && (
              <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-xs text-green-800 font-mono">
                  📍 Lat: {formData.deliveryLocation.latitude?.toFixed(6)}, Lon: {formData.deliveryLocation.longitude?.toFixed(6)}
                </p>
              </div>
            )}
            
            <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-800">
                <strong>Note:</strong> This GPS location will be used as your default delivery address for produce orders. 
                You can change this location later in your profile settings.
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#2d5f3f] text-white rounded-xl py-4 font-semibold text-lg flex items-center justify-center space-x-2 shadow-md hover:bg-[#234a32] transition-colors mt-8"
          >
            <span>Complete Registration</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}