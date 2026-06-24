'use server'

import { MongoClient, ObjectId } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db(process.env.AUTH_DB_NAME);
const servicesCollection = db.collection('services');

// Server action — inserts a new service directly into MongoDB.
// Called from src/app/dashboard/lawyer/manage-legal-profile/page.jsx → handleAddService()
export const createService = async (newServiceData) => {
    const { name, bio, fee, specialization, image } = newServiceData;

    if (!name || !bio || !fee || !specialization) {
        throw new Error('Missing required fields: name, bio, fee, specialization');
    }

    const doc = {
        name,
        bio,
        fee,
        specialization,
        image: image || '📋',
        createdAt: new Date(),
    };

    const result = await servicesCollection.insertOne(doc);

    return { id: result.insertedId.toString(), ...doc };
}
