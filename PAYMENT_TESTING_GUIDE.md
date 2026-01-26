# Payment System Testing Guide

## ✅ Fixed Issues

1. **API Route Fixed** - Added `await` for Supabase client
2. **Test Script Created** - Easy way to create test bookings

---

## 🧪 How to Test Properly

### Prerequisites
1. **User Account** - You need to be logged in
2. **Test Booking** - Need a booking in the database first

---

## 📝 Step-by-Step Testing

### Step 1: Create a User (If you don't have one)
```
1. Go to http://localhost:3000/signup
2. Create an account (use any email)
3. Login at http://localhost:3000/login
```

### Step 2: Create a Test Booking
```bash
node scripts/create-test-booking.js
```

**This will:**
- Find a user in your database
- Find a verified talent
- Create a pending booking
- Give you the booking ID to test with

**Output example:**
```
✅ Test booking ready!

📋 Booking Details:
   Booking ID: abc123...
   Booking Code: BK-20260126-4321
   Customer: test@example.com
   Amount: $50.00 USD
   Status: pending_payment

🧪 Test Payment:
   1. Login as: test@example.com
   2. Go to: http://localhost:3000/payment/abc123...
```

### Step 3: Test Payment Flow

1. **Login** as the user shown in the script output
2. **Visit** the payment URL with the booking ID
3. **Select** a payment method (Paynow/Stripe/InnBucks)
4. **Fill** the form with test data:
   - **Paynow:** 077 123 4567
   - **Stripe:** 4532 1234 5678 9010, Expiry 12/25, CVV 123
   - **InnBucks:** Any email + phone
5. **Click** "Pay"
6. **Wait** for processing (2-2.5 seconds)
7. **Success!** → Confirmation page

### Step 4: Verify Database Records

**Check in Supabase Dashboard:**

1. **Go to** Table Editor → `payments`
   - Should see new payment record
   - Reference: `PAY-...` or `pi_...` or `INN-...`
   - Status: `completed`
   - Amount: $50.00

2. **Go to** Table Editor → `bookings`
   - Find your booking by code
   - Status should be: `payment_confirmed` (updated!)
   - Due date should be: 7 days from now (added!)

---

## 🐛 Common Issues & Solutions

### Issue 1: "Booking not found"
**Cause:** Booking doesn't exist or wrong ID
**Solution:** Run `create-test-booking.js` script again

### Issue 2: "Unauthorized"
**Cause:** Not logged in
**Solution:** Login as the user shown in script output

### Issue 3: "Booking already paid"
**Cause:** Booking already has a completed payment
**Solution:** Create a new test booking

### Issue 4: No records in database
**Cause:** API error or auth issue
**Solution:**
- Check dev server logs
- Ensure you're logged in
- Check if Supabase keys are correct

---

## 🔍 Debugging Tips

### Check Dev Server Logs
```bash
# In the terminal where npm run dev is running
# Look for error messages after payment
```

### Check Browser Console
```
F12 → Console Tab
Look for any API errors
```

### Check API Response
```
F12 → Network Tab → Find /api/payments request
Check response for error messages
```

### Verify Tables Exist
```sql
-- In Supabase SQL Editor
SELECT * FROM bookings LIMIT 5;
SELECT * FROM payments LIMIT 5;
```

---

## 📊 Expected Flow

1. User logged in ✅
2. Test booking created ✅
3. Visit payment page ✅
4. Complete payment form ✅
5. API called: POST /api/payments ✅
6. Payment inserted into DB ✅
7. Booking status updated ✅
8. Confirmation page shown ✅

---

## 🎯 What to Look For

### In `payments` Table:
```json
{
  "id": "uuid",
  "booking_id": "uuid-from-booking",
  "user_id": "uuid-from-auth",
  "gateway": "paynow|stripe|innbucks",
  "reference": "PAY-1234567890",
  "amount": 50.00,
  "currency": "USD",
  "status": "completed",
  "metadata": {
    "phoneNumber": "077 123 4567",
    ...
  }
}
```

### In `bookings` Table:
```json
{
  "id": "uuid",
  "booking_code": "BK-20260126-4321",
  "status": "payment_confirmed",  // ← Updated!
  "due_date": "2026-02-02T...",   // ← Added (7 days later)!
  "updated_at": "2026-01-26T..."  // ← Updated!
}
```

---

## ✅ Success Checklist

After testing, verify:
- [ ] Payment record exists in database
- [ ] Booking status changed to `payment_confirmed`
- [ ] Due date was set (7 days from payment)
- [ ] Confirmation page displayed
- [ ] No errors in console
- [ ] Can view payment in Supabase dashboard

---

## 🚀 Quick Test Command

All in one:
```bash
# Create test booking
node scripts/create-test-booking.js

# Output will give you:
# - User email to login with
# - Payment URL to visit
# - Booking ID to track

# Then just login and visit the URL!
```

---

## 💡 Pro Tips

1. **Use same user** - Login as the user shown by the script
2. **Check logs** - Always monitor dev server output
3. **Verify tables** - Check Supabase dashboard after each test
4. **Create fresh bookings** - Each test should use a new booking
5. **Test all methods** - Try Paynow, Stripe, and InnBucks

---

## 📞 Still Not Working?

If you still have issues:

1. **Check Supabase connection**
   ```bash
   # Verify env variables
   echo $NEXT_PUBLIC_SUPABASE_URL
   echo $NEXT_PUBLIC_SUPABASE_ANON_KEY
   ```

2. **Check tables exist**
   - Go to Supabase Dashboard
   - Table Editor
   - Look for `bookings` and `payments`

3. **Check RLS policies**
   - Go to Table Editor → bookings → RLS
   - Should see policies enabled

4. **Restart dev server**
   ```bash
   # Ctrl+C to stop
   npm run dev
   ```

---

**Ready to test? Run the script and follow the steps!** 🎉
