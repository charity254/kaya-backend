import React, { useState } from 'react';
import { User, MapPin, Globe, ArrowRight, ArrowLeft, Mail, Phone } from 'lucide-react';

interface FarmerProfileSetupProps {
  phoneNumber: string;
  onComplete: () => void;
  onBack: () => void;
}

export function FarmerProfileSetup({ phoneNumber, onComplete, onBack }: FarmerProfileSetupProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    county: '',
    subCounty: '',
    language: 'English',
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Store profile data with timestamp
    const profileData = {
      ...formData,
      phoneNumber,
      role: 'farmer',
      createdAt: new Date().toISOString(),
    };
    console.log('Farmer profile created:', profileData);
    onComplete();
  };

  return (
    <div className="min-h-screen bg-[#fafaf8] flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-6">
        <button onClick={onBack} className="p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors mb-4">
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-xl font-bold text-gray-900 mb-1">Create Your Profile</h1>
        <p className="text-sm text-gray-600">Tell us about yourself</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
        <div className="max-w-md mx-auto space-y-5">
          {/* Names */}
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
                placeholder="Mwangi"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2d5f3f]"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Mail className="w-4 h-4 inline mr-1" />
              Email Address *
            </label>
            <input
              type="email"
              placeholder="john.mwangi@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2d5f3f]"
              required
            />
          </div>

          {/* Phone Number (Read-only) */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Phone className="w-4 h-4 inline mr-1" />
              Phone Number
            </label>
            <input
              type="text"
              value={`+254${phoneNumber}`}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-500 bg-gray-50"
              readOnly
            />
            <p className="text-xs text-gray-500 mt-1">Verified phone number</p>
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

          {/* Sub-County */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Sub-County *
            </label>
            <input
              type="text"
              placeholder="Enter sub-county"
              value={formData.subCounty}
              onChange={(e) => setFormData({ ...formData, subCounty: e.target.value })}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2d5f3f]"
              required
            />
          </div>

          {/* Language */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Globe className="w-4 h-4 inline mr-1" />
              Preferred Language *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, language: 'English' })}
                className={`border-2 rounded-xl px-4 py-3 font-semibold transition-all ${
                  formData.language === 'English'
                    ? 'border-[#2d5f3f] bg-[#2d5f3f]/5 text-[#2d5f3f]'
                    : 'border-gray-300 text-gray-700 hover:border-gray-400'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, language: 'Kiswahili' })}
                className={`border-2 rounded-xl px-4 py-3 font-semibold transition-all ${
                  formData.language === 'Kiswahili'
                    ? 'border-[#2d5f3f] bg-[#2d5f3f]/5 text-[#2d5f3f]'
                    : 'border-gray-300 text-gray-700 hover:border-gray-400'
                }`}
              >
                Kiswahili
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#2d5f3f] text-white rounded-xl py-4 font-semibold text-lg flex items-center justify-center space-x-2 shadow-md hover:bg-[#234a32] transition-colors mt-8"
          >
            <span>Continue</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}
