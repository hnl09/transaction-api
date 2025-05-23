import { InMemoryTransactionRepository } from './in-memory-transaction.repository';
import { TransactionEntity } from '../../../domain/entities/transaction.entity';
describe('InMemoryTransactionRepository', () => {
  let repository: InMemoryTransactionRepository;

  beforeEach(() => {
    repository = new InMemoryTransactionRepository();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('should add a transaction and return it', async () => {
      const transactionData = new TransactionEntity(10, new Date());
      const createdTransaction = await repository.create(transactionData);
      expect(createdTransaction).toEqual(transactionData);
      const all = await (
        repository as any
      ).findTransactionsInLastSixtySeconds();
      expect(all).toContainEqual(transactionData);
    });
  });

  describe('deleteAll', () => {
    it('should remove all transactions', async () => {
      await repository.create(new TransactionEntity(10, new Date()));
      await repository.create(new TransactionEntity(20, new Date()));
      await repository.deleteAll();
      const transactions = await (
        repository as any
      ).findTransactionsInLastSixtySeconds();
      expect(transactions.length).toBe(0);
    });
  });

  describe('findTransactionsInLastSixtySeconds', () => {
    const now = Date.now();

    it('should return transactions within the last 60 seconds', async () => {
      const recentTx = new TransactionEntity(50, new Date(now - 10 * 1000)); // 10s atrás
      const oldTx = new TransactionEntity(60, new Date(now - 70 * 1000)); // 70s atrás
      await repository.create(recentTx);
      await repository.create(oldTx);

      const found = await repository.findTransactionsInLastSixtySeconds();
      expect(found.length).toBe(1);
      expect(found).toContainEqual(recentTx);
      expect(found).not.toContainEqual(oldTx);
    });

    it('should return an empty array if no recent transactions', async () => {
      const oldTx = new TransactionEntity(60, new Date(now - 70 * 1000));
      await repository.create(oldTx);
      const found = await repository.findTransactionsInLastSixtySeconds();
      expect(found.length).toBe(0);
    });

    it('should return an empty array if no transactions exist', async () => {
      const found = await repository.findTransactionsInLastSixtySeconds();
      expect(found.length).toBe(0);
    });
  });
});
