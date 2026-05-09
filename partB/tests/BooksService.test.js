/**
 * Unit tests for MembersService
 * Testing Pyramid layer: UNIT
 *
 * Human review: Registration, duplicate prevention, and loan guard verified.
 */

const Database = require('better-sqlite3');
const { initSchema, setDb } = require('../../src/db/db');
const MembersService = require('../../src/services/MembersService');

let db;

beforeEach(() => {
  db = new Database(':memory:');
  db.pragma('foreign_keys = ON');
  initSchema(db);
  setDb(db);
});

afterEach(() => {
  db.close();
  setDb(null);
});

describe('MembersService', () => {

  // Test 9
  test('register_validData_returnsNewMember', () => {
    // Arrange
    const data = { name: 'Alice', email: 'alice@test.com' };

    // Act
    const member = MembersService.register(data);

    // Assert
    expect(member.id).toBeDefined();
    expect(member.name).toBe('Alice');
    expect(member.active).toBe(1);
    expect(member.loans).toEqual([]);
  });

  // Test 10
  test('register_duplicateEmail_throwsDuplicateEmailError', () => {
    // Arrange
    MembersService.register({ name: 'Alice', email: 'alice@test.com' });

    // Act & Assert
    expect(() => {
      MembersService.register({ name: 'Alice2', email: 'alice@test.com' });
    }).toThrow(expect.objectContaining({ code: 'DUPLICATE_EMAIL' }));
  });

  // Test 11
  test('deactivate_memberWithActiveLoan_throwsMemberHasActiveLoansError', () => {
    // Arrange
    const member = MembersService.register({ name: 'Bob', email: 'bob@test.com' });
    const bookId = db.prepare("INSERT INTO books (title, author) VALUES ('Book', 'Author')").run().lastInsertRowid;
    db.prepare('INSERT INTO loans (book_id, member_id, due_date) VALUES (?, ?, ?)').run(
      bookId, member.id, '2099-12-31'
    );

    // Act & Assert
    expect(() => MembersService.deactivate(member.id)).toThrow(
      expect.objectContaining({ code: 'MEMBER_HAS_ACTIVE_LOANS' })
    );
  });

});
