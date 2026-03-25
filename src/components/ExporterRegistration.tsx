import React, { useState } from 'react';
import { Building2, MapPin, Globe, Award, FileText, Calendar, ArrowRight, ArrowLeft, Navigation, CheckCircle, User, Mail, Phone } from 'lucide-react';

interface ExporterRegistrationProps {
  phoneNumber: string;
  onComplete: () => void;
  onBack: () => void;
}

export function ExporterRegistration({ phoneNumber, onComplete, onBack }: ExporterRegistrationProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    businessName: '',
    county: '',
    exportMarkets: [] as string[],
    certificationType: '',
    certificationId: '',
    certificationExpiry: '',
    exportLicenseNumber: '',
    packhouseRequired: true,
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

  const exportMarkets = [
    'European Union', 'United Kingdom', 'United States', 'Middle East',
    'Asia Pacific', 'East Africa', 'Southern Africa', 'North Africa'
  ];

  const certificationTypes = [
    'GlobalGAP',
    'Organic (EU)',
    'Organic (USDA)',
    'Fair Trade',
    'Rainforest Alliance',
    'HACCP',
  ];

  const toggleMarket = (market: string) => {
    setFormData({
      ...formData,
      exportMarkets: formData.exportMarkets.includes(market)
        ? formData.exportMarkets.filter(m => m !== market)
        : [...formData.exportMarkets, market]
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const buyerProfile = {
      buyerId: `BUY-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      buyerType: 'exporter',
      ...formData,
      phoneNumber,
      createdAt: new Date().toISOString(),
      immutable: true,
    };
    
    console.log('Exporter profile created:', buyerProfile);
    onComplete();
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
        <h1 className="text-xl font-bold text-gray-900 mb-1">Exporter Registration</h1>
        <p className="text-sm text-gray-600">Complete your export business profile</p>
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

          {/* Export Markets */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Globe className="w-4 h-4 inline mr-1" />
              Export Markets * (Select all that apply)
            </label>
            <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-300 rounded-xl p-3">
              {exportMarkets.map((market) => (
                <label
                  key={market}
                  className="flex items-center p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={formData.exportMarkets.includes(market)}
                    onChange={() => toggleMarket(market)}
                    className="w-4 h-4 text-[#2d5f3f] focus:ring-[#2d5f3f] rounded"
                  />
                  <span className="ml-3 text-sm text-gray-900">{market}</span>
                </label>
              ))}
            </div>
            {formData.exportMarkets.length === 0 && (
              <p className="text-xs text-red-600 mt-1">Please select at least one export market</p>
            )}
          </div>

          {/* Certification Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Award className="w-4 h-4 inline mr-1" />
              Certification Type *
            </label>
            <select
              value={formData.certificationType}
              onChange={(e) => setFormData({ ...formData, certificationType: e.target.value })}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2d5f3f]"
              required
            >
              <option value="">Select certification</option>
              {certificationTypes.map((cert) => (
                <option key={cert} value={cert}>{cert}</option>
              ))}
            </select>
          </div>

          {/* Certification ID */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <FileText className="w-4 h-4 inline mr-1" />
              Certification ID *
            </label>
            <input
              type="text"
              placeholder="Enter certification ID"
              value={formData.certificationId}
              onChange={(e) => setFormData({ ...formData, certificationId: e.target.value })}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2d5f3f]"
              required
            />
          </div>

          {/* Certification Expiry */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              Certification Expiry Date *
            </label>
            <input
              type="date"
              value={formData.certificationExpiry}
              onChange={(e) => setFormData({ ...formData, certificationExpiry: e.target.value })}
              min={new Date().toISOString().split('T')[0]}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2d5f3f]"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Must be a future date</p>
          </div>

          {/* Export License Number */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Export License Number *
            </label>
            <input
              type="text"
              placeholder="Enter export license number"
              value={formData.exportLicenseNumber}
              onChange={(e) => setFormData({ ...formData, exportLicenseNumber: e.target.value })}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2d5f3f]"
              required
            />
          </div>

          {/* Packhouse Required */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.packhouseRequired}
                onChange={(e) => setFormData({ ...formData, packhouseRequired: e.target.checked })}
                className="w-5 h-5 text-[#2d5f3f] focus:ring-[#2d5f3f] rounded"
              />
              <span className="ml-3 text-sm font-semibold text-gray-900">Packhouse Required</span>
            </label>
            <p className="text-xs text-gray-600 mt-2 ml-8">
              Check if you require produce to be processed through a certified packhouse
            </p>
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
          <div className="flex justify-between">
            <button
              type="button"
              onClick={onBack}
              className="w-full bg-gray-300 text-gray-900 rounded-xl py-4 font-semibold text-lg flex items-center justify-center space-x-2 shadow-md hover:bg-gray-400 transition-colors mt-8"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
            <button
              type="submit"
              disabled={formData.exportMarkets.length === 0}
              className="w-full bg-[#2d5f3f] text-white rounded-xl py-4 font-semibold text-lg flex items-center justify-center space-x-2 shadow-md hover:bg-[#234a32] transition-colors mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>Complete Registration</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}