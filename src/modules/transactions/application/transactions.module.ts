import { Module } from '@nestjs/common';
import { TransactionController } from '../presentation/controllers/transaction-controller';
import { CreateTransactionUseCase } from './use-cases/create-transaction/create-transaction.use-case';
import { InMemoryTransactionRepository } from '../infrastructure/persistence/in-memory/in-memory-transaction.repository';
import { TRANSACTION_REPOSITORY } from '../domain/repositories/transaction-repository.interface';
import { LogggerConfigModule } from '../../../infrastructure/logger/logger.module';

@Module({
  controllers: [TransactionController],
  providers: [
    CreateTransactionUseCase,
    {
      provide: TRANSACTION_REPOSITORY,
      useClass: InMemoryTransactionRepository,
    },
    
    LogggerConfigModule,
  ],
})
export class TransactionsModule {}