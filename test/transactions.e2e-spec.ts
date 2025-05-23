import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('TransactionController (e2e)', () => {
  let app: INestApplication;
  let server: any;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(new ValidationPipe({}));
    await app.init();
    server = app.getHttpServer();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    // Reseting the in-memory database before each test
    await request(server).delete('/transactions').expect(HttpStatus.OK);
  });

  describe('/transactions (POST)', () => {
    it('should create a transaction and return 201', () => {
      const validTransaction = {
        amount: 123.45,
        timestamp: new Date(Date.now() - 1000).toISOString(),
      };
      return request(server)
        .post('/transactions')
        .send(validTransaction)
        .expect(HttpStatus.CREATED);
    });

    it('should return 400 for malformed amount (string instead of number)', () => {
      const invalidTransaction = {
        amount: 'ten',
        timestamp: new Date().toISOString(),
      };
      return request(server)
        .post('/transactions')
        .send(invalidTransaction)
        .expect(HttpStatus.BAD_REQUEST)
        .then((response) => {
          expect(response.body.message).toEqual(
            expect.arrayContaining([
              'Amount must be a number with at most 2 decimal places.',
            ]),
          );
        });
    });

    it('should return 422 for amount < 0', () => {
      const invalidTransaction = {
        amount: -10.0,
        timestamp: new Date().toISOString(),
      };
      return request(server)
        .post('/transactions')
        .send(invalidTransaction)
        .expect(HttpStatus.UNPROCESSABLE_ENTITY)
        .then((response) => {
          expect(response.body.message).toContain('Amount cannot be negative');
        });
    });

    it('should return 422 for future timestamp', () => {
      const invalidTransaction = {
        amount: 10.0,
        timestamp: new Date(Date.now() + 100000).toISOString(),
      };
      return request(server)
        .post('/transactions')
        .send(invalidTransaction)
        .expect(HttpStatus.UNPROCESSABLE_ENTITY)
        .then((response) => {
          expect(response.body.message).toContain(
            'Transaction timestamp cannot be in the future',
          );
        });
    });

    it('should return 400 for invalid ISO timestamp format', () => {
      const invalidTransaction = {
        amount: 10.0,
        timestamp: '31/12/1950',
      };
      return request(server)
        .post('/transactions')
        .send(invalidTransaction)
        .expect(HttpStatus.BAD_REQUEST)
        .then((response) => {
          expect(response.body.message).toEqual(
            expect.arrayContaining([
              'Timestamp must be a valid ISO 8601 date string (e.g., YYYY-MM-DDTHH:mm:ss.sssZ).',
            ]),
          );
        });
    });
  });

  describe('/transactions/statistics (GET)', () => {
    it('should return zeroed statistics if no transactions', async () => {
      const response = await request(server)
        .get('/transactions/statistics')
        .expect(HttpStatus.OK);

      expect(response.body).toEqual({
        sum: 0,
        avg: 0,
        max: 0,
        min: 0,
        count: 0,
      });
    });

    it('should return correct statistics for recent transactions', async () => {
      const now = Date.now();
      await request(server)
        .post('/transactions')
        .send({ amount: 10.0, timestamp: new Date(now - 5000).toISOString() }); // 5s ago
      await request(server)
        .post('/transactions')
        .send({ amount: 20.5, timestamp: new Date(now - 10000).toISOString() }); // 10s ago
      await request(server)
        .post('/transactions')
        .send({ amount: 5.0, timestamp: new Date(now - 65000).toISOString() }); // 65s ago (more than 60s old)

      const response = await request(server)
        .get('/transactions/statistics')
        .expect(HttpStatus.OK);

      expect(response.body.sum).toBeCloseTo(30.5);
      expect(response.body.avg).toBeCloseTo(15.25);
      expect(response.body.max).toBeCloseTo(20.5);
      expect(response.body.min).toBeCloseTo(10.0);
      expect(response.body.count).toBe(2);
    });
  });

  describe('/transactions (DELETE)', () => {
    it('should delete all transactions and return 200', async () => {
      await request(server)
        .post('/transactions')
        .send({ amount: 10.0, timestamp: new Date().toISOString() });
      await request(server).delete('/transactions').expect(HttpStatus.OK);

      const statsResponse = await request(server)
        .get('/transactions/statistics')
        .expect(HttpStatus.OK);
      expect(statsResponse.body.count).toBe(0);
    });
  });
});
