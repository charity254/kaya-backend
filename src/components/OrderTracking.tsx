import React, { useState } from 'react';
import { ArrowLeft, Package, Truck, CheckCircle, Clock, MapPin, ChevronRight, Phone, MessageSquare } from 'lucide-react';

interface OrderTrackingProps {
  onBack?: () => void;
}

interface TrackingStep {
  status: 'pending' | 'confirmed' | 'dispatched' | 'completed';
  label: string;
  date?: string;
  description?: string;
  icon: React.ElementType;
}

interface TrackedOrder {
  id: string;
  crop: string;
  quantity: string;
  farmer: string;
  currentStatus: 'pending' | 'confirmed' | 'dispatched' | 'completed';
  lastUpdate: string;
  steps: TrackingStep[];
  driver?: {
    name: string;
    phone: string;
    vehicle: string;
  };
  deliveryAddress: string;
}

export function OrderTracking({ onBack }: OrderTrackingProps) {
  const [selectedOrder, setSelectedOrder] = useState<TrackedOrder | null>(null);

  // Mock Data
  const trackedOrders: TrackedOrder[] = [
    {
      id: 'ORD-003',
      crop: 'Avocados (Hass)',
      quantity: '500 kg',
      farmer: 'David Kamau',
      currentStatus: 'dispatched',
      lastUpdate: 'Today, 10:30 AM',
      deliveryAddress: 'Nairobi Export Hub, Embakasi',
      driver: {
        name: 'James Omondi',
        phone: '+254 712 345 678',
        vehicle: 'KCD 123X (Isuzu NMR)'
      },
      steps: [
        {
          status: 'completed',
          label: 'Order Completed',
          description: 'Delivered to destination',
          icon: CheckCircle
        },
        {
          status: 'dispatched',
          label: 'Dispatched',
          date: 'Jan 27, 10:30 AM',
          description: 'Driver picked up cargo. In transit.',
          icon: Truck
        },
        {
          status: 'confirmed',
          label: 'Order Confirmed',
          date: 'Jan 26, 09:15 AM',
          description: 'Farmer accepted the order. Harvesting scheduled.',
          icon: Package
        },
        {
          status: 'pending',
          label: 'Order Placed',
          date: 'Jan 26, 08:30 AM',
          description: 'Waiting for farmer confirmation',
          icon: Clock
        }
      ]
    },
    {
      id: 'ORD-002',
      crop: 'Cabbage',
      quantity: '50 kg',
      farmer: 'Mary Njeri',
      currentStatus: 'confirmed',
      lastUpdate: 'Yesterday, 4:00 PM',
      deliveryAddress: 'City Market, Stall 45',
      steps: [
        {
          status: 'completed',
          label: 'Order Completed',
          icon: CheckCircle
        },
        {
          status: 'dispatched',
          label: 'Dispatched',
          icon: Truck
        },
        {
          status: 'confirmed',
          label: 'Order Confirmed',
          date: 'Jan 26, 04:00 PM',
          description: 'Farmer confirmed availability.',
          icon: Package
        },
        {
          status: 'pending',
          label: 'Order Placed',
          date: 'Jan 26, 02:00 PM',
          description: 'Order sent to farmer',
          icon: Clock
        }
      ]
    },
    {
      id: 'ORD-001',
      crop: 'Tomatoes',
      quantity: '100 kg',
      farmer: 'John Mwangi',
      currentStatus: 'pending',
      lastUpdate: 'Jan 25, 2:00 PM',
      deliveryAddress: 'Westlands Distribution Center',
      steps: [
        {
          status: 'completed',
          label: 'Order Completed',
          icon: CheckCircle
        },
        {
          status: 'dispatched',
          label: 'Dispatched',
          icon: Truck
        },
        {
          status: 'confirmed',
          label: 'Order Confirmed',
          icon: Package
        },
        {
          status: 'pending',
          label: 'Order Placed',
          date: 'Jan 25, 02:00 PM',
          description: 'Waiting for confirmation',
          icon: Clock
        }
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100 border-green-200';
      case 'dispatched': return 'text-blue-600 bg-blue-100 border-blue-200';
      case 'confirmed': return 'text-orange-600 bg-orange-100 border-orange-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getStepStatus = (stepStatus: string, currentStatus: string) => {
    const order = ['pending', 'confirmed', 'dispatched', 'completed'];
    const stepIndex = order.indexOf(stepStatus);
    const currentIndex = order.indexOf(currentStatus);
    
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'upcoming';
  };

  if (selectedOrder) {
    return (
      <div className="flex flex-col h-full bg-[#fafaf8]">
        {/* Detail Header */}
        <div className="p-6 border-b border-gray-200 bg-white">
          <button 
            onClick={() => setSelectedOrder(null)}
            className="flex items-center text-gray-600 mb-4 hover:text-[#2d5f3f] transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            <span className="font-medium">Back to Tracking</span>
          </button>
          
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 mb-1">Order #{selectedOrder.id}</p>
              <h2 className="text-2xl font-bold text-gray-900">{selectedOrder.crop}</h2>
              <p className="text-gray-600">{selectedOrder.quantity} • From {selectedOrder.farmer}</p>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(selectedOrder.currentStatus)}`}>
              {selectedOrder.currentStatus}
            </div>
          </div>
        </div>

        {/* Tracking Timeline */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Driver Info Card (if dispatched) */}
          {selectedOrder.currentStatus === 'dispatched' && selectedOrder.driver && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-8 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-blue-900 flex items-center">
                  <Truck className="w-4 h-4 mr-2" />
                  Delivery in Progress
                </h3>
                <span className="text-xs text-blue-700 bg-blue-100 px-2 py-1 rounded-md">
                  Est. 2 hrs
                </span>
              </div>
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center text-blue-800 font-bold">
                  {selectedOrder.driver.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{selectedOrder.driver.name}</p>
                  <p className="text-xs text-gray-500">{selectedOrder.driver.vehicle}</p>
                </div>
                <div className="flex-1" />
                <button className="p-2 bg-white rounded-full shadow-sm text-blue-600 hover:bg-blue-50">
                  <Phone className="w-4 h-4" />
                </button>
                <button className="p-2 bg-white rounded-full shadow-sm text-blue-600 hover:bg-blue-50">
                  <MessageSquare className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Timeline */}
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-gray-200" />

            <div className="space-y-8">
              {[...selectedOrder.steps].reverse().map((step, index) => {
                const stepState = getStepStatus(step.status, selectedOrder.currentStatus);
                const Icon = step.icon;
                
                let iconColor = "bg-gray-100 text-gray-400"; // Upcoming
                let lineColor = "border-gray-200";
                
                if (stepState === 'completed') {
                  iconColor = "bg-[#2d5f3f] text-white";
                } else if (stepState === 'current') {
                  iconColor = "bg-[#e8915f] text-white ring-4 ring-[#e8915f]/20";
                }

                return (
                  <div key={index} className="relative flex items-start group">
                    <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${iconColor}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    
                    <div className="ml-4 flex-1 pt-1">
                      <div className="flex justify-between items-start">
                        <h4 className={`text-base font-semibold ${stepState === 'upcoming' ? 'text-gray-400' : 'text-gray-900'}`}>
                          {step.label}
                        </h4>
                        {step.date && (
                          <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-full border border-gray-100">
                            {step.date}
                          </span>
                        )}
                      </div>
                      
                      {step.description && (
                        <p className={`mt-1 text-sm ${stepState === 'upcoming' ? 'text-gray-300' : 'text-gray-600'}`}>
                          {step.description}
                        </p>
                      )}

                      {/* Delivery Address for Dispatched Step */}
                      {step.status === 'dispatched' && stepState === 'upcoming' && (
                        <div className="mt-2 flex items-center text-xs text-gray-400">
                          <MapPin className="w-3 h-3 mr-1" />
                          To: {selectedOrder.deliveryAddress}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-[#fafaf8]">
       <div className="px-6 py-6">
        <h2 className="font-semibold text-gray-900 mb-1">Track Orders</h2>
        <p className="text-sm text-gray-500 mb-6">Monitor your active shipments in real-time</p>

        <div className="space-y-4">
          {trackedOrders.map((order) => (
            <button
              key={order.id}
              onClick={() => setSelectedOrder(order)}
              className="w-full bg-white rounded-xl p-4 shadow-sm border border-transparent hover:border-[#2d5f3f]/30 hover:shadow-md transition-all text-left"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    order.currentStatus === 'dispatched' ? 'bg-blue-50 text-blue-600' :
                    order.currentStatus === 'completed' ? 'bg-green-50 text-green-600' :
                    'bg-orange-50 text-orange-600'
                  }`}>
                    {order.currentStatus === 'dispatched' ? <Truck className="w-5 h-5" /> :
                     order.currentStatus === 'completed' ? <CheckCircle className="w-5 h-5" /> :
                     <Package className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{order.crop}</h3>
                    <p className="text-xs text-gray-500">#{order.id}</p>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded-md text-xs font-medium capitalize ${getStatusColor(order.currentStatus)}`}>
                  {order.currentStatus}
                </div>
              </div>
              
              <div className="pl-12">
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-2" />
                  {order.quantity} from {order.farmer}
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                  <p className="text-xs text-gray-400">Updated {order.lastUpdate}</p>
                  <div className="flex items-center text-[#2d5f3f] text-xs font-medium">
                    View Details <ChevronRight className="w-3 h-3 ml-1" />
                  </div>
                </div>
              </div>

              {/* Progress Bar for Active Orders */}
              {order.currentStatus !== 'completed' && (
                <div className="mt-3 pl-12">
                   <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                     <div 
                        className={`h-full rounded-full ${
                          order.currentStatus === 'dispatched' ? 'bg-blue-500 w-3/4' : 
                          order.currentStatus === 'confirmed' ? 'bg-orange-500 w-1/2' : 
                          'bg-yellow-500 w-1/4'
                        }`} 
                     />
                   </div>
                   <p className="text-[10px] text-gray-400 mt-1 text-right">
                      {order.currentStatus === 'dispatched' ? 'In Transit' : 
                       order.currentStatus === 'confirmed' ? 'Preparing' : 'Awaiting Confirmation'}
                   </p>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
