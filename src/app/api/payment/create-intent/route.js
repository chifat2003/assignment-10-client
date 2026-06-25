import Stripe from 'stripe';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { MongoClient, ObjectId } from 'mongodb';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const client = new MongoClient(process.env.MONGODB_URI);

function getDb() {
  return client.db(process.env.AUTH_DB_NAME);
}

/**
 * POST /api/payment/create-intent
 * Creates a Stripe PaymentIntent for a given hiring.
 * Body: { hiringId }
 * Returns: { clientSecret, amount, currency }
 */
export async function POST(request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'user') {
      return Response.json({ error: 'Only users can initiate payments' }, { status: 403 });
    }

    const body = await request.json();
    const { hiringId } = body;

    if (!hiringId || !ObjectId.isValid(hiringId)) {
      return Response.json({ error: 'Valid hiringId is required' }, { status: 400 });
    }

    const db = getDb();
    const hiringsCol = db.collection('hirings');
    const hiring = await hiringsCol.findOne({ _id: new ObjectId(hiringId) });

    if (!hiring) {
      return Response.json({ error: 'Hiring not found' }, { status: 404 });
    }

    if (hiring.userId !== session.user.id) {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (hiring.status !== 'accepted') {
      return Response.json({ error: 'Hiring must be accepted before payment' }, { status: 400 });
    }

    if (hiring.paymentStatus === 'paid') {
      return Response.json({ error: 'This hiring is already paid' }, { status: 400 });
    }

    // Stripe expects amounts in the smallest currency unit (cents for USD)
    const amountInCents = Math.round(hiring.fee * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'usd',
      metadata: {
        hiringId: hiringId,
        userId: session.user.id,
        userEmail: session.user.email,
        lawyerEmail: hiring.lawyerEmail,
        lawyerName: hiring.lawyerName,
      },
      description: `LegalEase: Hiring fee for ${hiring.lawyerName} (${hiring.specialization || 'Legal Service'})`,
    });

    return Response.json({
      clientSecret: paymentIntent.client_secret,
      amount: amountInCents,
      currency: 'usd',
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error('POST /api/payment/create-intent error:', error);

    // Surface Stripe errors clearly
    if (error.type?.startsWith('Stripe')) {
      return Response.json({ error: error.message }, { status: 402 });
    }

    return Response.json({ error: 'Failed to create payment intent' }, { status: 500 });
  }
}
