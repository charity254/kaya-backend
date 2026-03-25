import React from 'react';
import { MapPin, Navigation, Package } from 'lucide-react';

interface InventoryItem {
  intakeId: string;
  sourceFarm: string;
  farmLocation: string;
  farmCoordinates: { lat: number; lng: number };
  cropType: string;
  receivedQuantity: string;
}

interface TraceabilityMapProps {
  inventory: InventoryItem[];
}

export function TraceabilityMap({ inventory }: TraceabilityMapProps) {
  // Calculate bounds for Kenya map visualization
  // Kenya approximate bounds: lat -4.68 to 5.03, lng 33.91 to 41.91
  const kenyaBounds = {
    minLat: -4.68,
    maxLat: 5.03,
    minLng: 33.91,
    maxLng: 41.91,
  };

  // Convert lat/lng to x/y position on the map (percentage-based)
  const coordsToPosition = (lat: number, lng: number) => {
    const x = ((lng - kenyaBounds.minLng) / (kenyaBounds.maxLng - kenyaBounds.minLng)) * 100;
    const y = ((kenyaBounds.maxLat - lat) / (kenyaBounds.maxLat - kenyaBounds.minLat)) * 100;
    return { x, y };
  };

  // Group farms by location to avoid overlapping markers
  const farmerLocations = inventory.map(item => ({
    farmer: item.sourceFarm,
    location: item.farmLocation,
    coords: item.farmCoordinates,
    crop: item.cropType,
    quantity: item.receivedQuantity,
  }));

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#2d5f3f] to-[#e8915f] p-4">
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center">
            <Navigation className="w-5 h-5 mr-2" />
            <h3 className="font-semibold">Farm Traceability Map</h3>
          </div>
          <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
            {farmerLocations.length} sources
          </span>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative bg-gradient-to-br from-green-50 to-blue-50 aspect-[4/3] p-4">
        {/* Kenya Map Outline (Simplified SVG) */}
        <svg 
          viewBox="0 0 400 300" 
          className="absolute inset-0 w-full h-full opacity-20"
          preserveAspectRatio="xMidYMid meet"
        >
          <path
            d="M 150,50 L 200,45 L 250,55 L 300,70 L 320,100 L 330,140 L 325,180 L 310,220 L 280,250 L 240,270 L 190,275 L 150,265 L 120,240 L 100,200 L 95,160 L 100,120 L 120,80 L 150,50 Z"
            fill="none"
            stroke="#2d5f3f"
            strokeWidth="2"
            strokeDasharray="4,4"
          />
        </svg>

        {/* Facility Location (Center - Your Hub) */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="relative">
            <div className="absolute -inset-8 bg-[#e8915f]/20 rounded-full animate-ping" />
            <div className="relative bg-[#e8915f] rounded-full p-3 shadow-lg border-4 border-white">
              <Package className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-2 text-center">
            <p className="text-xs font-semibold text-[#e8915f] bg-white px-2 py-1 rounded-full shadow-sm">
              Your Hub
            </p>
          </div>
        </div>

        {/* Farm Markers */}
        {farmerLocations.map((farm, index) => {
          const position = coordsToPosition(farm.coords.lat, farm.coords.lng);
          
          return (
            <div
              key={index}
              className="absolute z-20 group cursor-pointer"
              style={{
                left: `${position.x}%`,
                top: `${position.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              {/* Connection Line to Hub */}
              <svg
                className="absolute pointer-events-none"
                style={{
                  left: '50%',
                  top: '50%',
                  width: '200px',
                  height: '200px',
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <line
                  x1="100"
                  y1="100"
                  x2={`${150 - position.x}`}
                  y2={`${150 - position.y}`}
                  stroke="#2d5f3f"
                  strokeWidth="1"
                  strokeDasharray="3,3"
                  opacity="0.3"
                  className="group-hover:opacity-60 transition-opacity"
                />
              </svg>

              {/* Farm Marker */}
              <div className="relative">
                <div className="bg-[#2d5f3f] rounded-full p-2 shadow-lg border-2 border-white group-hover:scale-110 transition-transform">
                  <MapPin className="w-4 h-4 text-white" fill="currentColor" />
                </div>
                
                {/* Tooltip on Hover */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-30">
                  <div className="bg-gray-900 text-white text-xs rounded-lg p-3 shadow-xl min-w-[150px]">
                    <p className="font-semibold mb-1">{farm.farmer}</p>
                    <p className="text-gray-300 text-xs mb-2">{farm.location}</p>
                    <div className="border-t border-gray-700 pt-2">
                      <p className="text-xs">{farm.crop}: {farm.quantity}</p>
                    </div>
                    {/* Arrow */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
                      <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur rounded-lg p-3 shadow-md text-xs">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="bg-[#2d5f3f] rounded-full p-1 mr-2">
                <MapPin className="w-3 h-3 text-white" fill="currentColor" />
              </div>
              <span className="text-gray-700">Farm Source</span>
            </div>
            <div className="flex items-center">
              <div className="bg-[#e8915f] rounded-full p-1 mr-2">
                <Package className="w-3 h-3 text-white" />
              </div>
              <span className="text-gray-700">Your Facility</span>
            </div>
          </div>
        </div>

        {/* Info Badge */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur rounded-lg px-3 py-2 shadow-md">
          <p className="text-xs text-gray-600">
            <span className="font-semibold text-[#2d5f3f]">{farmerLocations.length}</span> active sources
          </p>
        </div>
      </div>

      {/* Farmer List */}
      <div className="border-t border-gray-200 p-4">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Source Farms</h4>
        <div className="space-y-2">
          {farmerLocations.map((farm, index) => (
            <div key={index} className="flex items-center justify-between text-xs bg-gray-50 rounded-lg p-2">
              <div className="flex items-center space-x-2 flex-1">
                <div className="bg-[#2d5f3f] rounded-full p-1">
                  <MapPin className="w-3 h-3 text-white" fill="currentColor" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{farm.farmer}</p>
                  <p className="text-gray-600">{farm.location}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-gray-700">{farm.crop}</p>
                <p className="text-gray-500">{farm.quantity}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}