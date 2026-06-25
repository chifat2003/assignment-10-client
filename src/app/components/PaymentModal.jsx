'use client';

import { useState, useEffect } from 'react';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { getStripe } from '@/lib/stripe';

/* ─────────────────────────────────────────────
   Inner form — must be rendered inside <Elements>
───────────────────────────────────────────── */
function CheckoutForm({ hiringId, paymentIntentId, amount, onSuccess, onCancel }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);
    setErrorMessage('');

    try {
      // 1. Confirm payment with Stripe
      const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: 'if_required', // stay on page for card payments
      });

      if (stripeError) {
        setErrorMessage(stripeError.message || 'Payment failed. Please try again.');
        setIsProcessing(false);
        return;
      }

      if (paymentIntent.status === 'succeeded') {
        // 2. Notify our backend to record the transaction
        const res = await fetch('/api/payment/confirm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            paymentIntentId: paymentIntent.id,
            hiringId,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          setErrorMessage(data.error || 'Payment confirmed but failed to record. Contact support.');
          setIsProcessing(false);
          return;
        }

        onSuccess({ transactionId: data.transactionId });
      }
    } catch (err) {
      console.error('Payment error:', err);
      setErrorMessage('An unexpected error occurred.');
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: 20 }}>
        <PaymentElement
          options={{
            layout: 'tabs',
            defaultValues: {},
          }}
        />
      </div>

      {errorMessage && (
        <div
          style={{
            padding: '10px 14px',
            borderRadius: 8,
            background: 'rgba(239,68,68,0.12)',
            border: '1px solid rgba(239,68,68,0.3)',
            color: '#f87171',
            fontSize: 13,
            marginBottom: 16,
          }}
        >
          {errorMessage}
        </div>
      )}

      <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
        <button
          type="button"
          onClick={onCancel}
          disabled={isProcessing}
          style={{
            flex: 1,
            padding: '12px 0',
            borderRadius: 10,
            border: '1px solid rgba(255,255,255,0.12)',
            background: 'rgba(255,255,255,0.04)',
            color: '#94a3b8',
            fontSize: 14,
            fontWeight: 600,
            cursor: isProcessing ? 'not-allowed' : 'pointer',
          }}
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={!stripe || isProcessing}
          style={{
            flex: 2,
            padding: '12px 0',
            borderRadius: 10,
            border: 'none',
            background:
              !stripe || isProcessing
                ? 'rgba(99,102,241,0.4)'
                : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            color: '#fff',
            fontSize: 14,
            fontWeight: 700,
            cursor: !stripe || isProcessing ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          {isProcessing ? (
            <>
              <span
                style={{
                  width: 16,
                  height: 16,
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: '#fff',
                  borderRadius: '50%',
                  display: 'inline-block',
                  animation: 'spin 0.7s linear infinite',
                }}
              />
              Processing…
            </>
          ) : (
            `Pay $${(amount / 100).toFixed(2)}`
          )}
        </button>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </form>
  );
}

/* ─────────────────────────────────────────────
   Outer modal wrapper — fetches clientSecret and
   mounts the Stripe Elements provider
───────────────────────────────────────────── */
export default function PaymentModal({ hiring, onClose, onPaymentSuccess }) {
  const [clientSecret, setClientSecret] = useState('');
  const [paymentIntentId, setPaymentIntentId] = useState('');
  const [amount, setAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');

  useEffect(() => {
    const createIntent = async () => {
      try {
        setIsLoading(true);
        const res = await fetch('/api/payment/create-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ hiringId: hiring.id }),
        });

        const data = await res.json();

        if (!res.ok) {
          setFetchError(data.error || 'Failed to initialize payment.');
          return;
        }

        setClientSecret(data.clientSecret);
        setPaymentIntentId(data.paymentIntentId);
        setAmount(data.amount);
      } catch (err) {
        console.error('Error creating payment intent:', err);
        setFetchError('Failed to connect to payment service.');
      } finally {
        setIsLoading(false);
      }
    };

    if (hiring?.id) {
      createIntent();
    }
  }, [hiring?.id]);

  // Stripe Elements appearance — dark theme to match the app
  const appearance = {
    theme: 'night',
    variables: {
      colorPrimary: '#6366f1',
      colorBackground: '#0f0c23',
      colorText: '#f1f5f9',
      colorDanger: '#f87171',
      borderRadius: '10px',
      fontFamily: 'inherit',
    },
    rules: {
      '.Input': {
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: 'none',
      },
      '.Input:focus': {
        border: '1px solid #6366f1',
        boxShadow: '0 0 0 2px rgba(99,102,241,0.25)',
      },
    },
  };

  // Prevent background scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    /* Backdrop */
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(4px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      }}
    >
      {/* Modal card */}
      <div
        style={{
          width: '100%',
          maxWidth: 480,
          borderRadius: 20,
          background: 'linear-gradient(135deg, #0f0c23 0%, #16213e 100%)',
          border: '1px solid rgba(99,102,241,0.25)',
          padding: 28,
          boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: 20 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: 8,
            }}
          >
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#f1f5f9' }}>
              Complete Payment
            </h2>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: '#64748b',
                fontSize: 20,
                cursor: 'pointer',
                padding: '0 4px',
                lineHeight: 1,
              }}
              aria-label="Close payment modal"
            >
              ✕
            </button>
          </div>

          {/* Hiring summary */}
          <div
            style={{
              padding: '12px 14px',
              borderRadius: 10,
              background: 'rgba(99,102,241,0.08)',
              border: '1px solid rgba(99,102,241,0.15)',
            }}
          >
            <p style={{ margin: '0 0 4px', fontSize: 13, color: '#94a3b8' }}>Hiring fee for</p>
            <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#f1f5f9' }}>
              {hiring.lawyerName}
            </p>
            {hiring.specialization && (
              <p style={{ margin: '2px 0 0', fontSize: 12, color: '#8b5cf6' }}>
                {hiring.specialization}
              </p>
            )}
            {amount > 0 && (
              <p style={{ margin: '8px 0 0', fontSize: 18, fontWeight: 800, color: '#818cf8' }}>
                ${(amount / 100).toFixed(2)}
              </p>
            )}
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '32px 0', color: '#94a3b8' }}>
            <div
              style={{
                width: 32,
                height: 32,
                border: '3px solid rgba(99,102,241,0.2)',
                borderTopColor: '#6366f1',
                borderRadius: '50%',
                animation: 'spin 0.7s linear infinite',
                margin: '0 auto 12px',
              }}
            />
            <p style={{ margin: 0, fontSize: 14 }}>Setting up secure payment…</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : fetchError ? (
          <div
            style={{
              padding: '14px 16px',
              borderRadius: 10,
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.3)',
              color: '#f87171',
              fontSize: 14,
            }}
          >
            {fetchError}
          </div>
        ) : clientSecret ? (
          <Elements
            stripe={getStripe()}
            options={{ clientSecret, appearance }}
          >
            <CheckoutForm
              hiringId={hiring.id}
              paymentIntentId={paymentIntentId}
              amount={amount}
              onSuccess={(data) => {
                onClose();
                onPaymentSuccess(data);
              }}
              onCancel={onClose}
            />
          </Elements>
        ) : null}

        {/* Security note */}
        <p
          style={{
            margin: '16px 0 0',
            textAlign: 'center',
            fontSize: 11,
            color: '#475569',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
          }}
        >
          🔒 Secured by Stripe. Your payment info is never stored on our servers.
        </p>
      </div>
    </div>
  );
}
