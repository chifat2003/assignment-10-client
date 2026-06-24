import { MongoClient, ObjectId } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI);

export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    // Validate if id is a valid MongoDB ObjectId
    if (!ObjectId.isValid(id)) {
      return Response.json({ error: 'Invalid service ID' }, { status: 400 });
    }

    const db = client.db(process.env.AUTH_DB_NAME);
    const servicesCollection = db.collection('services');

    const result = await servicesCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return Response.json({ error: 'Service not found' }, { status: 404 });
    }

    return Response.json({ success: true, message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Error deleting service:', error);
    return Response.json({ error: 'Failed to delete service' }, { status: 500 });
  }
}
