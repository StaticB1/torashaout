-- Migration: Create bookings and payments tables
-- Date: 2026-01-26
-- Description: Creates tables for booking management and payment processing

-- ============================================
-- BOOKINGS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_code TEXT UNIQUE NOT NULL,
  customer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  talent_id UUID NOT NULL REFERENCES talent_profiles(id) ON DELETE CASCADE,

  -- Booking details
  recipient_name TEXT NOT NULL,
  occasion TEXT,
  instructions TEXT,
  from_name TEXT,
  from_email TEXT,
  delivery_date DATE,
  is_public BOOLEAN DEFAULT FALSE,

  -- Pricing
  currency TEXT NOT NULL CHECK (currency IN ('USD', 'ZIG')),
  amount_paid DECIMAL(10, 2) NOT NULL,
  platform_fee DECIMAL(10, 2) NOT NULL DEFAULT 0,
  talent_earnings DECIMAL(10, 2) NOT NULL,

  -- Status tracking
  status TEXT NOT NULL DEFAULT 'pending_payment' CHECK (
    status IN (
      'pending_payment',
      'payment_confirmed',
      'in_progress',
      'completed',
      'cancelled',
      'refunded'
    )
  ),

  -- Video delivery
  video_url TEXT,
  video_duration_seconds INTEGER,
  due_date TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,

  -- Feedback
  customer_rating INTEGER CHECK (customer_rating BETWEEN 1 AND 5),
  customer_review TEXT,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for bookings
CREATE INDEX IF NOT EXISTS idx_bookings_customer ON bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_talent ON bookings(talent_id);
CREATE INDEX IF NOT EXISTS idx_bookings_code ON bookings(booking_code);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_created ON bookings(created_at DESC);

-- ============================================
-- PAYMENTS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Payment details
  gateway TEXT NOT NULL CHECK (gateway IN ('paynow', 'stripe', 'innbucks')),
  gateway_transaction_id TEXT,
  reference TEXT UNIQUE NOT NULL,

  -- Amount
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT NOT NULL CHECK (currency IN ('USD', 'ZIG')),

  -- Status
  status TEXT NOT NULL DEFAULT 'pending' CHECK (
    status IN ('pending', 'completed', 'failed', 'refunded')
  ),

  -- Gateway response data
  gateway_response JSONB,
  metadata JSONB,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for payments
CREATE INDEX IF NOT EXISTS idx_payments_booking ON payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_payments_user ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_reference ON payments(reference);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_created ON payments(created_at DESC);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Bookings policies
-- Users can view their own bookings as customer
CREATE POLICY "Users can view own bookings as customer"
  ON bookings FOR SELECT
  USING (auth.uid() = customer_id);

-- Talents can view bookings for themselves
CREATE POLICY "Talents can view own bookings"
  ON bookings FOR SELECT
  USING (
    talent_id IN (
      SELECT id FROM talent_profiles WHERE user_id = auth.uid()
    )
  );

-- Users can create bookings
CREATE POLICY "Users can create bookings"
  ON bookings FOR INSERT
  WITH CHECK (auth.uid() = customer_id);

-- Users can update their own bookings (limited fields)
CREATE POLICY "Users can update own bookings"
  ON bookings FOR UPDATE
  USING (auth.uid() = customer_id);

-- Talents can update bookings for themselves (video upload, status)
CREATE POLICY "Talents can update own bookings"
  ON bookings FOR UPDATE
  USING (
    talent_id IN (
      SELECT id FROM talent_profiles WHERE user_id = auth.uid()
    )
  );

-- Payments policies
-- Users can view their own payments
CREATE POLICY "Users can view own payments"
  ON payments FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create payments
CREATE POLICY "Users can create payments"
  ON payments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to generate unique booking code
CREATE OR REPLACE FUNCTION generate_booking_code()
RETURNS TEXT AS $$
DECLARE
  code TEXT;
  exists BOOLEAN;
BEGIN
  LOOP
    -- Generate format: BK-YYYYMMDD-XXXX
    code := 'BK-' || to_char(NOW(), 'YYYYMMDD') || '-' ||
            LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');

    -- Check if code exists
    SELECT EXISTS(SELECT 1 FROM bookings WHERE booking_code = code) INTO exists;

    -- Exit loop if unique
    EXIT WHEN NOT exists;
  END LOOP;

  RETURN code;
END;
$$ LANGUAGE plpgsql;

-- Function to update booking status after payment
CREATE OR REPLACE FUNCTION update_booking_after_payment()
RETURNS TRIGGER AS $$
BEGIN
  -- Only update if payment is completed
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    UPDATE bookings
    SET
      status = 'payment_confirmed',
      due_date = NOW() + INTERVAL '7 days',
      updated_at = NOW()
    WHERE id = NEW.booking_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update booking when payment completes
CREATE TRIGGER payment_completed_trigger
  AFTER INSERT OR UPDATE ON payments
  FOR EACH ROW
  EXECUTE FUNCTION update_booking_after_payment();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON payments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- COMMENTS
-- ============================================

COMMENT ON TABLE bookings IS 'Stores video booking requests from customers to talents';
COMMENT ON TABLE payments IS 'Stores payment transactions for bookings';
COMMENT ON COLUMN bookings.booking_code IS 'Human-readable unique booking identifier';
COMMENT ON COLUMN bookings.platform_fee IS 'Platform commission (25%)';
COMMENT ON COLUMN bookings.talent_earnings IS 'Amount talent receives after fees';
COMMENT ON COLUMN payments.gateway_response IS 'Raw response data from payment gateway';
COMMENT ON COLUMN payments.metadata IS 'Additional payment metadata (phone, card last4, etc)';
