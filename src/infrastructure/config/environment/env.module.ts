import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ENV_SERVICE } from './env-service.interface';
import { EnvService } from './env.service';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
  ],
  providers: [
    {
      provide: ENV_SERVICE,
      useClass: EnvService,
    },
  ],
  exports: [ENV_SERVICE],
})
export class EnvModule {}
