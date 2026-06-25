import { MongoClient, ObjectId } from 'mongodb';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

const client = new MongoClient(process.env.MONGODB_URI);

function getDb() {
  return client.db(process.env.AUTH_DB_NAME);
}

/**
 * PATCH /api/hirings/[id]
 * Allows a lawyer to accept/reject a hiring request, or mark payment status.
 * Body: { status: 'accepted' | 'rejected' }
 *   or  { paymentStatus: 'paid', stripePaymentIntentId: '...' }
 */
export async function PATCH(request, { params }) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return Response.json({ error: 'Invalid hiring ID' }, { status: 400 });
    }

    const body = await request.json();
    const db = getDb();
    const hiringsCol = db.collection('hirings');

    const hiring = await hiringsCol.findOne({ _id: new ObjectId(id) });
    if (!hiring) {
      return Response.json({ error: 'Hiring not found' }, { status: 404 });
    }

    const { role, id: userId } = session.user;

    // Build the update fields
    const updateFields = {};

    // Lawyer can accept/reject their own hirings
    if ('status' in body) {
      if (role !== 'lawyer' || hiring.lawyerId !== userId) {
        return Response.json({ error: 'Only the assigned lawyer can update status' }, { status: 403 });
      }
      if (!['accepted', 'rejected'].includes(body.status)) {
        return Response.json({ error: 'status must be accepted or rejected' }, { status: 400 });
      }
      updateFields.status = body.status;
    }

    // User can mark payment after Stripe success (validated further in /api/payment/confirm)
    if ('paymentStatus' in body) {
      if (role !== 'user' || hiring.userId !== userId) {
        return Response.json({ error: 'Only the hiring user can update payment status' }, { status: 403 });
      }
      updateFields.paymentStatus = body.paymentStatus;
      if (body.stripePaymentIntentId) {
        updateFields.stripePaymentIntentId = body.stripePaymentIntentId;
      }
    }

    if (Object.keys(updateFields).length === 0) {
      return Response.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    await hiringsCol.updateOne({ _id: new ObjectId(id) }, { $set: updateFields });

    return Response.json({ success: true, updated: updateFields });
  } catch (error) {
    console.error('PATCH /api/hirings/[id] error:', error);
    return Response.json({ error: 'Failed to update hiring' }, { status: 500 });
  }
}

/**
 * GET /api/hirings/[id]
 * Returns a single hiring by ID.
 */
export async function GET(request, { params }) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return Response.json({ error: 'Invalid hiring ID' }, { status: 400 });
    }

    const db = getDb();
    const hiringsCol = db.collection('hirings');
    const hiring = await hiringsCol.findOne({ _id: new ObjectId(id) });

    if (!hiring) {
      return Response.json({ error: 'Hiring not found' }, { status: 404 });
    }

    return Response.json({
      id: hiring._id.toString(),
      ...hiring,
      _id: undefined,
      createdAt: hiring.createdAt?.toISOString?.() || hiring.createdAt,
    });
  } catch (error) {
    console.error('GET /api/hirings/[id] error:', error);
    return Response.json({ error: 'Failed to fetch hiring' }, { status: 500 });
  }
}
