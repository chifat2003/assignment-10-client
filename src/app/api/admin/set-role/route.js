import { MongoClient, ObjectId } from 'mongodb';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { isAdmin } from '@/lib/roles';

const client = new MongoClient(process.env.MONGODB_URI);

function getDb() {
  return client.db(process.env.AUTH_DB_NAME);
}

/**
 * POST /api/admin/set-role
 * Updates a user's role. Requires admin role.
 * Body: { userId, role }
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

    const { userId, role } = await request.json();

    if (!userId || !role) {
      return Response.json({ error: 'userId and role are required' }, { status: 400 });
    }

    const validRoles = ['user', 'lawyer', 'admin'];
    if (!validRoles.includes(role)) {
      return Response.json({ error: `role must be one of: ${validRoles.join(', ')}` }, { status: 400 });
    }

    const db = getDb();
    const usersCol = db.collection('user');

    const result = await usersCol.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { role } }
    );

    if (result.matchedCount === 0) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    return Response.json({ success: true, userId, role });
  } catch (error) {
    console.error('POST /api/admin/set-role error:', error);
    return Response.json({ error: 'Failed to update user role' }, { status: 500 });
  }
}
