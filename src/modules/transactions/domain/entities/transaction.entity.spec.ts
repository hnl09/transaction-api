import { TransactionEntity } from './transaction.entity';

describe('Transaction Entity', () => {
  const validAmount = 100.5;
  const validTimestamp = new Date(Date.now() - 10000);

  it('should create a transaction successfully with valid data', () => {
    const transaction = new TransactionEntity(validAmount, validTimestamp);
    expect(transaction).toBeDefined();
    expect(transaction.amount).toBe(validAmount);
    expect(transaction.timestamp.toISOString()).toBe(
      validTimestamp.toISOString(),
    );
  });

  it('should create a transaction with timestamp as ISO string', () => {
    const isoTimestamp = validTimestamp.toISOString();
    const transaction = new TransactionEntity(validAmount, isoTimestamp);
    expect(transaction.timestamp.toISOString()).toBe(isoTimestamp);
  });

  it('should throw an error if amount is negative', () => {
    expect(() => new TransactionEntity(-10, validTimestamp)).toThrow(
      'Transaction amount must be a non-negative number.',
    );
  });

  it('should throw an error if timestamp is in the future', () => {
    const futureTimestamp = new Date(Date.now() + 100000);
    expect(() => new TransactionEntity(validAmount, futureTimestamp)).toThrow(
      'Transaction timestamp cannot be in the future.',
    );
  });

  it('should throw an error for an invalid timestamp string', () => {
    expect(
      () => new TransactionEntity(validAmount, 'invalid-date-string'),
    ).toThrow('Invalid transaction timestamp format.');
  });
});
