-- Seed Initial Data for ToraShaout
-- Insert categories

INSERT INTO public.categories (name, slug, icon, booking_count) VALUES
  ('Musicians', 'musician', '🎵', 0),
  ('Comedians', 'comedian', '😂', 0),
  ('Gospel Artists', 'gospel', '🙏', 0),
  ('Business Leaders', 'business', '💼', 0),
  ('Sports Stars', 'sports', '⚽', 0),
  ('Influencers', 'influencer', '📱', 0),
  ('Other Celebrities', 'other', '⭐', 0);

-- Note: To create an admin user, you need to:
-- 1. Sign up through your app
-- 2. Then run this SQL with your user ID:
-- UPDATE public.users SET role = 'admin' WHERE email = 'your-admin-email@example.com';
