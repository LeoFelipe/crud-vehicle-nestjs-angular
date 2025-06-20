import { IDomainEvent } from './domain-event';

export class VeiculoCriadoEvent implements IDomainEvent {
  public readonly dateTimeOccurred: Date;

  constructor(public readonly veiculoId: string) {
    this.dateTimeOccurred = new Date();
  }

  getAggregateId(): string {
    return this.veiculoId;
  }
}
