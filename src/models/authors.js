// src/models/authors.js
import { getDb } from '../db/connect.js';

const getAllAuthors = async () => {
    const db = getDb();
    const collection = db.collection('authors');
    return await collection.find({}).toArray();
};

const getAuthorById = async (authorId) => {
    const db = getDb();
    const collection = db.collection('authors');
    return await collection.findOne({ id: authorId });
};

const createAuthor = async (authorData) => {
    const db = getDb();
    const collection = db.collection('authors');
    await collection.insertOne(authorData);
    return await collection.findOne({ id: authorData.id });
};

const updateAuthor = async (authorId, authorData) => {
    const db = getDb();
    const collection = db.collection('authors');

    const result = await collection.updateOne(
        { id: authorId },
        { $set: authorData }
    );

    if (result.matchedCount === 0) {
        return null;
    }

    return await collection.findOne({ id: authorId });
};

const deleteAuthor = async (authorId) => {
    const db = getDb();
    const collection = db.collection('authors');
    return await collection.deleteOne({ id: authorId });
};

const hasBooks = async (authorId) => {
    const db = getDb();
    const collection = db.collection('books');
    const book = await collection.findOne(
        { authorId },
        { projection: { _id: 1 } }
    );
    return Boolean(book);
};

export {
    getAllAuthors,
    getAuthorById,
    createAuthor,
    updateAuthor,
    deleteAuthor,
    hasBooks
};
