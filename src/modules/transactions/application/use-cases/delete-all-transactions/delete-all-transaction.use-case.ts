import { Injectable, Inject, Logger } from '@nestjs/common';
import {
  ITransactionRepository,
  TRANSACTION_REPOSITORY,
} from '../../../domain/repositories/transaction-repository.interface';

/**
 * @class DeleteAllTransactionsUseCase
 * @description
 * Use case for deleting all transactions.
 * This use case is responsible for removing all transaction records from the repository.
 */
@Injectable()
export class DeleteAllTransactionsUseCase {
  private readonly logger = new Logger(DeleteAllTransactionsUseCase.name);

  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepository: ITransactionRepository,
  ) {}

  /**
   * @method execute
   * @description
   * Executes the use case to delete all transactions.
   * It calls the repository method to remove all transaction records.
   * @returns {Promise<void>}
   */
  async execute(): Promise<void> {
    try {
      this.logger.log('Executing DeleteAllTransactionsUseCase...');

      await this.transactionRepository.deleteAll();

      this.logger.log('Successfully deleted all transactions.');
    } catch (error) {
      this.logger.error('Failed to delete all transactions.', error.stack);
      
      throw error;
    }
  }
}