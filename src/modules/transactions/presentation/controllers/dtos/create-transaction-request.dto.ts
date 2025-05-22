import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  Min,
  IsISO8601,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTransactionRequestDto {
  @ApiProperty({
    description: 'The amount of the transaction. Must be a non-negative number.',
    example: 50,
    type: Number,
  })
  @IsNotEmpty({ message: 'Amount should not be empty.' })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Amount must be a number with at most 2 decimal places.' },
  )
  @Min(0, { message: 'Amount must be a non-negative number.' })
  @Type(() => Number)
  amount: number;

  @ApiProperty({
    description: 'The timestamp of the transaction in ISO 8601 format (UTC).',
    example: '1998-03-09T10:50:56.456Z',
    type: String,
    format: 'date-time',
  })
  @IsNotEmpty({ message: 'Timestamp should not be empty.' })
  @IsISO8601(
    { strict: true, strictSeparator: true },
    { message: 'Timestamp must be a valid ISO 8601 date string (e.g., YYYY-MM-DDTHH:mm:ss.sssZ).' },
  )
  timestamp: string;
}