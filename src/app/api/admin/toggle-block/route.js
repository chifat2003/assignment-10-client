import { MongoClient, ObjectId } from 'mongodb';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { isAdmin } from '@/lib/roles';

const client = new MongoClient(process.env.MONGODB_URI);

function getDb() {
  return client.db(process.env.AUTH_DB_NAME);
}

/**
 * POST /api/admin/toggle-block
 * Blocks or unblocks a user. Requires admin role.
 * Body: { userId, isBlocked }
 */
export async function POST(request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!isAdmin(session.user)) {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { userId, isBlocked } = await request.json();

    if (!userId || typeof isBlocked !== 'boolean') {
      return Response.json({ error: 'userId and isBlocked (boolean) are required' }, { status: 400 });
    }

    const db = getDb();
    const usersCol = db.collection('user');

    const result = await usersCol.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { isBlocked } }
    );

    if (result.matchedCount === 0) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    return Response.json({ success: true, userId, isBlocked });
  } catch (error) {
    console.error('POST /api/admin/toggle-block error:', error);
    return Response.json({ error: 'Failed to update user block status' }, { status: 500 });
  }
}
