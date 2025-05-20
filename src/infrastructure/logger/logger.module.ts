import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        transport: {
          target: 'pino-pretty',
          options: {
            singleLine: true,
            colorize: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname,time',
          },
        },
        customLogLevel: (req, res, err) => {
          if (res.statusCode >= 500) {
            return 'error';
          }
          if (res.statusCode >= 400 && res.statusCode < 500) {
            return 'warn';
          }
          return 'info';
        }
      },
    }),
  ],
})
export class LogggerConfigModule {}
