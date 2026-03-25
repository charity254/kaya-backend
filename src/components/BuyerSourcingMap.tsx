import React, { useState } from 'react';
import { MapPin, Navigation, Building2, Sprout, Package, X, Truck, Phone, Info, Globe } from 'lucide-react';

interface SourceLocation {
  id: string;
  type: 'aggregator' | 'farmer';
  name: string;
  location: string;
  coordinates: { lat: number; lng: number }; // Real GPS coordinates
  mapPosition: { x: number; y: number }; // Visual percentage on the container
  availableProduce: string;
  quantity: string;
  price?: string;
  contact: string;
  distance: string;
  travelTime: string;
  routeStatus: 'optimal' | 'traffic' | 'clear';
}

interface BuyerSourcingMapProps {
  buyerType: 'supplier_trader' | 'exporter';
}

export function BuyerSourcingMap({ buyerType }: BuyerSourcingMapProps) {
  const [selectedSource, setSelectedSource] = useState<SourceLocation | null>(null);
  const [hoveredSource, setHoveredSource] = useState<string | null>(null);
  const [showRoutes, setShowRoutes] = useState(true);

  // Buyer's location (Nairobi - Center/South)
  const buyerLocation = {
    name: 'Your Warehouse (Nairobi)',
    coordinates: { lat: -1.2921, lng: 36.8219 },
    mapPosition: { x: 50, y: 60 },
  };

  // Mock data with "real" distribution across Kenya
  const sources: SourceLocation[] = [
    {
      id: 'AGG-001',
      type: 'aggregator',
      name: 'Central Collection Hub',
      location: 'Nairobi County',
      coordinates: { lat: -1.286389, lng: 36.817223 },
      mapPosition: { x: 52, y: 58 },
      availableProduce: 'Mixed Vegetables',
      quantity: '730 kg',
      price: '$0.55/kg',
      contact: '+254 700 123 456',
      distance: '5.2 km',
      travelTime: '15 min',
      routeStatus: 'clear',
    },
    {
      id: 'AGG-002',
      type: 'aggregator',
      name: 'Rift Valley Depot',
      location: 'Nakuru County',
      coordinates: { lat: -0.3031, lng: 36.0800 },
      mapPosition: { x: 35, y: 45 },
      availableProduce: 'Tomatoes, Cabbage',
      quantity: '450 kg',
      price: '$0.48/kg',
      contact: '+254 700 123 457',
      distance: '158 km',
      travelTime: '3h 10m',
      routeStatus: 'optimal',
    },
    {
      id: 'AGG-003',
      type: 'aggregator',
      name: 'Mt. Kenya Fresh Hub',
      location: 'Nyeri County',
      coordinates: { lat: -0.4167, lng: 36.9500 },
      mapPosition: { x: 55, y: 40 },
      availableProduce: 'Carrots, Potatoes',
      quantity: '1,200 kg',
      price: '$0.60/kg',
      contact: '+254 700 123 458',
      distance: '150 km',
      travelTime: '2h 45m',
      routeStatus: 'traffic',
    },
    {
      id: 'FARM-001',
      type: 'farmer',
      name: 'John Mwangi Farm',
      location: 'Kiambu County',
      coordinates: { lat: -1.1743, lng: 36.9366 },
      mapPosition: { x: 55, y: 55 },
      availableProduce: 'Tomatoes',
      quantity: '250 kg',
      price: '$0.50/kg',
      contact: '+254 712 345 678',
      distance: '18 km',
      travelTime: '45 min',
      routeStatus: 'clear',
    },
    {
      id: 'FARM-002',
      type: 'farmer',
      name: 'Coastal Farms Co-op',
      location: 'Mombasa County',
      coordinates: { lat: -4.0435, lng: 39.6682 },
      mapPosition: { x: 85, y: 85 },
      availableProduce: 'Coconuts, Mangoes',
      quantity: '5,000 kg',
      price: '$1.20/kg',
      contact: '+254 712 345 690',
      distance: '480 km',
      travelTime: '8h 30m',
      routeStatus: 'optimal',
    },
    {
      id: 'FARM-003',
      type: 'farmer',
      name: 'Western Green Fields',
      location: 'Kisumu County',
      coordinates: { lat: -0.0917, lng: 34.7680 },
      mapPosition: { x: 15, y: 45 },
      availableProduce: 'Fish, Rice, Veg',
      quantity: '2,000 kg',
      price: '$0.80/kg',
      contact: '+254 712 345 691',
      distance: '350 km',
      travelTime: '6h 15m',
      routeStatus: 'traffic',
    },
  ];

  // Helper to generate curved paths (Quadratic Bezier)
  const getCurvedPath = (start: { x: number; y: number }, end: { x: number; y: number }, index: number) => {
    // Calculate midpoint
    const midX = (start.x + end.x) / 2;
    const midY = (start.y + end.y) / 2;
    
    // Offset control point based on index to create "natural" curve
    // Scale offset by distance to make longer routes curve more gently
    const dx = start.x - end.x;
    const dy = start.y - end.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const offsetFactor = 0.2;
    
    // Perpendicular offset
    const controlX = midX + (start.y - end.y) * offsetFactor * (index % 2 === 0 ? 1 : -1); 
    const controlY = midY + (end.x - start.x) * offsetFactor * (index % 2 === 0 ? -1 : 1);

    return `M ${start.x} ${start.y} Q ${controlX} ${controlY} ${end.x} ${end.y}`;
  };

  const aggregatorCount = sources.filter(s => s.type === 'aggregator').length;
  const farmerCount = sources.filter(s => s.type === 'farmer').length;

  // Detail Modal
  if (selectedSource) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
          {/* Header */}
          <div className={`sticky top-0 p-6 rounded-t-2xl z-10 text-white ${
            selectedSource.type === 'aggregator' ? 'bg-[#e8915f]' : 'bg-[#2d5f3f]'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold flex items-center">
                {selectedSource.type === 'aggregator' ? <Package className="w-5 h-5 mr-2" /> : <Sprout className="w-5 h-5 mr-2" />}
                {selectedSource.name}
              </h2>
              <button
                onClick={() => setSelectedSource(null)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-white/90 text-sm">{selectedSource.location}</p>
            <div className="flex items-center space-x-4 mt-2 text-sm font-mono bg-black/20 px-2 py-1 rounded inline-block">
              <span>{selectedSource.coordinates.lat.toFixed(4)}, {selectedSource.coordinates.lng.toFixed(4)}</span>
            </div>
            <div className="flex items-center space-x-4 mt-2 text-sm">
              <span className="flex items-center">
                <Navigation className="w-4 h-4 mr-1" />
                {selectedSource.distance} ({selectedSource.travelTime})
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-5">
            {/* Route Info */}
            <div className={`p-3 rounded-xl border flex items-center space-x-3 ${
              selectedSource.routeStatus === 'traffic' ? 'bg-orange-50 border-orange-200 text-orange-800' : 
              selectedSource.routeStatus === 'optimal' ? 'bg-green-50 border-green-200 text-green-800' :
              'bg-blue-50 border-blue-200 text-blue-800'
            }`}>
              <Truck className="w-5 h-5" />
              <div>
                <p className="font-semibold text-sm">
                  {selectedSource.routeStatus === 'traffic' ? 'High Traffic Delay' : 
                   selectedSource.routeStatus === 'optimal' ? 'Optimal Delivery Route' : 'Clear Route'}
                </p>
                <p className="text-xs opacity-80">ETA: {selectedSource.travelTime} by road</p>
              </div>
            </div>

            {/* Produce Info */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">Available Stock</h3>
              <div className="space-y-3">
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="text-gray-600">Produce</span>
                  <span className="font-medium text-gray-900">{selectedSource.availableProduce}</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="text-gray-600">Quantity</span>
                  <span className="font-bold text-[#2d5f3f]">{selectedSource.quantity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Indicative Price</span>
                  <span className="font-medium text-gray-900">{selectedSource.price}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center space-x-2 bg-[#2d5f3f] text-white py-3 rounded-xl font-semibold hover:bg-[#234a32] transition-colors">
                <Truck className="w-4 h-4" />
                <span>Order Logistics</span>
              </button>
              <button className="flex items-center justify-center space-x-2 bg-gray-100 text-gray-900 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors">
                <Phone className="w-4 h-4" />
                <span>Contact Source</span>
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
      <div className="bg-gradient-to-r from-[#2d5f3f] to-[#e8915f] p-4 text-white">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center">
            <Globe className="w-5 h-5 mr-2" />
            <h3 className="font-semibold text-lg">
              {buyerType === 'exporter' ? 'Export Sourcing Network' : 'National Sourcing Map'}
            </h3>
          </div>
          <button 
            onClick={() => setShowRoutes(!showRoutes)}
            className="text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded transition-colors"
          >
            {showRoutes ? 'Hide Logistics' : 'Show Logistics'}
          </button>
        </div>
        <p className="text-white/80 text-sm flex items-center">
          <span className="bg-white/20 px-1.5 rounded text-xs mr-2">Kenya Wide</span>
          {sources.length} sources tracked
        </p>
      </div>

      {/* Map Visualization */}
      <div className="relative h-[400px] overflow-hidden group bg-[#0a1f1c]">
        {/* Real Satellite Map Background - Kenya Context */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
          style={{ 
            backgroundImage: 'url("https://images.unsplash.com/photo-1574786199573-a22c93a95aaf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxLZW55YSUyMHNhdGVsbGl0ZSUyMG1hcCUyMGdyZWVufGVufDF8fHx8MTc3MTQwMzE5MHww&ixlib=rb-4.1.0&q=80&w=1080")',
            filter: 'brightness(0.6) contrast(1.2) hue-rotate(-10deg)'
          }}
        />
        
        {/* Map Grid Overlay for "Geospatial" Feel */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTCA0MCAwIEwgMCAwIDAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBzdHJva2Utb3BhY2l0eT0iMC4wNSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30 pointer-events-none" />

        {/* Routes Animation */}
        {showRoutes && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            {sources.map((source, index) => (
              <g key={`route-${source.id}`}>
                {/* Base Path (Dim) */}
                <path
                  d={getCurvedPath(source.mapPosition, buyerLocation.mapPosition, index).replace(/([\d.]+)/g, (v) => `${parseFloat(v)}%`)}
                  fill="none"
                  stroke={source.routeStatus === 'traffic' ? '#ef4444' : '#ffffff'}
                  strokeWidth="2"
                  strokeOpacity="0.1"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                />
                
                {/* Flow Animation Path */}
                <path
                  d={getCurvedPath(source.mapPosition, buyerLocation.mapPosition, index).replace(/([\d.]+)/g, (v) => `${parseFloat(v)}%`)}
                  fill="none"
                  stroke={source.routeStatus === 'traffic' ? '#ef4444' : source.type === 'aggregator' ? '#e8915f' : '#4ade80'}
                  strokeWidth="1.5"
                  strokeDasharray="4,6"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                  className={`drop-shadow-md transition-opacity duration-300 ${
                    hoveredSource === source.id ? 'opacity-100 stroke-[2.5]' : 'opacity-60'
                  }`}
                >
                  <animate 
                    attributeName="stroke-dashoffset" 
                    from="100" 
                    to="0" 
                    dur={source.routeStatus === 'traffic' ? "4s" : source.distance.includes('km') && parseInt(source.distance) > 100 ? "3s" : "1.5s"} 
                    repeatCount="indefinite" 
                  />
                </path>
              </g>
            ))}
          </svg>
        )}

        {/* Buyer Location (Center) */}
        <div
          className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
          style={{
            left: `${buyerLocation.mapPosition.x}%`,
            top: `${buyerLocation.mapPosition.y}%`,
          }}
        >
          <div className="relative group/buyer">
            {/* Pulse */}
            <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-50" />
            <div className="relative bg-blue-600 rounded-full p-2.5 shadow-xl border-2 border-white">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            {/* Label */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-black/80 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap">
              Your Warehouse
            </div>
          </div>
        </div>

        {/* Source Points */}
        {sources.map((source) => (
          <div
            key={source.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer"
            style={{
              left: `${source.mapPosition.x}%`,
              top: `${source.mapPosition.y}%`,
            }}
            onMouseEnter={() => setHoveredSource(source.id)}
            onMouseLeave={() => setHoveredSource(null)}
            onClick={() => setSelectedSource(source)}
          >
            <div className="relative group/source transition-transform hover:scale-110 duration-200">
              <div
                className={`rounded-full p-2 shadow-xl border-2 border-white ${
                  hoveredSource === source.id 
                    ? 'ring-4 ring-white/30 scale-110' 
                    : ''
                } ${source.type === 'aggregator' ? 'bg-[#e8915f]' : 'bg-[#2d5f3f]'}`}
              >
                {source.type === 'aggregator' ? (
                  <Package className="w-4 h-4 text-white" />
                ) : (
                  <Sprout className="w-4 h-4 text-white" />
                )}
              </div>

              {/* Tooltip */}
              <div className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 transition-all duration-200 pointer-events-none z-30 ${
                hoveredSource === source.id ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}>
                <div className="bg-white/95 backdrop-blur text-gray-900 text-xs rounded-lg py-2 px-3 whitespace-nowrap shadow-2xl border border-gray-200 min-w-[140px]">
                  <p className="font-bold text-sm mb-1">{source.name}</p>
                  <p className="text-gray-500 text-[10px] mb-1 uppercase tracking-wide">{source.location}</p>
                  <div className="flex items-center space-x-2 text-gray-600 border-t pt-1 mt-1">
                    <Truck className="w-3 h-3" />
                    <span>{source.distance} • {source.travelTime}</span>
                  </div>
                  <div className="text-[#2d5f3f] font-bold mt-1">
                    {source.quantity} Available
                  </div>
                </div>
                <div className="w-2 h-2 bg-white transform rotate-45 absolute left-1/2 -translate-x-1/2 -bottom-1 shadow-sm"></div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Map Legend/Controls Overlay */}
        <div className="absolute bottom-4 left-4 flex flex-col space-y-2">
          <div className="bg-black/60 backdrop-blur text-white text-xs rounded-lg p-2.5 shadow-lg border border-white/10">
            <p className="font-bold mb-2 opacity-80">Supply Chain Legend</p>
            <div className="space-y-1.5">
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-[#e8915f] mr-2"></div>
                <span>Aggregator Hub</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-[#2d5f3f] mr-2"></div>
                <span>Direct Farm</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                <span>Your Warehouse</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sourcing List */}
      <div className="bg-white p-4">
        <h4 className="font-semibold text-gray-900 text-sm mb-3">Priority Sourcing Opportunities</h4>
        <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
          {sources.map((source) => (
            <div
              key={source.id}
              className={`border rounded-xl p-3 transition-all cursor-pointer hover:shadow-md flex justify-between items-center ${
                hoveredSource === source.id
                  ? 'border-[#2d5f3f] bg-green-50/30'
                  : 'border-gray-200 bg-white'
              }`}
              onMouseEnter={() => setHoveredSource(source.id)}
              onMouseLeave={() => setHoveredSource(null)}
              onClick={() => setSelectedSource(source)}
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${source.type === 'aggregator' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
                   {source.type === 'aggregator' ? <Package className="w-4 h-4" /> : <Sprout className="w-4 h-4" />}
                </div>
                <div>
                  <h5 className="font-semibold text-gray-900 text-sm">{source.name}</h5>
                  <p className="text-xs text-gray-500">{source.location} • <span className="font-medium text-gray-700">{source.distance}</span></p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-[#2d5f3f] text-sm">{source.quantity}</p>
                <p className="text-xs text-gray-500">{source.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
