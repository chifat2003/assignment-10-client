import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI);

export async function GET() {
  try {
    const db = client.db(process.env.AUTH_DB_NAME);
    const servicesCollection = db.collection('services');

    const services = await servicesCollection.find({}).toArray();

    // Serialize MongoDB objects to plain objects
    const serializedServices = services.map(service => ({
      id: service._id.toString(),
      name: service.name,
      bio: service.bio,
      fee: service.fee,
      specialization: service.specialization,
      image: service.image,
      lawyerId: service.lawyerId?.toString?.() || service.lawyerId,
      lawyerName: service.lawyerName,
      lawyerEmail: service.lawyerEmail,
      lawyerImage: service.lawyerImage,
      createdAt: service.createdAt?.toISOString?.() || service.createdAt,
    }));

    return Response.json(serializedServices);
  } catch (error) {
    console.error('Error fetching services:', error);
    return Response.json({ error: 'Failed to fetch services' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const serviceId = searchParams.get('id');

    if (!serviceId) {
      return Response.json({ error: 'Service ID is required' }, { status: 400 });
    }

    const db = client.db(process.env.AUTH_DB_NAME);
    const servicesCollection = db.collection('services');

    const { ObjectId } = await import('mongodb');
    const result = await servicesCollection.deleteOne({ _id: new ObjectId(serviceId) });

    if (result.deletedCount === 0) {
      return Response.json({ error: 'Service not found' }, { status: 404 });
    }

    return Response.json({ success: true, message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Error deleting service:', error);
    return Response.json({ error: 'Failed to delete service' }, { status: 500 });
  }
}
