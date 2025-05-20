import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EnvModule } from './infrastructure/config/environment/env.module';
import { LogggerConfigModule } from './infrastructure/logger/logger.module';
import { ThrottlerConfigModule } from './infrastructure/throttler/throttler.module';

@Module({
  imports: [
    // Config
    EnvModule,
    LogggerConfigModule,
    ThrottlerConfigModule,

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
