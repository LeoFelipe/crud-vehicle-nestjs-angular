import { IDomainEventHandler } from './domain-event-handler.interface';
import { VeiculoCriadoEvent } from '../../domain/events/veiculo-criado.event';
import { IQueuePublisher } from '../../infrastructure/messaging/queue-publisher.interface';

export class VeiculoCriadoHandler implements IDomainEventHandler<VeiculoCriadoEvent> {
  constructor(private readonly publisher: IQueuePublisher) {}

  async handle(event: VeiculoCriadoEvent): Promise<void> {
    await this.publisher.publish('veiculos.criados', event);
  }
} 