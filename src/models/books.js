// src/models/books.js
import { getDb } from  '../db/connect.js';

const getAllBooks = async () => {
    const db = getDb();
    const collection = db.collection('books');
    const books = await collection.find({}).toArray();
    return books;
};

const getBookById = async (bookId) => {
  const db = getDb();
  const collection = db.collection('books');
  const book = await collection.findOne({ id: bookId });
  return book;
};

// Check whether an author exists
const authorExists = async (authorId) => {
    const db = getDb();
    const collection = db.collection('authors');

    const author = await collection.findOne(
        { id: authorId },
        { projection: { _id: 1 } }
    );

    return Boolean(author);
};

// Create a new book
const createBook = async (bookData) => {
    const db = getDb();
    const collection = db.collection('books');

    await collection.insertOne(bookData);

    return await collection.findOne({ id: bookData.id });
};

// Update an existing book
const updateBook = async (bookId, bookData) => {
    const db = getDb();
    const collection = db.collection('books');

    const result = await collection.updateOne(
        { id: bookId },
        { $set: bookData }
    );

    if (result.matchedCount === 0) {
        return null;
    }

    return await collection.findOne({ id: bookId });
};

// Delete an existing book
const deleteBook = async (bookId) => {
    const db = getDb();
    const collection = db.collection('books');

    return await collection.deleteOne({ id: bookId });
};

export {
    getAllBooks,
    getBookById,
    authorExists,
    createBook,
    updateBook,
    deleteBook
};