import { MongoClient } from 'mongodb';

let database;

const connectToDb = async () => {
  const connectionString = process.env.MONGODB_URI;
  if (!connectionString) {
    throw new Error('MONGODB_URI is required.');
  }

  const client = new MongoClient(connectionString);
  await client.connect();
  database = client.db(process.env.MONGODB_DB_NAME || 'cse341-books-db');

  // Ensure every book has a unique custom ID
    await database.collection('books').createIndexes([
    { key: { id: 1 }, unique: true, name: 'unique_book_id' }
    ]);

    await database.collection('authors').createIndexes([
        { key: { id: 1 }, unique: true, name: 'unique_author_id' }
    ]);

  return database;
};

const getDb = () => {
  if (!database) {
    throw new Error('Database not initialized. Call connectToDb first.');
  }
  return database;
};

export { connectToDb, getDb };