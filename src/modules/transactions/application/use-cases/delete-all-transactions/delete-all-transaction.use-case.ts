// src/modules/transactions/application/use-cases/delete-all-transactions/delete-all-transactions.use-case.ts

import { Injectable, Inject, Logger } from '@nestjs/common';
import {
  ITransactionRepository,
  TRANSACTION_REPOSITORY,
} from '../../../domain/repositories/transaction-repository.interface';

@Injectable()
export class DeleteAllTransactionsUseCase {
  private readonly logger = new Logger(DeleteAllTransactionsUseCase.name);

  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepository: ITransactionRepository,
  ) {}

  async execute(): Promise<void> {
    try {
      await this.transactionRepository.deleteAll();

      this.logger.log('Successfully deleted all transactions.');
    } catch (error) {
      this.logger.error('Failed to delete all transactions.', error.stack);
      
      throw error;
    }
  }
}