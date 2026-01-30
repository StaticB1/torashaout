'use client';

import React, { useState } from 'react';
import { Smartphone, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface PaynowFormProps {
  amount: number;
  currency: 'USD' | 'ZIG';
  onSuccess: (paymentData: any) => void;
  onError: (error: string) => void;
}

type PaynowMethod = 'ecocash' | 'onemoney';

export function PaynowForm({ amount, currency, onSuccess, onError }: PaynowFormProps) {
  const [method, setMethod] = useState<PaynowMethod>('ecocash');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  const validatePhoneNumber = (phone: string): boolean => {
    // Zimbabwe phone number format: 07X XXX XXXX
    const phoneRegex = /^07[0-9]{8}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const formatPhoneNumber = (value: string): string => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');

    // Format as 07X XXX XXXX
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 10)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate phone number
    const cleanPhone = phoneNumber.replace(/\s/g, '');
    if (!validatePhoneNumber(cleanPhone)) {
      setError('Please enter a valid Zimbabwe phone number (e.g., 077 123 4567)');
      return;
    }

    setProcessing(true);

    try {
      // Simulate Paynow payment processing
      // In production, this would call the Paynow API
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simulate 90% success rate
      const isSuccess = Math.random() > 0.1;

      if (isSuccess) {
        // Simulate successful payment
        const paymentData = {
          method: 'paynow',
          provider: method,
          phoneNumber: cleanPhone,
          amount,
          currency,
          reference: `PAY-${Date.now()}`,
          pollUrl: `https://www.paynow.co.zw/Payment/ConfirmPayment/${Date.now()}`,
          status: 'success',
          timestamp: new Date().toISOString(),
        };

        onSuccess(paymentData);
      } else {
        // Simulate payment failure
        throw new Error('Payment declined. Please try again or use a different method.');
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Payment failed. Please try again.';
      setError(errorMessage);
      onError(errorMessage);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Payment Method Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3">
          Select Mobile Money Provider
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setMethod('ecocash')}
            className={`p-4 rounded-lg border-2 transition-all ${
              method === 'ecocash'
                ? 'border-green-500 bg-green-900/20'
                : 'border-gray-700 bg-gray-900/50 hover:border-gray-600'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Smartphone size={20} className="text-green-400" />
              <span className="font-semibold text-white">EcoCash</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setMethod('onemoney')}
            className={`p-4 rounded-lg border-2 transition-all ${
              method === 'onemoney'
                ? 'border-purple-500 bg-purple-900/20'
                : 'border-gray-700 bg-gray-900/50 hover:border-gray-600'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Smartphone size={20} className="text-purple-400" />
              <span className="font-semibold text-white">OneMoney</span>
            </div>
          </button>
        </div>
      </div>

      {/* Phone Number Input */}
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
          Mobile Number
        </label>
        <div className="relative">
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
            <Smartphone size={20} />
          </div>
          <input
            id="phone"
            type="tel"
            value={phoneNumber}
            onChange={handlePhoneChange}
            placeholder="077 123 4567"
            maxLength={12}
            required
            className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-colors text-white placeholder-gray-500"
          />
        </div>
        <p className="text-sm text-gray-500 mt-2">
          You'll receive a prompt on your phone to approve the payment
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-900/20 border border-red-700/50 rounded-lg flex items-start space-x-3">
          <AlertCircle size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Amount Summary */}
      <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-400">Amount to pay</span>
          <span className="text-2xl font-bold text-white">
            {currency === 'USD' ? `$${amount.toFixed(2)}` : `ZIG ${amount.toLocaleString()}`}
          </span>
        </div>
        <p className="text-sm text-gray-500">
          via {method === 'ecocash' ? 'EcoCash' : 'OneMoney'}
        </p>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full"
        disabled={processing}
      >
        {processing ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 size={20} className="animate-spin" />
            Processing Payment...
          </span>
        ) : (
          `Pay ${currency === 'USD' ? `$${amount.toFixed(2)}` : `ZIG ${amount.toLocaleString()}`}`
        )}
      </Button>

      {/* Info Note */}
      <div className="bg-blue-900/20 border border-blue-700/50 rounded-lg p-4">
        <p className="text-sm text-blue-300">
          <strong>Note:</strong> After clicking "Pay", check your phone for a payment prompt.
          Enter your PIN to complete the transaction.
        </p>
      </div>
    </form>
  );
}
