'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PaymentMethodSelector, PaymentMethod } from './PaymentMethodSelector';
import { PaynowForm } from './PaynowForm';
import { StripeForm } from './StripeForm';
import { InnBucksForm } from './InnBucksForm';
import { ArrowLeft } from 'lucide-react';

interface PaymentContainerProps {
  bookingId: string;
  amount: number;
  currency: 'USD' | 'ZIG';
  talentName: string;
  onPaymentSuccess?: (paymentData: any) => void;
}

export function PaymentContainer({
  bookingId,
  amount,
  currency,
  talentName,
  onPaymentSuccess,
}: PaymentContainerProps) {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [processing, setProcessing] = useState(false);

  const handlePaymentSuccess = async (paymentData: any) => {
    setProcessing(true);

    try {
      // Save payment to database
      // In production, this would call the API
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId,
          ...paymentData,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save payment');
      }

      // Call custom success handler if provided
      if (onPaymentSuccess) {
        onPaymentSuccess(paymentData);
      }

      // Redirect to confirmation page
      router.push(`/booking-confirmation?ref=${paymentData.reference}&booking=${bookingId}`);
    } catch (error) {
      console.error('Payment save error:', error);
      // Even if save fails, redirect to confirmation since payment went through
      router.push(`/booking-confirmation?ref=${paymentData.reference}&booking=${bookingId}`);
    } finally {
      setProcessing(false);
    }
  };

  const handlePaymentError = (error: string) => {
    console.error('Payment error:', error);
    // Error is already shown in the form component
  };

  const handleBackToSelection = () => {
    setSelectedMethod(null);
  };

  return (
    <div className="bg-gray-900/50 border border-purple-700/30 rounded-2xl p-6 sm:p-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          {selectedMethod && (
            <button
              onClick={handleBackToSelection}
              className="p-2 hover:bg-gray-800 rounded-lg transition"
              disabled={processing}
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <div>
            <h2 className="text-2xl font-bold text-white">Complete Payment</h2>
            <p className="text-gray-400 text-sm mt-1">
              Booking video from {talentName}
            </p>
          </div>
        </div>

        {/* Amount Display */}
        <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-700/50 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-300">Total Amount</span>
            <span className="text-3xl font-bold text-white">
              {currency === 'USD' ? `$${amount.toFixed(2)}` : `ZIG ${amount.toLocaleString()}`}
            </span>
          </div>
        </div>
      </div>

      {/* Payment Method Selection or Form */}
      {!selectedMethod ? (
        <PaymentMethodSelector
          selectedMethod={selectedMethod}
          onSelectMethod={setSelectedMethod}
          currency={currency}
        />
      ) : (
        <div>
          {selectedMethod === 'paynow' && (
            <PaynowForm
              amount={amount}
              currency={currency}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
            />
          )}
          {selectedMethod === 'stripe' && (
            <StripeForm
              amount={amount}
              currency={currency}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
            />
          )}
          {selectedMethod === 'innbucks' && (
            <InnBucksForm
              amount={amount}
              currency={currency}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
            />
          )}
        </div>
      )}

      {/* Security Note */}
      <div className="mt-6 pt-6 border-t border-gray-800">
        <p className="text-sm text-gray-500 text-center">
          🔒 All payments are secured with 256-bit SSL encryption
        </p>
      </div>
    </div>
  );
}
