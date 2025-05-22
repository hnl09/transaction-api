import { TransactionEntity } from "../entities/transaction.entity";

export const TRANSACTION_REPOSITORY = Symbol('TRANSACTION_REPOSITORY');

export interface ITransactionRepository {
  create(transaction: TransactionEntity): Promise<TransactionEntity>;
}