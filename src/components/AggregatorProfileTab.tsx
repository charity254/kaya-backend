// Profile Tab
import React from 'react';
import { User, Store, MapPin } from 'lucide-react';

export function ProfileTab({ onBack, profile }: any) {
  const facilityName = profile?.facilityName || 'Central Collection Hub';
  const areaName = profile?.areaName || 'Main Area';
  const county = profile?.county || 'Nairobi County';

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
          <span className="text-gray-900 font-semibold">Edit Facility Profile</span>
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