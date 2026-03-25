import React, { useState } from 'react';
import { ArrowLeft, Scan, Package, AlertCircle, CheckCircle2 } from 'lucide-react';

interface BatchIntakeProps {
  onBack: () => void;
}

export function BatchIntake({ onBack }: BatchIntakeProps) {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    batchId: '',
    receivedQuantity: '',
    qualityGrade: 'A',
  });

  // Mock existing batches (in real app, this would be from backend)
  const existingBatches = [
    { batchId: 'KT-1737547200-ABC123XYZ', farmer: 'John Mwangi', crop: 'Tomatoes', quantity: '250' },
    { batchId: 'KT-1737460800-DEF456UVW', farmer: 'Mary Njeri', crop: 'Cabbage', quantity: '180' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate batch ID exists
    const batch = existingBatches.find(b => b.batchId === formData.batchId);
    if (!batch) {
      setError('Batch ID not found. Please verify and try again.');
      return;
    }

    // In real app, check if already intaken
    // For demo, we'll allow it

    // Create intake record
    const facilityId = 'FAC-1737547200-DEMO123';
    const intakeRecord = {
      intakeId: `INT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      batchId: formData.batchId,
      facilityId,
      receivedQuantity: formData.receivedQuantity,
      qualityGrade: formData.qualityGrade,
      sourceFarm: batch.farmer,
      cropType: batch.crop,
      intakeDate: new Date().toISOString(),
      immutable: true,
    };

    console.log('Intake record created:', intakeRecord);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#fafaf8] flex flex-col items-center justify-center p-6">
        <div className="bg-white rounded-2xl p-8 text-center max-w-sm shadow-lg">
          <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Batch Intaken!</h2>
          
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-4">
            <p className="text-xs text-gray-600 mb-1">Batch ID</p>
            <p className="font-mono font-bold text-[#e8915f] text-sm break-all">{formData.batchId}</p>
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-600">Received:</span>
                <span className="font-semibold">{formData.receivedQuantity} kg</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">Grade:</span>
                <span className="font-semibold">Grade {formData.qualityGrade}</span>
              </div>
            </div>
          </div>

          <p className="text-gray-600 mb-6">
            The batch has been added to your inventory and linked to the supply chain.
          </p>

          <button
            onClick={onBack}
            className="w-full bg-[#e8915f] text-white rounded-xl py-3 font-semibold hover:bg-[#d67d4a] transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafaf8] flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="flex items-center mb-4">
          <button onClick={onBack} className="p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-gray-900 ml-2">Batch Intake</h1>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 p-6 overflow-y-auto">
        <form onSubmit={handleSubmit} className="space-y-5 max-w-md mx-auto">
          {/* Batch ID */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Scan className="w-4 h-4 inline mr-1" />
              Batch ID *
            </label>
            <input
              type="text"
              placeholder="Scan or enter batch ID"
              value={formData.batchId}
              onChange={(e) => {
                setFormData({ ...formData, batchId: e.target.value });
                setError('');
              }}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 font-mono text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#e8915f]"
              required
            />
            {error && (
              <div className="mt-2 bg-red-50 border border-red-200 rounded-lg p-3 flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}
          </div>

          {/* Quick Select (Demo Helper) */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-xs font-semibold text-blue-900 mb-2">Quick Select (Demo):</p>
            <div className="space-y-1">
              {existingBatches.map((batch) => (
                <button
                  key={batch.batchId}
                  type="button"
                  onClick={() => setFormData({ ...formData, batchId: batch.batchId })}
                  className="w-full text-left bg-white border border-blue-200 rounded-lg px-3 py-2 text-xs hover:bg-blue-50 transition-colors"
                >
                  <span className="font-mono text-blue-700 block">{batch.batchId}</span>
                  <span className="text-gray-600">{batch.farmer} - {batch.crop} ({batch.quantity} kg)</span>
                </button>
              ))}
            </div>
          </div>

          {/* Received Quantity */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Package className="w-4 h-4 inline mr-1" />
              Received Quantity (kg) *
            </label>
            <input
              type="number"
              step="0.1"
              placeholder="Enter received quantity"
              value={formData.receivedQuantity}
              onChange={(e) => setFormData({ ...formData, receivedQuantity: e.target.value })}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#e8915f]"
              required
            />
          </div>

          {/* Quality Grade */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Quality Grade *
            </label>
            <div className="grid grid-cols-3 gap-3">
              {['A', 'B', 'C'].map((grade) => (
                <label
                  key={grade}
                  className={`flex items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    formData.qualityGrade === grade
                      ? 'border-[#e8915f] bg-[#e8915f]/5'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <input
                    type="radio"
                    name="qualityGrade"
                    value={grade}
                    checked={formData.qualityGrade === grade}
                    onChange={(e) => setFormData({ ...formData, qualityGrade: e.target.value })}
                    className="sr-only"
                  />
                  <span className="font-bold text-xl text-gray-900">Grade {grade}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-orange-900 font-semibold mb-1">Important</p>
                <p className="text-sm text-orange-800">
                  You cannot modify farmer harvest data. This intake record will be immutable and linked to the original batch.
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#e8915f] text-white rounded-xl py-4 font-semibold text-lg shadow-md hover:bg-[#d67d4a] transition-colors mt-8"
          >
            Record Intake
          </button>
        </form>
      </div>
    </div>
  );
}
