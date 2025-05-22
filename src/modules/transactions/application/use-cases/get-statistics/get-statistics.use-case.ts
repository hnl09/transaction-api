import { Injectable, Inject, Logger } from '@nestjs/common';
import {
  ITransactionRepository,
  TRANSACTION_REPOSITORY,
} from '../../../domain/repositories/transaction-repository.interface';
import { StatisticsResponseDto } from '../../../presentation/controllers/dtos/statistics.response.dto';

/**
 * @class GetStatisticsUseCase
 * @description
 * Use case for retrieving transaction statistics.
 * This use case calculates the sum, average, maximum, minimum, and count of transactions
 * that occurred in the last 60 seconds.
 */
@Injectable()
export class GetStatisticsUseCase {
  private readonly logger = new Logger(GetStatisticsUseCase.name);
  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepository: ITransactionRepository,
  ) {}

  /**
   * @method execute
   * @description
   * Executes the use case to retrieve transaction statistics.
   * It fetches transactions from the repository, calculates the statistics,
   * and returns them in a structured format.
   * @returns {Promise<StatisticsResponseDto>}
   */
  async execute(): Promise<StatisticsResponseDto> {
    this.logger.log('Executing GetStatisticsUseCase...');

    const recentTransactions = await this.transactionRepository.findTransactionsInLastSixtySeconds();

    if (recentTransactions.length === 0) {
      return {
        sum: 0,
        avg: 0,
        max: 0,
        min: 0,
        count: 0,
      };
    }

    let sum = 0;
    let max = -Infinity;
    let min = Infinity;

    for (const transaction of recentTransactions) {
      const amount = transaction.amount;
      sum += amount;
      if (amount > max) {
        max = amount;
      }
      if (amount < min) {
        min = amount;
      }
    }
    
    if (min === Infinity) min = 0; 
    if (max === -Infinity) max = 0;

    const count = recentTransactions.length;
    const avg = count > 0 ? sum / count : 0;

    const statistics: StatisticsResponseDto = {
      sum: parseFloat(sum.toFixed(2)),
      avg: parseFloat(avg.toFixed(2)),
      max: parseFloat(max.toFixed(2)),
      min: parseFloat(min.toFixed(2)),
      count: count,
    };

    this.logger.log(`Statistics calculated: ${JSON.stringify(statistics)}`);
    return statistics;
  }
}