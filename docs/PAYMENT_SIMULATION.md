# Payment Simulation System Documentation

## Overview

The ToraShaout payment system is currently in **simulation mode** while waiting for payment provider accounts. This allows full testing and development of the payment flow with realistic UI and behavior that mimics real payment processing.

---

## 🎯 What's Been Built

### Payment Components

1. **PaymentMethodSelector** (`components/payment/PaymentMethodSelector.tsx`)
   - Displays available payment methods based on currency
   - Paynow (EcoCash/OneMoney) - ZIG & USD
   - Stripe (Card payments) - USD only
   - InnBucks (Digital wallet) - ZIG & USD
   - Recommends optimal method per currency

2. **PaynowForm** (`components/payment/PaynowForm.tsx`)
   - EcoCash and OneMoney selection
   - Zimbabwe phone number input with validation (077 XXX XXXX)
   - Real-time phone formatting
   - 90% simulated success rate
   - 2-second processing delay

3. **StripeForm** (`components/payment/StripeForm.tsx`)
   - Card number input with formatting (XXXX XXXX XXXX XXXX)
   - Cardholder name, expiry date (MM/YY), and CVV
   - Card type detection (Visa, Mastercard, Amex)
   - Full validation (Luhn algorithm ready)
   - 95% simulated success rate
   - 2.5-second processing delay

4. **InnBucksForm** (`components/payment/InnBucksForm.tsx`)
   - Email and phone number inputs
   - International and local phone format support
   - 92% simulated success rate
   - 2-second processing delay

5. **PaymentContainer** (`components/payment/PaymentContainer.tsx`)
   - Orchestrates payment flow
   - Handles method selection and form display
   - Processes payment success/failure
   - Redirects to confirmation page

### Pages

1. **Payment Page** (`app/payment/[bookingId]/page.tsx`)
   - Dedicated payment page for completing bookings
   - Displays booking summary
   - Integrates PaymentContainer
   - Currency switcher support

2. **Booking Confirmation** (`app/booking-confirmation/page.tsx`)
   - Success animation
   - Payment reference display
   - Booking details summary
   - Expected delivery timeline
   - "What Happens Next" guide
   - Dashboard and browse again actions

### API

1. **Payment API** (`app/api/payments/route.ts`)
   - POST endpoint for saving payments
   - GET endpoint for fetching payment details
   - Authentication check
   - Database-ready structure (commented out)

---

## 🔄 How It Works

### Payment Flow

```
1. User completes booking form
   ↓
2. Redirected to /payment/[bookingId]
   ↓
3. Selects payment method (Paynow/Stripe/InnBucks)
   ↓
4. Fills payment form
   ↓
5. Clicks "Pay" button
   ↓
6. Simulated processing (2-2.5 seconds)
   ↓
7. Success → Confirmation page
   Failure → Error message
```

### Simulation Details

**Success Rates:**
- Paynow: 90% success rate
- Stripe: 95% success rate
- InnBucks: 92% success rate

**Processing Times:**
- Paynow: 2 seconds
- Stripe: 2.5 seconds
- InnBucks: 2 seconds

**Payment References:**
- Paynow: `PAY-{timestamp}`
- Stripe: `pi_{timestamp}`
- InnBucks: `INN-{timestamp}`

---

## 🧪 Testing the System

### Test Scenarios

#### 1. Successful Paynow Payment
```
1. Navigate to any talent's booking page
2. Complete booking details
3. Go to payment page
4. Select "Paynow"
5. Choose "EcoCash" or "OneMoney"
6. Enter phone: 077 123 4567
7. Click "Pay"
8. Wait 2 seconds → Success!
```

#### 2. Successful Stripe Payment
```
1. Switch currency to USD
2. Go to payment page
3. Select "Card Payment"
4. Enter card: 4532 1234 5678 9010
5. Name: JOHN DOE
6. Expiry: 12/25
7. CVV: 123
8. Click "Pay" → Success!
```

#### 3. Failed Payment (10% chance)
```
Simply retry the payment multiple times.
About 1 in 10 attempts will simulate a failure.
Error message will display in the form.
```

### Form Validations

**Paynow:**
- Phone must be 10 digits starting with 07
- Format: 077 123 4567

**Stripe:**
- Card number: 16 digits
- Expiry: Valid future date (MM/YY)
- CVV: 3 digits
- Name: Required

**InnBucks:**
- Email: Valid format
- Phone: Zimbabwe format (07X XXX XXXX or +263 7X XXX XXXX)

---

## 🚀 Upgrading to Real Payments

When payment provider accounts are ready, follow these steps:

### 1. Paynow Integration

**File to Update:** `components/payment/PaynowForm.tsx`

