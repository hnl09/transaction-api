import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiProperty,
} from '@nestjs/swagger';

class HealthStatusDto {
  @ApiProperty({
    example: 'ok',
    description: 'The health status of the application.',
  })
  status: string;
}

@ApiTags('health')
@Controller('health')
export class HealthController {
  @Get()
  @ApiOperation({ summary: 'Check application health status' })
  @ApiResponse({
    status: 200,
    description: 'Application is healthy and running.',
    type: HealthStatusDto,
  })
  @ApiResponse({
    status: 503,
    description: 'App is unhealthy (Service Unavailable).',
  })
  check(): HealthStatusDto {
    const isHealthy = true; // isHealthy check Mockup

    if (!isHealthy) {
      throw new HttpException(
        { status: 'unhealthy' },
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }

    return { status: 'ok' };
  }
}
