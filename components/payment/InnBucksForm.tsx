'use client';

import React, { useState } from 'react';
import { Wallet, AlertCircle, Loader2, Mail } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface InnBucksFormProps {
  amount: number;
  currency: 'USD' | 'ZIG';
  onSuccess: (paymentData: any) => void;
  onError: (error: string) => void;
}

export function InnBucksForm({ amount, currency, onSuccess, onError }: InnBucksFormProps) {
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhoneNumber = (phone: string): boolean => {
    // Zimbabwe or international phone number
    const phoneRegex = /^(\+263|0)[0-9]{9}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const formatPhoneNumber = (value: string): string => {
    // Remove all non-digits and plus
    let digits = value.replace(/[^\d+]/g, '');

    // Handle international format
    if (digits.startsWith('+263')) {
      const rest = digits.slice(4);
      if (rest.length <= 3) return `+263 ${rest}`;
      if (rest.length <= 6) return `+263 ${rest.slice(0, 3)} ${rest.slice(3)}`;
      return `+263 ${rest.slice(0, 3)} ${rest.slice(3, 6)} ${rest.slice(6, 9)}`;
    }

    // Handle local format
    if (digits.startsWith('0')) {
      if (digits.length <= 3) return digits;
      if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
      return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 10)}`;
    }

    return digits;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    const cleanPhone = phoneNumber.replace(/\s/g, '');
    if (!validatePhoneNumber(cleanPhone)) {
      setError('Please enter a valid Zimbabwe phone number');
      return;
    }

    setProcessing(true);

    try {
      // Simulate InnBucks payment processing
      // In production, this would call the InnBucks API
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simulate 92% success rate
      const isSuccess = Math.random() > 0.08;

      if (isSuccess) {
        // Simulate successful payment
        const paymentData = {
          method: 'innbucks',
          email,
          phoneNumber: cleanPhone,
          amount,
          currency,
          reference: `INN-${Date.now()}`,
          status: 'success',
          timestamp: new Date().toISOString(),
        };

        onSuccess(paymentData);
      } else {
        // Simulate payment failure
        throw new Error('Insufficient wallet balance or payment declined.');
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
      {/* Email Input */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
          InnBucks Account Email
        </label>
        <div className="relative">
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
            <Mail size={20} />
          </div>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError('');
            }}
            placeholder="you@example.com"
            required
            className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-colors text-white placeholder-gray-500"
          />
        </div>
      </div>

      {/* Phone Number Input */}
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
          Mobile Number (Linked to InnBucks)
        </label>
        <div className="relative">
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
            <Wallet size={20} />
          </div>
          <input
            id="phone"
            type="tel"
            value={phoneNumber}
            onChange={handlePhoneChange}
            placeholder="077 123 4567 or +263 77 123 4567"
            required
            className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-colors text-white placeholder-gray-500"
          />
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Payment will be deducted from your InnBucks wallet
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
          via InnBucks Digital Wallet
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
            <Wallet size={18} />
            Pay {currency === 'USD' ? `$${amount.toFixed(2)}` : `ZIG ${amount.toLocaleString()}`}
          </span>
        )}
      </Button>

      {/* Info Note */}
      <div className="bg-purple-900/20 border border-purple-700/50 rounded-lg p-4">
        <p className="text-sm text-purple-300">
          <strong>What is InnBucks?</strong>
        </p>
        <p className="text-sm text-gray-400 mt-1">
          InnBucks is a digital wallet for easy remittances and payments. Funds will be debited
          from your wallet balance instantly.
        </p>
      </div>

      {/* Additional Support */}
      <div className="text-center">
        <a
          href="https://innbucks.co.zw"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-purple-400 hover:text-purple-300 transition"
        >
          Don't have an InnBucks account? Sign up here →
        </a>
      </div>
    </form>
  );
}
