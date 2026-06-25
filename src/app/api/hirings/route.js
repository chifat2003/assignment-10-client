import { MongoClient, ObjectId } from 'mongodb';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

const client = new MongoClient(process.env.MONGODB_URI);

function getDb() {
  return client.db(process.env.AUTH_DB_NAME);
}

/**
 * GET /api/hirings
 * Returns hirings relevant to the logged-in user.
 *   - role "user"   → hirings where userId matches
 *   - role "lawyer" → hirings where lawyerId matches
 *   - role "admin"  → all hirings
 */
export async function GET(request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = getDb();
    const hiringsCol = db.collection('hirings');

    const { role, id: userId } = session.user;

    let query = {};
    if (role === 'user') {
      query = { userId };
    } else if (role === 'lawyer') {
      query = { lawyerId: userId };
    }
    // admin sees everything (empty query)

    const hirings = await hiringsCol.find(query).sort({ createdAt: -1 }).toArray();

    const serialized = hirings.map((h) => ({
      id: h._id.toString(),
      userId: h.userId,
      userName: h.userName,
      userEmail: h.userEmail,
      lawyerId: h.lawyerId,
      lawyerName: h.lawyerName,
      lawyerEmail: h.lawyerEmail,
      specialization: h.specialization,
      fee: h.fee,
      serviceId: h.serviceId,
      serviceName: h.serviceName,
      status: h.status,          // pending | accepted | rejected
      paymentStatus: h.paymentStatus, // unpaid | paid
      stripePaymentIntentId: h.stripePaymentIntentId || null,
      createdAt: h.createdAt?.toISOString?.() || h.createdAt,
    }));

    return Response.json(serialized);
  } catch (error) {
    console.error('GET /api/hirings error:', error);
    return Response.json({ error: 'Failed to fetch hirings' }, { status: 500 });
  }
}

/**
 * POST /api/hirings
 * Creates a new hiring request. Requires role "user".
 * Body: { lawyerId, lawyerName, lawyerEmail, specialization, fee, serviceId, serviceName }
 */
export async function POST(request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'user') {
      return Response.json({ error: 'Only users can hire lawyers' }, { status: 403 });
    }

    const body = await request.json();
    const { lawyerId, lawyerName, lawyerEmail, specialization, fee, serviceId, serviceName } = body;

    if (!lawyerId || !lawyerName || !fee) {
      return Response.json({ error: 'lawyerId, lawyerName, and fee are required' }, { status: 400 });
    }

    const db = getDb();
    const hiringsCol = db.collection('hirings');

    const doc = {
      userId: session.user.id,
      userName: session.user.name,
      userEmail: session.user.email,
      lawyerId,
      lawyerName,
      lawyerEmail: lawyerEmail || '',
      specialization: specialization || '',
      fee: Number(fee),
      serviceId: serviceId || null,
      serviceName: serviceName || '',
      status: 'pending',       // pending | accepted | rejected
      paymentStatus: 'unpaid', // unpaid | paid
      createdAt: new Date(),
    };

    const result = await hiringsCol.insertOne(doc);

    return Response.json({ id: result.insertedId.toString(), ...doc }, { status: 201 });
  } catch (error) {
    console.error('POST /api/hirings error:', error);
    return Response.json({ error: 'Failed to create hiring request' }, { status: 500 });
  }
}
