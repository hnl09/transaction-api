import { Test, TestingModule } from '@nestjs/testing';
import { DeleteAllTransactionsUseCase } from './delete-all-transaction.use-case';
import { ITransactionRepository, TRANSACTION_REPOSITORY } from '../../../domain/repositories/transaction-repository.interface';
import { Logger } from '@nestjs/common';

const mockTransactionRepository = {
  deleteAll: jest.fn(),
};

describe('DeleteAllTransactionsUseCase', () => {
  let useCase: DeleteAllTransactionsUseCase;
  let repository: ITransactionRepository;

  beforeEach(async () => {
    mockTransactionRepository.deleteAll.mockClear();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteAllTransactionsUseCase,
        {
          provide: TRANSACTION_REPOSITORY,
          useValue: mockTransactionRepository,
        },
        {
            provide: Logger,
            useValue: {
              log: jest.fn(),
              error: jest.fn(),
            },
          },
      ],
    }).compile();

    useCase = module.get<DeleteAllTransactionsUseCase>(DeleteAllTransactionsUseCase);
    repository = module.get<ITransactionRepository>(TRANSACTION_REPOSITORY);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should call repository.deleteAll once', async () => {
    mockTransactionRepository.deleteAll.mockResolvedValue(undefined);

    await useCase.execute();

    expect(repository.deleteAll).toHaveBeenCalledTimes(1);
  });

  it('should propagate an error if repository.deleteAll fails', async () => {
    const errorMessage = 'Database unavailable';
    mockTransactionRepository.deleteAll.mockRejectedValue(new Error(errorMessage));

    await expect(useCase.execute()).rejects.toThrow(errorMessage);
    expect(repository.deleteAll).toHaveBeenCalledTimes(1);
  });
});