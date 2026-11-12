// src/controllers/authors.js

import {
    getAllAuthors,
    getAuthorById,
    createAuthor,
    updateAuthor,
    deleteAuthor,
    hasBooks
} from '../models/authors.js';

// Validate author data
const validateAuthor = (author) => {
    if (!author || typeof author !== 'object' || Array.isArray(author)) {
        return 'Request body must be a JSON object.';
    }

    const currentYear = new Date().getFullYear();

    if (
        typeof author.id !== 'string' ||
        !author.id.trim() ||
        typeof author.name !== 'string' ||
        !author.name.trim() ||
        !Number.isInteger(author.birthYear) ||
        author.birthYear < 1000 ||
        author.birthYear > currentYear
    ) {
        return 'Provide a valid id, name and four-digit birthYear that is not in the future.';
    }

    return null;
};

// GET /authors
const getAuthorsHandler = async (req, res) => {
    try {
        const authors = await getAllAuthors();
        return res.status(200).json(authors);
    } catch (error) {
        console.error('GET /authors failed:', error.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// GET /authors/:id
const getAuthorByIdHandler = async (req, res) => {
    try {
        const author = await getAuthorById(req.params.id);

        if (!author) {
            return res.status(404).json({ message: 'Author not found' });
        }

        return res.status(200).json(author);
    } catch (error) {
        console.error('GET /authors/:id failed:', error.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// POST /authors
const createAuthorHandler = async (req, res) => {
    const validationError = validateAuthor(req.body);

    if (validationError) {
        return res.status(400).json({ message: validationError });
    }

    try {
        const authorData = {
            id: req.body.id.trim(),
            name: req.body.name.trim(),
            birthYear: req.body.birthYear
        };

        const newAuthor = await createAuthor(authorData);
        return res.status(201).json(newAuthor);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                message: 'An author with this ID already exists.'
            });
        }

        console.error('POST /authors failed:', error.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// PUT /authors/:id
const updateAuthorHandler = async (req, res) => {
    const validationError = validateAuthor({
        ...req.body,
        id: req.params.id
    });

    if (validationError) {
        return res.status(400).json({ message: validationError });
    }

    try {
        const authorData = {
            name: req.body.name.trim(),
            birthYear: req.body.birthYear
        };

        const updatedAuthor = await updateAuthor(
            req.params.id,
            authorData
        );

        if (!updatedAuthor) {
            return res.status(404).json({ message: 'Author not found' });
        }

        return res.status(200).json(updatedAuthor);
    } catch (error) {
        console.error('PUT /authors/:id failed:', error.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// DELETE /authors/:id
const deleteAuthorHandler = async (req, res) => {
    try {
        const author = await getAuthorById(req.params.id);

        if (!author) {
            return res.status(404).json({ message: 'Author not found' });
        }

        const referenced = await hasBooks(req.params.id);

        if (referenced) {
            return res.status(409).json({
                message: 'Cannot delete an author who has books.'
            });
        }

        await deleteAuthor(req.params.id);
        return res.status(204).send();
    } catch (error) {
        console.error('DELETE /authors/:id failed:', error.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export {
    getAuthorsHandler,
    getAuthorByIdHandler,
    createAuthorHandler,
    updateAuthorHandler,
    deleteAuthorHandler
};
