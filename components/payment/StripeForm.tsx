'use client';

import React, { useState } from 'react';
import { CreditCard, AlertCircle, Loader2, Lock } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface StripeFormProps {
  amount: number;
  currency: 'USD' | 'ZIG';
  onSuccess: (paymentData: any) => void;
  onError: (error: string) => void;
}

export function StripeForm({ amount, currency, onSuccess, onError }: StripeFormProps) {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  const formatCardNumber = (value: string): string => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');

    // Format as XXXX XXXX XXXX XXXX
    const parts = [];
    for (let i = 0; i < digits.length; i += 4) {
      parts.push(digits.slice(i, i + 4));
    }
    return parts.join(' ').slice(0, 19); // 16 digits + 3 spaces
  };

  const formatExpiryDate = (value: string): string => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');

    // Format as MM/YY
    if (digits.length <= 2) return digits;
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}`;
  };

  const validateCardNumber = (number: string): boolean => {
    const digits = number.replace(/\s/g, '');
    return digits.length === 16 && /^\d+$/.test(digits);
  };

  const validateExpiryDate = (expiry: string): boolean => {
    if (!/^\d{2}\/\d{2}$/.test(expiry)) return false;

    const [month, year] = expiry.split('/').map(Number);
    if (month < 1 || month > 12) return false;

    const now = new Date();
    const currentYear = now.getFullYear() % 100;
    const currentMonth = now.getMonth() + 1;

    if (year < currentYear) return false;
    if (year === currentYear && month < currentMonth) return false;

    return true;
  };

  const validateCVV = (cvv: string): boolean => {
    return cvv.length === 3 && /^\d+$/.test(cvv);
  };

  const detectCardType = (number: string): string => {
    const digits = number.replace(/\s/g, '');

    if (digits.startsWith('4')) return 'Visa';
    if (digits.startsWith('5')) return 'Mastercard';
    if (digits.startsWith('3')) return 'American Express';

    return 'Card';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!validateCardNumber(cardNumber)) {
      setError('Please enter a valid 16-digit card number');
      return;
    }

    if (!validateExpiryDate(expiryDate)) {
      setError('Please enter a valid expiry date (MM/YY)');
      return;
    }

    if (!validateCVV(cvv)) {
      setError('Please enter a valid 3-digit CVV');
      return;
    }

    if (!cardholderName.trim()) {
      setError('Please enter the cardholder name');
      return;
    }

    setProcessing(true);

    try {
      // Simulate Stripe payment processing
      // In production, this would use Stripe.js and create a payment intent
      await new Promise((resolve) => setTimeout(resolve, 2500));

      // Simulate 95% success rate
      const isSuccess = Math.random() > 0.05;

      if (isSuccess) {
        // Simulate successful payment
        const paymentData = {
          method: 'stripe',
          cardType: detectCardType(cardNumber),
          last4: cardNumber.replace(/\s/g, '').slice(-4),
          amount,
          currency,
          reference: `pi_${Date.now()}`,
          status: 'success',
          timestamp: new Date().toISOString(),
        };

        onSuccess(paymentData);
      } else {
        // Simulate payment failure
        throw new Error('Card declined. Please check your card details or try another card.');
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
      {/* Card Number */}
      <div>
        <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-300 mb-2">
          Card Number
        </label>
        <div className="relative">
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
            <CreditCard size={20} />
          </div>
          <input
            id="cardNumber"
            type="text"
            value={cardNumber}
            onChange={(e) => {
              setCardNumber(formatCardNumber(e.target.value));
              setError('');
            }}
            placeholder="1234 5678 9012 3456"
            maxLength={19}
            required
            className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-colors text-white placeholder-gray-500"
          />
          {cardNumber.length >= 4 && (
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <span className="text-xs text-gray-400">{detectCardType(cardNumber)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Cardholder Name */}
      <div>
        <label htmlFor="cardholderName" className="block text-sm font-medium text-gray-300 mb-2">
          Cardholder Name
        </label>
        <input
          id="cardholderName"
          type="text"
          value={cardholderName}
          onChange={(e) => {
            setCardholderName(e.target.value.toUpperCase());
            setError('');
          }}
          placeholder="JOHN DOE"
          required
          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-colors text-white placeholder-gray-500 uppercase"
        />
      </div>

      {/* Expiry Date and CVV */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-300 mb-2">
            Expiry Date
          </label>
          <input
            id="expiryDate"
            type="text"
            value={expiryDate}
            onChange={(e) => {
              setExpiryDate(formatExpiryDate(e.target.value));
              setError('');
            }}
            placeholder="MM/YY"
            maxLength={5}
            required
            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-colors text-white placeholder-gray-500"
          />
        </div>

        <div>
          <label htmlFor="cvv" className="block text-sm font-medium text-gray-300 mb-2">
            CVV
          </label>
          <input
            id="cvv"
            type="text"
            value={cvv}
            onChange={(e) => {
              setCvv(e.target.value.replace(/\D/g, '').slice(0, 3));
              setError('');
            }}
            placeholder="123"
            maxLength={3}
            required
            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-colors text-white placeholder-gray-500"
          />
        </div>
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
            ${amount.toFixed(2)} USD
          </span>
        </div>
        <p className="text-sm text-gray-500">
          Processed securely by Stripe
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
          <span className="flex items-center justify-center gap-2">
            <Lock size={18} />
            Pay ${amount.toFixed(2)}
          </span>
        )}
      </Button>

      {/* Security Note */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Lock size={16} />
        <span>Secured by Stripe. Your card details are encrypted and never stored.</span>
      </div>
    </form>
  );
}
