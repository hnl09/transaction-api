import { Module } from '@nestjs/common';
import {
  ENV_SERVICE,
  IEnvService,
} from '../config/environment/env-service.interface';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      inject: [ENV_SERVICE],
      useFactory: (envService: IEnvService) => [
        {
          ttl: envService.throttle.ttl,
          limit: envService.throttle.limit,
        },
      ],
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class ThrottlerConfigModule {}
