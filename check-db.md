# Quick Database Check

Run these queries in your Supabase SQL Editor:

1. Check if application exists:
```sql
SELECT id, email, status, user_id, created_at 
FROM talent_applications 
LIMIT 5;
```

2. Check if your admin user exists:
```sql
SELECT id, email, role 
FROM users 
WHERE role = 'admin';
```

3. Check RLS policies:
```sql
SELECT * FROM pg_policies 
WHERE tablename = 'talent_applications';
```
