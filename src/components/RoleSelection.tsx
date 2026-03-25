import React from 'react';
import { Sprout, Package, ShoppingBag, ArrowLeft } from 'lucide-react';

interface RoleSelectionProps {
  onSelectRole: (role: 'farmer' | 'aggregator' | 'buyer') => void;
  onBack: () => void;
}

export function RoleSelection({ onSelectRole, onBack }: RoleSelectionProps) {
  return (
    <div className="min-h-screen bg-[#fafaf8] flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-6 pb-8">
        <button onClick={onBack} className="p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors mb-4">
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <div className="flex items-center justify-center mb-2">
          <Sprout className="w-8 h-8 text-[#2d5f3f]" />
          <span className="ml-2 text-2xl font-bold text-[#2d5f3f]">Kilimo Trace</span>
        </div>
        <p className="text-center text-gray-600 text-sm">Select your role to continue</p>
      </div>

      {/* Role Cards */}
      <div className="flex-1 p-6 flex flex-col justify-center space-y-4 max-w-md mx-auto w-full">
        {/* Farmer */}
        <button
          onClick={() => onSelectRole('farmer')}
          className="bg-white rounded-2xl p-6 shadow-sm border-2 border-transparent hover:border-[#2d5f3f] transition-all active:scale-98"
        >
          <div className="flex items-start space-x-4">
            <div className="bg-[#2d5f3f] rounded-xl p-3 flex-shrink-0">
              <Sprout className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-semibold text-lg text-gray-900 mb-1">Farmer</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Record your harvests and track your produce from field to sale
              </p>
            </div>
          </div>
        </button>

        {/* Aggregator */}
        <button
          onClick={() => onSelectRole('aggregator')}
          className="bg-white rounded-2xl p-6 shadow-sm border-2 border-transparent hover:border-[#e8915f] transition-all active:scale-98"
        >
          <div className="flex items-start space-x-4">
            <div className="bg-[#e8915f] rounded-xl p-3 flex-shrink-0">
              <Package className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-semibold text-lg text-gray-900 mb-1">Aggregator</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Manage produce intake and coordinate supply to buyers
              </p>
            </div>
          </div>
        </button>

        {/* Buyer */}
        <button
          onClick={() => onSelectRole('buyer')}
          className="bg-white rounded-2xl p-6 shadow-sm border-2 border-transparent hover:border-[#2d5f3f] transition-all active:scale-98"
        >
          <div className="flex items-start space-x-4">
            <div className="bg-[#2d5f3f] rounded-xl p-3 flex-shrink-0">
              <ShoppingBag className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-semibold text-lg text-gray-900 mb-1">Buyer</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Purchase traceable produce with full transparency
              </p>
            </div>
          </div>
        </button>
      </div>

      {/* Footer note */}
      <div className="p-6 text-center text-sm text-gray-500">
        Building trust from farm to market
      </div>
    </div>
  );
}