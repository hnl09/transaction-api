import { Injectable, Inject, UnprocessableEntityException, Logger } from '@nestjs/common';
import { TransactionEntity } from '../../../domain/entities/transaction.entity'; 
import { ITransactionRepository, TRANSACTION_REPOSITORY } from '../../../domain/repositories/transaction-repository.interface';
import { CreateTransactionCommand } from './create-transaction.command';

@Injectable()
export class CreateTransactionUseCase {
  private readonly logger = new Logger(CreateTransactionUseCase.name);

  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepository: ITransactionRepository,
  ) {}

  async execute(command: CreateTransactionCommand): Promise<TransactionEntity> {
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