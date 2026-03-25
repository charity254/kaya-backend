import React from 'react';
import { ArrowLeft, MapPin, Calendar, Sprout, Package, TrendingUp, CheckCircle } from 'lucide-react';

interface ProduceDetailsProps {
  produce: any;
  onBack: () => void;
  onOrder: () => void;
}

export function ProduceDetails({ produce, onBack, onOrder }: ProduceDetailsProps) {
  const traceSteps = [
    { stage: 'Harvested', date: 'Jan 20, 2026', location: 'Kiambu County, Field A', actor: 'John Mwangi (Farmer)', icon: Sprout },
    { stage: 'Verified', date: 'Jan 20, 2026', location: 'Central Collection Hub', actor: 'Verified by Aggregator', icon: CheckCircle },
    { stage: 'Available', date: 'Jan 21, 2026', location: 'Ready for Purchase', actor: 'Listed on Market', icon: Package },
  ];

  return (
    <div className="min-h-screen bg-[#fafaf8] flex flex-col">
      {/* Header */}
      <div className="bg-[#2d5f3f] text-white p-6">
        <button onClick={onBack} className="p-2 -ml-2 hover:bg-white/10 rounded-lg transition-colors mb-4">
          <ArrowLeft className="w-6 h-6" />
        </button>

        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h1 className="text-2xl font-bold">{produce.crop}</h1>
              <CheckCircle className="w-5 h-5" />
            </div>
            <p className="text-white/80 text-sm">Batch ID: {produce.id}</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold">{produce.price}</p>
            <p className="text-sm text-white/80">{produce.quality}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Quick Info */}
        <div className="bg-white p-6 border-b border-gray-200">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-600 mb-1">Quantity</p>
              <p className="font-semibold text-gray-900">{produce.quantity}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">Harvest Date</p>
              <p className="font-semibold text-gray-900">{produce.harvestDate}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">Location</p>
              <p className="font-semibold text-gray-900">{produce.location}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">Farmer</p>
              <p className="font-semibold text-gray-900">{produce.farmer}</p>
            </div>
          </div>
        </div>

        {/* Traceability Timeline */}
        <div className="p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Traceability Journey</h2>
          
          <div className="relative">
            {traceSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="relative pb-8 last:pb-0">
                  {/* Connecting Line */}
                  {index < traceSteps.length - 1 && (
                    <div className="absolute left-5 top-12 w-0.5 h-full bg-[#2d5f3f]/20" />
                  )}
                  
                  <div className="flex items-start space-x-4">
                    {/* Icon */}
                    <div className="relative z-10 bg-[#2d5f3f] rounded-full p-2 flex-shrink-0">
                      <Icon className="w-6 h-6 text-white" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 bg-white rounded-xl p-4 shadow-sm">
                      <h3 className="font-semibold text-gray-900 mb-1">{step.stage}</h3>
                      <p className="text-sm text-gray-600 mb-2">{step.actor}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <div className="flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          <span>{step.location}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          <span>{step.date}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quality Info */}
        <div className="px-6 pb-6">
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-green-900 mb-1">Verified Quality</h3>
                <p className="text-sm text-green-800">
                  This produce has been inspected and verified by certified aggregators. 
                  Full traceability from farm to market is guaranteed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Purchase Button */}
      <div className="bg-white border-t border-gray-200 p-6">
        <button className="w-full bg-[#2d5f3f] text-white rounded-xl py-4 font-semibold text-lg shadow-md hover:bg-[#234a32] transition-colors" onClick={onOrder}>
          Purchase {produce.quantity}
        </button>
        <p className="text-center text-xs text-gray-500 mt-2">
          Secure transaction with full traceability
        </p>
      </div>
    </div>
  );
}