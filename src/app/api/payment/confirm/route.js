import Stripe from 'stripe';
import { MongoClient, ObjectId } from 'mongodb';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const client = new MongoClient(process.env.MONGODB_URI);

function getDb() {
  return client.db(process.env.AUTH_DB_NAME);
}

/**
 * POST /api/payment/confirm
 * Called after Stripe.js confirms payment on the client.
 * Verifies the PaymentIntent server-side, then:
 *  1. Updates hiring.paymentStatus = 'paid'
 *  2. Saves a transaction record
 * Body: { paymentIntentId, hiringId }
 */
export async function POST(request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { paymentIntentId, hiringId } = body;

    if (!paymentIntentId || !hiringId) {
      return Response.json({ error: 'paymentIntentId and hiringId are required' }, { status: 400 });
    }

    if (!ObjectId.isValid(hiringId)) {
      return Response.json({ error: 'Invalid hiringId' }, { status: 400 });
    }

    // Verify payment status with Stripe (never trust client-side success alone)
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return Response.json(
        { error: `Payment not successful. Status: ${paymentIntent.status}` },
        { status: 402 }
      );
    }

    // Verify the intent belongs to this hiring
    if (paymentIntent.metadata?.hiringId !== hiringId) {
      return Response.json({ error: 'Payment intent does not match hiring' }, { status: 403 });
    }

    const db = getDb();
    const hiringsCol = db.collection('hirings');
    const transactionsCol = db.collection('transactions');

    const hiring = await hiringsCol.findOne({ _id: new ObjectId(hiringId) });
    if (!hiring) {
      return Response.json({ error: 'Hiring not found' }, { status: 404 });
    }

    // Idempotency: if already recorded, return success
    if (hiring.paymentStatus === 'paid') {
      return Response.json({ success: true, alreadyPaid: true });
    }

    // 1. Mark hiring as paid
    await hiringsCol.updateOne(
      { _id: new ObjectId(hiringId) },
      {
        $set: {
          paymentStatus: 'paid',
          stripePaymentIntentId: paymentIntentId,
          paidAt: new Date(),
        },
      }
    );

    // 2. Create transaction record
    const transaction = {
      hiringId: hiringId,
      stripePaymentIntentId: paymentIntentId,
      userId: hiring.userId,
      userEmail: hiring.userEmail,
      lawyerId: hiring.lawyerId,
      lawyerEmail: hiring.lawyerEmail,
      lawyerName: hiring.lawyerName,
      amount: paymentIntent.amount / 100, // back to dollars
      currency: paymentIntent.currency,
      serviceName: hiring.serviceName || '',
      specialization: hiring.specialization || '',
      status: 'completed',
      createdAt: new Date(),
    };

    const txnResult = await transactionsCol.insertOne(transaction);

    return Response.json({
      success: true,
      transactionId: txnResult.insertedId.toString(),
    });
  } catch (error) {
    console.error('POST /api/payment/confirm error:', error);

    if (error.type?.startsWith('Stripe')) {
      return Response.json({ error: error.message }, { status: 402 });
    }

    return Response.json({ error: 'Failed to confirm payment' }, { status: 500 });
  }
}
