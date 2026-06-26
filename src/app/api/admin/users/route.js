import { MongoClient } from 'mongodb';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { isAdmin } from '@/lib/roles';

const client = new MongoClient(process.env.MONGODB_URI);

function getDb() {
  return client.db(process.env.AUTH_DB_NAME);
}

/**
 * GET /api/admin/users
 * Returns all users. Requires admin role.
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

    const users = await usersCol.find({}).sort({ createdAt: -1 }).toArray();

    const serialized = users.map((u) => ({
      id: u._id.toString(),
      _id: u._id.toString(),
      name: u.name,
      email: u.email,
      role: u.role || 'user',
      isBlocked: u.isBlocked || false,
      image: u.image || null,
      createdAt: u.createdAt?.toISOString?.() || u.createdAt,
    }));

    return Response.json(serialized);
  } catch (error) {
    console.error('GET /api/admin/users error:', error);
    return Response.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}
