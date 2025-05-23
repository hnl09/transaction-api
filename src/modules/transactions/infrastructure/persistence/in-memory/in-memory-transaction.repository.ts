import { Injectable, Logger } from '@nestjs/common';
import { TransactionEntity } from '../../../domain/entities/transaction.entity';
import { ITransactionRepository } from '../../../domain/repositories/transaction-repository.interface';

@Injectable()
export class InMemoryTransactionRepository implements ITransactionRepository {
  private readonly logger = new Logger(InMemoryTransactionRepository.name);
  private transactions: TransactionEntity[] = [];

  async create(transaction: TransactionEntity): Promise<TransactionEntity> {
    this.transactions.push(transaction);

    this.logger.log(`Transaction created. Total: ${this.transactions.length}`);

    return transaction;
  }

  async deleteAll(): Promise<void> {
    this.transactions = [];

    this.logger.log('All transactions deleted.');
  }

  async findTransactionsInLastSixtySeconds(): Promise<TransactionEntity[]> {
    const now = new Date();
    const sixtySecondsAgo = new Date(now.getTime() - 60 * 1000);

    const recentTransactions = this.transactions.filter(
      (transaction) =>
        transaction.timestamp >= sixtySecondsAgo &&
        transaction.timestamp <= now,
    );

    this.logger.log(
      `Found ${recentTransactions.length} transactions in the last 60 seconds.`,
    );

    return recentTransactions;
  }
}
