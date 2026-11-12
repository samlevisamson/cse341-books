# Books API Week 02 Spec - Version 2

## Feature 1: Book CRUD Operations and Author References

### Goal

Update the existing Week 01 book API so book documents include a reference to an author and the API supports all CRUD operations for books. Every book route must be documented and testable in Swagger.

### Data Model

Book documents will be stored in the `books` collection.

Required book fields:
- `id`: string, required, unique custom id such as `b1`
- `authorId`: string, required, references the `id` field of an existing author document
- `title`: string, required
- `publicationDate`: string, required, valid date in `YYYY-MM-DD` format

Books will continue to use custom string ids instead of MongoDB `_id` values for route parameters.

MongoDB must enforce unique custom book ids.

### Relationship to Authors

Each book will identify its author with an `authorId` field. The value of `authorId` must match the custom `id` value of an existing author document.

When creating or updating a book, the API should reject the request with a `400` status code if the submitted `authorId` does not match an existing author.

### Routes

#### GET /books

Purpose: Return all books.

Success:
- Status code: `200`
- Response body: an array of book objects

Errors:
- `500` if an unexpected server or database error occurs

#### GET /books/:id

Purpose: Return one book by its custom id.

Success:
- Status code: `200`
- Response body: the matching book object

Errors:
- `404` if no book exists with that id
- `500` if an unexpected server or database error occurs

#### POST /books

Purpose: Create a new book.

Request body:

    {
      "id": "b4",
      "authorId": "a1",
      "title": "Example Book Title",
      "publicationDate": "2026-01-15"
    }

Success:
- Status code: `201`
- Response body: the newly created book object

Errors:
- `400` if a required field is missing or invalid
- `400` if the `authorId` does not match an existing author
- `409` if the book id already exists
- `500` if an unexpected server or database error occurs

#### PUT /books/:id

Purpose: Update an existing book.

Request body:

    {
      "authorId": "a2",
      "title": "Updated Book Title",
      "publicationDate": "2026-02-20"
    }

Success:
- Status code: `200`
- Response body: the updated book object

Errors:
- `400` if a required field is missing or invalid
- `400` if the `authorId` does not match an existing author
- `404` if no book exists with that id
- `500` if an unexpected server or database error occurs

#### DELETE /books/:id

Purpose: Delete an existing book.

Success:
- Status code: `204`
- Response body: none

Errors:
- `404` if no book exists with that id
- `500` if an unexpected server or database error occurs

### Swagger Documentation

Swagger must document every book route, including request bodies, parameters, success responses, and error responses.

### Deployment Expectations

After implementation, the book routes must work locally and from the deployed Render application. The deployed Swagger page at `/api-docs` must allow someone to test every book route from the browser.

## Feature 2: Author CRUD Operations

### Goal

Create an authors API that supports all CRUD operations for managing author documents. Each author will have a unique custom id, name, and birth year. Every author route must be documented and testable in Swagger.

### Data Model

Author documents will be stored in the `authors` collection.

Required author fields:
- `id`: string, required, unique custom id such as `a1`
- `name`: string, required
- `birthYear`: number, required, valid four-digit year that is not in the future

Authors will continue to use custom string ids instead of MongoDB `_id` values for route parameters.

MongoDB must enforce unique custom author ids.

### Relationship to Books

Each book will identify its author with an `authorId` field. The value of `authorId` must match the custom `id` value of an existing author document.

An author cannot be deleted if one or more books reference that author's id.

If a client tries to delete an author who still has associated books, the API should return a `409` status code with a JSON error message.

### Routes

#### GET /authors

Purpose: Return all authors.

Success:
- Status code: `200`
- Response body: an array of author objects

Errors:
- `500` if an unexpected server or database error occurs

#### GET /authors/:id

Purpose: Return one author by their custom id.

Success:
- Status code: `200`
- Response body: the matching author object

Errors:
- `404` if no author exists with that id
- `500` if an unexpected server or database error occurs

#### POST /authors

Purpose: Create a new author.

Request body:

    {
      "id": "a3",
      "name": "Robert Brown",
      "birthYear": 1978
    }

Success:
- Status code: `201`
- Response body: the newly created author object

Errors:
- `400` if a required field is missing or invalid
- `409` if the author id already exists
- `500` if an unexpected server or database error occurs

#### PUT /authors/:id

Purpose: Update an existing author.

Request body:

    {
      "name": "Robert Brown Updated",
      "birthYear": 1980
    }

Success:
- Status code: `200`
- Response body: the updated author object

Errors:
- `400` if a required field is missing or invalid
- `404` if no author exists with that id
- `500` if an unexpected server or database error occurs

#### DELETE /authors/:id

Purpose: Delete an existing author.

Success:
- Status code: `204`
- Response body: none

Errors:
- `404` if no author exists with that id
- `409` if books are still associated with the author
- `500` if an unexpected server or database error occurs

### Swagger Documentation

Swagger must document every author route, including request bodies, parameters, success responses, and error responses.

### Deployment Expectations

After implementation, the author routes must work locally and from the deployed Render application. The deployed Swagger page at `/api-docs` must allow someone to test every author route from the browser.