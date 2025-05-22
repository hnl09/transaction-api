export class CreateTransactionCommand {
  constructor(
    public readonly amount: number,
    public readonly timestamp: string,
  ) {}
}