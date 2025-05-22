import { ApiProperty } from '@nestjs/swagger';

export class StatisticsResponseDto {
  @ApiProperty({
    description: 'The total sum of transaction amounts in the last 60 seconds.',
    example: 1000,
    type: Number,
  })
  sum: number;

  @ApiProperty({
    description: 'The average of transaction amounts in the last 60 seconds.',
    example: 500,
    type: Number,
  })
  avg: number;

  @ApiProperty({
    description: 'The maximum transaction amount in the last 60 seconds.',
    example: 200,
    type: Number,
  })
  max: number;

  @ApiProperty({
    description: 'The minimum transaction amount in the last 60 seconds.',
    example: 5,
    type: Number,
  })
  min: number;

  @ApiProperty({
    description: 'The total count of transactions in the last 60 seconds.',
    example: 10,
    type: Number,
  })
  count: number;
}