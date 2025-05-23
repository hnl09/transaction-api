import {
  Controller,
  Post,
  Body,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  ParseFloatPipe,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { CreateTransactionRequestDto } from './dtos/create-transaction-request.dto';
import { CreateTransactionUseCase } from '../../application/use-cases/create-transaction/create-transaction.use-case';
import { DeleteAllTransactionsUseCase } from '../../application/use-cases/delete-all-transactions/delete-all-transaction.use-case';
import { StatisticsResponseDto } from './dtos/statistics.response.dto';
import { GetStatisticsUseCase } from '../../application/use-cases/get-statistics/get-statistics.use-case';

@ApiTags('Transactions')
@Controller('transactions')
export class TransactionController {
  private readonly logger = new Logger(TransactionController.name);

  constructor(
    private readonly createTransactionUseCase: CreateTransactionUseCase,
    private readonly deleteAllTransactionsUseCase: DeleteAllTransactionsUseCase,
    private readonly getStatisticsUseCase: GetStatisticsUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new transaction' })
  @ApiBody({ type: CreateTransactionRequestDto })
  @ApiResponse({ status: 201 })
  @ApiResponse({ status: 400 })
  @ApiResponse({ status: 422 })
  async createTransaction(
    @Body() createTransactionDto: CreateTransactionRequestDto,
  ): Promise<void> {
    this.logger.log(
      `Received request to create transaction: ${JSON.stringify(createTransactionDto)}`,
    );

    await this.createTransactionUseCase.execute(createTransactionDto);
  }

  @Delete()
  @HttpCode(HttpStatus.OK) // 204 Would be more appropriate
  @ApiOperation({ summary: 'Delete all transactions' })
  @ApiResponse({ status: 200 })
  async deleteAllTransactions(): Promise<void> {
    this.logger.log('Received request to delete all transactions');

    await this.deleteAllTransactionsUseCase.execute();
  }

  @Get('/statistics')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get transaction statistics for the last 60 seconds',
  })
  @ApiResponse({ status: 200, type: StatisticsResponseDto })
  async getStatistics(): Promise<StatisticsResponseDto> {
    this.logger.log('Received request for statistics');
    return this.getStatisticsUseCase.execute();
  }
}
