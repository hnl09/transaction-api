export class TransactionEntity {
  private readonly _amount: number;
  private readonly _timestamp: Date;

  constructor(amount: number, timestamp: Date | string) {
    if (typeof amount !== 'number' || isNaN(amount) || amount < 0) {
      throw new Error('Transaction amount must be a non-negative number.');
    }

    const parsedTimestamp =
      timestamp instanceof Date ? timestamp : new Date(timestamp);

    if (isNaN(parsedTimestamp.getTime())) {
      throw new Error('Invalid transaction timestamp format.');
    }

    const now = new Date();
    if (parsedTimestamp > now) {
      throw new Error('Transaction timestamp cannot be in the future.');
    }

    this._amount = amount;
    this._timestamp = parsedTimestamp;
  }

  public get amount(): number {
    return this._amount;
  }

  public get timestamp(): Date {
    return this._timestamp;
  }

  public static create(
    amount: number,
    timestamp: Date | string,
  ): TransactionEntity {
    return new TransactionEntity(amount, timestamp);
  }
}
