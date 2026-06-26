import { MongoClient } from 'mongodb';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { isAdmin } from '@/lib/roles';

const client = new MongoClient(process.env.MONGODB_URI);

function getDb() {
  return client.db(process.env.AUTH_DB_NAME);
}

/**
 * GET /api/admin/stats
 * Returns platform-wide stats. Requires admin role.
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
    const usersCol = db.collection('user');
    const servicesCol = db.collection('services');
    const transactionsCol = db.collection('transactions');

    const [totalUsers, totalLawyers, totalAdmins, blockedUsers, totalServices, totalTransactions, revenueAgg] =
      await Promise.all([
        usersCol.countDocuments(),
        usersCol.countDocuments({ role: 'lawyer' }),
        usersCol.countDocuments({ role: 'admin' }),
        usersCol.countDocuments({ isBlocked: true }),
        servicesCol.countDocuments(),
        transactionsCol.countDocuments(),
        transactionsCol
          .aggregate([{ $group: { _id: null, total: { $sum: '$amount' } } }])
          .toArray(),
      ]);

    const totalRevenue = revenueAgg[0]?.total || 0;

    return Response.json({
      totalUsers,
      totalLawyers,
      totalAdmins,
      blockedUsers,
      totalServices,
      totalTransactions,
      totalRevenue,
    });
  } catch (error) {
    console.error('GET /api/admin/stats error:', error);
    return Response.json({ error: 'Failed to fetch admin stats' }, { status: 500 });
  }
}
