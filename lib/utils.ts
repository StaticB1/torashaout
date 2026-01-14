import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: 'USD' | 'ZIG'): string {
  if (currency === 'USD') {
    return `$${amount.toFixed(2)}`;
  }
  return `ZIG ${amount.toLocaleString()}`;
}

export function formatResponseTime(hours: number): string {
  if (hours < 24) {
    return `${hours} hours`;
  }
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? 's' : ''}`;
}
