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
        },
        serializers: {
          req(req) {
            return {
              id: req.id,
              method: req.method,
              url: req.url,
              query: req.query,
              params: req.params,
              remoteAddress: req.remoteAddress,
            };
          },
          res(res) {
            return {
              statusCode: res.statusCode,
              headers: res.headers,
            };
          },
        },
      },
    }),
  ],
})
export class LogggerConfigModule {}
