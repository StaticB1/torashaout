-- ============================================
-- MANUAL PAYMENT MIGRATION
-- Run this directly in Supabase SQL Editor
-- ============================================

-- Drop tables if they exist (to start fresh)
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;

-- ============================================
-- BOOKINGS TABLE
-- ============================================

CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_code TEXT UNIQUE NOT NULL,
  customer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  talent_id UUID NOT NULL REFERENCES talent_profiles(id) ON DELETE CASCADE,

  recipient_name TEXT NOT NULL,
  occasion TEXT,
  instructions TEXT,

  currency TEXT NOT NULL CHECK (currency IN ('USD', 'ZIG')),
  amount_paid DECIMAL(10, 2) NOT NULL,
  platform_fee DECIMAL(10, 2) NOT NULL DEFAULT 0,
  talent_earnings DECIMAL(10, 2) NOT NULL,

  status TEXT NOT NULL DEFAULT 'pending_payment',

  video_url TEXT,
  due_date TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,

  customer_rating INTEGER,
  customer_review TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_bookings_customer ON bookings(customer_id);
CREATE INDEX idx_bookings_talent ON bookings(talent_id);
CREATE INDEX idx_bookings_code ON bookings(booking_code);
CREATE INDEX idx_bookings_status ON bookings(status);

-- ============================================
-- PAYMENTS TABLE
-- ============================================

CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  gateway TEXT NOT NULL,
  reference TEXT UNIQUE NOT NULL,

  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT NOT NULL,

  status TEXT NOT NULL DEFAULT 'pending',

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_payments_booking ON payments(booking_id);
CREATE INDEX idx_payments_user ON payments(user_id);
CREATE INDEX idx_payments_reference ON payments(reference);

-- ============================================
-- RLS POLICIES
-- ============================================

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Bookings: Users can view their own
CREATE POLICY "Users view own bookings"
  ON bookings FOR SELECT
  USING (auth.uid() = customer_id);

-- Bookings: Users can create
CREATE POLICY "Users create bookings"
  ON bookings FOR INSERT
  WITH CHECK (auth.uid() = customer_id);

-- Bookings: Users can update own
CREATE POLICY "Users update own bookings"
  ON bookings FOR UPDATE
  USING (auth.uid() = customer_id);

-- Payments: Users view own
CREATE POLICY "Users view own payments"
  ON payments FOR SELECT
  USING (auth.uid() = user_id);

-- Payments: Users create own
CREATE POLICY "Users create payments"
  ON payments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- TRIGGER: Update booking after payment
-- ============================================

CREATE OR REPLACE FUNCTION update_booking_after_payment()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' THEN
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

CREATE TRIGGER payment_completed_trigger
  AFTER INSERT OR UPDATE ON payments
  FOR EACH ROW
  EXECUTE FUNCTION update_booking_after_payment();

-- ============================================
-- SUCCESS MESSAGE
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '✅ Payment tables created successfully!';
  RAISE NOTICE '   - bookings table';
  RAISE NOTICE '   - payments table';
  RAISE NOTICE '   - RLS policies enabled';
  RAISE NOTICE '   - Trigger created for automatic status updates';
END $$;
