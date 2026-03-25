import React, { useState, useEffect } from 'react';
import { MapPin, Sprout, Package, Navigation, X, Truck, Phone, Info } from 'lucide-react';

interface FarmerPoint {
  id: string;
  name: string;
  location: string;
  distance: string;
  travelTime: string;
  coordinates: { x: number; y: number; lat: number; lng: number };
  crops: string[];
  availableQuantity: string;
  contact: string;
  nextHarvest: string;
  routeStatus: 'optimal' | 'traffic' | 'clear';
}

export function AggregatorTraceabilityMap() {
  const [hoveredPoint, setHoveredPoint] = useState<string | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<FarmerPoint | null>(null);
  const [showRoutes, setShowRoutes] = useState(true);

  // Aggregator's location (center)
  const hubLocation = {
    name: 'Central Collection Hub',
    location: 'Nairobi County',
    coordinates: { x: 50, y: 50, lat: -1.2921, lng: 36.8219 },
  };

  // Nearby farmers with "real" GPS-like coordinates
  const farmerPoints: FarmerPoint[] = [
    {
      id: 'FARM-001',
      name: 'John Mwangi',
      location: 'Kiambu County',
      distance: '5.2 km',
      travelTime: '15 min drive',
      coordinates: { x: 35, y: 35, lat: -1.1462, lng: 36.9665 },
      crops: ['Tomatoes', 'Cabbage'],
      availableQuantity: '250 kg',
      contact: '+254 712 345 678',
      nextHarvest: 'Jan 25, 2026',
      routeStatus: 'clear',
    },
    {
      id: 'FARM-002',
      name: 'Mary Njeri',
      location: 'Nakuru County',
      distance: '8.5 km',
      travelTime: '22 min drive',
      coordinates: { x: 65, y: 30, lat: -1.2800, lng: 36.7000 },
      crops: ['Carrots', 'Onions'],
      availableQuantity: '180 kg',
      contact: '+254 712 345 679',
      nextHarvest: 'Jan 28, 2026',
      routeStatus: 'traffic',
    },
    {
      id: 'FARM-003',
      name: 'Peter Oloo',
      location: 'Nyandarua County',
      distance: '12.1 km',
      travelTime: '35 min drive',
      coordinates: { x: 70, y: 65, lat: -1.3500, lng: 36.9000 },
      crops: ['Potatoes', 'Kale'],
      availableQuantity: '300 kg',
      contact: '+254 712 345 680',
      nextHarvest: 'Feb 02, 2026',
      routeStatus: 'optimal',
    },
    {
      id: 'FARM-004',
      name: 'Jane Wanjiku',
      location: 'Kiambu County',
      distance: '6.8 km',
      travelTime: '18 min drive',
      coordinates: { x: 30, y: 60, lat: -1.2000, lng: 36.7500 },
      crops: ['Spinach', 'Tomatoes'],
      availableQuantity: '120 kg',
      contact: '+254 712 345 681',
      nextHarvest: 'Today',
      routeStatus: 'clear',
    },
  ];

  // Helper to generate curved paths (Quadratic Bezier)
  const getCurvedPath = (start: { x: number; y: number }, end: { x: number; y: number }, index: number) => {
    // Calculate midpoint
    const midX = (start.x + end.x) / 2;
    const midY = (start.y + end.y) / 2;
    
    // Offset control point based on index to avoid overlapping straight lines
    // and create a "natural" road curve look
    const offset = index % 2 === 0 ? 15 : -15; 
    const controlX = midX + (start.y - end.y) * 0.2; // Perpendicular offset
    const controlY = midY + (end.x - start.x) * 0.2;

    return `M ${start.x} ${start.y} Q ${controlX} ${controlY} ${end.x} ${end.y}`;
  };

  // Modal for detailed farmer info
  if (selectedPoint) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
          {/* Header */}
          <div className="sticky top-0 bg-[#2d5f3f] text-white p-6 rounded-t-2xl z-10">
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
            <div className="flex items-center space-x-4 mt-2 text-sm">
              <span className="flex items-center bg-black/20 px-2 py-1 rounded">
                <Navigation className="w-4 h-4 mr-1" />
                {selectedPoint.distance}
              </span>
              <span className="bg-black/20 px-2 py-1 rounded">
                {selectedPoint.travelTime}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-5">
            {/* Route Status */}
            <div className={`p-3 rounded-xl border flex items-center space-x-3 ${
              selectedPoint.routeStatus === 'traffic' ? 'bg-orange-50 border-orange-200 text-orange-800' : 
              selectedPoint.routeStatus === 'optimal' ? 'bg-green-50 border-green-200 text-green-800' :
              'bg-blue-50 border-blue-200 text-blue-800'
            }`}>
              <Truck className="w-5 h-5" />
              <div>
                <p className="font-semibold text-sm">Route Status: {
                  selectedPoint.routeStatus === 'traffic' ? 'Heavy Traffic' : 
                  selectedPoint.routeStatus === 'optimal' ? 'Optimal Route' : 'Clear Road'
                }</p>
                <p className="text-xs opacity-80">Estimated arrival: {selectedPoint.travelTime}</p>
              </div>
            </div>

            {/* Crops */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Sprout className="w-5 h-5 mr-2 text-[#2d5f3f]" />
                Available Produce
              </h3>
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm text-gray-600">Total Quantity</span>
                  <span className="text-lg font-bold text-[#2d5f3f]">{selectedPoint.availableQuantity}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedPoint.crops.map((crop) => (
                    <span key={crop} className="bg-white border border-green-100 text-green-800 px-3 py-1 rounded-lg text-sm font-medium shadow-sm">
                      {crop}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button className="flex items-center justify-center space-x-2 bg-[#2d5f3f] text-white py-3 rounded-xl font-semibold hover:bg-[#234a32] transition-colors">
                <Truck className="w-4 h-4" />
                <span>Schedule Pickup</span>
              </button>
              <button className="flex items-center justify-center space-x-2 bg-gray-100 text-gray-900 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors">
                <Phone className="w-4 h-4" />
                <span>Call Farmer</span>
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
      <div className="bg-gradient-to-r from-[#e8915f] to-[#d17845] p-4 text-white">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-semibold text-lg">Smart Logistics Map</h3>
          <button 
            onClick={() => setShowRoutes(!showRoutes)}
            className="text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded transition-colors"
          >
            {showRoutes ? 'Hide Routes' : 'Show Routes'}
          </button>
        </div>
        <p className="text-white/80 text-sm">
          {farmerPoints.length} active farms near hub coordinates: {hubLocation.coordinates.lat}, {hubLocation.coordinates.lng}
        </p>
      </div>

      {/* Map Visualization */}
      <div className="relative h-[320px] overflow-hidden group">
        {/* Real Satellite Map Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
          style={{ 
            backgroundImage: 'url("https://images.unsplash.com/photo-1574786199573-a22c93a95aaf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxLZW55YSUyMHNhdGVsbGl0ZSUyMG1hcCUyMGdyZWVufGVufDF8fHx8MTc3MTQwMzE5MHww&ixlib=rb-4.1.0&q=80&w=1080")',
            filter: 'brightness(0.7) contrast(1.2)'
          }}
        />
        
        {/* Overlay Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

        {/* Animated Routes (Flowing Lines) */}
        {showRoutes && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            <defs>
              <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#2d5f3f" stopOpacity="0" />
                <stop offset="50%" stopColor="#4ade80" stopOpacity="1" />
                <stop offset="100%" stopColor="#2d5f3f" stopOpacity="0" />
              </linearGradient>
            </defs>
            {farmerPoints.map((point, index) => (
              <g key={`route-${point.id}`}>
                {/* Base Path (Dim) */}
                <path
                  d={getCurvedPath(point.coordinates, hubLocation.coordinates, index)}
                  fill="none"
                  stroke={point.routeStatus === 'traffic' ? '#ef4444' : '#ffffff'}
                  strokeWidth="3"
                  strokeOpacity="0.2"
                  strokeLinecap="round"
                />
                
                {/* Flow Animation Path */}
                <path
                  d={getCurvedPath(point.coordinates, hubLocation.coordinates, index)}
                  fill="none"
                  stroke={point.routeStatus === 'traffic' ? '#ef4444' : '#4ade80'}
                  strokeWidth="2"
                  strokeDasharray="8,8"
                  strokeLinecap="round"
                  className={`drop-shadow-md transition-opacity duration-300 ${
                    hoveredPoint === point.id ? 'opacity-100' : 'opacity-60'
                  }`}
                >
                  <animate 
                    attributeName="stroke-dashoffset" 
                    from="100" 
                    to="0" 
                    dur={point.routeStatus === 'traffic' ? "3s" : "1.5s"} 
                    repeatCount="indefinite" 
                  />
                </path>
              </g>
            ))}
          </svg>
        )}

        {/* Aggregator Hub Location (Center) */}
        <div
          className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
          style={{
            left: `${hubLocation.coordinates.x}%`,
            top: `${hubLocation.coordinates.y}%`,
          }}
        >
          <div className="relative group/hub">
            {/* Pulse Effect */}
            <div className="absolute inset-0 bg-[#e8915f] rounded-full animate-ping opacity-75" />
            
            <div className="relative bg-[#e8915f] rounded-full p-3 shadow-xl border-4 border-white z-20">
              <Package className="w-6 h-6 text-white" />
            </div>
            
            {/* Hub Tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 opacity-0 group-hover/hub:opacity-100 transition-opacity pointer-events-none z-30">
              <div className="bg-black/90 backdrop-blur text-white text-xs rounded-lg py-2 px-3 whitespace-nowrap shadow-xl border border-white/20">
                <p className="font-bold text-[#e8915f]">YOUR HUB</p>
                <p className="font-mono text-[10px] mt-1 text-gray-300">
                  {hubLocation.coordinates.lat}, {hubLocation.coordinates.lng}
                </p>
              </div>
              <div className="w-2 h-2 bg-black/90 transform rotate-45 absolute left-1/2 -translate-x-1/2 -bottom-1 border-r border-b border-white/20"></div>
            </div>
          </div>
        </div>

        {/* Farmer Points */}
        {farmerPoints.map((point) => (
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
            <div className="relative group/farm transition-transform hover:scale-110 duration-200">
              <div
                className={`rounded-full p-2 shadow-xl border-2 border-white ${
                  hoveredPoint === point.id 
                    ? 'bg-[#2d5f3f] ring-4 ring-[#2d5f3f]/30' 
                    : point.routeStatus === 'traffic' ? 'bg-orange-500' : 'bg-white'
                }`}
              >
                <Sprout className={`w-5 h-5 ${
                  hoveredPoint === point.id || point.routeStatus === 'traffic' ? 'text-white' : 'text-[#2d5f3f]'
                }`} />
              </div>

              {/* Status Indicator Dot */}
              {point.routeStatus !== 'clear' && (
                 <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border border-white ${
                   point.routeStatus === 'traffic' ? 'bg-red-500' : 'bg-green-500'
                 }`} />
              )}

              {/* Farmer Tooltip */}
              <div className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 transition-all duration-200 pointer-events-none z-30 ${
                hoveredPoint === point.id ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}>
                <div className="bg-white/95 backdrop-blur text-gray-900 text-xs rounded-lg py-2 px-3 whitespace-nowrap shadow-2xl border border-gray-200 min-w-[140px]">
                  <p className="font-bold text-sm mb-1">{point.name}</p>
                  <div className="flex items-center space-x-2 text-gray-600 mb-1">
                    <Navigation className="w-3 h-3" />
                    <span>{point.distance} • {point.travelTime}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`w-2 h-2 rounded-full ${
                      point.routeStatus === 'traffic' ? 'bg-red-500' : 'bg-green-500'
                    }`} />
                    <span className="text-[10px] uppercase font-bold text-gray-500">
                      {point.routeStatus === 'traffic' ? 'Traffic Delay' : 'Route Clear'}
                    </span>
                  </div>
                </div>
                <div className="w-2 h-2 bg-white transform rotate-45 absolute left-1/2 -translate-x-1/2 -bottom-1 shadow-sm"></div>
              </div>
            </div>
          </div>
        ))}

        {/* Map Controls */}
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

      {/* Logistics List */}
      <div className="p-4 space-y-3 bg-gray-50/50">
        <div className="flex justify-between items-center mb-2">
          <h4 className="font-semibold text-gray-900 text-sm">Active Logistics Routes</h4>
          <span className="text-xs text-[#2d5f3f] font-medium bg-green-100 px-2 py-0.5 rounded-full flex items-center">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1 animate-pulse"></span>
            Live Tracking
          </span>
        </div>
        
        {farmerPoints.map((point) => (
          <div
            key={point.id}
            className={`border rounded-xl p-3 transition-all cursor-pointer hover:shadow-md ${
              hoveredPoint === point.id
                ? 'border-[#2d5f3f] bg-white ring-1 ring-[#2d5f3f]'
                : 'border-gray-200 bg-white'
            }`}
            onMouseEnter={() => setHoveredPoint(point.id)}
            onMouseLeave={() => setHoveredPoint(null)}
            onClick={() => setSelectedPoint(point)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h5 className="font-semibold text-gray-900 text-sm">{point.name}</h5>
                  {point.routeStatus === 'traffic' && (
                    <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-bold">
                      TRAFFIC
                    </span>
                  )}
                </div>
                <div className="flex items-center mt-1 space-x-3 text-xs text-gray-500">
                  <span className="flex items-center">
                    <Navigation className="w-3 h-3 mr-1 text-[#2d5f3f]" />
                    {point.distance}
                  </span>
                  <span className="flex items-center text-gray-600">
                    <Truck className="w-3 h-3 mr-1" />
                    {point.travelTime}
                  </span>
                </div>
              </div>
              <button className="text-[#e8915f] text-xs font-semibold bg-[#e8915f]/10 px-3 py-1.5 rounded-lg hover:bg-[#e8915f]/20 transition-colors flex items-center">
                <Truck className="w-3 h-3 mr-1" />
                Dispatch
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
