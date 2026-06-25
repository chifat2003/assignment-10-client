# 🚀 Quick Start - Stripe Payment Gateway

## Step 1: Get Stripe Keys (2 minutes)

1. Go to https://dashboard.stripe.com/register (or login if you have an account)
2. After login, visit https://dashboard.stripe.com/test/apikeys
3. You'll see two keys:
   - **Publishable key** (starts with `pk_test_`)
   - **Secret key** (starts with `sk_test_`) - Click "Reveal test key"

## Step 2: Add Keys to Environment (1 minute)

Open `.env.local` in your project root and add/update these lines:

```bash
# Replace with your actual keys from Stripe Dashboard
STRIPE_SECRET_KEY=sk_test_YOUR_ACTUAL_KEY_HERE
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_ACTUAL_KEY_HERE
```

**Example:**
```bash
STRIPE_SECRET_KEY=sk_test_51AbCdEfGhIjKlMnOpQrStUvWxYz1234567890
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51AbCdEfGhIjKlMnOpQrStUvWxYz1234567890
```

## Step 3: Start the Application

```bash
npm run dev
```

Visit http://localhost:3000

## Step 4: Test the Payment Flow (5 minutes)

### Create Test Accounts (if you don't have them):

1. **User Account**: Sign up with email/password or Google
   - Choose role: "User" during signup
   
2. **Lawyer Account**: Sign up with different email
   - Choose role: "Lawyer" during signup

### Test Hiring & Payment:

**As User:**
1. Go to http://localhost:3000/lawyers
2. Click on any lawyer
3. Click "Hire [Lawyer Name]"
4. Confirm the hiring request
5. Logout

**As Lawyer:**
1. Login with the lawyer account
2. Go to Dashboard → Hiring History
3. You'll see the pending hiring request
4. Click "Accept"
5. Logout

**As User (Pay):**
1. Login with the user account
2. Go to Dashboard → Hiring History
3. You'll see the accepted hiring with "Pay Now" button
4. Click "Pay Now"
5. Enter test card: `4242 4242 4242 4242`
6. Expiry: Any future date (e.g., `12/26`)
7. CVC: Any 3 digits (e.g., `123`)
8. ZIP: Any 5 digits (e.g., `12345`)
9. Click "Pay $X.XX"
10. ✅ Success! You'll see "Paid" status

## 🧪 Test Cards

| Card Number | Scenario |
|------------|----------|
| `4242 4242 4242 4242` | Success |
| `4000 0025 0000 3155` | Requires authentication (3D Secure) |
| `4000 0000 0000 9995` | Declined |

## 🎯 What You Should See

1. **User Dashboard**: Hiring with "Paid" badge
2. **Lawyer Dashboard**: Accepted hiring with payment indicator
3. **Admin Dashboard** (`/dashboard/admin/all-transactions`): Transaction record
4. **Stripe Dashboard** (https://dashboard.stripe.com/test/payments): Payment record

## ❓ Troubleshooting

### Payment Modal Won't Open
- Check browser console for errors
- Verify `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is set (starts with `pk_test_`)

### "Unauthorized" Error
- Make sure you're logged in
- Check you're using the correct role account

### Payment Fails
- Use test card `4242 4242 4242 4242`
- Any future expiry date
- Any 3-digit CVC
- Any ZIP code

### Nothing Happens After Payment
- Check browser console
- Check terminal (server) logs
- Verify `STRIPE_SECRET_KEY` is set correctly

## 📚 More Information

- **Full Guide**: See `STRIPE_PAYMENT_GUIDE.md`
- **Implementation Details**: See `IMPLEMENTATION_SUMMARY.md`
- **Stripe Docs**: https://stripe.com/docs/payments/quickstart

## ✅ Success Checklist

- [ ] Stripe keys added to `.env.local`
- [ ] Dev server running (`npm run dev`)
- [ ] User can hire lawyer
- [ ] Lawyer can accept hiring
- [ ] User can pay for accepted hiring
- [ ] Transaction appears in admin dashboard
- [ ] Payment shows in Stripe Dashboard

---

**You're all set! 🎉** The payment gateway is ready to use.
