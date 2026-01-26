'use client';

import React from 'react';
import { CreditCard, Smartphone, Wallet } from 'lucide-react';

export type PaymentMethod = 'paynow' | 'stripe' | 'innbucks';

interface PaymentMethodOption {
  id: PaymentMethod;
  name: string;
  description: string;
  icon: React.ReactNode;
  currencies: string[];
  recommended?: boolean;
}

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethod | null;
  onSelectMethod: (method: PaymentMethod) => void;
  currency: 'USD' | 'ZIG';
}

export function PaymentMethodSelector({
  selectedMethod,
  onSelectMethod,
  currency,
}: PaymentMethodSelectorProps) {
  const paymentMethods: PaymentMethodOption[] = [
    {
      id: 'paynow',
      name: 'Paynow',
      description: 'EcoCash, OneMoney, Visa & Mastercard',
      icon: <Smartphone size={24} className="text-green-400" />,
      currencies: ['USD', 'ZIG'],
      recommended: currency === 'ZIG',
    },
    {
      id: 'stripe',
      name: 'Card Payment',
      description: 'Visa, Mastercard, American Express',
      icon: <CreditCard size={24} className="text-blue-400" />,
      currencies: ['USD'],
      recommended: currency === 'USD',
    },
    {
      id: 'innbucks',
      name: 'InnBucks',
      description: 'Digital wallet & remittances',
      icon: <Wallet size={24} className="text-purple-400" />,
      currencies: ['USD', 'ZIG'],
    },
  ];

  // Filter methods by currency support
  const availableMethods = paymentMethods.filter((method) =>
    method.currencies.includes(currency)
  );

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white mb-4">
        Select Payment Method
      </h3>

      <div className="space-y-3">
        {availableMethods.map((method) => (
          <button
            key={method.id}
            onClick={() => onSelectMethod(method.id)}
            className={`w-full p-4 rounded-lg border-2 transition-all ${
              selectedMethod === method.id
                ? 'border-purple-500 bg-purple-900/20'
                : 'border-gray-700 bg-gray-900/50 hover:border-gray-600'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">{method.icon}</div>
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white">
                    {method.name}
                  </span>
                  {method.recommended && (
                    <span className="px-2 py-0.5 bg-green-900/30 text-green-400 text-xs rounded-full border border-green-700/50">
                      Recommended
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-400 mt-1">
                  {method.description}
                </p>
              </div>
              <div className="flex-shrink-0">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedMethod === method.id
                      ? 'border-purple-500 bg-purple-500'
                      : 'border-gray-600'
                  }`}
                >
                  {selectedMethod === method.id && (
                    <div className="w-2 h-2 bg-white rounded-full" />
                  )}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {currency === 'USD' && (
        <p className="text-sm text-gray-500 mt-4">
          💡 International cards are processed through Stripe for security
        </p>
      )}
      {currency === 'ZIG' && (
        <p className="text-sm text-gray-500 mt-4">
          💡 Paynow is recommended for local payments in Zimbabwe
        </p>
      )}
    </div>
  );
}
