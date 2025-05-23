import { Injectable } from '@nestjs/common';
import { IEnvService } from './env-service.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EnvService implements IEnvService {
  constructor(private readonly configService: ConfigService) {}

  api = {
    env: this.configService.getOrThrow<string>('API_ENV'),
    port: this.configService.getOrThrow<number>('API_PORT'),
  };

  throttle = {
    ttl: this.configService.getOrThrow<number>('THROTTLE_TTL'),
    limit: this.configService.getOrThrow<number>('THROTTLE_LIMIT'),
  };
}
