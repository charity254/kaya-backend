import React, { useState } from 'react';
import { MapPin, Package, Navigation, Sprout, X, CheckCircle, AlertCircle } from 'lucide-react';

interface CropRequirement {
  crop: string;
  minimumQuantity?: string;
  acceptedCondition: string;
}

interface AggregationPoint {
  id: string;
  name: string;
  location: string;
  distance: string;
  travelTime: string;
  coordinates: { x: number; y: number; lat: number; lng: number };
  acceptingCrops: string[];
  capacity: string;
  contact: string;
  cropRequirements: CropRequirement[];
  notes: string[];
}

export function FarmerTraceabilityMap() {
  const [hoveredPoint, setHoveredPoint] = useState<string | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<AggregationPoint | null>(null);

  // Farmer's location (center)
  const farmerLocation = {
    name: 'My Farm',
    location: 'Kiambu County',
    coordinates: { x: 50, y: 50, lat: -1.1462, lng: 36.9665 },
  };

  // Nearby aggregation points with "real" GPS-like coordinates for visualization
  const aggregationPoints: AggregationPoint[] = [
    {
      id: 'AGG-001',
      name: 'Central Collection Hub',
      location: 'Nairobi County',
      distance: '5.2 km',
      travelTime: '15 min drive',
      coordinates: { x: 65, y: 35, lat: -1.2921, lng: 36.8219 },
      acceptingCrops: ['Tomatoes', 'Cabbage', 'Carrots'],
      capacity: 'High',
      contact: '+254 700 123 456',
      cropRequirements: [
        { crop: 'Tomatoes', minimumQuantity: '100 kg', acceptedCondition: 'Grade A, Fresh' },
        { crop: 'Cabbage', minimumQuantity: '50 kg', acceptedCondition: 'Grade A/B, Fresh' },
        { crop: 'Carrots', minimumQuantity: '30 kg', acceptedCondition: 'Grade A, Fresh' },
      ],
      notes: ['Sorted produce preferred', 'No damaged produce', 'Payment within 24 hours'],
    },
    {
      id: 'AGG-002',
      name: 'Kiambu Farmers Hub',
      location: 'Kiambu Town',
      distance: '3.1 km',
      travelTime: '45 min walk',
      coordinates: { x: 35, y: 30, lat: -1.1718, lng: 36.8356 },
      acceptingCrops: ['Tomatoes', 'Onions', 'Potatoes'],
      capacity: 'Medium',
      contact: '+254 700 123 457',
      cropRequirements: [
        { crop: 'Tomatoes', minimumQuantity: '50 kg', acceptedCondition: 'Grade A/B, Fresh' },
        { crop: 'Onions', minimumQuantity: '40 kg', acceptedCondition: 'Grade B acceptable' },
        { crop: 'Potatoes', minimumQuantity: '60 kg', acceptedCondition: 'Grade A/B, Fresh' },
      ],
      notes: ['Sorted produce preferred', 'Minimal blemishes acceptable', 'Payment within 48 hours'],
    },
    {
      id: 'AGG-003',
      name: 'Fresh Produce Aggregators',
      location: 'Thika',
      distance: '12.5 km',
      travelTime: '30 min drive',
      coordinates: { x: 70, y: 60, lat: -1.0388, lng: 37.0834 },
      acceptingCrops: ['All Vegetables'],
      capacity: 'High',
      contact: '+254 700 123 458',
      cropRequirements: [
        { crop: 'All Vegetables', minimumQuantity: '100 kg', acceptedCondition: 'Grade A preferred' },
      ],
      notes: ['Sorted produce required', 'No damaged produce', 'Packaging available on-site'],
    },
  ];

  // Modal for detailed requirements
  if (selectedPoint) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
          {/* Header */}
          <div className="sticky top-0 bg-[#e8915f] text-white p-6 rounded-t-2xl z-10">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold">{selectedPoint.name}</h2>
              <button
                onClick={() => setSelectedPoint(null)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-white/90 text-sm">{selectedPoint.location}</p>
            <div className="flex items-center space-x-4 mt-2 text-sm font-mono bg-black/20 px-2 py-1 rounded inline-block">
              <span>{selectedPoint.coordinates.lat.toFixed(4)}, {selectedPoint.coordinates.lng.toFixed(4)}</span>
            </div>
            <div className="flex items-center space-x-4 mt-2 text-sm">
              <span className="flex items-center">
                <Navigation className="w-4 h-4 mr-1" />
                {selectedPoint.distance} ({selectedPoint.travelTime})
              </span>
              <span>{selectedPoint.contact}</span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-5">
            {/* Capacity */}
            <div>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                selectedPoint.capacity === 'High' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
              }`}>
                {selectedPoint.capacity} Capacity
              </span>
            </div>

            {/* Accepted Crops */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                Accepted Crops & Requirements
              </h3>
              <div className="space-y-3">
                {selectedPoint.cropRequirements.map((req, index) => (
                  <div key={index} className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">{req.crop}</h4>
                    <div className="space-y-1.5 text-sm">
                      {req.minimumQuantity && (
                        <div className="flex items-start">
                          <span className="text-gray-600 w-32 flex-shrink-0">Minimum Qty:</span>
                          <span className="font-semibold text-gray-900">{req.minimumQuantity}</span>
                        </div>
                      )}
                      <div className="flex items-start">
                        <span className="text-gray-600 w-32 flex-shrink-0">Condition:</span>
                        <span className="font-semibold text-gray-900">{req.acceptedCondition}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Important Notes */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <AlertCircle className="w-5 h-5 mr-2 text-orange-600" />
                Important Notes
              </h3>
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                <ul className="space-y-2">
                  {selectedPoint.notes.map((note, index) => (
                    <li key={index} className="flex items-start text-sm">
                      <span className="text-orange-600 mr-2 flex-shrink-0">•</span>
                      <span className="text-gray-900">{note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4">
              <button className="flex-1 bg-[#2d5f3f] text-white py-3 rounded-xl font-semibold hover:bg-[#234a32] transition-colors flex items-center justify-center space-x-2">
                <Navigation className="w-4 h-4" />
                <span>Start Navigation</span>
              </button>
              <button className="flex-1 bg-gray-100 text-gray-900 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors">
                Call Now
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#2d5f3f] to-[#3a7050] p-4 text-white">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-semibold text-lg">Geospatial Collection Map</h3>
          <MapPin className="w-5 h-5" />
        </div>
        <p className="text-white/80 text-sm">
          {aggregationPoints.length} hubs detected near GPS coordinates: {farmerLocation.coordinates.lat}, {farmerLocation.coordinates.lng}
        </p>
      </div>

      {/* Map Visualization */}
      <div className="relative h-[320px] overflow-hidden group">
        {/* Real Satellite Map Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
          style={{ 
            backgroundImage: 'url("https://images.unsplash.com/photo-1574786199573-a22c93a95aaf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxLZW55YSUyMHNhdGVsbGl0ZSUyMG1hcCUyMGdyZWVufGVufDF8fHx8MTc3MTQwMzE5MHww&ixlib=rb-4.1.0&q=80&w=1080")',
            filter: 'brightness(0.8) contrast(1.1)'
          }}
        />
        
        {/* Overlay Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none" />

        {/* Connection Lines (Routes) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {aggregationPoints.map((point) => (
            <line
              key={`line-${point.id}`}
              x1={`${farmerLocation.coordinates.x}%`}
              y1={`${farmerLocation.coordinates.y}%`}
              x2={`${point.coordinates.x}%`}
              y2={`${point.coordinates.y}%`}
              stroke="#e8915f"
              strokeWidth="3"
              strokeDasharray="6,4"
              opacity={hoveredPoint === point.id ? '1' : '0.6'}
              className="transition-opacity drop-shadow-md"
            />
          ))}
        </svg>

        {/* Farmer Location (Center) */}
        <div
          className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
          style={{
            left: `${farmerLocation.coordinates.x}%`,
            top: `${farmerLocation.coordinates.y}%`,
          }}
        >
          <div className="relative group/pin">
            {/* Radar Pulse Effect */}
            <div className="absolute inset-0 bg-[#2d5f3f] rounded-full animate-ping opacity-75" />
            
            <div className="relative bg-[#2d5f3f] rounded-full p-2 shadow-xl border-2 border-white">
              <Sprout className="w-6 h-6 text-white" />
            </div>
            
            {/* Farmer Tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 opacity-0 group-hover/pin:opacity-100 transition-opacity pointer-events-none z-30">
              <div className="bg-black/90 backdrop-blur text-white text-xs rounded-lg py-2 px-3 whitespace-nowrap shadow-xl border border-white/20">
                <p className="font-bold text-[#e8915f]">YOU ARE HERE</p>
                <p className="font-mono text-[10px] mt-1 text-gray-300">
                  {farmerLocation.coordinates.lat}, {farmerLocation.coordinates.lng}
                </p>
              </div>
              <div className="w-2 h-2 bg-black/90 transform rotate-45 absolute left-1/2 -translate-x-1/2 -bottom-1 border-r border-b border-white/20"></div>
            </div>
          </div>
        </div>

        {/* Aggregation Points */}
        {aggregationPoints.map((point) => (
          <div
            key={point.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer"
            style={{
              left: `${point.coordinates.x}%`,
              top: `${point.coordinates.y}%`,
            }}
            onMouseEnter={() => setHoveredPoint(point.id)}
            onMouseLeave={() => setHoveredPoint(null)}
            onClick={() => setSelectedPoint(point)}
          >
            <div className="relative group/hub transition-transform hover:scale-110 duration-200">
              <div
                className={`rounded-full p-2 shadow-xl border-2 border-white ${
                  hoveredPoint === point.id ? 'bg-[#e8915f] ring-4 ring-[#e8915f]/30' : 'bg-white'
                }`}
              >
                <Package className={`w-5 h-5 ${hoveredPoint === point.id ? 'text-white' : 'text-[#e8915f]'}`} />
              </div>

              {/* Hub Tooltip */}
              <div className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 transition-all duration-200 pointer-events-none z-30 ${
                hoveredPoint === point.id ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}>
                <div className="bg-white/95 backdrop-blur text-gray-900 text-xs rounded-lg py-2 px-3 whitespace-nowrap shadow-2xl border border-gray-200 min-w-[140px]">
                  <p className="font-bold text-sm mb-1">{point.name}</p>
                  <div className="flex items-center space-x-2 text-gray-600 mb-1">
                    <Navigation className="w-3 h-3" />
                    <span>{point.distance} • {point.travelTime}</span>
                  </div>
                  <div className="flex items-center space-x-1 bg-gray-100 rounded px-1.5 py-0.5 w-fit">
                    <span className="text-[10px] font-mono text-gray-500">
                      {point.coordinates.lat}, {point.coordinates.lng}
                    </span>
                  </div>
                </div>
                <div className="w-2 h-2 bg-white transform rotate-45 absolute left-1/2 -translate-x-1/2 -bottom-1 shadow-sm"></div>
              </div>
            </div>
          </div>
        ))}

        {/* Map Controls (Simulated) */}
        <div className="absolute top-4 right-4 flex flex-col space-y-2">
          <button className="bg-white/90 p-2 rounded-lg shadow-lg hover:bg-white text-gray-700">
            <Navigation className="w-5 h-5" />
          </button>
          <div className="bg-white/90 p-2 rounded-lg shadow-lg flex flex-col items-center space-y-2 text-gray-700 font-bold text-lg">
            <button className="hover:bg-gray-100 rounded px-1">+</button>
            <button className="hover:bg-gray-100 rounded px-1">-</button>
          </div>
        </div>
      </div>

      {/* Aggregation Points List */}
      <div className="p-4 space-y-3 bg-gray-50/50">
        <div className="flex justify-between items-center mb-2">
          <h4 className="font-semibold text-gray-900 text-sm">Route Planning</h4>
          <span className="text-xs text-[#2d5f3f] font-medium bg-green-100 px-2 py-0.5 rounded-full">Live Traffic</span>
        </div>
        
        {aggregationPoints.map((point) => (
          <div
            key={point.id}
            className={`border rounded-xl p-3 transition-all cursor-pointer hover:shadow-md ${
              hoveredPoint === point.id
                ? 'border-[#e8915f] bg-white ring-1 ring-[#e8915f]'
                : 'border-gray-200 bg-white'
            }`}
            onMouseEnter={() => setHoveredPoint(point.id)}
            onMouseLeave={() => setHoveredPoint(null)}
            onClick={() => setSelectedPoint(point)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h5 className="font-semibold text-gray-900 text-sm">{point.name}</h5>
                <div className="flex items-center mt-1 space-x-3 text-xs text-gray-500">
                  <span className="flex items-center">
                    <Navigation className="w-3 h-3 mr-1 text-[#e8915f]" />
                    {point.distance}
                  </span>
                  <span className="flex items-center">
                    <div className="w-1 h-1 bg-gray-300 rounded-full mr-2"></div>
                    {point.travelTime}
                  </span>
                </div>
              </div>
              <button className="text-[#2d5f3f] text-xs font-semibold bg-[#2d5f3f]/10 px-3 py-1.5 rounded-lg hover:bg-[#2d5f3f]/20 transition-colors">
                Navigate
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
