import { Module } from '@nestjs/common';
import { EnvModule } from './infrastructure/config/environment/env.module';
import { LogggerConfigModule } from './infrastructure/logger/logger.module';
import { ThrottlerConfigModule } from './infrastructure/throttler/throttler.module';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [
    // Config
    EnvModule,
    LogggerConfigModule,
    ThrottlerConfigModule,
    HealthModule,
  ],
})
export class AppModule {}