Replace the simulation code (lines ~60-100) with:

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setProcessing(true);

  try {
    // Initialize Paynow
    const paynow = new Paynow(
      process.env.NEXT_PUBLIC_PAYNOW_INTEGRATION_ID!,
      process.env.NEXT_PUBLIC_PAYNOW_INTEGRATION_KEY!
    );

    // Create payment
    const payment = paynow.createPayment(bookingId);
    payment.add('Video Booking', amount);

    // Send payment
    const response = await paynow.sendMobile(
      payment,
      cleanPhone,
      method // 'ecocash' or 'onemoney'
    );

    if (response.success) {
      // Poll for payment status
      const status = await paynow.pollTransaction(response.pollUrl);

      if (status.paid) {
        onSuccess({
          method: 'paynow',
          provider: method,
          phoneNumber: cleanPhone,
          amount,
          currency,
          reference: response.reference,
          pollUrl: response.pollUrl,
          status: 'success',
          timestamp: new Date().toISOString(),
        });
      } else {
        throw new Error('Payment not completed');
      }
    } else {
      throw new Error(response.error);
    }
  } catch (err: any) {
    setError(err.message);
    onError(err.message);
  } finally {
    setProcessing(false);
  }
};
```

**Environment Variables:**
```bash
NEXT_PUBLIC_PAYNOW_INTEGRATION_ID=your_id
NEXT_PUBLIC_PAYNOW_INTEGRATION_KEY=your_key
```

### 2. Stripe Integration

**File to Update:** `components/payment/StripeForm.tsx`

Replace the simulation code with:

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setProcessing(true);

  try {
    // Create payment intent on server
    const response = await fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, currency, bookingId }),
    });

    const { clientSecret } = await response.json();

    // Confirm payment with Stripe
    const stripe = await stripePromise;
    const { error, paymentIntent } = await stripe!.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: elements.getElement(CardElement)!,
          billing_details: { name: cardholderName },
        },
      }
    );

    if (error) {
      throw new Error(error.message);
    }

    if (paymentIntent?.status === 'succeeded') {
      onSuccess({
        method: 'stripe',
        cardType: detectCardType(cardNumber),
        last4: cardNumber.slice(-4),
        amount,
        currency,
        reference: paymentIntent.id,
        status: 'success',
        timestamp: new Date().toISOString(),
      });
    }
  } catch (err: any) {
    setError(err.message);
    onError(err.message);
  } finally {
    setProcessing(false);
  }
};
```

**Environment Variables:**
```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 3. InnBucks Integration

**File to Update:** `components/payment/InnBucksForm.tsx`

Replace the simulation code with InnBucks API calls:

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setProcessing(true);

  try {
    const response = await fetch('/api/innbucks/initiate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount,
        currency,
        email,
        phoneNumber: cleanPhone,
        bookingId,
      }),
    });

    const data = await response.json();

    if (data.success) {
      onSuccess({
        method: 'innbucks',
        email,
        phoneNumber: cleanPhone,
        amount,
        currency,
        reference: data.reference,
        status: 'success',
        timestamp: new Date().toISOString(),
      });
    } else {
      throw new Error(data.error);
    }
  } catch (err: any) {
    setError(err.message);
    onError(err.message);
  } finally {
    setProcessing(false);
  }
};
```

**Environment Variables:**
```bash
INNBUCKS_API_KEY=your_api_key
INNBUCKS_MERCHANT_ID=your_merchant_id
```

### 4. Database Integration

**File to Update:** `app/api/payments/route.ts`

Uncomment the database insert code (lines ~50-55):

```typescript
const { data, error } = await supabase
  .from('payments')
  .insert(paymentRecord)
  .select()
  .single();

if (error) {
  throw new Error('Failed to save payment');
}
```

**Create payments table:**
```sql
CREATE TABLE payments (
  id TEXT PRIMARY KEY,
  booking_id TEXT NOT NULL REFERENCES bookings(id),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  method TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT NOT NULL,
  reference TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_payments_booking ON payments(booking_id);
CREATE INDEX idx_payments_user ON payments(user_id);
CREATE INDEX idx_payments_reference ON payments(reference);
```

---

## 📊 Features

### Current Features
✅ Three payment methods (Paynow, Stripe, InnBucks)
✅ Currency-based method filtering
✅ Full form validation
✅ Realistic processing delays
✅ Success/failure simulation
✅ Payment confirmation page
✅ Mobile responsive design
✅ Error handling
✅ Loading states

### Ready for Production
✅ Component architecture
✅ Type safety (TypeScript)
✅ API structure
✅ Database schema ready
✅ Security considerations (SSL note)
✅ User experience flow

---

## 🔧 Customization

### Adjust Success Rates

Edit the random number check in each form:

```typescript
// 90% success rate
const isSuccess = Math.random() > 0.1;

// Change to 100% for always successful
const isSuccess = true;

// Change to 50% for half success
const isSuccess = Math.random() > 0.5;
```

### Adjust Processing Delays

Change the timeout values:

```typescript
// Current: 2 seconds
await new Promise((resolve) => setTimeout(resolve, 2000));

// Change to instant
await new Promise((resolve) => setTimeout(resolve, 0));

// Change to 5 seconds
await new Promise((resolve) => setTimeout(resolve, 5000));
```

### Add More Payment Methods

1. Create new form component in `components/payment/`
2. Add to `PaymentMethodSelector` options
3. Add case in `PaymentContainer`
4. Update API to handle new method

---

## 📝 Notes

- All simulation code is clearly marked with comments
- Real API integration points are documented
- Database queries are commented out but ready to enable
- TypeScript types are production-ready
- Forms include proper validation and formatting
- Error messages are user-friendly
- Success states include proper animations

---

## 🚨 Important Reminders

1. **Remove simulation code** before production deployment
2. **Test with small amounts** first when going live
3. **Set up webhooks** for payment confirmations
4. **Enable proper logging** for payment transactions
5. **Implement retry logic** for failed payments
6. **Set up monitoring** for payment success rates
7. **Add rate limiting** to prevent abuse
8. **Implement refund functionality** when needed

---

## 📞 Support

For payment provider setup help:
- **Paynow**: https://paynow.co.zw/developers
- **Stripe**: https://stripe.com/docs
- **InnBucks**: Contact InnBucks support

---

**Status:** ✅ Simulation Complete - Ready for Real Integration
**Last Updated:** January 26, 2026
**Next Step:** Obtain payment provider credentials and integrate real APIs
