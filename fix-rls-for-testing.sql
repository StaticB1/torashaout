-- ============================================
-- FIX RLS POLICIES FOR SERVICE ROLE ACCESS
-- ============================================
-- Run this in DEV SQL Editor to allow service role access
-- ============================================

-- Grant service role access to favorites table
GRANT ALL ON public.favorites TO service_role;
GRANT ALL ON public.users TO service_role;
GRANT ALL ON public.talent_profiles TO service_role;
GRANT ALL ON public.bookings TO service_role;
GRANT ALL ON public.payments TO service_role;
GRANT ALL ON public.notifications TO service_role;
GRANT ALL ON public.categories TO service_role;

-- Verify grants
SELECT
    grantee,
    table_name,
    privilege_type
FROM information_schema.role_table_grants
WHERE grantee = 'service_role'
    AND table_schema = 'public'
ORDER BY table_name, privilege_type;
