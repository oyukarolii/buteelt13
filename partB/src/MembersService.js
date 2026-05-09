const { getDb } = require('../db/db');

/**
 * Service layer for library member management.
 * Handles registration, retrieval, and deactivation of members.
 */
class MembersService {
  /**
   * Retrieve all members.
   *
   * @param {object} [filters={}] - Optional filters
   * @param {boolean} [filters.activeOnly=false] - Return only active members if true
   * @returns {Array<object>} List of member records
   */
  getAll(filters = {}) {
    const db = getDb();
    let query = 'SELECT id, name, email, active, joined_at FROM members';
    if (filters.activeOnly) {
      query += ' WHERE active = 1';
    }
    query += ' ORDER BY name ASC';
    return db.prepare(query).all();
  }

  /**
   * Find a member by ID, including their loan history.
   *
   * @param {number} id - Member primary key
   * @returns {object|null} Member with a `loans` array, or null if not found
   */
  getById(id) {
    const db = getDb();
    const member = db.prepare(
      'SELECT id, name, email, active, joined_at FROM members WHERE id = ?'
    ).get(id);

    if (!member) return null;

    member.loans = db.prepare(`
      SELECT l.id, l.issued_at, l.due_date, l.returned_at,
             b.title AS book_title, b.author AS book_author
      FROM loans l
      JOIN books b ON b.id = l.book_id
      WHERE l.member_id = ?
      ORDER BY l.issued_at DESC
    `).all(id);

    return member;
  }

  /**
   * Register a new library member.
   *
   * @param {object} data - Member data
   * @param {string} data.name - Full name (required)
   * @param {string} data.email - Email address (required, must be unique)
   * @returns {object} Newly created member record
   * @throws {Error} If the email address is already registered
   */
  register({ name, email }) {
    const db = getDb();

    const existing = db.prepare('SELECT id FROM members WHERE email = ?').get(email);
    if (existing) {
      const err = new Error(`Member with email ${email} already exists`);
      err.code = 'DUPLICATE_EMAIL';
      throw err;
    }

    const result = db.prepare(
      'INSERT INTO members (name, email) VALUES (?, ?)'
    ).run(name, email);

    return this.getById(result.lastInsertRowid);
  }

  /**
   * Deactivate a member account.
   * A member with active loans cannot be deactivated.
   *
   * @param {number} id - Member ID to deactivate
   * @returns {object|null} Updated member record, or null if not found
   * @throws {Error} If the member has active loans
   */
  deactivate(id) {
    const db = getDb();
    const member = db.prepare('SELECT id FROM members WHERE id = ?').get(id);
    if (!member) return null;

    const activeLoan = db.prepare(
      'SELECT id FROM loans WHERE member_id = ? AND returned_at IS NULL'
    ).get(id);

    if (activeLoan) {
      const err = new Error('Cannot deactivate a member who has active loans');
      err.code = 'MEMBER_HAS_ACTIVE_LOANS';
      throw err;
    }

    db.prepare('UPDATE members SET active = 0 WHERE id = ?').run(id);
    return this.getById(id);
  }
}

module.exports = new MembersService();
