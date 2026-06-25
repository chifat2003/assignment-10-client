import { loadStripe } from '@stripe/stripe-js';

// loadStripe is called once and cached (Stripe recommends this)
let stripePromise = null;

export function getStripe() {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
}
