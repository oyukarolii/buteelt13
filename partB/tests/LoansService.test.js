/**
 * Unit tests for LoansService
 * Testing Pyramid layer: UNIT
 * All DB calls use an in-memory SQLite database.
 *
 * Human review: Business logic edge cases verified — all assertions correct.
 */

const Database = require('better-sqlite3');
const { initSchema, setDb } = require('../../src/db/db');
const LoansService = require('../../src/services/LoansService');

let db;
let bookId, memberId;

// ── Test setup ────────────────────────────────────────────────────────────────

beforeEach(() => {
  db = new Database(':memory:');
  db.pragma('foreign_keys = ON');
  initSchema(db);
  setDb(db);

  // Seed a book and a member for reuse in each test
  bookId   = db.prepare("INSERT INTO books (title, author) VALUES ('Test Book', 'Author')").run().lastInsertRowid;
  memberId = db.prepare("INSERT INTO members (name, email) VALUES ('Bob', 'bob@test.com')").run().lastInsertRowid;
});

afterEach(() => {
  db.close();
  setDb(null);
});

// ── Helpers ───────────────────────────────────────────────────────────────────

function futureDate(daysFromNow = 14) {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().split('T')[0];
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('LoansService', () => {

  // Test 1
  test('issue_validData_createsLoanAndMarksBookUnavailable', () => {
    // Act
    const loan = LoansService.issue({ bookId, memberId, dueDate: futureDate() });

    // Assert
    expect(loan.id).toBeDefined();
    expect(loan.book_id).toBe(bookId);
    const book = db.prepare('SELECT available FROM books WHERE id = ?').get(bookId);
    expect(book.available).toBe(0);
  });

  // Test 2
  test('issue_unavailableBook_throwsBookUnavailableError', () => {
    // Arrange — issue once to make book unavailable
    LoansService.issue({ bookId, memberId, dueDate: futureDate() });

    // Create second member
    const member2Id = db.prepare("INSERT INTO members (name, email) VALUES ('Carol', 'carol@test.com')").run().lastInsertRowid;

    // Act & Assert
    expect(() => {
      LoansService.issue({ bookId, memberId: member2Id, dueDate: futureDate() });
    }).toThrow(expect.objectContaining({ code: 'BOOK_UNAVAILABLE' }));
  });

  // Test 3
  test('issue_inactiveMember_throwsMemberInactiveError', () => {
    // Arrange
    db.prepare('UPDATE members SET active = 0 WHERE id = ?').run(memberId);

    // Act & Assert
    expect(() => {
      LoansService.issue({ bookId, memberId, dueDate: futureDate() });
    }).toThrow(expect.objectContaining({ code: 'MEMBER_INACTIVE' }));
  });

  // Test 4
  test('issue_pastDueDate_throwsInvalidDueDateError', () => {
    // Act & Assert
    expect(() => {
      LoansService.issue({ bookId, memberId, dueDate: '2020-01-01' });
    }).toThrow(expect.objectContaining({ code: 'INVALID_DUE_DATE' }));
  });

  // Test 5
  test('returnBook_activeLoan_marksReturnedAndRestoresAvailability', () => {
    // Arrange
    const loan = LoansService.issue({ bookId, memberId, dueDate: futureDate() });

    // Act
    const returned = LoansService.returnBook(loan.id);

    // Assert
    expect(returned.returned_at).not.toBeNull();
    const book = db.prepare('SELECT available FROM books WHERE id = ?').get(bookId);
    expect(book.available).toBe(1);
  });

  // Test 6
  test('returnBook_alreadyReturnedLoan_throwsAlreadyReturnedError', () => {
    // Arrange
    const loan = LoansService.issue({ bookId, memberId, dueDate: futureDate() });
    LoansService.returnBook(loan.id);

    // Act & Assert
    expect(() => LoansService.returnBook(loan.id)).toThrow(
      expect.objectContaining({ code: 'ALREADY_RETURNED' })
    );
  });

  // Test 7 — edge case: overdue detection
  test('getOverdue_withExpiredLoan_returnsLoanWithDaysOverdue', () => {
    // Arrange — insert a loan with a past due date directly (bypass date validation)
    const loanId = db.prepare(
      "INSERT INTO loans (book_id, member_id, due_date) VALUES (?, ?, datetime('now', '-3 days'))"
    ).run(bookId, memberId).lastInsertRowid;
    // Mark book as unavailable
    db.prepare('UPDATE books SET available = 0 WHERE id = ?').run(bookId);

    // Act
    const overdue = LoansService.getOverdue();

    // Assert
    expect(overdue.length).toBeGreaterThanOrEqual(1);
    expect(overdue[0].days_overdue).toBeGreaterThanOrEqual(2);
  });

  // Test 8 — edge case: nonexistent loan
  test('returnBook_nonExistentLoanId_returnsNull', () => {
    // Act
    const result = LoansService.returnBook(9999);

    // Assert
    expect(result).toBeNull();
  });

});
