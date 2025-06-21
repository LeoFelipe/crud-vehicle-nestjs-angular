import { Injectable, Inject } from '@nestjs/common';
import { IDomainEventHandler } from './domain-event-handler.interface';
import { VeiculoCriadoEvent } from '../../domain/events/veiculo-criado.event';
import { IQueuePublisher } from '../../infrastructure/messaging/queue-publisher.interface';
import { QUEUE_PUBLISHER } from '../../infrastructure/config/injection-tokens';

@Injectable()
export class VeiculoCriadoHandler
  implements IDomainEventHandler<VeiculoCriadoEvent>
{
  constructor(
    @Inject(QUEUE_PUBLISHER) private readonly publisher: IQueuePublisher,
  ) {}

  async handle(event: VeiculoCriadoEvent): Promise<void> {
    await this.publisher.publish('veiculo-em-ativacao', event);
  }
}
