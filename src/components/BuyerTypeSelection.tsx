import React from 'react';
import { ShoppingBag, Truck, Globe, ArrowLeft } from 'lucide-react';

interface BuyerTypeSelectionProps {
  onSelectType: (type: 'supplier_trader' | 'exporter') => void;
  onBack: () => void;
}

export function BuyerTypeSelection({ onSelectType, onBack }: BuyerTypeSelectionProps) {
  return (
    <div className="min-h-screen bg-[#fafaf8] flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-6">
        <button onClick={onBack} className="p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors mb-4">
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <div className="flex items-center justify-center mb-2">
          <ShoppingBag className="w-8 h-8 text-[#2d5f3f]" />
          <span className="ml-2 text-2xl font-bold text-[#2d5f3f]">Kilimo Trace</span>
        </div>
        <h1 className="text-xl font-bold text-gray-900 text-center mb-1">Buyer Registration</h1>
        <p className="text-sm text-gray-600 text-center">Select your business type</p>
      </div>

      {/* Type Selection */}
      <div className="flex-1 p-6 flex flex-col justify-center">
        <div className="max-w-md mx-auto w-full space-y-4">
          {/* Supplier / Trader */}
          <button
            onClick={() => onSelectType('supplier_trader')}
            className="w-full bg-white rounded-2xl p-6 shadow-sm border-2 border-transparent hover:border-[#2d5f3f] transition-all active:scale-98"
          >
            <div className="flex items-start space-x-4">
              <div className="bg-[#2d5f3f] rounded-xl p-4 flex-shrink-0">
                <ShoppingBag className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-semibold text-lg text-gray-900 mb-2">Supplier / Trader</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-3">
                  For local traders, wholesalers, retailers, and institutional buyers
                </p>
                <ul className="text-xs text-gray-500 space-y-1">
                  <li>• Local and domestic markets</li>
                  <li>• Direct sourcing from farmers</li>
                  <li>• Wholesale and retail distribution</li>
                </ul>
              </div>
            </div>
          </button>

          {/* Exporter */}
          <button
            onClick={() => onSelectType('exporter')}
            className="w-full bg-white rounded-2xl p-6 shadow-sm border-2 border-transparent hover:border-[#e8915f] transition-all active:scale-98"
          >
            <div className="flex items-start space-x-4">
              <div className="bg-[#e8915f] rounded-xl p-4 flex-shrink-0">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-semibold text-lg text-gray-900 mb-2">Exporter</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-3">
                  For businesses exporting produce to international markets
                </p>
                <ul className="text-xs text-gray-500 space-y-1">
                  <li>• International export markets</li>
                  <li>• Certification requirements</li>
                  <li>• Packhouse facilities</li>
                </ul>
              </div>
            </div>
          </button>
        </div>

        <div className="mt-6 text-center text-xs text-gray-500 max-w-md mx-auto">
          <p className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <strong>Note:</strong> Your buyer type is permanent and cannot be changed after registration.
          </p>
        </div>
      </div>
    </div>
  );
}