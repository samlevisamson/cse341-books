
// src/controllers/books.js

import {
    getAllBooks,
    getBookById,
    authorExists,
    createBook,
    updateBook,
    deleteBook
} from '../models/books.js';

// Validate publication date (YYYY-MM-DD)
const isValidDate = (date) => {
    if (typeof date !== 'string' ||
        !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return false;
    }

    const parsedDate = new Date(`${date}T00:00:00.000Z`);

    return !Number.isNaN(parsedDate.getTime()) &&
        parsedDate.toISOString().slice(0, 10) === date;
};

// Validate required book fields
const validateBook = (book) => {
    if (!book || typeof book !== 'object' || Array.isArray(book)) {
        return 'Request body must be a JSON object.';
    }

    if (
        typeof book.id !== 'string' ||
        !book.id.trim() ||
        typeof book.authorId !== 'string' ||
        !book.authorId.trim() ||
        typeof book.title !== 'string' ||
        !book.title.trim() ||
        !isValidDate(book.publicationDate)
    ) {
        return 'All fields are required. Provide valid id, authorId, title and publicationDate (YYYY-MM-DD).';
    }

    return null;
};

// GET all books
const getBooksHandler = async (req, res) => {
    try {
        const books = await getAllBooks();
        return res.status(200).json(books);
    } catch (error) {
        console.error('GET /books failed:', error.message);
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
};

// GET one book
const getBookByIdHandler = async (req, res) => {
    try {
        const book = await getBookById(req.params.id);

        if (!book) {
            return res.status(404).json({
                message: 'Book not found'
            });
        }

        return res.status(200).json(book);
    } catch (error) {
        console.error('GET /books/:id failed:', error.message);
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
};

// POST create a book
const createBookHandler = async (req, res) => {
    const validationError = validateBook(req.body);

    if (validationError) {
        return res.status(400).json({
            message: validationError
        });
    }

    try {
        const exists = await authorExists(req.body.authorId);

        if (!exists) {
            return res.status(400).json({
                message: 'Author does not exist.'
            });
        }

        const bookData = {
            id: req.body.id.trim(),
            authorId: req.body.authorId.trim(),
            title: req.body.title.trim(),
            publicationDate: req.body.publicationDate
        };

        const newBook = await createBook(bookData);

        return res.status(201).json(newBook);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                message: 'A book with this ID already exists.'
            });
        }

        console.error('POST /books failed:', error.message);
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
};

// PUT update a book
const updateBookHandler = async (req, res) => {
    const validationError = validateBook({
        ...req.body,
        id: req.params.id
    });

    if (validationError) {
        return res.status(400).json({
            message: validationError
        });
    }

    try {
        const exists = await authorExists(req.body.authorId);

        if (!exists) {
            return res.status(400).json({
                message: 'Author does not exist.'
            });
        }

        const bookData = {
            authorId: req.body.authorId.trim(),
            title: req.body.title.trim(),
            publicationDate: req.body.publicationDate
        };

        const updatedBook = await updateBook(
            req.params.id,
            bookData
        );

        if (!updatedBook) {
            return res.status(404).json({
                message: 'Book not found'
            });
        }

        return res.status(200).json(updatedBook);
    } catch (error) {
        console.error('PUT /books/:id failed:', error.message);
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
};

// DELETE a book
const deleteBookHandler = async (req, res) => {
    try {
        const result = await deleteBook(req.params.id);

        if (result.deletedCount === 0) {
            return res.status(404).json({
                message: 'Book not found'
            });
        }

        return res.status(204).send();
    } catch (error) {
        console.error('DELETE /books/:id failed:', error.message);
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
};

export {
    getBooksHandler,
    getBookByIdHandler,
    createBookHandler,
    updateBookHandler,
    deleteBookHandler
};
