import { Module } from '@nestjs/common';
import { TransactionController } from '../presentation/controllers/transaction-controller';
import { CreateTransactionUseCase } from './use-cases/create-transaction/create-transaction.use-case';
import { InMemoryTransactionRepository } from '../infrastructure/persistence/in-memory/in-memory-transaction.repository';
import { TRANSACTION_REPOSITORY } from '../domain/repositories/transaction-repository.interface';
import { DeleteAllTransactionsUseCase } from './use-cases/delete-all-transactions/delete-all-transaction.use-case';
import { GetStatisticsUseCase } from './use-cases/get-statistics/get-statistics.use-case';

@Module({
  controllers: [TransactionController],
  providers: [
    CreateTransactionUseCase,
    DeleteAllTransactionsUseCase,
    GetStatisticsUseCase,
    {
      provide: TRANSACTION_REPOSITORY,
      useClass: InMemoryTransactionRepository,
    },
  ],
})
export class TransactionsModule {}
