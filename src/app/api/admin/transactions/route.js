import { MongoClient } from 'mongodb';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { isAdmin } from '@/lib/roles';

const client = new MongoClient(process.env.MONGODB_URI);

function getDb() {
  return client.db(process.env.AUTH_DB_NAME);
}

/**
 * GET /api/admin/transactions
 * Returns all transactions. Requires admin role.
 */
export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!isAdmin(session.user)) {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const db = getDb();
    const transactionsCol = db.collection('transactions');

    const transactions = await transactionsCol
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    const serialized = transactions.map((t) => ({
      id: t._id.toString(),
      hiringId: t.hiringId,
      stripePaymentIntentId: t.stripePaymentIntentId,
      userId: t.userId,
      userEmail: t.userEmail,
      lawyerId: t.lawyerId,
      lawyerEmail: t.lawyerEmail,
      lawyerName: t.lawyerName,
      amount: t.amount,
      currency: t.currency || 'usd',
      serviceName: t.serviceName,
      specialization: t.specialization,
      status: t.status,
      createdAt: t.createdAt?.toISOString?.() || t.createdAt,
    }));

    return Response.json(serialized);
  } catch (error) {
    console.error('GET /api/admin/transactions error:', error);
    return Response.json({ error: 'Failed to fetch transactions' }, { status: 500 });
  }
}
