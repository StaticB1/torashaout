export type Currency = 'USD' | 'ZIG';

export type UserRole = 'fan' | 'talent' | 'admin';

export type UserRegion = 'zimbabwe' | 'diaspora';

export type TalentCategory = 
  | 'musician' 
  | 'comedian' 
  | 'gospel' 
  | 'business' 
  | 'sports' 
  | 'influencer' 
  | 'other';

export type BookingStatus = 
  | 'pending_payment'
  | 'payment_confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'refunded';

export type PaymentGateway = 'paynow' | 'stripe' | 'innbucks';

export interface User {
  id: string;
  email: string;
  phone?: string;
  fullName: string;
  role: UserRole;
  region: UserRegion;
  preferredCurrency: Currency;
  avatarUrl?: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TalentProfile {
  id: string;
  userId: string;
  displayName: string;
  bio?: string;
  category: TalentCategory;
  profileVideoUrl?: string;
  thumbnailUrl?: string;
  priceZIG?: number;
  priceUSD?: number;
  isAcceptingBookings: boolean;
  responseTimeHours: number;
  verificationDocumentUrl?: string;
  adminVerified: boolean;
  totalBookings: number;
  averageRating: number;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: string;
  bookingCode: string;
  customerId: string;
  talentId: string;
  recipientName: string;
  occasion?: string;
  instructions?: string;
  currency: Currency;
  amountPaid: number;
  platformFee: number;
  talentEarnings: number;
  status: BookingStatus;
  videoUrl?: string;
  videoDurationSeconds?: number;
  dueDate?: string;
  completedAt?: string;
  customerRating?: number;
  customerReview?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  bookingId: string;
  gateway: PaymentGateway;
  gatewayTransactionId?: string;
  amount: number;
  currency: Currency;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  gatewayResponse?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  name: string;
  icon: string;
  count: number;
  slug: string;
}
