import React, { useState } from 'react';
import { ArrowLeft, Package, Plus, Minus, CheckCircle2, ShoppingCart, AlertCircle, Edit2, Truck, Calendar, MapPin } from 'lucide-react';

interface OrderPlacementProps {
  selectedProduce: any;
  onBack: () => void;
  onComplete: () => void;
}

export function OrderPlacement({ selectedProduce, onBack, onComplete }: OrderPlacementProps) {
  const [orderQuantity, setOrderQuantity] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [useDefaultLocation, setUseDefaultLocation] = useState(true);
  const [customLocation, setCustomLocation] = useState({ latitude: null as number | null, longitude: null as number | null });
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [orderData, setOrderData] = useState<any>(null);

  // Mock default delivery location from registration (in real app, this would come from user profile)
  const defaultDeliveryLocation = {
    latitude: -1.286389,
    longitude: 36.817223,
    address: 'Nairobi, Kenya'
  };

  const maxQuantity = parseFloat(selectedProduce.quantity.replace(' kg', ''));

  // Delivery method options with descriptions and estimated lead times
  const deliveryMethods = [
    {
      id: 'farm_pickup',
      label: 'Farm Pickup',
      description: 'Collect directly from farm',
      icon: '🚜',
      leadTime: 1,
      fee: 'Free'
    },
    {
      id: 'aggregation_center',
      label: 'Aggregation Center',
      description: 'Pick up from collection hub',
      icon: '🏪',
      leadTime: 2,
      fee: 'Free'
    },
    {
      id: 'delivery_to_buyer',
      label: 'Delivery to Buyer',
      description: 'Seller delivers to your location',
      icon: '🚚',
      leadTime: 2,
      fee: '+$15'
    },
    {
      id: 'arrange_transport',
      label: 'Arrange Transport',
      description: 'Third-party logistics service',
      icon: '📦',
      leadTime: 3,
      fee: 'Variable'
    },
  ];

  // Calculate minimum delivery date based on selected method
  const getMinDeliveryDate = () => {
    const selectedMethod = deliveryMethods.find(m => m.id === deliveryMethod);
    const leadTime = selectedMethod ? selectedMethod.leadTime : 1;
    const minDate = new Date();
    minDate.setDate(minDate.getDate() + leadTime);
    return minDate.toISOString().split('T')[0];
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    
    const generatedOrderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const selectedMethodData = deliveryMethods.find(m => m.id === deliveryMethod);
    
    const data = {
      orderId: generatedOrderId,
      batchId: selectedProduce.id,
      cropType: selectedProduce.crop,
      orderQuantity: parseFloat(orderQuantity),
      unitPrice: parseFloat(selectedProduce.price.replace('$', '')) / maxQuantity,
      totalPrice: parseFloat(orderQuantity) * (parseFloat(selectedProduce.price.replace('$', '')) / maxQuantity),
      farmer: selectedProduce.farmer,
      location: selectedProduce.location,
      quality: selectedProduce.quality,
      harvestDate: selectedProduce.harvestDate,
      deliveryMethod: selectedMethodData?.label || '',
      deliveryMethodId: deliveryMethod,
      deliveryFee: selectedMethodData?.fee || 'Free',
      deliveryDate: new Date(deliveryDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
      status: 'pending',
      createdAt: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
      canCancel: true,
    };
    
    setOrderData(data);
    setOrderId(generatedOrderId);
    setShowConfirmation(true);
  };

  const handleConfirmOrder = () => {
    console.log('Order confirmed:', orderData);
    setSubmitted(true);
  };

  const handleEditOrder = () => {
    setShowConfirmation(false);
  };

  // Success screen after order is confirmed
  if (submitted) {
    return (
      <div className="min-h-screen bg-[#fafaf8] flex flex-col items-center justify-center p-6">
        <div className="bg-white rounded-2xl p-8 text-center max-w-sm shadow-lg">
          <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Placed!</h2>
          
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-4">
            <p className="text-xs text-gray-600 mb-1">Order ID</p>
            <p className="font-mono font-bold text-[#2d5f3f] text-sm break-all">{orderId}</p>
          </div>

          <p className="text-gray-600 mb-6">
            Your order is pending confirmation. You can track its status in your orders list.
          </p>

          <button
            onClick={onComplete}
            className="w-full bg-[#2d5f3f] text-white rounded-xl py-3 font-semibold hover:bg-[#234a32] transition-colors"
          >
            View My Orders
          </button>
        </div>
      </div>
    );
  }

  // Confirmation screen - review order details before finalizing
  if (showConfirmation && orderData) {
    return (
      <div className="min-h-screen bg-[#fafaf8] flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <button onClick={handleEditOrder} className="p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft className="w-6 h-6 text-gray-700" />
            </button>
            <h1 className="text-xl font-bold text-gray-900 ml-2">Confirm Order</h1>
          </div>
        </div>

        {/* Alert Banner */}
        <div className="p-6">
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-orange-900 mb-1">Review Your Order</p>
              <p className="text-xs text-orange-700">
                Please verify all details are correct before confirming. You can go back to make changes.
              </p>
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div className="flex-1 px-6 pb-6 overflow-y-auto">
          <div className="max-w-md mx-auto space-y-4">
            {/* Order ID */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <p className="text-xs text-gray-600 mb-1">Order ID</p>
              <p className="font-mono font-semibold text-gray-900 text-sm break-all">{orderData.orderId}</p>
            </div>

            {/* Product Details */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Package className="w-4 h-4 mr-2 text-[#2d5f3f]" />
                Product Details
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Crop</span>
                  <span className="font-semibold text-gray-900">{orderData.cropType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Batch ID</span>
                  <span className="font-mono text-xs text-gray-900">{orderData.batchId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Quality</span>
                  <span className="font-semibold text-gray-900">{orderData.quality}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Harvest Date</span>
                  <span className="text-gray-900">{orderData.harvestDate}</span>
                </div>
              </div>
            </div>

            {/* Supplier Details */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3">Supplier Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Farmer</span>
                  <span className="font-semibold text-gray-900">{orderData.farmer}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Location</span>
                  <span className="text-gray-900">{orderData.location}</span>
                </div>
              </div>
            </div>

            {/* Pricing Details */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <h3 className="font-semibold text-green-900 mb-3">Order Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-green-700">Quantity</span>
                  <span className="font-semibold text-green-900">{orderData.orderQuantity} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-700">Unit Price</span>
                  <span className="font-semibold text-green-900">${orderData.unitPrice.toFixed(2)}/kg</span>
                </div>
                <div className="border-t border-green-300 pt-2 mt-2">
                  <div className="flex justify-between">
                    <span className="font-semibold text-green-900">Total Amount</span>
                    <span className="font-bold text-xl text-green-900">${orderData.totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Details */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Delivery Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Method</span>
                  <span className="font-semibold text-gray-900">{orderData.deliveryMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fee</span>
                  <span className="font-semibold text-gray-900">{orderData.deliveryFee}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date</span>
                  <span className="font-semibold text-gray-900">{orderData.deliveryDate}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4">
              <button
                onClick={handleConfirmOrder}
                className="w-full bg-[#2d5f3f] text-white rounded-xl py-4 font-semibold text-lg flex items-center justify-center space-x-2 shadow-md hover:bg-[#234a32] transition-colors"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>Confirm Order</span>
              </button>
              
              <button
                onClick={handleEditOrder}
                className="w-full bg-white border-2 border-gray-300 text-gray-700 rounded-xl py-3 font-semibold flex items-center justify-center space-x-2 hover:bg-gray-50 transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                <span>Edit Order</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Order form - initial screen
  return (
    <div className="min-h-screen bg-[#fafaf8] flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="flex items-center mb-4">
          <button onClick={onBack} className="p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-gray-900 ml-2">Place Order</h1>
        </div>
      </div>

      {/* Product Summary */}
      <div className="p-6">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-2">{selectedProduce.crop}</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="text-gray-600">Available</p>
              <p className="font-semibold text-gray-900">{selectedProduce.quantity}</p>
            </div>
            <div>
              <p className="text-gray-600">Price</p>
              <p className="font-semibold text-[#2d5f3f]">{selectedProduce.price}</p>
            </div>
            <div>
              <p className="text-gray-600">Farmer</p>
              <p className="font-semibold text-gray-900">{selectedProduce.farmer}</p>
            </div>
            <div>
              <p className="text-gray-600">Quality</p>
              <p className="font-semibold text-gray-900">{selectedProduce.quality}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Order Form */}
      <form onSubmit={handlePlaceOrder} className="flex-1 px-6 pb-6">
        <div className="max-w-md mx-auto space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Package className="w-4 h-4 inline mr-1" />
              Order Quantity (kg) *
            </label>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => setOrderQuantity(String(Math.max(0, parseFloat(orderQuantity || '0') - 10)))}
                className="bg-gray-200 hover:bg-gray-300 rounded-lg p-3 transition-colors"
              >
                <Minus className="w-5 h-5 text-gray-700" />
              </button>
              <input
                type="number"
                step="0.1"
                placeholder="0"
                value={orderQuantity}
                onChange={(e) => setOrderQuantity(e.target.value)}
                max={maxQuantity}
                className="flex-1 border border-gray-300 rounded-xl px-4 py-3 text-center text-lg font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2d5f3f]"
                required
              />
              <button
                type="button"
                onClick={() => setOrderQuantity(String(Math.min(maxQuantity, parseFloat(orderQuantity || '0') + 10)))}
                className="bg-gray-200 hover:bg-gray-300 rounded-lg p-3 transition-colors"
              >
                <Plus className="w-5 h-5 text-gray-700" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">Maximum available: {maxQuantity} kg</p>
          </div>

          {/* Delivery Method */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              <Truck className="w-4 h-4 inline mr-1" />
              Delivery Method *
            </label>
            <div className="grid grid-cols-1 gap-3">
              {deliveryMethods.map(method => (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setDeliveryMethod(method.id)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    deliveryMethod === method.id
                      ? 'border-[#2d5f3f] bg-green-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{method.icon}</span>
                      <div>
                        <p className={`font-semibold ${
                          deliveryMethod === method.id ? 'text-[#2d5f3f]' : 'text-gray-900'
                        }`}>
                          {method.label}
                        </p>
                        <p className="text-xs text-gray-600">{method.description}</p>
                      </div>
                    </div>
                    {deliveryMethod === method.id && (
                      <CheckCircle2 className="w-5 h-5 text-[#2d5f3f] flex-shrink-0" />
                    )}
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">
                      <Calendar className="w-3 h-3 inline mr-1" />
                      {method.leadTime} {method.leadTime === 1 ? 'day' : 'days'} lead time
                    </span>
                    <span className={`font-semibold ${
                      method.fee === 'Free' ? 'text-green-600' : 'text-orange-600'
                    }`}>
                      {method.fee}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Delivery Date */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              Delivery Date *
            </label>
            <input
              type="date"
              value={deliveryDate}
              onChange={(e) => setDeliveryDate(e.target.value)}
              min={getMinDeliveryDate()}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2d5f3f]"
              required
            />
          </div>

          {/* Delivery Address */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <MapPin className="w-4 h-4 inline mr-1" />
              Delivery Address
            </label>
            
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-3">
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-blue-700 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs font-semibold text-blue-900 mb-1">Default Delivery Location</p>
                  <p className="text-xs text-blue-800 font-mono">
                    📍 {defaultDeliveryLocation.address}
                  </p>
                  <p className="text-xs text-blue-700 mt-1">
                    Lat: {defaultDeliveryLocation.latitude.toFixed(6)}, Lon: {defaultDeliveryLocation.longitude.toFixed(6)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <p className="text-xs text-gray-600">
                <strong>Note:</strong> This is your default delivery address set during registration. 
                You can change this address in your profile settings.
              </p>
            </div>
          </div>

          {/* Order Summary */}
          {orderQuantity && parseFloat(orderQuantity) > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <h4 className="font-semibold text-green-900 mb-2">Order Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-green-700">Quantity</span>
                  <span className="font-semibold text-green-900">{orderQuantity} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-700">Unit Price</span>
                  <span className="font-semibold text-green-900">
                    ${(parseFloat(selectedProduce.price.replace('$', '')) / maxQuantity).toFixed(2)}/kg
                  </span>
                </div>
                <div className="border-t border-green-300 pt-2 mt-2">
                  <div className="flex justify-between">
                    <span className="font-semibold text-green-900">Total</span>
                    <span className="font-bold text-lg text-green-900">
                      ${((parseFloat(orderQuantity) * parseFloat(selectedProduce.price.replace('$', ''))) / maxQuantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!orderQuantity || parseFloat(orderQuantity) <= 0 || parseFloat(orderQuantity) > maxQuantity || !deliveryMethod || !deliveryDate}
            className="w-full bg-[#2d5f3f] text-white rounded-xl py-4 font-semibold text-lg flex items-center justify-center space-x-2 shadow-md hover:bg-[#234a32] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="w-5 h-5" />
            <span>Place Order</span>
          </button>
        </div>
      </form>
    </div>
  );
}