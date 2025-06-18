import { DomainEvent } from './domain-event';
import { Veiculo } from '../entities/veiculo';

export class VeiculoCriadoEvent implements DomainEvent {
  public readonly occurredOn: Date;
  public readonly eventName: string;

  constructor(public readonly veiculo: Veiculo) {
    this.occurredOn = new Date();
    this.eventName = 'VeiculoCriado';
  }
} 