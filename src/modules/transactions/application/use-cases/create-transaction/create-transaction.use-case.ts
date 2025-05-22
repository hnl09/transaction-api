import { Injectable, Inject, UnprocessableEntityException, Logger } from '@nestjs/common';
import { TransactionEntity } from '../../../domain/entities/transaction.entity'; 
import { ITransactionRepository, TRANSACTION_REPOSITORY } from '../../../domain/repositories/transaction-repository.interface';
import { CreateTransactionCommand } from './create-transaction.command';

/**
 * @class CreateTransactionUseCase
 * @description
 * Use case for creating a new transaction.
 * This use case is responsible for validating the transaction data and
 * saving it to the repository.
 */
@Injectable()
export class CreateTransactionUseCase {
  private readonly logger = new Logger(CreateTransactionUseCase.name);

  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepository: ITransactionRepository,
  ) {}

  /**
   * @method execute
   * @description
   * Executes the use case to create a new transaction.
   * It validates the transaction data and saves it to the repository.
   * @param {CreateTransactionCommand} command - The command containing transaction data.
   * @returns {Promise<TransactionEntity>}
   */
  async execute(command: CreateTransactionCommand): Promise<TransactionEntity> {
    this.logger.log('Executing CreateTransactionUseCase...');
    
    const { amount, timestamp } = command;

    if (amount < 0) {
      this.logger.warn('Attempted to create transaction with negative amount');

      throw new UnprocessableEntityException('Amount cannot be negative.');
    }

    const transactionTimestamp = new Date(timestamp);

    if (transactionTimestamp > new Date()) {
      this.logger.warn('Attempted to create transaction with future timestamp');

      throw new UnprocessableEntityException('Transaction timestamp cannot be in the future.');
    }

    const transaction = new TransactionEntity(amount, transactionTimestamp);
    
    return this.transactionRepository.create(transaction);
  }
}