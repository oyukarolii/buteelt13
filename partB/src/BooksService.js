const { getDb } = require('../db/db');

/**
 */
class BooksService {
  /**
   
   *
   * @param {object} filters - Optional query filters
   * @param {string} [filters.search] - Search term matched against title and author
   * @param {boolean} [filters.available] - Filter by availability if provided
   * @returns {Array<object>} List of matching book records
   */
  getAll(filters = {}) {
    const db = getDb();
    let query = 'SELECT id, isbn, title, author, genre, available, created_at FROM books WHERE 1=1';
    const params = [];

    if (filters.search) {
      query += ' AND (title LIKE ? OR author LIKE ?)';
      const term = `%${filters.search}%`;
      params.push(term, term);
    }

    if (filters.available !== undefined) {
      query += ' AND available = ?';
      params.push(filters.available ? 1 : 0);
    }

    query += ' ORDER BY title ASC';
    return db.prepare(query).all(...params);
  }

  /**
   *
   * @param {number} id - The book's primary key
   * @returns {object|undefined} The book record, or undefined if not found
   */
  getById(id) {
    const db = getDb();
    return db.prepare(
      'SELECT id, isbn, title, author, genre, available, created_at FROM books WHERE id = ?'
    ).get(id);
  }

  /**
   * Add a new book to the inventory.
   *
   * @param {object} data - Book data
   * @param {string} data.title - Book title (required)
   * @param {string} data.author - Author name (required)
   * @param {string} [data.isbn] - ISBN identifier
   * @param {string} [data.genre] - Book genre
   * @returns {object} Newly created book record
   * @throws {Error} If a book with the same ISBN already exists
   */
  create({ title, author, isbn = null, genre = null }) {
    const db = getDb();

    if (isbn) {
      const existing = db.prepare('SELECT id FROM books WHERE isbn = ?').get(isbn);
      if (existing) {
        const err = new Error(`Book with ISBN ${isbn} already exists`);
        err.code = 'DUPLICATE_ISBN';
        throw err;
      }
    }

    const result = db.prepare(
      'INSERT INTO books (title, author, isbn, genre) VALUES (?, ?, ?, ?)'
    ).run(title, author, isbn, genre);

    return this.getById(result.lastInsertRowid);
  }

  /**
   * Update an existing book's details.
   *
   * @param {number} id - ID of the book to update
   * @param {object} data - Fields to update (any subset of title, author, isbn, genre)
   * @returns {object|null} Updated book record, or null if book not found
   */
  update(id, data) {
    const db = getDb();
    const book = this.getById(id);
    if (!book) return null;

    const { title, author, isbn, genre } = data;
    db.prepare(`
      UPDATE books
      SET title  = COALESCE(?, title),
          author = COALESCE(?, author),
          isbn   = COALESCE(?, isbn),
          genre  = COALESCE(?, genre)
      WHERE id = ?
    `).run(title ?? null, author ?? null, isbn ?? null, genre ?? null, id);

    return this.getById(id);
  }

  /**
   * Remove a book from the inventory.
   * A book cannot be deleted if it has an active (non-returned) loan.
   *
   * @param {number} id - ID of the book to delete
   * @returns {boolean} True if deleted, false if not found
   * @throws {Error} If the book has an active loan
   */
  delete(id) {
    const db = getDb();
    const book = this.getById(id);
    if (!book) return false;

    const activeLoan = db.prepare(
      'SELECT id FROM loans WHERE book_id = ? AND returned_at IS NULL'
    ).get(id);

    if (activeLoan) {
      const err = new Error('Cannot delete a book that is currently on loan');
      err.code = 'BOOK_ON_LOAN';
      throw err;
    }

    db.prepare('DELETE FROM books WHERE id = ?').run(id);
    return true;
  }

  /**
   * Check whether a book is available for loan.
   *
   * @param {number} id - Book ID
   * @returns {boolean} True if available, false otherwise
   */
  isAvailable(id) {
    const db = getDb();
    const row = db.prepare('SELECT available FROM books WHERE id = ?').get(id);
    return row ? row.available === 1 : false;
  }
}

module.exports = new BooksService();
