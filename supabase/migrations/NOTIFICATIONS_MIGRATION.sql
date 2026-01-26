-- ============================================
-- NOTIFICATIONS MIGRATION
-- Run this in Supabase SQL Editor
-- ============================================

-- Drop if exists
DROP TABLE IF EXISTS notifications CASCADE;

-- Create notifications table
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Notification details
  type TEXT NOT NULL CHECK (type IN (
    'booking_confirmed',
    'video_ready',
    'payment_received',
    'review_received',
    'booking_request',
    'talent_approved',
    'message_received',
    'promotion',
    'reminder'
  )),
  title TEXT NOT NULL,
  message TEXT NOT NULL,

  -- Optional link
  action_url TEXT,

  -- Related entities (optional foreign keys)
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,

  -- Status
  read BOOLEAN DEFAULT FALSE,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  read_at TIMESTAMP WITH TIME ZONE
);

-- Indexes
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_user_unread ON notifications(user_id, read) WHERE read = FALSE;
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);
CREATE INDEX idx_notifications_booking ON notifications(booking_id) WHERE booking_id IS NOT NULL;

-- ============================================
-- RLS POLICIES
-- ============================================

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Users can view their own notifications
CREATE POLICY "Users view own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users update own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own notifications
CREATE POLICY "Users delete own notifications"
  ON notifications FOR DELETE
  USING (auth.uid() = user_id);

-- System can insert notifications (service role)
CREATE POLICY "Service role can insert notifications"
  ON notifications FOR INSERT
  WITH CHECK (true);

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Function to create notification
CREATE OR REPLACE FUNCTION create_notification(
  p_user_id UUID,
  p_type TEXT,
  p_title TEXT,
  p_message TEXT,
  p_action_url TEXT DEFAULT NULL,
  p_booking_id UUID DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  notification_id UUID;
BEGIN
  INSERT INTO notifications (
    user_id,
    type,
    title,
    message,
    action_url,
    booking_id
  ) VALUES (
    p_user_id,
    p_type,
    p_title,
    p_message,
    p_action_url,
    p_booking_id
  )
  RETURNING id INTO notification_id;

  RETURN notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to mark notification as read
CREATE OR REPLACE FUNCTION mark_notification_read(notification_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE notifications
  SET read = TRUE, read_at = NOW()
  WHERE id = notification_id AND user_id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to mark all user notifications as read
CREATE OR REPLACE FUNCTION mark_all_notifications_read()
RETURNS VOID AS $$
BEGIN
  UPDATE notifications
  SET read = TRUE, read_at = NOW()
  WHERE user_id = auth.uid() AND read = FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- TRIGGERS FOR AUTOMATIC NOTIFICATIONS
-- ============================================

-- Notify customer when booking is confirmed
CREATE OR REPLACE FUNCTION notify_booking_confirmed()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'payment_confirmed' AND OLD.status = 'pending_payment' THEN
    PERFORM create_notification(
      NEW.customer_id,
      'booking_confirmed',
      'Booking Confirmed! 🎉',
      'Your video booking has been confirmed and sent to the talent.',
      '/booking/' || NEW.booking_code,
      NEW.id
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER booking_confirmed_notification
  AFTER UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION notify_booking_confirmed();

-- Notify talent when they receive a booking request
CREATE OR REPLACE FUNCTION notify_talent_booking_request()
RETURNS TRIGGER AS $$
DECLARE
  talent_user_id UUID;
BEGIN
  IF NEW.status = 'payment_confirmed' THEN
    -- Get the talent's user_id
    SELECT user_id INTO talent_user_id
    FROM talent_profiles
    WHERE id = NEW.talent_id;

    IF talent_user_id IS NOT NULL THEN
      PERFORM create_notification(
        talent_user_id,
        'booking_request',
        'New Booking Request 📹',
        'You have a new video request for ' || NEW.occasion || '!',
        '/dashboard?tab=requests',
        NEW.id
      );
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER talent_booking_request_notification
  AFTER INSERT OR UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION notify_talent_booking_request();

-- Notify customer when video is ready
CREATE OR REPLACE FUNCTION notify_video_ready()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.video_url IS NOT NULL AND OLD.video_url IS NULL THEN
    PERFORM create_notification(
      NEW.customer_id,
      'video_ready',
      'Your Video is Ready! 🎬',
      'Your personalized video has been delivered!',
      '/booking/' || NEW.booking_code,
      NEW.id
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER video_ready_notification
  AFTER UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION notify_video_ready();

-- ============================================
-- SUCCESS MESSAGE
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '✅ Notifications system created successfully!';
  RAISE NOTICE '   - notifications table with RLS';
  RAISE NOTICE '   - Helper functions for CRUD operations';
  RAISE NOTICE '   - Automatic triggers for booking events';
  RAISE NOTICE '   - Indexes for performance';
END $$;
