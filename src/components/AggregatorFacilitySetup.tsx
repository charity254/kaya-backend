import React, { useState } from 'react';
import { Building2, MapPin, Navigation, ArrowRight, CheckCircle, ArrowLeft } from 'lucide-react';

interface AggregatorFacilitySetupProps {
  phoneNumber: string;
  onComplete: (profileData: any) => void;
  onBack: () => void;
}

export function AggregatorFacilitySetup({ phoneNumber, onComplete, onBack }: AggregatorFacilitySetupProps) {
  const [gpsStatus, setGpsStatus] = useState<'idle' | 'getting' | 'success'>('idle');
  const [formData, setFormData] = useState({
    facilityName: '',
    areaName: '',
    county: '',
    latitude: '',
    longitude: '',
  });

  const kenyanCounties = [
    'Baringo', 'Bomet', 'Bungoma', 'Busia', 'Elgeyo-Marakwet', 'Embu', 'Garissa',
    'Homa Bay', 'Isiolo', 'Kajiado', 'Kakamega', 'Kericho', 'Kiambu', 'Kilifi',
    'Kirinyaga', 'Kisii', 'Kisumu', 'Kitui', 'Kwale', 'Laikipia', 'Lamu', 'Machakos',
    'Makueni', 'Mandera', 'Marsabit', 'Meru', 'Migori', 'Mombasa', 'Murang\'a',
    'Nairobi', 'Nakuru', 'Nandi', 'Narok', 'Nyamira', 'Nyandarua', 'Nyeri',
    'Samburu', 'Siaya', 'Taita-Taveta', 'Tana River', 'Tharaka-Nithi', 'Trans-Nzoia',
    'Turkana', 'Uasin Gishu', 'Vihiga', 'Wajir', 'West Pokot'
  ];

  const handleGetGPS = () => {
    setGpsStatus('getting');
    
    setTimeout(() => {
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
    
    // Generate unique facility_id
    const facilityId = `FAC-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    
    const facilityData = {
      facilityId,
      ...formData,
      phoneNumber,
      role: 'aggregator',
      createdAt: new Date().toISOString(),
    };
    
    console.log('Facility created:', facilityData);
    onComplete(formData);
  };

  return (
    <div className="min-h-screen bg-[#fafaf8] flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-6">
        <button onClick={onBack} className="p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors mb-4">
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-xl font-bold text-gray-900 mb-1">Facility Setup</h1>
        <p className="text-sm text-gray-600">Register your collection facility</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
        <div className="max-w-md mx-auto space-y-8">
          
          {/* Facility Details Section */}
          <section className="space-y-5">
             <h2 className="text-lg font-semibold text-gray-900 flex items-center border-b border-gray-200 pb-2">
              <Building2 className="w-5 h-5 mr-2 text-[#e8915f]" />
              Facility Details
            </h2>

            {/* Facility Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Facility Name *
              </label>
              <input
                type="text"
                placeholder="e.g., Central Collection Hub"
                value={formData.facilityName}
                onChange={(e) => setFormData({ ...formData, facilityName: e.target.value })}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#e8915f]"
                required
              />
            </div>

            {/* Collection Center Area Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Collection Center Area Name *
              </label>
              <input
                type="text"
                placeholder="e.g., Kinoo Center"
                value={formData.areaName}
                onChange={(e) => setFormData({ ...formData, areaName: e.target.value })}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#e8915f]"
                required
              />
            </div>

            {/* County */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                County *
              </label>
              <select
                value={formData.county}
                onChange={(e) => setFormData({ ...formData, county: e.target.value })}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#e8915f]"
                required
              >
                <option value="">Select county</option>
                {kenyanCounties.map((county) => (
                  <option key={county} value={county}>{county}</option>
                ))}
              </select>
            </div>

            {/* GPS Coordinates */}
            <div className="bg-white rounded-xl border-2 border-[#e8915f]/20 p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900 flex items-center">
                  <Navigation className="w-5 h-5 mr-2 text-[#e8915f]" />
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
                  className="w-full bg-[#e8915f] text-white rounded-xl py-3 font-semibold flex items-center justify-center space-x-2 hover:bg-[#d67d4a] transition-colors"
                >
                  <MapPin className="w-5 h-5" />
                  <span>Get Current Location</span>
                </button>
              )}

              {gpsStatus === 'getting' && (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#e8915f] mx-auto mb-2" />
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
                    className="w-full text-[#e8915f] text-sm font-semibold py-2"
                  >
                    Update Location
                  </button>
                </div>
              )}
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm text-blue-900">
                <strong>Note:</strong> Your facility location helps track the movement of produce through the supply chain and builds buyer confidence.
              </p>
            </div>
          </section>

          {/* Submit Button */}
          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={onBack}
              className="w-full bg-gray-200 text-gray-900 rounded-xl py-4 font-semibold text-lg flex items-center justify-center space-x-2 shadow-md hover:bg-gray-300 transition-colors mr-4"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
            <button
              type="submit"
              disabled={gpsStatus !== 'success'}
              className="w-full bg-[#e8915f] text-white rounded-xl py-4 font-semibold text-lg flex items-center justify-center space-x-2 shadow-md hover:bg-[#d67d4a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>Complete Setup</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
