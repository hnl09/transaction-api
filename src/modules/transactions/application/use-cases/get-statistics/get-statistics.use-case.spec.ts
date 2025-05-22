import { Test, TestingModule } from '@nestjs/testing';
import { GetStatisticsUseCase } from './get-statistics.use-case';
import { ITransactionRepository, TRANSACTION_REPOSITORY } from '../../../domain/repositories/transaction-repository.interface';
import { TransactionEntity } from '../../../domain/entities/transaction.entity';
import { Logger } from '@nestjs/common';

const mockTransactionRepository = {
  findTransactionsInLastSixtySeconds: jest.fn(),
};

describe('GetStatisticsUseCase', () => {
  let useCase: GetStatisticsUseCase;
  let repository: ITransactionRepository;

  beforeEach(async () => {
    mockTransactionRepository.findTransactionsInLastSixtySeconds.mockClear();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetStatisticsUseCase,
        {
          provide: TRANSACTION_REPOSITORY,
          useValue: mockTransactionRepository,
        },
        {
          provide: Logger,
          useValue: {
            log: jest.fn(),
            error: jest.fn(),
            warn: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<GetStatisticsUseCase>(GetStatisticsUseCase);
    repository = module.get<ITransactionRepository>(TRANSACTION_REPOSITORY);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should return zeroed statistics if no transactions are found', async () => {
    mockTransactionRepository.findTransactionsInLastSixtySeconds.mockResolvedValue([]);

    const result = await useCase.execute();

    expect(result).toEqual({
      sum: 0,
      avg: 0,
      max: 0,
      min: 0,
      count: 0,
    });
    expect(repository.findTransactionsInLastSixtySeconds).toHaveBeenCalledTimes(1);
  });

  it('should calculate statistics correctly for given transactions', async () => {
    const transactions: Partial<TransactionEntity>[] = [
      { amount: 10, timestamp: new Date() },
      { amount: 20, timestamp: new Date() },
      { amount: 30, timestamp: new Date() },
    ];
    mockTransactionRepository.findTransactionsInLastSixtySeconds.mockResolvedValue(transactions as TransactionEntity[]);

    const result = await useCase.execute();

    expect(result).toEqual({
      sum: 60.00,
      avg: 20.00,
      max: 30.00,
      min: 10.00,
      count: 3,
    });
    expect(repository.findTransactionsInLastSixtySeconds).toHaveBeenCalledTimes(1);
  });

  it('should handle a single transaction correctly', async () => {
    const transactions: Partial<TransactionEntity>[] = [{ amount: 12.34, timestamp: new Date() }];
    mockTransactionRepository.findTransactionsInLastSixtySeconds.mockResolvedValue(transactions as TransactionEntity[]);

    const result = await useCase.execute();
    expect(result).toEqual({
      sum: 12.34,
      avg: 12.34,
      max: 12.34,
      min: 12.34,
      count: 1,
    });
  });

  it('should handle transactions with zero amount', async () => {
    const transactions: Partial<TransactionEntity>[] = [
        { amount: 0, timestamp: new Date() },
        { amount: 0, timestamp: new Date() },
    ];
    mockTransactionRepository.findTransactionsInLastSixtySeconds.mockResolvedValue(transactions as TransactionEntity[]);

    const result = await useCase.execute();
    expect(result).toEqual({
      sum: 0.00,
      avg: 0.00,
      max: 0.00,
      min: 0.00,
      count: 2,
    });
  });
});