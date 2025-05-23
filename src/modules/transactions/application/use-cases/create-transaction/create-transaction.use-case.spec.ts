import { Test, TestingModule } from '@nestjs/testing';
import { CreateTransactionUseCase } from './create-transaction.use-case';
import { CreateTransactionCommand } from './create-transaction.command';
import {
  ITransactionRepository,
  TRANSACTION_REPOSITORY,
} from '../../../domain/repositories/transaction-repository.interface';
import { TransactionEntity } from '../../../domain/entities/transaction.entity';
import { UnprocessableEntityException, Logger } from '@nestjs/common';

const mockTransactionRepository = {
  create: jest.fn(),
};

describe('CreateTransactionUseCase', () => {
  let useCase: CreateTransactionUseCase;
  let repository: ITransactionRepository;

  beforeEach(async () => {
    mockTransactionRepository.create.mockClear();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateTransactionUseCase,
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

    useCase = module.get<CreateTransactionUseCase>(CreateTransactionUseCase);
    repository = module.get<ITransactionRepository>(TRANSACTION_REPOSITORY);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should create a transaction and call repository.create', async () => {
    const command = new CreateTransactionCommand(
      100.5,
      new Date(Date.now() - 5000).toISOString(),
    );
    const mockCreatedTransaction = new TransactionEntity(
      command.amount,
      command.timestamp,
    );

    mockTransactionRepository.create.mockResolvedValue(mockCreatedTransaction);

    const result = await useCase.execute(command);

    expect(result).toEqual(mockCreatedTransaction);
    expect(repository.create).toHaveBeenCalledTimes(1);
    expect(repository.create).toHaveBeenCalledWith(
      expect.any(TransactionEntity),
    );
    const calledWithArg = mockTransactionRepository.create.mock
      .calls[0][0] as TransactionEntity;
    expect(calledWithArg.amount).toBe(command.amount);
    expect(calledWithArg.timestamp.toISOString()).toBe(command.timestamp);
  });

  it('should throw UnprocessableEntityException if amount is negative', async () => {
    const command = new CreateTransactionCommand(-10, new Date().toISOString());

    await expect(useCase.execute(command)).rejects.toThrow(
      UnprocessableEntityException,
    );
    await expect(useCase.execute(command)).rejects.toThrow(
      'Amount cannot be negative.',
    );

    expect(repository.create).not.toHaveBeenCalled();
  });

  it('should throw UnprocessableEntityException if timestamp is in the future', async () => {
    const command = new CreateTransactionCommand(
      50,
      new Date(Date.now() + 100000).toISOString(),
    );

    await expect(useCase.execute(command)).rejects.toThrow(
      UnprocessableEntityException,
    );
    await expect(useCase.execute(command)).rejects.toThrow(
      'Transaction timestamp cannot be in the future.',
    );

    expect(repository.create).not.toHaveBeenCalled();
  });
});
