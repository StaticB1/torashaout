-- Create flagged_content table for moderation
CREATE TABLE IF NOT EXISTS flagged_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  reporter_id UUID NOT NULL REFERENCES users(id),
  reason TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'resolved', 'dismissed')),
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ,
  resolved_by UUID REFERENCES users(id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_flagged_content_booking_id ON flagged_content(booking_id);
CREATE INDEX IF NOT EXISTS idx_flagged_content_status ON flagged_content(status);
CREATE INDEX IF NOT EXISTS idx_flagged_content_created_at ON flagged_content(created_at DESC);

-- Enable RLS
ALTER TABLE flagged_content ENABLE ROW LEVEL SECURITY;

-- Policy: Admins can view all flagged content
CREATE POLICY "Admins can view flagged content"
  ON flagged_content FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- Policy: Admins can insert flagged content
CREATE POLICY "Admins can insert flagged content"
  ON flagged_content FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'
    )
    OR reporter_id = auth.uid()
  );

-- Policy: Admins can update flagged content
CREATE POLICY "Admins can update flagged content"
  ON flagged_content FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- Policy: Users can report content (insert their own reports)
CREATE POLICY "Users can report content"
  ON flagged_content FOR INSERT
  TO authenticated
  WITH CHECK (reporter_id = auth.uid());

-- Policy: Users can view their own reports
CREATE POLICY "Users can view own reports"
  ON flagged_content FOR SELECT
  TO authenticated
  USING (reporter_id = auth.uid());
