import { Controller, Post, Body, Delete, Get, HttpCode, HttpStatus, ParseFloatPipe, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { CreateTransactionRequestDto } from './dtos/create-transaction-request.dto';
import { CreateTransactionUseCase } from '../../application/use-cases/create-transaction/create-transaction.use-case';

@ApiTags('Transactions')
@Controller('transactions')
export class TransactionController {
  private readonly logger = new Logger(TransactionController.name);

  constructor(
    private readonly createTransactionUseCase: CreateTransactionUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new transaction' })
  @ApiBody({ type: CreateTransactionRequestDto })
  @ApiResponse({ status: 201})
  @ApiResponse({ status: 400})
  @ApiResponse({ status: 422})
  async createTransaction(
    @Body() createTransactionDto: CreateTransactionRequestDto,
  ): Promise<void> {
    this.logger.log(`Received request to create transaction: ${JSON.stringify(createTransactionDto)}`);

    await this.createTransactionUseCase.execute(createTransactionDto);
  }
}