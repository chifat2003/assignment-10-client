import { MongoClient } from 'mongodb';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

const client = new MongoClient(process.env.MONGODB_URI);

function getDb() {
  return client.db(process.env.AUTH_DB_NAME);
}

/**
 * GET /api/transactions
 * Returns transactions for the logged-in user.
 *   - role "user"   → transactions where userId matches
 *   - role "lawyer" → transactions where lawyerId matches
 *   - role "admin"  → all transactions
 */
export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = getDb();
    const transactionsCol = db.collection('transactions');

    const { role, id: userId } = session.user;

    let query = {};
    if (role === 'user') {
      query = { userId };
    } else if (role === 'lawyer') {
      query = { lawyerId: userId };
    }

    const transactions = await transactionsCol
      .find(query)
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
    console.error('GET /api/transactions error:', error);
    return Response.json({ error: 'Failed to fetch transactions' }, { status: 500 });
  }
}
