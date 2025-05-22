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
}